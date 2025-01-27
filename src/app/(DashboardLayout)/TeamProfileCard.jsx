import React from 'react';

const TeamProfileCard = () => {
  return (
    <div className="bg-[#222327] text-white rounded-xl p-4 flex items-start justify-between w-full max-w-md">
      <div className="flex items-start">
        <div className="w-16 h-16 relative mr-4 flex-shrink-0">
          <svg width="0" height="0">
            <defs>
              <clipPath id="pentagon" clipPathUnits="objectBoundingBox">
                <path d="M0.5 0, 1 0.4, 0.8 1, 0.2 1, 0 0.4Z" />
              </clipPath>
            </defs>
          </svg>
          <div
            className="w-full h-full"
            style={{
              clipPath: 'url(#pentagon)'
            }}
          >
            <img
              src='https://yt3.googleusercontent.com/csrkEo7TvlRc_b388HvX7Q87gaQCn-rj8SFbRF8rOFuAhuGZ0lgPYz5DA3syM7Ufn0cTpknrgA=s900-c-k-c0x00ffffff-no-rj'
              alt="Team Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight mb-1">WE PLAY RBEEE BRSTNTRN EBRTQN</h2>
          <p className="text-[#ff4700] text-xs mb-2">5 Members</p>
          <div className="flex -space-x-2">
          {[
                'https://designzonic.com/download/wp-content/uploads/2019/06/SamuraiSkullAvatar.png',
                'https://i.pinimg.com/236x/08/27/23/082723ad570164eb39b670dbad5ee92a.jpg',
                'https://designzonic.com/download/wp-content/uploads/2019/04/Red-Avatar-Luar-Arts.png',
                'https://yt3.googleusercontent.com/csrkEo7TvlRc_b388HvX7Q87gaQCn-rj8SFbRF8rOFuAhuGZ0lgPYz5DA3syM7Ufn0cTpknrgA=s900-c-k-c0x00ffffff-no-rj',
              ].map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Player ${index + 1}`}
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 border-gray-800"
              />
            ))}
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
              +6
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end ml-4">
        <div style={{
          clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px), 0% 0%)'
        }} className="bg-[#313339] rounded-lg p-1 mb-2 w-20 text-center">
          <p className="text-xl font-bold">45</p>
          <p className="text-[11px] text-gray-400">Tournament</p>
        </div>
        <div style={{
          clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px), 0% 0%)'
        }} className="bg-[#313339] rounded-lg p-2 w-20 text-center">
          <p className="text-2xl font-bold">900</p>
          <p className="text-xs text-gray-400">Matches</p>
        </div>
      </div>
    </div>
  );
};

export default TeamProfileCard;