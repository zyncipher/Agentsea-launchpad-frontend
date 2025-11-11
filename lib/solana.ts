import { AnchorProvider, Program, web3, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idlJson from "./idl.json";

// Get program ID from IDL metadata
const PROGRAM_ID_STR = (idlJson as any)?.metadata?.address;
if (!PROGRAM_ID_STR) {
  throw new Error("Program ID not found in IDL metadata");
}
const PROGRAM_ID = new PublicKey(PROGRAM_ID_STR);

// Prepare IDL with required fields for Anchor
// Create a simplified IDL structure to avoid TypeScript type instantiation issues
const IDL: any = {
  ...idlJson,
  address: PROGRAM_ID_STR,
  metadata: {
    address: PROGRAM_ID_STR,
  },
};

// Helper to create program instance
function createProgram(provider: AnchorProvider) {
  console.log("Creating program with address:", PROGRAM_ID_STR);
  console.log("IDL has address field:", IDL.address);
  console.log("IDL has metadata.address:", IDL.metadata?.address);

  // Anchor v0.28.0 uses: new Program(idl, programId, provider)
  const program = new Program(IDL, PROGRAM_ID, provider);
  console.log("Program created successfully");
  return program;
}

// Helper function to derive launchpad PDA
export function getLaunchpadPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("launchpad")],
    PROGRAM_ID
  );
}

// Helper function to derive agent PDA
export function getAgentPDA(agentCount: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("agent"), new BN(agentCount).toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );
}

export interface RegisterAgentParams {
  name: string;
  metadataUri: string;
  description: string;
  wallet: any; // WalletContextState
  connection: web3.Connection;
}

/**
 * Register a new agent on the Solana blockchain
 */
export async function registerAgent({
  name,
  metadataUri,
  description,
  wallet,
  connection,
}: RegisterAgentParams): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  console.log("Starting agent registration...");
  console.log("Wallet:", wallet.publicKey.toString());
  console.log("Program ID:", PROGRAM_ID_STR);

  // Create provider
  const provider = new AnchorProvider(
    connection,
    wallet as any,
    { commitment: "confirmed" }
  );

  console.log("Provider created");

  // Create program instance (Anchor v0.30.1)
  console.log("IDL structure:", JSON.stringify({
    hasAddress: !!IDL.address,
    hasMetadata: !!IDL.metadata,
    addressValue: IDL.address,
    metadataAddress: IDL.metadata?.address
  }));

  // Create program instance (Anchor v0.28.0)
  console.log("About to create Program...");
  const program = new Program(IDL as any, PROGRAM_ID, provider);
  console.log("Program instance created successfully");

  try {
    // Get launchpad PDA
    const [launchpadPda, launchpadBump] = getLaunchpadPDA();
    console.log("Launchpad PDA:", launchpadPda.toString(), "Bump:", launchpadBump);

    // Fetch current agent count from launchpad
    console.log("Fetching launchpad account...");
    const launchpadAccount: any = await (program.account as any).launchpad.fetch(launchpadPda);
    console.log("Launchpad account fetched successfully");

    const agentCount = launchpadAccount.agentCount.toNumber();
    console.log("Current agent count:", agentCount);

    // Derive agent PDA
    const [agentPda] = getAgentPDA(agentCount);
    console.log("Agent PDA:", agentPda.toString());

    // Call the registerAgent instruction
    console.log("Calling registerAgent instruction...");
    const tx = await program.methods
      .registerAgent(name, metadataUri, description)
      .accounts({
        agent: agentPda,
        launchpad: launchpadPda,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Agent registered! Transaction signature:", tx);
    console.log("Agent account:", agentPda.toString());

    return tx;
  } catch (error: any) {
    console.error("Error registering agent:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    throw error;
  }
}

/**
 * Fetch all agents from the blockchain
 */
export async function fetchAllAgents(connection: web3.Connection) {
  try {
    console.log("Fetching all agents from program:", PROGRAM_ID_STR);

    // Create a dummy provider for fetching (no wallet needed for reading)
    const provider = new AnchorProvider(
      connection,
      {} as any,
      AnchorProvider.defaultOptions()
    );

    const program = createProgram(provider);

    // Get launchpad to know how many agents exist
    const [launchpadPda] = getLaunchpadPDA();
    console.log("Fetching launchpad at:", launchpadPda.toString());

    const launchpadAccount: any = await (program.account as any).launchpad.fetch(launchpadPda);
    const agentCount = launchpadAccount.agentCount.toNumber();
    console.log(`Total agents registered: ${agentCount}`);

    if (agentCount === 0) {
      console.log("No agents registered yet");
      return [];
    }

    // Fetch all agents by their PDAs
    const agents = [];
    for (let i = 0; i < agentCount; i++) {
      try {
        const [agentPda] = getAgentPDA(i);
        console.log(`Fetching agent ${i} at:`, agentPda.toString());

        const agentAccount: any = await (program.account as any).agent.fetch(agentPda);

        // Fetch metadata from IPFS if available
        let metadata = null;
        let imageUrl = null;
        if (agentAccount.metadataUri) {
          try {
            console.log(`Fetching metadata from: ${agentAccount.metadataUri}`);
            const metadataResponse = await fetch(agentAccount.metadataUri);
            if (metadataResponse.ok) {
              metadata = await metadataResponse.json();
              imageUrl = metadata.image || null;
              console.log(`Metadata fetched for agent ${i}:`, metadata);
            }
          } catch (metadataError) {
            console.error(`Error fetching metadata for agent ${i}:`, metadataError);
          }
        }

        agents.push({
          publicKey: agentPda.toString(),
          agentId: agentAccount.agentId.toNumber(),
          name: agentAccount.name,
          description: agentAccount.description,
          metadataUri: agentAccount.metadataUri,
          owner: agentAccount.owner.toString(),
          totalStaked: agentAccount.totalStaked.toNumber(),
          reputationScore: agentAccount.reputationScore,
          feedbackCount: agentAccount.feedbackCount,
          isActive: agentAccount.isActive,
          createdAt: agentAccount.createdAt.toNumber(),
          // Add metadata fields
          imageUrl,
          metadata,
        });
      } catch (err) {
        console.error(`Error fetching agent ${i}:`, err);
      }
    }

    console.log(`Successfully fetched ${agents.length} agents`);
    return agents;

  } catch (error: any) {
    console.error("Error fetching agents:", error);
    console.error("Error message:", error?.message);
    // Return empty array to allow page to load
    return [];
  }
}

/**
 * Fetch a single agent by public key
 */
export async function fetchAgent(
  connection: web3.Connection,
  agentPublicKey: PublicKey
) {
  try {
    const provider = new AnchorProvider(
      connection,
      {} as any,
      AnchorProvider.defaultOptions()
    );

    const program = createProgram(provider);

    const agent: any = await (program.account as any).agent.fetch(agentPublicKey);

    return {
      publicKey: agentPublicKey.toString(),
      ...agent,
    };
  } catch (error) {
    console.error("Error fetching agent:", error);
    return null;
  }
}
