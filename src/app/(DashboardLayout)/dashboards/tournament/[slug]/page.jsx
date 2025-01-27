'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CircleUserRound,
  Gamepad2,
  Plus,
  Shapes,
  ChevronDown,
  AwardIcon,
  Loader,
  AlertCircle,
  Type,
  AlertCircleIcon,
  Swords,
  ArrowUpRight,
  DollarSign,
  Users,
  Monitor,
  Trophy,
} from 'lucide-react';
import WaitingList from '@/app/(DashboardLayout)/components/widgets/cards/WaitingList';
import ParticipantList from '@/app/(DashboardLayout)/components/widgets/cards/ParticipantList';
import axios from 'axios';
import { HeroSection } from './HeroSection';
import { SquadFormatCard } from './SquadFormatCard';
import TournamentBracket from '../../../TournamentBracket';
import TransparentLoader from './Loader';
import { useToast } from '@/utils/ToastProvider';
import TournamentStatus from './TournamentStatus';
import DoubleEliminationBracket from '@/app/(DashboardLayout)/DoubleElminationBracket';
import TabComponent from './TabComponent';


<<<<<<< HEAD
=======
  const renderTabContent = () => {
    if (
      tournament.status === 'En cours' &&
      activeTab !== 'Overview' &&
      activeTab !== 'Participants' &&
      activeTab !== 'Bracket'
    ) {
      return (
        <div className=" p-6 rounded-lg  text-center z-[20]">
          <Loader className="mx-auto w-12 h-12 mb-4" />
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
</div>
            <div>
              <div className=" p-4 rounded-lg bg-secondary text-sm space-y-4 border-l-4 border-primary">
                <h3 className=" text-3xl font-custom text-white  leading-tight uppercase tracking-wider   mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-primary " />
                  Tournament Rules
                </h3>
                {tournament.rules.split('\n').map((rule, index) => (
                  <p key={index}>{rule}</p>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Waiting List':
        return <WaitingList tournamentId={tournament.id} />;
      case 'Participants':
        return <ParticipantList tournamentId={tournament.id} />;
      case 'Bracket':
        return tournament.format_des_qualifications === 'Single Elimination' ? (
          <TournamentBracket tournamentId={tournament.id} isTeamTournament={tournament.participation_type === 'team'} />
        ) : (
          <DoubleEliminationBracket tournamentId={tournament.id} />
        );
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
>>>>>>> 7a251904a296d560f82e3d62ce4e7a82583ed85c

const EsportsTournamentSidebar = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);

  const [error, setError] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const [glowColor, setGlowColor] = useState('green');
  const [showDropdown, setShowDropdown] = useState(false);
  const { showToast } = useToast();

  const { slug } = useParams();
  const router = useRouter();

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
  const generateInitialMatches = async (tournamentId) => {
    try {
      setLoad(false);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate_matches.php`,
        {
          tournament_id: tournamentId,
          isTeamTournament: tournament.participation_type === 'team',
        },
      );

      if (response.data.success) {
        const MAX_PARTICIPANTS = response.data.data[0]?.nombre_maximum || 8;
        const numRounds = Math.ceil(Math.log2(MAX_PARTICIPANTS));
        const matches = response.data.data;

        const formattedMatches = matches.map((match) => ({
          id: match.id,
          round: parseInt(match.round),
          player1: {
            id: match.player1_id,
            name: match.player1_name || 'TBD',
            avatar: match.player1_avatar,
          },
          player2: {
            id: match.player2_id,
            name: match.player2_name || 'TBD',
            avatar: match.player2_avatar,
          },
          score1: parseInt(match.score1) || 0,
          score2: parseInt(match.score2) || 0,
          status: match.status,
          match_date: match.match_date,
        }));

        return {
          success: true,
          data: formattedMatches,
          rounds: numRounds,
        };
      }

      return {
        success: false,
        error: 'Failed to generate matches',
      };
    } catch (error) {
      console.error('Error generating matches:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error generating matches',
      };
    } finally {
      setLoad(false);
    }
  };
  const updateTournamentStatus = async (newStatus) => {
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_tournament_status.php`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tournament_id: tournament.id,
            new_status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        await generateInitialMatches(tournament.id);

        setGlowColor(newStatus === 'En cours' ? 'green' : 'red');
        setShowGlow(true);
        setTournament({ ...tournament, status: newStatus });
      }
    } catch (error) {
      console.error('Error:', error);
      setLoad(false);
    }
  };

  if (load)
    return (
      <TransparentLoader
        messages={[
          'Loading your content...',
          'Generating matches...',
          'Creating bracket...',
          'Almost there...',
        ]}
      />
    );
  if (loading)
    return (
      <div className="text-white">
        <TransparentLoader messages={['Loading your content...']} />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center ">
        <AlertCircleIcon /> Error: {error}
      </div>
    );
  if (!tournament) return <div className="text-white">No tournament found.</div>;

  return (
    <div className="relative flex flex-col gap-8  text-white p-2 rounded-lg">
      {/* Glow Effect */}
      <div
        className={`fixed inset-0 z-[999] pointer-events-none transition-opacity duration-1000 ${
          showGlow ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${
            glowColor === 'green'
              ? 'from-green-500 via-green-500/20'
              : 'from-red-500 via-red-500/20'
          } to-transparent`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${
            glowColor === 'green'
              ? 'from-green-500 via-green-500/20'
              : 'from-red-500 via-red-500/20'
          } to-transparent`}
        />
        <div
          className={`absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r ${
            glowColor === 'green'
              ? 'from-green-500 via-green-500/20'
              : 'from-red-500 via-red-500/20'
          } to-transparent`}
        />
        <div
          className={`absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l ${
            glowColor === 'green'
              ? 'from-green-500 via-green-500/20'
              : 'from-red-500 via-red-500/20'
          } to-transparent`}
        />
      </div>

      {/* Tournament Content */}
      <div
        className={`transition-all duration-300 gap-2 ease-in-out ${
          activeTab !== 'Overview'
            ? 'lg:w-full lg:opacity-0 lg:overflow-hidden'
            : 'lg:w-full lg:opacity-100'
        }`}
      >
       {
        activeTab === 'Overview' && (
          <>
           <HeroSection
          spots_remaining={tournament.spots_remaining}
          tournamentId={tournament.id}
          title={tournament.nom_des_qualifications}
          backgroundSrc={tournament.image}
          startDate={tournament.start_date}
          endDate={tournament.end_date}
          tournament={tournament}
                      updateTournamentStatus={updateTournamentStatus}

        />
        {/* <div className="flex items-center justify-between mb-8">
          {' '}
          <TournamentStatus
            tournament={tournament}
            updateTournamentStatus={updateTournamentStatus}
          />{' '}
        </div> */}
        
          </>
        )
       }
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeTab !== 'Overview' ? 'lg:w-full' : 'lg:w-full'
        }`}
      >
        <TabComponent activeTab={activeTab} onTabChange={setActiveTab} tournament={tournament} />
      </div>
    </div>
  );
};

export default EsportsTournamentSidebar;
