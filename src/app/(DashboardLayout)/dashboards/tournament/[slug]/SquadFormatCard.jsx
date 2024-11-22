import React from "react";

export const SquadFormatCard = ({ icon, title, subTitle }) => (
    <div className="bg-gray-800 p-4 angular-cut flex flex-col items-center text-center">
      {typeof icon === 'string' ? (
        <img src={icon} alt={title} className="w-14 h-12 mb-2" />
      ) : (
        React.cloneElement(icon, { size: 24, className: 'mb-2' })
      )}
      <h4 className="font-bold">{title}</h4>
      <p className="text-xs text-gray-400">{subTitle}</p>
    </div>
  );