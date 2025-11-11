"use client";

import { useState } from "react";
import { TrendingUp, Star, Search } from "lucide-react";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real data from blockchain
  const agents = [
    {
      id: 0,
      name: "AI Trading Bot",
      description: "Automated crypto trading agent with risk management",
      totalStaked: "1,250,000",
      reputation: 95,
      feedbackCount: 42,
    },
    // Add more mock agents here
  ];

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
        {agents.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Agents Yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to register an AI agent on the marketplace
            </p>
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium transition-colors"
            >
              Register Agent
            </a>
          </div>
        ) : (
          agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))
        )}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: any }) {
  return (
    <div className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{agent.name}</h3>
          <p className="text-sm text-muted-foreground">Agent #{agent.id}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-semibold">{agent.reputation}</span>
        </div>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-2">
        {agent.description}
      </p>

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-semibold">{agent.totalStaked}</span>
          <span className="text-muted-foreground">staked</span>
        </div>
        <div className="text-muted-foreground">
          {agent.feedbackCount} reviews
        </div>
      </div>

      <button className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 font-medium transition-colors">
        View Details
      </button>
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
