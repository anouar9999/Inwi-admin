import React from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';

const CustomButton = ({ 
  title, 
  href, 
  icon: Icon = CirclePlus, 
  onClick,
  disabled = false,
  className = '',
  mobileTitle = title,
  color = '#ff4700' // Default color
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-300 hover:from-blue-600 hover:to-pink-400',
    green: 'from-green-500 to-emerald-300 hover:from-green-600 hover:to-pink-400',
    red: 'from-red-500 to-pink-300 hover:from-red-600 hover:to-pink-400',
    purple: 'from-purple-500 to-indigo-300 hover:from-purple-600 hover:to-pink-400',
  };

  const buttonClasses = `
    relative overflow-hidden font
    text-white font-valorant rounded-md text-sm px-6 py-2 
    inline-flex items-center justify-center
    transition-all duration-300 ease-in-out
    transform  angular-cut
    focus:outline-none focus:ring-2 focus:ring-offset-2 ]
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const buttonContent = (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
    >
      <span className={`absolute inset-0 bg-gradient-to-r [${colorClasses[color] || colorClasses.blue}]`}></span>
      <span className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></span>
      <span className="relative flex items-center">
        <Icon className="w-5 h-5 mr-2 animate-pulse" />
        <span className="hidden md:inline">{title}</span>
        <span className="md:hidden">{mobileTitle}</span>
      </span>
      <span className="absolute inset-0  opacity-25 rounded-md"></span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12"></span>
      <style jsx global>{`
        .angular-cut {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut::before,
        .angular-cut::after {
          content: '';
          position: absolute;
          background-color: #374151;
        }
        .angular-cut::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut::after {
          bottom: 0;
          left: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
        .angular-cut-button {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut-button::before,
        .angular-cut-button::after {
          content: '';
          position: absolute;
          background-color: #78350f;
        }
        .angular-cut-button::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut-button::after {
          bottom: 0;
          left: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
      `}</style>
    </button>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="group">
        {buttonContent}
      </Link>
    );
  }

  return <div className="group">{buttonContent}</div>;
};

export default CustomButton;