import React from "react";

interface LogoProps {
  className?: string;
}

export function KanvoroLogoMark({ className = "h-5 w-5 text-white" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kanvoro Logo"
    >
      {/* Left Backlog Pillar / Agile Column */}
      <rect x="3.5" y="3.5" width="4.5" height="17" rx="2" fill="currentColor" />
      {/* Dynamic Chevron Wings forming the 'K' monogram & velocity flow */}
      <path
        d="M11 12.2L17.2 4.4C17.6 3.9 18.3 3.9 18.7 4.3L19.8 5.3C20.2 5.7 20.2 6.4 19.8 6.9L14.8 12.8L19.9 19.1C20.3 19.6 20.2 20.3 19.8 20.7L18.7 21.6C18.3 22 17.6 21.9 17.2 21.5L11 13.5V12.2Z"
        fill="currentColor"
        fillOpacity="0.95"
      />
    </svg>
  );
}
