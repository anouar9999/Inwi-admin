"use client"
import React, { useState, useEffect, createContext, useContext } from 'react';

// Create a context for the glow effect
const GlowContext = createContext();

// Custom hook to use the glow effect
export const useGlow = () => {
  const context = useContext(GlowContext);
  if (!context) {
    throw new Error('useGlow must be used within a GlowProvider');
  }
  return context;
};

const GlowEffect = ({ children, color = 'green', duration = 3000, className = '' }) => {
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    let timer;
    if (showGlow) {
      timer = setTimeout(() => setShowGlow(false), duration);
    }
    return () => clearTimeout(timer);
  }, [showGlow, duration]);

  const triggerGlow = () => {
    setShowGlow(true);
  };

  // Provide the triggerGlow function through context
  const contextValue = { triggerGlow };

  return (
    <GlowContext.Provider value={contextValue}>
      <div className={`relative ${className}`}>
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            showGlow ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: 1 }}
        >
          {/* Top edge */}
          <div className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-${color}-500 via-${color}-500/20 to-transparent`}></div>
          {/* Bottom edge */}
          <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-${color}-500 via-${color}-500/20 to-transparent`}></div>
          {/* Left edge */}
          <div className={`absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-${color}-500 via-${color}-500/20 to-transparent`}></div>
          {/* Right edge */}
          <div className={`absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-${color}-500 via-${color}-500/20 to-transparent`}></div>
          {/* Corner overlays */}
          <div className={`absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-${color}-500 via-${color}-500/40 to-transparent`}></div>
          <div className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-${color}-500 via-${color}-500/40 to-transparent`}></div>
          <div className={`absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-${color}-500 via-${color}-500/40 to-transparent`}></div>
          <div className={`absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-${color}-500 via-${color}-500/40 to-transparent`}></div>
        </div>

        {/* Wrapped Content */}
        <div className="relative" style={{ zIndex: 2 }}>
          {children}
        </div>
      </div>
    </GlowContext.Provider>
  );
};

export default GlowEffect;