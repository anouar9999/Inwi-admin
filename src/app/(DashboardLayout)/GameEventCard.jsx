import React from 'react';

const NeonSharpEdgedProgressBar = ({ progress }) => (
  <div
    className="relative w-full h-1.5 bg-gray-700 overflow-hidden"
    style={{
      clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)',
    }}
  >
    <div
      className="absolute inset-y-0 left-0 bg-[#ff4700]"
      style={{
        width: `${progress}%`,
        clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)',
      }}
    ></div>
  </div>
);

const GameEventCard = () => {
  return (
    <div className="bg-transparent rounded-lg shadow-lg p-4 flex items-center space-x-4 w-full max-w-xl">
      <img
        style={{
          clipPath:
            'polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px), 0% 0%)',
        }}
        src="https://img.freepik.com/photos-premium/image-haute-resolution-trophee-decerne-aux-champions-tournoi-esports_1039156-3442.jpg?w=826"
        alt="Character portrait"
        className="w-2/6	 h-full object-cover rounded-lg"
      />

      <div className="flex-1 w-4/6	">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 flex items-center  ">
           
              <div className="bg-[#fbff00]  h-2 w-2 mx-1 rounded-full"></div>
              STARTS IN 2 HOURS, 20:00 PM
            </p>
            <h2 className="text-white text-xl font-bold  my-1">Super Circuit Level 900000</h2>
          </div>
        </div>

        <NeonSharpEdgedProgressBar progress={70} />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>54 spots</span>
          <span className="text-[#ff4700]">4 left</span>
        </div>

        

        <div className="flex items-center space-x-2 mt-4">
          <img
            src="https://yt3.googleusercontent.com/csrkEo7TvlRc_b388HvX7Q87gaQCn-rj8SFbRF8rOFuAhuGZ0lgPYz5DA3syM7Ufn0cTpknrgA=s900-c-k-c0x00ffffff-no-rj"
            alt="Host"
            className="w-10 h-10 rounded-[1rem]"
          />
          <span className="text-gray-400 text-sm">Hosted by</span>
          <span className="text-[#ff4700] text-sm font-semibold">Playtest.GG</span>
        </div>
      </div>
    </div>
  );
};

export default GameEventCard;
