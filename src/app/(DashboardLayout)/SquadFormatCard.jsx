import React from 'react';


const SquadFormatCard = ({icon, title, subTitle}) => {
  return (
    <div className={`relative w-48 h-28 overflow-hidden }`}>
      {/* SVG for border with cut corners in top right and bottom left, rounded corners in top left and bottom right */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0H180L192 12V104C192 108.418 188.418 112 184 112H12L0 100V8C0 3.58172 3.58172 0 8 0Z" stroke="#374151" strokeWidth="1" fill="none"/>
      </svg>
      
      {/* Card content */}
      <div className="relative z-10 p-4 flex flex-col items-start h-full">
        {icon}
        <span className="text-white font-bold text-lg mt-1">{title}</span>
        <p className="text-gray-400 text-sm mt-1">{subTitle}</p>
      </div>
    </div>
  );
};

export default SquadFormatCard;