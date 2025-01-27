'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { PlusCircle, Search, UserCircle, X, UserPlus } from 'lucide-react';
import TeamSidebar from './TeamSidebar';
import CreateTeamForm from './CreateTeamForm';
import NonOwnerView from './NonOwnerView';
import { ToastProvider, addToast, useToast } from '@/app/components/toast/ToastProviderContext';

// Constants
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Custom Hooks
const useTeamsData = (userId) => {
  const [teamsData, setTeamsData] = useState({
    allTeams: [],
    myTeams: [],
    isLoading: true,
    error: null,
  });

  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/get_teams.php`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Better error handling
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        const allTeamsData = result.data || [];
        const userOwnedTeams = allTeamsData.filter(
          (team) =>
            parseInt(team.owner_id) === userId ||
            team.members?.some((member) => parseInt(member.user_id) === userId),
        );

        setTeamsData({
          allTeams: allTeamsData,
          myTeams: userOwnedTeams,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(result.message || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeamsData((prev) => ({
        ...prev,
        isLoading: false,
        error,
      }));
      // Don't use toast directly, let the component handle errors
      return error;
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTeams();
    } else {
      setTeamsData({
        allTeams: [],
        myTeams: [],
        isLoading: false,
        error: null,
      });
    }
  }, [userId, fetchTeams]);

  return { ...teamsData, refreshTeams: fetchTeams };
};
// Components
const TeamCard = ({ team, onClick }) => (
  <div
    className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col sm:w-full w-64 transition-all duration-300
     
    hover:-translate-y-1 cursor-pointer"
    onClick={() => onClick(team)}
  >
    <div className="relative h-28">
      {team.image ? (
        <img
          className="w-full h-full object-cover"
          src={`${BACKEND_URL}/${team.image}`}
          alt={`${team.name} logo`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500 font-bold">
          <UserCircle className="w-24 h-24" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h5 className="text-xl font-semibold text-white truncate">{team.name}</h5>
      </div>
    </div>
  </div>
);

const AddTeamCard = ({ onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    className="
    group relative overflow-hidden
    bg-gradient-to-br from-gray-800 to-gray-900
    rounded-xl
    transition-all duration-300
    hover:shadow-lg hover:shadow-[#aa2180]
    hover:-translate-y-1
    focus:outline-none focus:ring-2 focus:ring-blue-500
    cursor-pointer
    w-64 md:w-full h-46
  "
  >
    <div
      className="absolute inset-0 bg-[#aa2180] opacity-0 
                  group-hover:opacity-20 transition-opacity duration-300"
    />

    <div className="h-full flex flex-col items-center justify-center  p-4 gap-4">
      <div
        className="
       rounded-full bg-gray-700/50
      group-hover:bg-gray-500/20 
      transition-colors duration-300
    "
      >
        <PlusCircle
          className="w-10 h-10 text-[#aa2180] 
                            group-hover:text-[#aa2180] 
                            transition-colors duration-300"
        />
      </div>
      <span
        className="text-gray-300 font-medium 
                     group-hover:
                     transition-colors duration-300"
      >
        Ajouter une équipe
      </span>
    </div>
  </div>
);

// SearchBar Component
const SearchBar = ({ value, onChange }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Rechercher une équipe..."
      className="bg-gray-700 text-white px-6 py-3 angular-cut pl-10 pr-4 w-72"
      value={value}
      onChange={onChange}
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  </div>
);

// Main Component
const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');
  const { addToast } = useToast();

  const userId = parseInt(localStorage.getItem('userId'));
  const { allTeams, myTeams, isLoading, refreshTeams } = useTeamsData(userId);

  const handleTeamUpdate = useCallback(() => {
    refreshTeams();
  }, [refreshTeams]);

  const handleAddTeam = () => {
    if (!userId) {
      toast.error('Please login to create a team');
      return;
    }
    setIsCreateTeamOpen(true);
  };

  const handleJoinTeamRequest = async (teamId) => {
    if (!userId) {
      toast.error('Please login to join a team');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/team_api.php?endpoint=join-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: teamId,
          user_id: userId,
          role: 'Mid', // You can make this dynamic based on user selection
          rank: 'Unranked', // You can make this dynamic based on user's actual rank
        }),
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success', // 'success' | 'error' | 'warning' | 'info'
          message: 'Join request sent successfully!',
          duration: 5000, // optional, in ms
          position: 'bottom-right', // optional
        });
        setSidebarOpen(false);
      } else {
        throw new Error(data.message || 'Failed to send join request');
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      addToast({
        type: 'error', // 'success' | 'error' | 'warning' | 'info'
        message: error.message,
        duration: 5000, // optional, in ms
        position: 'bottom-right', // optional
      });
    }
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedTeam(null);
  };

  const filteredTeams = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return {
      all: allTeams.filter((team) => team.name.toLowerCase().includes(searchTermLower)),
      my: myTeams.filter((team) => team.name.toLowerCase().includes(searchTermLower)),
    };
  }, [searchTerm, allTeams, myTeams]);

  const isTeamOwner = (team) => {
    return parseInt(team?.owner_id) === userId;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white p-4 rounded-lg shadow-lg relative">
      <h3 className="text-5xl font-custom my-4">MES EQUIPES</h3>
      {myTeams.length === 0  ? (
        
        <div className="w-1/4 text-center text-gray-400 mb-10 mt-2">
                  <AddTeamCard onClick={handleAddTeam} />

        </div>
      )  : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AddTeamCard onClick={handleAddTeam} />
          {myTeams.map((team) => (
            <TeamCard key={team.id} team={team} onClick={handleTeamClick} />
          ))}
        </div>
      )}

      <h3 className="text-5xl font-custom mt-12">REJOINDRE UNE EQUIPE</h3>
      <div className="flex justify-between items-center mb-8 mt-6">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {filteredTeams.all.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          <p>Aucune équipe ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredTeams.all.map((team) => (
            <>
                        <TeamCard key={team.id} team={team} onClick={handleTeamClick} />

            </>
          ))}
        </div>
      )}

      {/* Conditional rendering based on ownership */}
      {selectedTeam && (
        <>
          {isTeamOwner(selectedTeam) ? (
            <TeamSidebar
              team={selectedTeam}
              isOpen={sidebarOpen}
              onClose={handleCloseSidebar}
              activeTab={activeSidebarTab}
              setActiveTab={setActiveSidebarTab}
              onTeamUpdate={handleTeamUpdate}
              currentUserId={userId}
            />
          ) : (
            <NonOwnerView
              team={selectedTeam}
              isOpen={sidebarOpen}
              onClose={handleCloseSidebar}
              onJoinRequest={handleJoinTeamRequest}
            />
          )}
        </>
      )}

      <CreateTeamForm
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        onFinish={refreshTeams}
      />
    </div>
  );
};

export default TeamPage;
