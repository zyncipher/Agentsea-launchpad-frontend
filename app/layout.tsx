import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SolanaWalletProvider } from "@/components/wallet-provider";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentSea Launchpad - AI Agent Marketplace on Solana",
  description: "Discover, register, and build trust in autonomous AI agents on Solana blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SolanaWalletProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
