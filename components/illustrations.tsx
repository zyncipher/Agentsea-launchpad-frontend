export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2081e2" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background Circles */}
      <circle cx="200" cy="150" r="120" fill="url(#grad1)" opacity="0.1" />
      <circle cx="600" cy="400" r="100" fill="url(#grad2)" opacity="0.1" />
      <circle cx="700" cy="200" r="80" fill="#2081e2" opacity="0.05" />

      {/* AI Robot/Agent Illustration */}
      <g transform="translate(250, 150)">
        {/* Head */}
        <rect
          x="100"
          y="50"
          width="120"
          height="100"
          rx="20"
          fill="url(#grad1)"
          opacity="0.9"
        />

        {/* Eyes */}
        <circle cx="130" cy="90" r="12" fill="white" opacity="0.9" />
        <circle cx="190" cy="90" r="12" fill="white" opacity="0.9" />
        <circle cx="133" cy="93" r="6" fill="#0a0b0d" />
        <circle cx="193" cy="93" r="6" fill="#0a0b0d" />

        {/* Antenna */}
        <line x1="160" y1="50" x2="160" y2="20" stroke="#2081e2" strokeWidth="4" />
        <circle cx="160" cy="20" r="8" fill="#ec4899" />

        {/* Body */}
        <rect
          x="90"
          y="160"
          width="140"
          height="120"
          rx="15"
          fill="url(#grad2)"
          opacity="0.8"
        />

        {/* Arms */}
        <rect x="40" y="180" width="50" height="15" rx="7" fill="#2081e2" opacity="0.7" />
        <rect x="230" y="180" width="50" height="15" rx="7" fill="#2081e2" opacity="0.7" />

        {/* Control Panel */}
        <circle cx="160" cy="210" r="25" fill="white" opacity="0.3" />
        <circle cx="160" cy="210" r="15" fill="#2081e2" opacity="0.8" />
      </g>

      {/* Floating Elements */}
      <g opacity="0.6">
        <circle cx="150" cy="400" r="6" fill="#2081e2">
          <animate
            attributeName="cy"
            values="400;380;400"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="650" cy="150" r="8" fill="#a855f7">
          <animate
            attributeName="cy"
            values="150;130;150"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="100" cy="250" r="5" fill="#ec4899">
          <animate
            attributeName="cy"
            values="250;230;250"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Network Lines */}
      <g stroke="#2081e2" strokeWidth="2" opacity="0.2">
        <line x1="100" y1="200" x2="250" y2="300" />
        <line x1="550" y1="300" x2="650" y2="200" />
        <line x1="200" y1="450" x2="400" y2="400" />
      </g>

      {/* Stars/Sparkles */}
      <g fill="#2081e2" opacity="0.4">
        <path d="M680 100 L684 108 L692 112 L684 116 L680 124 L676 116 L668 112 L676 108 Z" />
        <path d="M120 500 L123 506 L129 509 L123 512 L120 518 L117 512 L111 509 L117 506 Z" />
        <path d="M720 450 L723 456 L729 459 L723 462 L720 468 L717 462 L711 459 L717 456 Z" />
      </g>
    </svg>
  );
}

export function AgentCardIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2081e2" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="200" height="200" fill="url(#cardGrad)" opacity="0.1" rx="20" />

      {/* Simple Robot Head */}
      <g transform="translate(50, 40)">
        <rect x="20" y="20" width="60" height="50" rx="10" fill="url(#cardGrad)" opacity="0.8" />
        <circle cx="40" cy="40" r="6" fill="white" />
        <circle cx="60" cy="40" r="6" fill="white" />
        <rect x="35" y="55" width="30" height="4" rx="2" fill="white" opacity="0.6" />
      </g>

      {/* Decorative Elements */}
      <circle cx="170" cy="30" r="4" fill="#2081e2" opacity="0.4" />
      <circle cx="30" cy="170" r="3" fill="#a855f7" opacity="0.4" />
    </svg>
  );
}

export function EmptyStateIllustration() {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-xs mx-auto"
    >
      <defs>
        <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2081e2" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Large Robot/Agent */}
      <g transform="translate(75, 50)">
        {/* Head */}
        <rect x="40" y="20" width="80" height="70" rx="15" fill="url(#emptyGrad)" opacity="0.2" />
        <circle cx="70" cy="50" r="8" fill="#2081e2" opacity="0.3" />
        <circle cx="110" cy="50" r="8" fill="#2081e2" opacity="0.3" />

        {/* Antenna */}
        <line x1="90" y1="20" x2="90" y2="0" stroke="#2081e2" strokeWidth="3" opacity="0.3" />
        <circle cx="90" cy="0" r="6" fill="#a855f7" opacity="0.3" />

        {/* Body */}
        <rect x="30" y="95" width="100" height="90" rx="12" fill="url(#emptyGrad)" opacity="0.15" />

        {/* Question Mark */}
        <text x="65" y="155" fontSize="48" fill="#2081e2" opacity="0.4" fontWeight="bold">?</text>
      </g>

      {/* Floating Dots */}
      <circle cx="50" cy="100" r="4" fill="#2081e2" opacity="0.2">
        <animate attributeName="cy" values="100;85;100" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="250" cy="150" r="4" fill="#a855f7" opacity="0.2">
        <animate attributeName="cy" values="150;135;150" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function WhyAgentSeaIllustration() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="whyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2081e2" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="whyGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background circles */}
      <circle cx="250" cy="250" r="180" fill="url(#whyGrad1)" opacity="0.05" />
      <circle cx="250" cy="250" r="140" fill="url(#whyGrad2)" opacity="0.05" />
      <circle cx="250" cy="250" r="100" fill="url(#whyGrad1)" opacity="0.05" />

      {/* Central AI Node */}
      <g filter="url(#glow)">
        <circle cx="250" cy="250" r="50" fill="url(#whyGrad1)" opacity="0.3" />
        <circle cx="250" cy="250" r="35" fill="#2081e2" opacity="0.6">
          <animate attributeName="r" values="35;38;35" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* AI Icon in center */}
        <path
          d="M235 240 L250 225 L265 240 M235 260 L250 275 L265 260 M240 250 h20"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>

      {/* Orbiting nodes - Shield (Security) */}
      <g>
        <circle cx="250" cy="120" r="25" fill="url(#whyGrad1)" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 250 250"
            to="360 250 250"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <path
          d="M250 105 v8 m-6 -3 l6 -5 l6 5 v8 c0 4 -6 6 -6 10 c0 -4 -6 -6 -6 -10 z"
          fill="white"
          opacity="0.8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 250 250"
            to="360 250 250"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Orbiting nodes - Star (Reputation) */}
      <g>
        <circle cx="380" cy="250" r="25" fill="url(#whyGrad2)" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="120 250 250"
            to="480 250 250"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <path
          d="M380 238 l3 8 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z"
          fill="white"
          opacity="0.8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="120 250 250"
            to="480 250 250"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Orbiting nodes - Chart (Economics) */}
      <g>
        <circle cx="250" cy="380" r="25" fill="url(#whyGrad1)" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="240 250 250"
            to="600 250 250"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <path
          d="M240 385 l4 -8 l4 4 l4 -10 l4 6 l4 -4"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="240 250 250"
            to="600 250 250"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Connection lines */}
      <g stroke="#2081e2" strokeWidth="2" opacity="0.2" strokeDasharray="5,5">
        <line x1="250" y1="145" x2="250" y2="200">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
        </line>
        <line x1="355" y1="250" x2="300" y2="250">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
        </line>
        <line x1="250" y1="355" x2="250" y2="300">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Particle effects */}
      <g>
        <circle cx="150" cy="150" r="3" fill="#2081e2" opacity="0.4">
          <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="150" r="3" fill="#a855f7" opacity="0.4">
          <animate attributeName="cy" values="150;140;150" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="350" r="3" fill="#ec4899" opacity="0.4">
          <animate attributeName="cy" values="350;340;350" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="350" r="3" fill="#8b5cf6" opacity="0.4">
          <animate attributeName="cy" values="350;340;350" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.2s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}
