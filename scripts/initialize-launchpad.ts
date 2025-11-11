import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Load IDL
const IDL = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../lib/idl.json"), "utf-8")
);

// Get program ID from IDL metadata or env
const PROGRAM_ID_STR = IDL.metadata?.address || process.env.NEXT_PUBLIC_PROGRAM_ID;
if (!PROGRAM_ID_STR) {
  throw new Error("Program ID not found in IDL or .env file");
}
console.log("Using Program ID:", PROGRAM_ID_STR);
const PROGRAM_ID = new PublicKey(PROGRAM_ID_STR);

async function main() {
  // Connect to localnet
  const connection = new Connection("http://localhost:8899", "confirmed");

  // Load wallet from default Solana CLI keypair
  const keypairPath = path.join(
    process.env.HOME || "",
    ".config/solana/id.json"
  );
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
  );
  const wallet = Keypair.fromSecretKey(secretKey);

  console.log("Wallet public key:", wallet.publicKey.toString());

  // Create provider
  const provider = new AnchorProvider(
    connection,
    {
      publicKey: wallet.publicKey,
      signTransaction: async (tx: any) => {
        tx.partialSign(wallet);
        return tx;
      },
      signAllTransactions: async (txs: any) => {
        txs.forEach((tx: any) => tx.partialSign(wallet));
        return txs;
      },
    } as any,
    { commitment: "confirmed" }
  );

  // Create program instance - Anchor will extract program ID from IDL
  // We need to ensure IDL has the right structure
  const programIdl = {
    ...IDL,
    address: PROGRAM_ID.toString(),
    types: IDL.types || [], // Add empty types array if not present
  };

  const program = new Program(programIdl as any, provider);

  try {
    // Step 1: Create $AGENTS token mint
    console.log("\n1. Creating $AGENTS token mint...");
    const agentsTokenMint = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      null,
      9 // 9 decimals
    );
    console.log("$AGENTS token mint created:", agentsTokenMint.toString());

    // Step 2: Derive launchpad PDA
    const [launchpadPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("launchpad")],
      PROGRAM_ID
    );
    console.log("\n2. Launchpad PDA:", launchpadPda.toString());

    // Step 3: Check if launchpad is already initialized
    try {
      const existingLaunchpad = await (program.account as any).launchpad.fetch(
        launchpadPda
      );
      console.log("\nLaunchpad already initialized!");
      console.log("Launchpad state:", existingLaunchpad);
      return;
    } catch (error) {
      // Launchpad doesn't exist yet, continue with initialization
      console.log("\n3. Initializing launchpad...");
    }

    // Step 4: Initialize launchpad
    const tx = await program.methods
      .initializeLaunchpad(new BN(1_000_000_000)) // 1 token minimum stake
      .accounts({
        launchpad: launchpadPda,
        authority: wallet.publicKey,
        agentsTokenMint: agentsTokenMint,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Launchpad initialized! Transaction:", tx);

    // Fetch and display launchpad state
    const launchpadAccount = await (program.account as any).launchpad.fetch(
      launchpadPda
    );
    console.log("\nLaunchpad state:", launchpadAccount);

    // Save token mint address to .env.local for reference
    const envContent = `\n# Token mint address (for reference)\nAGENTS_TOKEN_MINT=${agentsTokenMint.toString()}\n`;
    fs.appendFileSync(
      path.join(__dirname, "../.env.local"),
      envContent
    );
    console.log("\n✅ Token mint address saved to .env.local");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("\n✅ Launchpad initialization complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Initialization failed:", error);
    process.exit(1);
  });
