import Link from 'next/link';
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
            <h2 className="text-white text-xs sm:text-sm font-semibold">
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
            <p className="text-gray-400 text-[10px]">TIME LEFT</p>
            <p className="text-white font-bold text-xs ">03:22:46</p>
          </div>
          <div className="w-0.5 h-6 sm:h-8 bg-orange-500"></div>
        </div>
      </div>
    </div>
  );
};

const MatchCard = () => {
  return (
    <Link href={'match/5'}>
      <div
        style={{
          clipPath:
            'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px), 0% 0%)',
        }}
        className="bg-[#1f2937] rounded-lg text-white w-full max-w-sm sm:max-w-md mx-auto"
      >
        <MatchCardHeader />
        <hr className="border-t border-[#242528]" />

        <div className="sm:p-4 pt-2">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="w-[45%] flex items-center">
                <img
                  src="https://yt3.googleusercontent.com/csrkEo7TvlRc_b388HvX7Q87gaQCn-rj8SFbRF8rOFuAhuGZ0lgPYz5DA3syM7Ufn0cTpknrgA=s900-c-k-c0x00ffffff-no-rj"
                  alt="Team A"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-[1rem] mr-2 sm:mr-3 flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-gray-400 text-xs text-left truncate">Team A</p>
                  <p className="text-white text-xs font-semibold text-left truncate">FORETOX EZR LONG NAME</p>
                </div>
              </div>

              <div className="text-white text-lg sm:text-2xl font-bold mx-2 flex-shrink-0">VS</div>

              <div className="w-[45%] flex items-center justify-end">
                <div className="text-right flex-grow min-w-0">
                  <p className="text-gray-400 text-xs text-right truncate">Team B</p>
                  <p className="text-white text-xs font-semibold text-right truncate">RUBBITS RUSH EXTENDED</p>
                </div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDr_tLrupx4dAPFB6-OMDEvK-W6CKlVRLjYg&s"
                  alt="Team B"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-[1rem] ml-2 sm:ml-3 flex-shrink-0"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex -space-x-2 w-[45%]">
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
              </div>

              <span className="inline-flex items-center px-1 bg-blue-200 hover:bg-blue-300 rounded text-[10px] font-semibold text-blue-600">
                UPCOMING
              </span>

              <div className="flex -space-x-2 w-[45%] justify-end">
                {[
                  'https://designzonic.com/download/wp-content/uploads/2019/06/SamuraiSkullAvatar.png',
                  'https://i.pinimg.com/236x/08/27/23/082723ad570164eb39b670dbad5ee92a.jpg',
                  'https://designzonic.com/download/wp-content/uploads/2019/04/Red-Avatar-Luar-Arts.png',
                  'https://yt3.googleusercontent.com/csrkEo7TvlRc_b388HvX7Q87gaQCn-rj8SFbRF8rOFuAhuGZ0lgPYz5DA3syM7Ufn0cTpknrgA=s900-c-k-c0x00ffffff-no-rj',
                ].map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Player ${index + 5}`}   
                    className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 border-gray-800"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;