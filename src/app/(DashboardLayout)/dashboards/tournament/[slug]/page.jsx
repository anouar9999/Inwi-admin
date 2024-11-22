'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CircleUserRound,
  Gamepad2,
  Plus,
  Shapes,
  BookmarkCheck,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  AwardIcon,
  Loader,
  AlertCircle,
  Type,
  TypeIcon,
} from 'lucide-react';
import ProfileCardGrid from '@/app/(DashboardLayout)/components/widgets/cards/ProfileCard';
import ParticipantCardGrid from '@/app/(DashboardLayout)/components/widgets/cards/ParticipantCardGrid';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HeroSection } from './HeroSection';
import { SquadFormatCard } from './SquadFormatCard';




const TabComponent = ({ activeTab, onTabChange, tournament }) => {
  const tabs = ['Overview', 'Waiting List', 'Participants', 'Bracket'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderTabContent = () => {
    if (
      tournament.status === 'En cours' &&
      activeTab !== 'Overview' &&
      activeTab !== 'Participants' &&
      activeTab !== 'Bracket'
    ) {
      return (
        <div className=" p-6 rounded-lg  text-center z-[20]">
        <Loader className='mx-auto w-12 h-12 mb-4'  />
          <h3 className="text-2xl font-bold mb-4">Tournament In Progress</h3>
          <p className="text-sm">
            The tournament is currently in progress. Some features may be limited until the
            tournament ends.
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
                icon={<Type />}
                title={`${tournament.participation_type} `}
                subTitle="Participant Type"
              />
               <SquadFormatCard
                icon={<AwardIcon />}
                title={`${tournament.prize_pool} DH`}
                subTitle="Prize Pool"
              />
               <SquadFormatCard
                icon={<AwardIcon />}
                title={`${tournament.competition_type} `}
                subTitle="Game"
              />
            </div>
            <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-primary" />
        Tournament Rules
      </h3>
              <div className=" p-4 rounded-lg text-sm space-y-4">
               {tournament.rules.split('\n').map((rule, index) => (
            <p key={index}>{rule}</p>
          ))}
              </div>
            </div>
          </div>
        );
      case 'Waiting List':
        return <ProfileCardGrid tournamentId={tournament.id} />;
      case 'Participants':
        return <ParticipantCardGrid tournamentId={tournament.id} />;
      case 'Bracket':
        return <p className="text-center text-gray-400">Bracket view is not yet implemented</p>;
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
          <ChevronDown
            className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
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
                className={`w-full p-2 text-left ${
                  activeTab === tab ? 'bg-fe5821 text-white' : 'hover:bg-gray-700'
                }`}
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
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const [glowColor, setGlowColor] = useState('green');
  const [showDropdown, setShowDropdown] = useState(false);

  const { slug } = useParams();
  const router = useRouter();

  const handleEdit = () => {
    // Redirect to edit page
    console.log(tournament);
    router.push(`/dashboards/edit-tournament/${tournament.id}`);
  };
  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete this tournament? This action cannot be undone.',
      )
    ) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_tournament.php`,
          {
            tournament_id: tournament.id,
          },
        );

        if (response.data.success) {
          toast.success(response.data.message, { autoClose: 1500 });
          setTimeout(() => {
            router.push('/dashboards/tournaments'); // Redirect to tournaments list
          }, 1500);
        } else {
          console.log(response.data);
          alert('Error deleting tournament: ' + response.data);
        }
      } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while deleting the tournament.${error}`);
      }
    }
  };
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/single_tournament.php?slug=${slug}`,
        );
        const data = await response.json();

        if (data.success) {
          setTournament(data.tournament);
          console.log(data.tournament);
        } else {
          setError(data.error || 'Failed to fetch tournament data');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while fetching tournament data');
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [slug]);

  useEffect(() => {
    let timer;
    if (showGlow) {
      timer = setTimeout(() => setShowGlow(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [showGlow]);

  const updateTournamentStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_tournament_status.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tournament_id: tournament.id,
            new_status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        if (tournament.status === 'Ouvert aux inscriptions' && newStatus === 'En cours') {
          setGlowColor('green');
          setShowGlow(true);
        } else if (newStatus === 'Terminé') {
          setGlowColor('red');
          setShowGlow(true);
        }
        setTournament({ ...tournament, status: newStatus });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating tournament status:', error);
    }
  };

  const renderStatusBasedContent = () => {
    switch (tournament.status) {
      case 'En cours':
        return (
          <>
           <p>Tournament In Progress
           </p>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit Tournament
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center text-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Tournament
                  </button>
                </div>
              )}
            </div>
          </>
        );
      case 'Ouvert aux inscriptions':
        return (
          <>
            <button
              onClick={() => updateTournamentStatus('En cours')}
              className=" angular-cut bg-primary text-white px-4 py-2 rounded-lg flex items-center mr-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Tournament
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit Tournament
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center text-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Tournament
                  </button>
                </div>
              )}
            </div>
          </>
        );
      case 'Terminé':
      case 'Annulé':
        return (
          <>
            <div
              className={`bg-${
                tournament.status === 'Terminé' ? 'gray' : 'red'
              }-600 text-white px-4 py-2 rounded-lg mr-2 angular-cut`}
            >
              Tournament has {tournament.status === 'Terminé' ? 'ended' : 'been cancelled'}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center text-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Tournament
                  </button>
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!tournament) return <div className="text-white">No tournament found.</div>;

  return (
    <div className="relative flex flex-col lg:flex-row gap-8 bg-gray-900 text-white p-6 rounded-lg">
      <ToastContainer />

      {/* Glow Effect */}
      <div
        className={`fixed inset-0 z-[999] pointer-events-none transition-opacity duration-1000 ${
          showGlow ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-${glowColor}-500 via-${glowColor}-500/20 to-transparent`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-${glowColor}-500 via-${glowColor}-500/20 to-transparent`}
        ></div>
        <div
          className={`absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-${glowColor}-500 via-${glowColor}-500/20 to-transparent`}
        ></div>
        <div
          className={`absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-${glowColor}-500 via-${glowColor}-500/20 to-transparent`}
        ></div>
      </div>

      {/* Tournament Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeTab !== 'Overview'
            ? 'lg:w-0 lg:opacity-0 lg:overflow-hidden'
            : 'lg:w-1/3 lg:opacity-100'
        }`}
      >
        <HeroSection
          title={tournament.nom_des_qualifications}
          backgroundSrc={tournament.image}
          startDate={tournament.start_date}
          endDate={tournament.end_date}
        />
        <div className="flex items-center justify-between mb-4">{renderStatusBasedContent()}</div>
        {tournament.status !== 'En cours' && (
          <div>
               <h3 className="text-lg font-bold mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-primary" />
        About the tournament
      </h3>
      
            <p className="text-sm text-gray-400">{tournament.description_des_qualifications}</p>
          </div>
        )}
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeTab !== 'Overview' ? 'lg:w-full' : 'lg:w-2/3'
        }`}
      >
        <TabComponent activeTab={activeTab} onTabChange={setActiveTab} tournament={tournament} />
      </div>
    </div>
  );
};

export default EsportsTournamentSidebar;
