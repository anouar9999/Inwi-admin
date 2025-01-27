'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CircleUserRound,
  Gamepad2,
  Plus,
  Shapes,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import PrizeList from '@/app/(DashboardLayout)/PrizeList';
import ParticipantCardGrid from '@/app/(DashboardLayout)/components/widgets/cards/ParticipantCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useTournament } from '@/contexts/TournamentContext';
import UserTournamentBracket from './tournamentBracket';




const SquadFormatCard = ({ icon, title, subTitle }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
    {typeof icon === 'string' ? (
      <img src={icon} alt={title} className="w-14 h-12 mb-2" />
    ) : (
      React.cloneElement(icon, { size: 24, className: 'mb-2' })
    )}
    <h4 className="font-bold">{title}</h4>
    <p className="text-xs text-gray-400">{subTitle}</p>
  </div>
);



const TabComponent = ({ activeTab, onTabChange, tournament }) => {
  const tabs = ['Overview',  'Participants', 'Bracket'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderTabContent = () => {
    if (tournament.status === 'En cours' && activeTab !== 'Overview' && activeTab !== 'Participants' && activeTab !== 'Bracket') {
      return (
        <div className="text-white p-6 rounded-lg text-center z-[20]">
          <h3 className="text-2xl font-bold mb-4">Tournament In Progress</h3>
          <p className="text-lg">
            The tournament is currently in progress. Some features may be limited until the tournament ends.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SquadFormatCard
                icon={<Gamepad2 />}
                title={tournament.type_de_match}
                subTitle="Format of game"
              />
              <SquadFormatCard
                icon={<Shapes />}
                title={tournament.type_de_jeu}
                subTitle="Platform Played"
              />
              <SquadFormatCard
                icon={<CircleUserRound />}
                title={tournament.nombre_maximum}
                subTitle="Number of Players"
              />
              <SquadFormatCard
                icon={tournament.competition_type === 'Valorant' ? "https://freebiehive.com/wp-content/uploads/2024/02/Valorant-Logo-PNG.jpg": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6_3faaiwykPBNbY9_8LSxvZfyFSK_wobcNqs9WhqNjJWBRPjdwUXoNojqgsmuzZ__LcTGQfpct6VMWkILsNGlCBHKb46jJ3tFg-7DmULovwGBTnMH3E3KsoLj2uO7EAef4hVH3yJMYpU/s0/Free+Fire+Logo+-+Download+Free+Vector+PNG.png"}
                subTitle="Game"
              />
            </div>
            <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-primary" />
        Tournament Rules
      </h3>
              <div className="bg-gray-800 p-4 rounded-lg text-sm space-y-4">
              {tournament.rules.split('\n').map((rule, index) => (
            <p key={index}>{rule}</p>
          ))}
              </div>
            </div>
          </div>
        );
      case 'Participants':
        return <ParticipantCardGrid tournamentId={tournament.id} />;
      case 'Bracket':
        return <UserTournamentBracket tournamentId={tournament.id} />;
      default:
        return <p className="text-center text-gray-400">Content for {activeTab}</p>;
    }
  };

  const TabButton = ({ tab }) => (
    <div className="relative inline-block">
      <svg
        width="100"
        height="32"
        viewBox="0 0 100 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path
          d="M6 0H87C90.5 0 93.5 1 95.5 3L100 7.5V27.5C100 30 98 32 95.5 32H13C9.5 32 6.5 31 4.5 29L0 24.5V4.5C0 2 2 0 4.5 0H6Z"
          fill={activeTab === tab ? '#AE2085' : 'transparent'}
        />
      </svg>
      <button
        onClick={() => onTabChange(tab)}
        className={`absolute inset-0 flex items-center justify-center text-xs font-semibold 
          ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}
      >
        <span>{tab}</span>
      </button>
    </div>
  );
        
  return (
    <div className="text-gray-300">
      {/* Desktop view */}
      <div className="hidden md:flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <TabButton key={tab} tab={tab} />
        ))}
      </div>

      {/* Mobile view */}
      <div className="md:hidden mb-4 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-gray-800 p-2 rounded-lg flex justify-between items-center"
        >
          <span>{activeTab}</span>
          <ChevronDown className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 mt-1 rounded-lg overflow-hidden z-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  onTabChange(tab);
                  setIsDropdownOpen(false);
                }}
                className={`w-full p-2 text-left ${activeTab === tab ? 'bg-fe5821 text-white' : 'hover:bg-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-lg">{renderTabContent()}</div>
    </div>
  );
};

const EsportsTournamentSidebar = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isJoining, setIsJoining] = useState(false);
  const { slug } = useParams();
  const { tournament, hasJoined, loading, error, fetchTournament, checkJoinStatus, setHasJoined } = useTournament();

  
 
  useEffect(() => {
   

    fetchTournament(slug);
    console.log(tournament);
  }, [slug]);
 
  
const LoadingPage = () => (
  <div className="fixed inset-0  flex flex-col justify-center items-center w-full h-full bg-[#05050f] z-50">
    <div className="mb-6 md:mb-8 flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
          alt="Brand Logo"
          width={350}
          height={100}
          className="cut-corners"
        />
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-500 mt-8"></div>
      </div>
    </div>
  </div>
);
  const joinTournament = async () => {
    try {
      setIsJoining(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User not logged in");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_join_tournament.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournament_id: tournament.id,
          user_id: userId,
        }),
      });
  
      let data;
      try {
        data = await response.json();
        fetchTournament();
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast.error("An unexpected error occurred. Please try again.", { autoClose: 1500 });
        return;
      }
  
      // Log the server-side logs
      if (data.logs && Array.isArray(data.logs)) {
        console.group('Server Logs:');
        data.logs.forEach(log => console.log(log));
        console.groupEnd();
      } else {
        console.log('No server logs available');
      }
  
      if (data.success) {
        toast.success(data.message, { autoClose: 1500 });
        setHasJoined(true);
        setIsJoining(false);

        // Optionally, you can update the UI or fetch updated tournament data here
      } else {
        toast.error(data.message || "Failed to join the tournament", { autoClose: 1500 });
      }
    } catch (error) {
      console.error('Error joining tournament:', error);
      toast.error(error.message || "An error occurred. Please try again.", { autoClose: 1500 });
    }
  };

  const renderStatusBasedContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (tournament.status === 'Ouvert aux inscriptions') {
      if (hasJoined) {
        return (
          <div className="text-white px-4 py-2 rounded-lg mr-2">
            You have joined this tournament
          </div>
        );
      } else {
        return (
          <button
            onClick={joinTournament}
            className="bg-primary text-white px-4 py-2 angular-cut flex items-center mr-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Join Tournament
          </button>
        );
      }
    } else if (tournament.status === 'En cours') {
      return (
        <div className=" text-white px-4 py-2 rounded-lg mr-2 flex items-center">
          <div className="animate-pulse mr-2 h-4 w-4 bg-white rounded-full"></div>
          Tournament is in progress ...
        </div>
      );
    } else {
      return (
        <div className="text-white px-4 py-2 rounded-lg mr-2">
          Tournament is {tournament.status}
        </div>
      );
    }
  };
  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!tournament) return <div className="text-white">No tournament found.</div>;

  return (
    <>
{isJoining && <LoadingPage />}
    <div className="relative overflow-x-hidden flex flex-col lg:flex-row gap-8 bg-gray-900 text-white p-6 rounded-lg">
             <ToastContainer />

      {/* Glow Effect */}
     

      {/* Tournament Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeTab !== 'Overview'
            ? 'lg:w-0 lg:opacity-0 lg:overflow-hidden'
            : 'lg:w-1/3 lg:opacity-100'
        }`}
      >
{/* 
<div className="flex items-center justify-between mb-4">{renderStatusBasedContent()}
                  
                  </div> */}
<div>
<h3 className="text-lg font-bold mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-primary" />
        About the tournament
      </h3>
            <h3 className="font-bold text-lg my-4"></h3>
            <p className="text-sm text-gray-400">{tournament.description_des_qualifications}</p>
          </div>
                
   
        {tournament.status !== 'Terminé' && <PrizeList />}
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeTab !== 'Overview' ? 'lg:w-full' : 'lg:w-2/3'
        }`}
      >
        <TabComponent activeTab={activeTab} onTabChange={setActiveTab} tournament={tournament} />
      </div>
    </div>
    </>
  );
};

export default EsportsTournamentSidebar;
