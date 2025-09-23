import React from 'react';

interface LogoMonoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LogoMono({ className = '', size = 'md', color = '#000000' }: LogoMonoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <svg 
        className={`${sizeClasses[size]} w-auto`}
        viewBox="0 0 80 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Water Drop */}
        <path
          d="M40 10C40 10 20 30 20 45C20 56.045 29.955 65 40 65C50.045 65 60 56.045 60 45C60 30 40 10 40 10Z"
          fill={color}
        />
        
        {/* Eye Shape */}
        <ellipse cx="40" cy="42" rx="15" ry="8" fill="white"/>
        
        {/* Pupil/Iris */}
        <circle cx="40" cy="42" r="6" fill={color}/>
        <circle cx="40" cy="42" r="3" fill="white"/>
        <circle cx="42" cy="40" r="1" fill={color}/>
        
        {/* Water Waves */}
        <path
          d="M25 55C30 50 35 55 40 50C45 55 50 50 55 55"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      
      <div className="flex flex-col">
        <span className="font-bold text-xl leading-tight tracking-wide" style={{ color }}>
          JalDrishti
        </span>
        <span className="text-sm opacity-70 font-medium" style={{ color }}>
          जलदृष्टि
        </span>
      </div>
    </div>
  );
}