"use client";

import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Bot, TrendingUp, Star, Shield, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { HeroIllustration, EmptyStateIllustration, WhyAgentSeaIllustration } from "@/components/illustrations";
import { fetchAllAgents } from "@/lib/solana";

export default function Home() {
  const { connection } = useConnection();
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      setIsLoading(true);
      try {
        const fetchedAgents = await fetchAllAgents(connection);
        setAgents(fetchedAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, [connection]);

  // Show top 4 agents for homepage
  const featuredAgents = agents.slice(0, 4);
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2081e2]/10 via-transparent to-purple-500/10 dark:from-[#2081e2]/20 dark:to-purple-500/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Powered by Solana</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Discover, Collect, and Sell
                <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  AI Agents
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl lg:mx-0 mx-auto">
                The world's first and largest marketplace for AI agents. Explore, stake, and build trust in autonomous AI programs on Solana blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/agents"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 font-semibold text-lg transition-all hover:scale-105"
                >
                  Explore
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background hover:bg-accent hover:border-primary h-14 px-8 font-semibold text-lg transition-all"
                >
                  Create
                </Link>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number={agents.length.toString()} label="Total Agents" />
            <StatItem number="0 SOL" label="Total Volume" />
            <StatItem
              number={agents.reduce((sum, agent) => sum + (agent.totalStaked || 0), 0).toString()}
              label="Total Stakes"
            />
            <StatItem number="0" label="Active Users" />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Notable Agents</h2>
          <Link href="/agents" className="text-primary hover:underline font-medium">
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-20">
              <p className="text-muted-foreground">Loading agents...</p>
            </div>
          ) : featuredAgents.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center py-20 bg-card border border-border rounded-2xl">
                <div className="max-w-xs mx-auto mb-6">
                  <EmptyStateIllustration />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Agents Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Be the first to register an AI agent on the marketplace and start building trust
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-medium transition-colors"
                >
                  Register First Agent
                </Link>
              </div>
            </div>
          ) : (
            featuredAgents.map((agent, index) => (
              <AgentCard key={agent.publicKey || index} agent={agent} />
            ))
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card/30 border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Create and sell your AI Agents</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AgentSea is a decentralized marketplace built on Solana for discovering and trusting AI agents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Bot className="h-8 w-8" />}
              number="1"
              title="Set up your wallet"
              description="Connect your Solana wallet (Phantom, Solflare) to get started with AgentSea marketplace."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              number="2"
              title="Register your agent"
              description="Upload your AI agent metadata, set a description, and list it on the blockchain."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8" />}
              number="3"
              title="Build reputation"
              description="Users stake tokens and give feedback to build your agent's on-chain reputation score."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Why AgentSea?</h2>
            <div className="space-y-6">
              <BenefitItem
                icon={<Shield className="h-6 w-6 text-primary" />}
                title="Decentralized Trust"
                description="Build trust through on-chain staking and reputation without centralized intermediaries"
              />
              <BenefitItem
                icon={<Star className="h-6 w-6 text-primary" />}
                title="Reputation System"
                description="Transparent feedback and ratings (0-100) calculated directly on Solana blockchain"
              />
              <BenefitItem
                icon={<TrendingUp className="h-6 w-6 text-primary" />}
                title="Token Economics"
                description="Stake $AGENTS tokens to support agents and earn rewards based on their success"
              />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-border flex items-center justify-center p-8">
              <WhyAgentSeaIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start building your AI agent portfolio today
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join the decentralized AI agent marketplace on Solana
            </p>
            <Link
              href="/agents"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary hover:bg-gray-100 h-14 px-8 font-bold text-lg transition-all hover:scale-105"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{number}</div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary transition-colors h-full">
        <div className="text-primary mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: any }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Format total staked amount
  const formatStaked = (amount: number) => {
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`;
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  return (
    <div className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{agent.name}</h3>
          <p className="text-sm text-muted-foreground">Agent #{agent.agentId?.toString() || 0}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-semibold">{agent.reputationScore || 0}</span>
        </div>
      </div>

      <div className="relative mb-4">
        <p
          className={`text-muted-foreground ${!showFullDescription ? 'line-clamp-2' : ''} cursor-pointer hover:text-foreground transition-colors`}
          onClick={() => setShowFullDescription(!showFullDescription)}
          onMouseEnter={() => setShowFullDescription(true)}
          onMouseLeave={() => setShowFullDescription(false)}
          title="Click or hover to expand"
        >
          {agent.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-semibold">{formatStaked(agent.totalStaked || 0)}</span>
          <span className="text-muted-foreground">staked</span>
        </div>
        <div className="text-muted-foreground">
          {agent.feedbackCount || 0} reviews
        </div>
      </div>
    </div>
  );
}
