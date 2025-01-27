"use client"
import React, { useRef, useEffect, useState } from 'react';

const NeonSharpEdgedProgressBar = ({ progress = 75 }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.max(12, width * 0.04); // Minimum height of 12px, or 3% of width
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { width, height } = dimensions;
  const sharpness = Math.min(width * 0.01, height * 0.25); // Adjust sharpness based on size

  return (
    <div ref={containerRef} className="w-full">
      <svg width="100%" height={height} preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fe5821" />
            <stop offset="100%" stopColor="#FF9900" />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <path 
          d={`M${sharpness} 0 H${width-sharpness} L${width} ${height/2} L${width-sharpness} ${height} H${sharpness} L0 ${height/2} Z`}
          fill="#1F2937"
        />
        
        {/* Neon Glow Effect */}
        <path 
          d={`M${sharpness} 0 H${(width * progress / 100) - sharpness} L${width * progress / 100} ${height/2} L${(width * progress / 100) - sharpness} ${height} H${sharpness} L0 ${height/2} Z`}
          fill="url(#neonGradient)"
          filter="url(#neonGlow)"
          opacity="0.7"
        />
        
        {/* Progress Fill */}
        <path 
          d={`M${sharpness} 0 H${(width * progress / 100) - sharpness} L${width * progress / 100} ${height/2} L${(width * progress / 100) - sharpness} ${height} H${sharpness} L0 ${height/2} Z`}
          fill="url(#neonGradient)"
        />
      </svg>
    </div>
  );
};

export default NeonSharpEdgedProgressBar;