"use client";

import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { TrendingUp, Star, Search } from "lucide-react";
import { fetchAllAgents } from "@/lib/solana";

export default function AgentsPage() {
  const { connection } = useConnection();
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explore AI Agents</h1>
        <p className="text-muted-foreground">
          Discover and stake on trustworthy AI agents in the marketplace
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-20">
            <p className="text-muted-foreground">Loading agents...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? "No agents found" : "No Agents Yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Be the first to register an AI agent on the marketplace"}
            </p>
            {!searchQuery && (
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium transition-colors"
              >
                Register Agent
              </a>
            )}
          </div>
        ) : (
          filteredAgents.map((agent, index) => (
            <AgentCard key={agent.publicKey || index} agent={agent} />
          ))
        )}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: any }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Format total staked amount (convert from lamports to tokens if needed)
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
      {/* Agent Image */}
      {agent.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden bg-muted">
          <img
            src={agent.imageUrl}
            alt={agent.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

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

function Bot({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
