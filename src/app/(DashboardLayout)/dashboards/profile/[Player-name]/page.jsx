"use client"
import React, { useEffect, useState } from 'react';
import { ChevronRight, CircleUserRound, Gamepad2, Joystick, Plus, Shapes, Wallet, Settings, Users, Calendar, FileText, PlusCircle, MapPin } from 'lucide-react';
import PrizeList from '@/app/(DashboardLayout)/PrizeList';
import Image from 'next/image';

const NeonSharpEdgedProgressBar = ({ progress }) => (
  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const AvatarGroup = () => (
  <div className="flex -space-x-2 overflow-hidden">
    {[...Array(4)].map((_, i) => (
      <img
        key={i}
        className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800"
        src={`https://i.pravatar.cc/150?img=${i + 1}`}
        alt="User avatar"
      />
    ))}
  </div>
);

const UserProfileSection = () => {
  const roundedHexagonClipPath = `
    polygon(
      50% 0%, 
      95% 25%, 95% 75%,
      50% 100%, 
      5% 75%, 5% 25%
    )
  `;
 
  return (
    <div className="text-white  ">
      <div className="flex items-center mb-7">
        <div className="mr-4 relative w-16 h-16">
          <img
            src="https://img.freepik.com/psd-gratuit/illustration-3d-avatar-profil-humain_23-2150671122.jpg?t=st=1724071085~exp=1724074685~hmac=2ac058c4d961e22e8abf69f7ee9f4691bbeaaa56829172bb29031db26551597e&w=740"
            alt="John Matrix"
            className="w-full h-full object-cover absolute rounded-lg"
            style={{
              clipPath: roundedHexagonClipPath,
            }}
          />
          <div
            className="absolute inset-0 border-2 border-purple-500 rounded-lg"
            style={{
              clipPath: roundedHexagonClipPath,
            }}
          ></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">JOHN MATRIX</h1>
          <div className="flex space-x-2 mt-1">
            {['facebook', 'facebook', 'youtube', 'twitch'].map((social) => (
              <div key={social} className="w-5 h-5 bg-gray-700 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

    

      <div className='my-7'>
          <h3 className="font-bold text-lg mb-2">About The Player</h3>
          <p className="text-sm text-gray-400">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut odio id obcaecati
            necessitatibus! Quis officia architecto, illum sunt, magni quae est aliquam voluptatibus
            reiciendis sint vitae dignissimos debitis eos accusantium.
          </p>
        </div>

     

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
          background-color: #374151; /* Tailwind's gray-700, adjust as needed */
        }
        .angular-cut::before {
          top: 0;
          right: 0;
          width: 2px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut::after {
          bottom: 0;
          left: 0;
          width: 10px;
          height: 2px;
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
          background-color: #78350f; /* Tailwind's orange-900, for a darker border */
        }
        .angular-cut-button::before {
          top: 0;
          right: 0;
          width: 2px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut-button::after {
          bottom: 0;
          left: 0;
          width: 10px;
          height: 2px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }

        .clip-polygon {
          clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%);
        }

        .clip-polygon2 {
          clip-path: polygon(
            30% 0%,
            70% 0%,
            100% 30%,
            100% 70%,
            70% 100%,
            30% 100%,
            0% 70%,
            0% 30%
          );
        }
      `}</style>

      <div className='p-6'>
        <h3 className="text-sm font-medium mb-2 ">My platform IDs</h3>
        <div className="bg-gray-800  px-3 py-2 flex items-center justify-between mb-2 angular-cut">
          <span className="text-gray-400 text-sm">marz76_spirit_john</span>
          <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </div>
        </div>
        <div className="bg-orange-500  px-3 py-2 flex items-center justify-between angular-cut">
          <span className="text-sm">marz76_spirit4420</span>
          <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const SquadFormatCard = ({ icon, title, subTitle }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
    {typeof icon === 'string' ? <img src={icon} alt={title} className="w-14 h-12 mb-2" /> : React.cloneElement(icon, { size: 24, className: "mb-2" })}
    <h4 className="font-bold">{title}</h4>
    <p className="text-xs text-gray-400">{subTitle}</p>
  </div>
);

const MatchCard = () => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-bold">Team A</span>
      <span className="text-sm text-gray-400">VS</span>
      <span className="text-sm font-bold">Team B</span>
    </div>
    <div className="text-center text-xs text-gray-400">Upcoming Match</div>
  </div>
);

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Match Finder', 'Standings', 'Matches'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SquadFormatCard icon={<Gamepad2 />} title="SQUAD" subTitle="Format of game" />
              <SquadFormatCard icon={<Shapes />} title="PLAYSTATION" subTitle="Platform Played" />
              <SquadFormatCard icon={<CircleUserRound />} title="12" subTitle="Number of Players" />
              <SquadFormatCard icon="/images/backgrounds/LOL_Logo_Rendered_Hi-Res_onblue-4x3-removebg-preview.png" subTitle="Game" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Rules</h3>
              <div className="bg-gray-800 p-4 rounded-lg text-sm space-y-4">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima quibusdam, numquam similique dolor magni blanditiis vero excepturi sapiente, eius iure dicta, ea nesciunt soluta dolorem aliquid in tempore corporis explicabo.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima quibusdam, numquam similique dolor magni blanditiis vero excepturi sapiente, eius iure dicta, ea nesciunt soluta dolorem aliquid in tempore corporis explicabo.</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>
                  <li>Minima quibusdam, numquam similique dolor magni blanditiis vero excepturi sapiente.</li>
                  <li>Eius iure dicta, ea nesciunt soluta dolorem aliquid in tempore corporis explicabo.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'Match Finder':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <UpcomingMatchSummary />
          <MatchSummary />
          <MatchSummary />
          <MatchSummary />
          <MatchSummary />
          <MatchSummary />
          <UpcomingMatchSummary />
        </div>
        );
      default:
        return <p className="text-center text-gray-400">Content for {activeTab}</p>;
    }
  };

  return (
    <div className="text-gray-300">
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <div key={tab} className="relative inline-block">
            <svg
              width="100"
              height="32"
              viewBox="0 0 100 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 0H87C90.5 0 93.5 1 95.5 3L100 7.5V27.5C100 30 98 32 95.5 32H13C9.5 32 6.5 31 4.5 29L0 24.5V4.5C0 2 2 0 4.5 0H6Z"
                fill={activeTab === tab ? "#fe5821" : "transparent"}
              />
            </svg>
            <button
              onClick={() => setActiveTab(tab)}
              className={`absolute inset-0 flex items-center justify-center text-xs font-semibold 
                ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}
            >
              <span>{tab}</span>
            </button>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 p-6 rounded-lg">
        {renderTabContent()}
      </div>
    </div>
  );
};
const HeroSection = ({ title, logoSrc, backgroundSrc }) => (
  <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
    <img
      src={backgroundSrc}
      alt="Tournament background"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
    <div className="absolute inset-0 flex items-center p-6">
   
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <NeonSharpEdgedProgressBar progress={45} />
        <p className="text-sm text-gray-300 mt-2">Started in 44:39</p>
      </div>
    </div>
  </div>
);
const EsportsTournamentSidebar = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-gray-900 text-white p-6 rounded-lg">
      {/* Left Column - Tournament Info */}
      <div className="lg:w-1/3 space-y-6">
      <UserProfileSection/>
      
       

       


     
       
      </div>

      {/* Right Column - Tab Content */}
      <div className="lg:w-2/3">
        <TabComponent />
      </div>
    </div>
  );
};

export default EsportsTournamentSidebar;


const MatchSummary = () => {
  return (
    <div className="bg-[#1E1F23] rounded-lg overflow-hidden max-w-md">
      {/* Match Header */}
      <div className="bg-[#2d2f35] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-0.5 h-8 bg-orange-500 mr-2"></div>
          <div>
            <p className="text-gray-400 text-xs">PLAYED</p>
            <p className="text-white text-sm">2 HOURS AGO</p>
          </div>
        </div>
        <span className="bg-red-500 text-white text-[10px] font-semibold px-1  rounded">
          FINISHED
        </span>
      </div>

      {/* Match Body */}
      <div className="p-4 space-y-4">
        {/* Team A (Winner) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full mr-3 flex items-center justify-center">
              <Image
                src="https://img.freepik.com/photos-premium/concept-unique-nouvelle-conception-du-logo_1252102-24837.jpg?w=740"
                width={40}
                height={40}
                alt="Team A Avatar"
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-gray-400 text-xs">TEAM A</p>
              <p className="text-white font-semibold">FORESTYFOX</p>
            </div>
          </div>
          <div className="text-white text-xl font-bold">4</div>
        </div>
        <div className="w-full h-px bg-gray-600 mx-4"></div>

        {/* Team B (Loser - Muted) */}
        <div className="flex items-center justify-between opacity-70">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full mr-3 flex items-center justify-center">
              <Image
                src="https://img.freepik.com/photos-premium/conception-du-logo-jeu-ai-generation_679376-1001.jpg?w=740"
                width={40}
                height={40}
                alt="Team B Avatar"
                className="rounded-full opacity-80"
              />
            </div>
            <div>
              <p className="text-gray-500 text-xs">TEAM B</p>
              <p className="text-gray-300 font-semibold">RABBITS RUSH</p>
            </div>
          </div>
          <div className="text-gray-300 text-xl font-bold">0</div>
        </div>
      </div>
    </div>
  );
};

const UpcomingMatchSummary = () => {
  return (
    <div className="bg-[#1E1F23] rounded-lg overflow-hidden max-w-md">
      {/* Match Header */}
      <div className="bg-[#2d2f35] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-0.5 h-8 bg-blue-500 mr-2"></div>
          <div>
            <p className="text-gray-400 text-xs">UPCOMING</p>
            <p className="text-white text-sm">IN 2 HOURS</p>
          </div>
        </div>
        <span className="bg-blue-500 text-white text-[10px] font-semibold px-1 rounded">
          NOT STARTED
        </span>
      </div>

      {/* Match Body */}
      <div className="p-4 space-y-4">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full mr-3 flex items-center justify-center">
              <Image
                src="https://img.freepik.com/photos-premium/concept-unique-nouvelle-conception-du-logo_1252102-24837.jpg?w=740"
                width={40}
                height={40}
                alt="Team A Avatar"
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-gray-400 text-xs">TEAM A</p>
              <p className="text-white font-semibold">FORESTYFOX</p>
            </div>
          </div>
          <div className="text-gray-400 text-sm font-semibold">TBD</div>
        </div>
        <div className="w-full h-px bg-gray-600 mx-4"></div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full mr-3 flex items-center justify-center">
              <Image
                src="https://img.freepik.com/photos-premium/conception-du-logo-jeu-ai-generation_679376-1001.jpg?w=740"
                width={40}
                height={40}
                alt="Team B Avatar"
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-gray-400 text-xs">TEAM B</p>
              <p className="text-white font-semibold">RABBITS RUSH</p>
            </div>
          </div>
          <div className="text-gray-400 text-sm font-semibold">TBD</div>
        </div>
      </div>
    </div>
  );
};