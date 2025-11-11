# AgentSea Launchpad - Frontend

A modern, sleek frontend for the AgentSea Launchpad built with Next.js, TypeScript, and Tailwind CSS. Features dark/light mode and full Solana wallet integration.


## Pages

- **Home** - Landing page with features and stats
- **Explore Agents** - Browse and search AI agents
- **Register Agent** - Form to register new AI agents
- **Agent Details** - View agent info, stake tokens, give feedback (coming soon)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
agentsea-frontend/
├── app/                    # Next.js app directory
│   ├── agents/            # Agents listing page
│   ├── register/          # Register agent page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── navbar.tsx         # Navigation bar
│   ├── theme-provider.tsx # Theme context
│   ├── theme-toggle.tsx   # Dark/light mode toggle
│   └── wallet-provider.tsx # Solana wallet context
├── lib/                   # Utility functions
├── public/                # Static assets
└── tailwind.config.ts     # Tailwind configuration
```

## Solana Integration

The app connects to Solana devnet by default. Configure the network in `components/wallet-provider.tsx`:

```typescript
const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
```

Supported wallets:
- Phantom
- Solflare
- And more via @solana/wallet-adapter

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here
```


### Tailwind Configuration

Modify `tailwind.config.ts` to extend the theme:

```typescript
theme: {
  extend: {
    colors: {
      // Your custom colors
    },
  },
}
```

## Integration with Solana Program

To connect the frontend to your deployed Solana program:

1. Copy the program IDL from `../agentsea_launchpad/target/idl/agentsea_launchpad.json`
2. Create `lib/idl.ts` with the IDL
3. Initialize the program in `lib/program.ts`
4. Use the program in your components to call instructions

Example:

```typescript
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const { connection } = useConnection();
const wallet = useWallet();
const provider = new AnchorProvider(connection, wallet as any, {});
const program = new Program(IDL, PROGRAM_ID, provider);

// Register agent
await program.methods
  .registerAgent(name, metadataUri, description)
  .accounts({
    // ... accounts
  })
  .rpc();
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Wallet**: @solana/wallet-adapter
- **Icons**: Lucide React
- **Theme**: next-themes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Support

For issues or questions:
- GitHub Issues: [Create an issue]
- Discord: [AgentSea Community]

---

**Built for hackathons** 🚀 **Powered by Solana & Next.js** ⚡