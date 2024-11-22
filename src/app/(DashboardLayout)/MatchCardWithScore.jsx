import React from 'react';

const MatchCardHeader = () => {
  return (
    <div className="bg-[#1f2937] rounded-t-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex items-start mb-2 sm:mb-0">
          <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold mr-2 sm:mr-3">
            A
          </div>
          <div>
            <h2 className="text-white text-xs sm:text-sm font-semibold truncate max-w-[200px]">
              Summer Season Starter Cup
            </h2>
            <p className="flex items-center text-gray-400 text-xs">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mr-1 rounded-full bg-yellow-400"></div>
              August 10, 2024
            </p>
          </div>
        </div>
        <div className="flex items-start mt-2 sm:mt-0">
          <div className="text-right mr-2">
            <p className="text-gray-400 text-[10px]">WINNER</p>
            <p className="text-white font-semibold text-xs truncate max-w-[100px]">FORETOX EZR</p>
          </div>
          <div className="w-0.5 h-6 sm:h-8 bg-orange-500"></div>
        </div>
      </div>
    </div>
  );
};

const ScoreDisplay = ({ scoreA, scoreB }) => {
  return (
    <div className="flex items-center justify-center rounded-lg px-2 py-1 sm:px-3 sm:py-2 flex-shrink-0">
      <span className="text-white text-base sm:text-xl font-bold">{scoreA}</span>
      <span className="text-gray-400 text-sm sm:text-lg mx-1">-</span>
      <span className="text-white text-base sm:text-xl font-bold">{scoreB}</span>
    </div>
  );
};

const TeamDisplay = ({ title, name, logoSrc, isLosing }) => {
  const overlayClass = isLosing ? 'opacity-50' : '';
  return (
    <div className={`w-[42%] flex items-center ${isLosing ? 'opacity-50' : ''}`}>
      <div className="flex-grow min-w-0">
        <p className="text-gray-400 text-xs truncate">{title}</p>
        <p className="text-white text-xs font-semibold truncate">{name}</p>
      </div>
      <img
        src={logoSrc}
        alt={`Team ${name}`}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ml-2 sm:ml-3 flex-shrink-0 ${overlayClass}`}
      />
    </div>
  );
};

const PlayerAvatars = ({ count, isLosing }) => {
  const overlayClass = isLosing ? 'opacity-50' : '';
  return (
    <div className={`flex -space-x-2 w-[42%] ${isLosing ? 'justify-end' : ''}`}>
      {[
        'https://designzonic.com/download/wp-content/uploads/2019/06/SamuraiSkullAvatar.png',
        'https://i.pinimg.com/236x/08/27/23/082723ad570164eb39b670dbad5ee92a.jpg',
        'https://designzonic.com/download/wp-content/uploads/2019/04/Red-Avatar-Luar-Arts.png',
        'https://yt3.googleusercontent.com/csrkEo7TvlRc_b388HvX7Q87gaQCn-rj8SFbRF8rOFuAhuGZ0lgPYz5DA3syM7Ufn0cTpknrgA=s900-c-k-c0x00ffffff-no-rj',
      ].slice(0, count).map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Player ${index + 1}`}
          className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 border-gray-800 ${overlayClass}`}
        />
      ))}
    </div>
  );
};

const MatchCardWithScore = () => {
  const scoreA = 2;
  const scoreB = 1;
  const isTeamALosing = scoreA < scoreB;
  const isTeamBLosing = scoreB < scoreA;

  return (
    <div
      style={{
        clipPath:
          'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px), 0% 0%)',
      }}
      className="bg-[#1f2937] rounded-lg text-white w-full max-w-sm sm:max-w-md mx-auto"
    >
      <MatchCardHeader />
      <hr className="border-t border-[#242528]" />

      <div className="p-3 sm:p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TeamDisplay
              title="Title A Long Name"
              name="FORETOX EZR EXTENDED"
              logoSrc="https://yt3.googleusercontent.com/csrkEo7TvlRc_b388HvX7Q87gaQCn-rj8SFbRF8rOFuAhuGZ0lgPYz5DA3syM7Ufn0cTpknrgA=s900-c-k-c0x00ffffff-no-rj"
              isLosing={isTeamALosing}
            />

            <ScoreDisplay scoreA={scoreA} scoreB={scoreB} />

            <TeamDisplay
              title="Title B Long Name"
              name="RUBBITS RUSH EXTENDED"
              logoSrc="https://yt3.googleusercontent.com/csrkEo7TvlRc_b388HvX7Q87gaQCn-rj8SFbRF8rOFuAhuGZ0lgPYz5DA3syM7Ufn0cTpknrgA=s900-c-k-c0x00ffffff-no-rj"
              isLosing={isTeamBLosing}
            />
          </div>

          <div className="flex justify-between items-center">
            <PlayerAvatars count={4} isLosing={isTeamALosing} />

            <span className="inline-flex items-center px-1 bg-red-600 hover:bg-red-700 rounded text-[10px] font-semibold text-white">
              Finished
            </span>

            <PlayerAvatars count={4} isLosing={isTeamBLosing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCardWithScore;