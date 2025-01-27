import React, { useState } from 'react';
import { ChevronRight, Trophy, Clock, ArrowRight } from 'lucide-react';

const AdvanceButton = ({ seed, handleAdvanceClick }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!(seed.teams.filter((team) => team.name !== 'TBD').length === 1 && seed.status === 'SCHEDULED')) {
    return null;
  }

  const advancingTeam = seed.teams.find(t => t.name !== 'TBD');
  
  const handleClick = (e) => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    
    // Add ripple effect
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - diameter / 2}px`;
    circle.style.top = `${e.clientY - button.offsetTop - diameter / 2}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    
    button.appendChild(circle);
    handleAdvanceClick(e);
    setIsConfirming(false);
  };

  return (
    <div 
      className="absolute -right-4 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => {
        setShowTooltip(false);
        setIsConfirming(false);
      }}
    >
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center 
          rounded-full bg-primary shadow-lg hover:bg-primary/90 
          focus:ring-2 focus:ring-primary/50 focus:outline-none
          transform hover:scale-105 active:scale-95
          transition-all duration-200 ease-out overflow-hidden"
        aria-label="Advance team to next round"
      >
        {/* Background pulse animation */}
        <div className="absolute inset-0 rounded-full opacity-0 
          group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 rounded-full bg-primary/20 
            animate-pulse" />
        </div>
        
        {/* Icon with transition */}
        {isConfirming ? (
          <ArrowRight 
            size={18} 
            className="text-white transform rotate-0 group-hover:rotate-45
              transition-transform duration-200" 
          />
        ) : (
          <ChevronRight 
            size={18} 
            className="text-white transform group-hover:translate-x-0.5
              transition-transform duration-200" 
          />
        )}

        {/* Connection line */}
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-px 
          bg-primary/50" />

        {/* Ripple style */}
        <style jsx>{`
          .ripple {
            position: absolute;
            background: white;
            transform: scale(0);
            animation: ripple 0.6s linear;
            border-radius: 50%;
            opacity: 0.4;
          }

          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}</style>
      </button>

      {/* Custom Tooltip */}
      <div className={`absolute top-1/2 right-full -translate-y-1/2 mr-4
        ${showTooltip ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-2'}
        transition-all duration-200 ease-out`}>
        <div className="relative bg-gray-800 rounded-lg shadow-xl border border-gray-700 min-w-[200px]">
          <div className="p-3 space-y-3">
            {isConfirming ? (
              <div className="space-y-1">
                <div className="text-sm font-semibold text-amber-500">
                  Confirm Advance
                </div>
                <div className="text-xs text-gray-400">
                  Click again to advance {advancingTeam.name} to the next round
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 
                    flex items-center justify-center">
                    <Trophy size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {advancingTeam.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      Ready to advance
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Click to initiate advance</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Arrow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-full
          border-8 border-transparent border-l-gray-800" />
      </div>
    </div>
  );
};

export default AdvanceButton;