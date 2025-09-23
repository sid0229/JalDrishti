import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export default function LogoIcon({ className = '', size = 48 }: LogoIconProps) {
  return (
    <svg 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dropGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#003F7F" />
          <stop offset="50%" stopColor="#0066CC" />
          <stop offset="100%" stopColor="#00FFC2" />
        </linearGradient>
        <filter id="glowIcon" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Water Drop */}
      <path
        d="M40 10C40 10 20 30 20 45C20 56.045 29.955 65 40 65C50.045 65 60 56.045 60 45C60 30 40 10 40 10Z"
        fill="url(#dropGradientIcon)"
        filter="url(#glowIcon)"
      />
      
      {/* Eye Shape */}
      <ellipse cx="40" cy="42" rx="15" ry="8" fill="#FFF8E6" opacity="0.9"/>
      
      {/* Pupil/Iris */}
      <circle cx="40" cy="42" r="6" fill="#003F7F"/>
      <circle cx="40" cy="42" r="3" fill="#00FFC2"/>
      <circle cx="42" cy="40" r="1" fill="#FFF8E6"/>
      
      {/* Water Waves */}
      <path
        d="M25 55C30 50 35 55 40 50C45 55 50 50 55 55"
        stroke="#00FFC2"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}