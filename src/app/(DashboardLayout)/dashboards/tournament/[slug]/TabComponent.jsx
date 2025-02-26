import React, { useEffect, useState } from 'react';
import {
  CircleUserRound,
  Gamepad2,
  ChevronDown,
  AlertCircle,
  Loader,
  DollarSign,
  Users,
  Monitor,
  Trophy,
} from 'lucide-react';
import DoubleEliminationBracket from '@/app/(DashboardLayout)/DoubleElminationBracket';
import WaitingList from '@/app/(DashboardLayout)/components/widgets/cards/WaitingList';
import ParticipantList from '@/app/(DashboardLayout)/components/widgets/cards/ParticipantList';
import TournamentBracket from '../../../TournamentBracket';

const TabComponent = ({ activeTab, onTabChange, tournament }) => {
  const tabs = ['Overview', 'Waiting List', 'Participants', 'Bracket'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderTabContent = () => {
    if (tournament.status === 'En cours' && 
        activeTab !== 'Overview' && 
        activeTab !== 'Participants' && 
        activeTab !== 'Bracket') {
      return (
        <div className="p-4 md:p-6 rounded-lg text-center">
          <Loader className="mx-auto w-8 h-8 md:w-12 md:h-12 mb-4" />
          <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Tournament In Progress</h3>
          <p className="text-xs md:text-sm">
            The tournament is currently in progress. Some features may be limited until the tournament ends.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* About Section */}
              <div className="w-full md:w-1/2 text-white rounded-lg p-3 md:p-4">
                <h3 className="font-custom text-white leading-tight uppercase tracking-wider text-xl md:text-3xl mb-2 md:mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary" />
                  About the tournament
                </h3>
                <p className="text-xs md:text-sm">{tournament.description_des_qualifications}</p>
              </div>

              {/* Tournament Info Grid */}
              <div className="w-full md:w-1/2 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  <InfoCard
                    icon={<DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    value={`${tournament.prize_pool} DH`}
                    label="Prize Pool"
                  />
                  <InfoCard
                    icon={<Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    value={tournament.type_de_match}
                    label="Format"
                  />
                  <InfoCard
                    icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    value={tournament.nombre_maximum}
                    label="Players"
                  />
                  <InfoCard
                    icon={<Monitor className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    value={tournament.type_de_jeu}
                    label="Platform"
                  />
                  <InfoCard
                    icon={<Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    value={tournament.format_des_qualifications}
                    label="Type"
                  />
                </div>
              </div>
            </div>

            {/* Rules Section */}
            <div className="p-3 md:p-4 rounded-lg w-full text-gray-400 text-xs md:text-sm space-y-2 md:space-y-4">
              <h3 className="text-xl md:text-3xl font-custom text-white leading-tight uppercase tracking-wider mb-2 md:mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary" />
                Tournament Rules
              </h3>
              {tournament.rules.split('\n').map((rule, index) => (
                <p key={index} className="text-xs md:text-sm">{rule}</p>
              ))}
            </div>
          </div>
        );
      case 'Waiting List':
        return <WaitingList tournamentId={tournament.id} />;
      case 'Participants':
        return <ParticipantList tournamentId={tournament.id} />;
      case 'Bracket':
        return tournament.format_des_qualifications === 'Single Elimination' ? (
          <TournamentBracket
            tournamentId={tournament.id}
            isTeamTournament={tournament.participation_type === 'team'}
          />
        ) : (
          <DoubleEliminationBracket tournamentId={tournament.id} />
        );
      default:
        return <p className="text-center text-gray-400">Content for {activeTab}</p>;
    }
  };

  const InfoCard = ({ icon, value, label }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-1 md:gap-2">
        {icon}
        <span className="text-sm md:text-xl font-valorant">{value}</span>
      </div>
      <p className="text-xs md:text-sm text-gray-400">{label}</p>
    </div>
  );

  const TabButton = ({ tab }) => (
    <div className="relative inline-block px-1 md:px-2">
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
          fill={activeTab === tab ? '#ff3d08' : 'transparent'}
        />
      </svg>
      <button
        onClick={() => onTabChange(tab)}
        className={`absolute inset-0 flex items-center justify-center text-xs md:text-sm font-pilot 
          ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}
      >
        <span>{tab}</span>
      </button>
    </div>
  );

  return (
    <div className="text-gray-300">
      {/* Desktop navigation */}
      <div className="hidden md:flex space-x-2 lg:space-x-4 mb-4">
        {tabs.map((tab) => (
          <TabButton key={tab} tab={tab} />
        ))}
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden mb-4 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-gray-800 p-2 rounded-lg flex justify-between items-center text-sm"
        >
          <span>{activeTab}</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
                className={`w-full p-2 text-left text-sm ${
                  activeTab === tab ? 'bg-primary text-white' : 'hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-3 md:p-6 rounded-lg">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TabComponent;