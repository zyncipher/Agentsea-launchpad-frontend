"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ThemeToggle } from "./theme-toggle";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AgentSea</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {mounted && <WalletMultiButton />}
        </div>
      </div>
    </nav>
  );
}
