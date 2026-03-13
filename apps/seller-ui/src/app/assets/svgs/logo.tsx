import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

const UGoesShopOnlineLogo: React.FC<LogoProps> = ({
  size = 40,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#667eea", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#764ba2", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      {/* Circular background */}
      <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" />

      {/* Shopping bag icon */}
      <g transform="translate(12, 12)">
        {/* Bag body */}
        <rect
          x="2"
          y="8"
          width="20"
          height="16"
          rx="2"
          fill="white"
          opacity="0.95"
        />

        {/* Bag handles */}
        <path
          d="M8 8 C8 4, 16 4, 16 8"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Letter U */}
        <text
          x="12"
          y="20"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fontWeight="bold"
          fill="url(#logoGradient)"
          textAnchor="middle"
        >
          U
        </text>
      </g>
    </svg>
  );
};

export default UGoesShopOnlineLogo;
