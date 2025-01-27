import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Settings,
  Users,
  Trophy,
  Star,
  Search,
  Check,
  Trash,
  Save,
  Shield,
  AlertTriangle,
  Loader2,
  Award,
  BarChart2,
  Users2,
  Target,
  WarehouseIcon,
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';

const StatCard = ({ icon: Icon, value, label, trend, gradient }) => (
  <div
    className={`${gradient} relative overflow-hidden group angular-cut rounded-xl p-6 transition-all duration-300 hover:scale-105`}
  >
    <div className="relative flex flex-col items-center">
      <div className="p-4 bg-white/5 rounded-xl mb-4 group-hover:scale-110 transition-transform">
        <Icon className="text-white" size={28} />
      </div>
      <span className="text-3xl font-bold text-white">{value}</span>
      <span className="text-sm font-medium text-gray-300">{label}</span>
      {trend !== undefined && (
        <span
          className={`absolute top-4 right-4 text-sm font-medium ${
            trend >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {trend > 0 && '+'}
          {trend}%
        </span>
      )}
    </div>
  </div>
);
const defaultAvatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="64" fill="#1F2937"/>
  <path d="M108 128C108 103.699 88.3005 84 64 84C39.6995 84 20 103.699 20 128" fill="#374151"/>
  <circle cx="64" cy="50" r="24" fill="#374151"/>
</svg>
`;
const MemberCard = ({ member, isOwner }) => (
  <div className="group relative bg-gray-800/40 hover:bg-gray-800/60 angular-cut backdrop-blur-sm p-4 transition-all">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 overflow-hidden">
          
          <img
              src={member.avatar ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${member.avatar}` : 
                `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
              alt={member.name}
              className="w-full h-full object-cover angular-cut"
            />
          </div>
         
        </div>
        <div>
          <div className="font-bold text-lg text-white">{member.name}</div>
          <div className="flex gap-2 mt-1.5">
            <span className="px-3 py-1.5 bg-gray-700/50 text-sm font-medium text-gray-300">
              {member.role}
            </span>
            <span className="px-3 py-1.5 bg-purple-500/10 text-sm font-medium text-purple-400">
              {member.rank}
            </span>
            {isOwner && (
              <span className="px-3 py-1.5 bg-yellow-500/10 text-sm font-medium text-yellow-400">
                Team Owner
              </span>
            )}
          </div>
        </div>
      </div>

      {!isOwner && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAction('remove', member.id)}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  </div>
);

const RequestCard = ({ request, onAction }) => (
  <div className="group relative bg-gray-800/40 hover:bg-gray-800/60 backdrop-blur-sm angular-cut p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 overflow-hidden">
          <img
            src={request.avatar || '/api/placeholder/64/64'}
            alt={request.name}
            className="w-full h-full object-cover angular-cut"
          />
        </div>
        <div>
          <div className="font-bold text-lg text-white">{request.name}</div>
          <div className="text-sm text-gray-400">{request.experience} experience</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1.5 bg-gray-900/50 rounded-lg text-sm font-medium text-gray-300">
              {request.role}
            </span>
            <span className="px-3 py-1.5 bg-purple-500/10 rounded-lg text-sm font-medium text-purple-400">
              {request.rank}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onAction(request.id, 'rejected')}
          className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 rounded-lg"
        >
          <X size={20} className="text-red-400" />
        </button>
        <button
          onClick={() => onAction(request.id, 'accepted')}
          className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 rounded-lg text-white flex items-center gap-2"
        >
          <Check size={18} />
          <span>Accept</span>
        </button>
      </div>
    </div>
  </div>
);

const TeamSidebar = ({ isOpen, onClose, team, currentUserId, onTeamUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [teamSettings, setTeamSettings] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    description: '',
    privacy_level: 'Public',
    team_game: 'Valorant',
    division: 'any',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { addToast } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (team) {
      setSettingsForm({
        name: team.name || '',
        description: team.description || '',
        privacy_level: team.privacy_level || 'Public',
        team_game: team.team_game || 'Valorant',
        division: team.division || 'any',
      });
    }
  }, [team]);

  useEffect(() => {
    if (isOpen && team?.id) {
      fetchTeamData();
    }
  }, [isOpen, team?.id]);

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchConfig = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      };

      const [statsRes, membersRes, requestsRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/api/team_api.php?endpoint=team-stats&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-members&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-requests&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-settings&team_id=${team.id}`, fetchConfig),
      ]);

      const [statsData, membersData, requestsData, settingsData] = await Promise.all([
        statsRes.json(),
        membersRes.json(),
        requestsRes.json(),
        settingsRes.json(),
      ]);
      console.log(statsData, membersData, requestsData, settingsData);

      if (!statsRes.ok || !membersRes.ok || !requestsRes.ok || !settingsRes.ok) {
        throw new Error('Failed to fetch team data');
      }

      setTeamStats(statsData.data);
      setMembers(membersData.data);
      setRequests(requestsData.data);
      setTeamSettings(settingsData.data);
      setSettingsForm((prev) => ({
        ...prev,
        ...settingsData.data,
      }));
    } catch (err) {
      setError('Failed to load team data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(true);
    try {
      // Map the action to the correct status expected by the API
      const apiAction = action === 'accept' ? 'accepted' : 'rejected';
  
      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team.id,
          request_id: requestId,
          action: apiAction, // Use the mapped action value
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to ${action} the request`);
      }
  
      const data = await response.json();
  
      if (data.success) {
        addToast({
          type: 'success',
          message: `Request ${action}ed successfully`, // Fixed grammar
          duration: 5000,
          position: 'bottom-right',
        });
        fetchTeamData();
      } else {
        throw new Error(data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      addToast({
        type: 'error',
        message: `Failed to ${action} request: ${error.message}`,
        duration: 5000,
        position: 'bottom-right',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: team?.id,
          ...settingsForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success', // 'success' | 'error' | 'warning' | 'info'
          message: 'Team settings updated successfully',
          duration: 5000, // optional, in ms
          position: 'bottom-right', // optional
        });
        // Refresh local data
        await fetchTeamData();
        // Refresh parent component data
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      } else {
        throw new Error(result.message || 'Failed to update settings');
      }
    } catch (err) {
      setError('Failed to update settings. Please try again.');

      addToast({
        type: 'error', // 'success' | 'error' | 'warning' | 'info'
        message: err.message,
        duration: 5000, // optional, in ms
        position: 'bottom-right', // optional
      });
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/team_api.php?endpoint=team-settings&team_id=${team.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success', // 'success' | 'error' | 'warning' | 'info'
          message: 'Team deleted successfully',
          duration: 5000, // optional, in ms
          position: 'bottom-right', // optional
        });
        // Close the sidebar
        onClose();
        // Refresh parent component data
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      } else {
        throw new Error(result.message || 'Failed to delete team');
      }
    } catch (err) {
      setError('Failed to delete team. Please try again.');

      addToast({
        type: 'error', // 'success' | 'error' | 'warning' | 'info'
        message: err.message,
        duration: 5000, // optional, in ms
        position: 'bottom-right', // optional
      });
    }
  };

  return (
    <>
      {/* Backdrop with enhanced blur */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-all duration-500`}
        onClick={onClose}
      />

      {/* Modernized sidebar panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-6xl bg-gradient-to-b from-gray-900 to-gray-950 z-50 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-all duration-500 shadow-2xl overflow-hidden`}
      >
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-lg">
            <div className="p-8 bg-gray-800/80 rounded-2xl flex items-center gap-4 shadow-xl">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="text-lg text-white font-medium">Loading team data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-lg">
            <div className="p-8 bg-gray-800/80 rounded-2xl flex items-center gap-4 shadow-xl">
              <WarehouseIcon className="w-8 h-8 text-red-400" />
              <span className="text-lg text-white font-medium">{error}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-full flex flex-col">
              {/* Enhanced header section */}
              <div className="relative">
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-300 hover:scale-105"
                    style={{
                      backgroundImage: team?.image
                        ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.image})`
                        : 'url(/api/placeholder/1200/300)',
                      filter: 'brightness(0.4)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/60 to-gray-900" />
                </div>

                <div className="relative px-8 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      {/* Modernized team logo */}
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/20">
                        <img
                          src={
                            team?.image
                              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.image}`
                              : '/api/placeholder/80/80'
                          }
                          alt={team?.name || 'Team logo'}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>

                      {/* Enhanced team info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h2 className="text-3xl font-bold text-white tracking-tight">
                            {team?.name || 'Team Management'}
                          </h2>
                          {/* <span className="px-4 py-1.5 bg-primary-500/20 rounded-full text-sm font-medium text-purple-300 border border-purple-500/20">
                            {team?.team_game} Team
                          </span> */}
                        </div>
                        <div className="flex items-center gap-6 text-gray-300">
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-purple-400" />
                            <span className="text-lg">{team?.total_members || 0} Members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-400" />
                            <span className="text-lg">Division {team?.division || 'Unranked'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modernized close button */}
                    <button
                      onClick={onClose}
                      className="p-3 hover:bg-gray-800/50 rounded-xl transition-all duration-300 hover:scale-105 group"
                    >
                      <X
                        size={24}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced tab navigation */}
              <div className="px-8 py-4 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50">
                <div className="flex gap-3">
                  {[
                    { id: 'overview', label: 'Overview', icon: BarChart2 },
                    { id: 'members', label: 'Members', icon: Users },
                    { id: 'requests', label: 'Requests', icon: UserPlus, count: requests.length },
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map((tab) => (  
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3 angular-cut  transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary/50 to-primary/60 text-white shadow-lg shadow-purple-500/20 scale-105'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <tab.icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                      {tab.count > 0 && (
                        <span className="px-2.5 py-1 bg-purple-400/20 rounded-full text-xs font-semibold">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content area with modern styling */}
              <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard
                        icon={Users2}
                        value={teamStats?.total_members || 0}
                        label="Total Members"
                        trend={12}
                        gradient="bg-gradient-to-br from-purple-500/10 to-blue-500/10"
                      />
                      <StatCard
                        icon={Target}
                        value={`${teamStats?.win_rate || 0}%`}
                        label="Win Rate"
                        trend={teamStats?.win_rate_trend}
                        gradient="bg-gradient-to-br from-green-500/10 to-emerald-500/10"
                      />
                      <StatCard
                        icon={Award}
                        value={teamStats?.regional_rank || '-'}
                        label="Regional Rank"
                        gradient="bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                      />
                      <StatCard
                        icon={Star}
                        value={teamStats?.mmr || 0}
                        label="Team MMR"
                        gradient="bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                          <div className="text-sm font-medium text-gray-400">Average Rank</div>
                          <div className="text-2xl font-bold text-white mt-2">
                            {teamStats?.average_rank || 'N/A'}
                          </div>
                        </div>
                        <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                          <div className="text-sm font-medium text-gray-400">Division</div>
                          <div className="text-2xl font-bold text-white mt-2">
                            {teamStats?.division || 'N/A'}
                          </div>
                        </div>
                      </div>
                  </div>
                )}

                {activeTab === 'members' && (
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Search members..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-800/30 rounded-xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-purple-500/20 border border-gray-700/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {members
                        .filter(
                          (member) =>
                            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.role.toLowerCase().includes(searchQuery.toLowerCase()),
                        )
                        .map((member) => (
                          <MemberCard
                          key={member.id}
                          member={member}
                          // onAction={handleAction}
                          isOwner={member.user_id === team?.owner_id}
                        />
                        ))}
                      {members.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                          No members found. Add some members to get started.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'requests' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-white">Join Requests</h3>
                          <p className="text-gray-400 mt-2">{requests.length} pending requests</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {requests.map((request) => (
                        <div
                          key={request.id}
                          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden">
                               <img
  src={request.avatar ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${request.avatar}` :
    `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
  alt={request.name}
  className="w-full h-full object-cover"
/>
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-white">{request.name}</h4>
                                <p className="text-gray-400">{request.message}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleRequestAction(request.id, 'accept')}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-all hover:scale-105"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRequestAction(request.id, 'reject')}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-all hover:scale-105"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {requests.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                          No pending join requests at the moment.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="w-full mx-auto space-y-8">
                    <form onSubmit={handleSettingsSubmit} className="space-y-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Team Name
                          </label>
                          <input
                            type="text"
                            value={settingsForm.name}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, name: e.target.value })
                            }
                            className="w-full bg-gray-800/30 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/20 border border-gray-700/30"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Team Description
                          </label>
                          <textarea
                            rows="4"
                            value={settingsForm.description}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, description: e.target.value })
                            }
                            className="w-full bg-gray-800/30 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/20 border border-gray-700/30"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Privacy
                            </label>
                            <select
                              value={settingsForm.privacy_level}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, privacy_level: e.target.value })
                              }
                              className="w-full bg-gray-800/30 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/20 border border-gray-700/30"
                            >
                              <option value="Public">Public</option>
                              <option value="Private">Private</option>
                              <option value="Invitation Only">Invitation Only</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Division
                            </label>
                            <select
                              value={settingsForm.division}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, division: e.target.value })
                              }
                              className="w-full bg-gray-800/30 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/20 border border-gray-700/30"
                            >
                              <option value="Iron">Iron</option>
                              <option value="Bronze">Bronze</option>
                              <option value="Silver">Silver</option>
                              <option value="Gold">Gold</option>
                              <option value="Platinum">Platinum</option>
                              <option value="Diamond">Diamond</option>
                              <option value="Master">Master</option>
                              <option value="Grandmaster">Grandmaster</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-between pt-8 border-t border-gray-800">
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 angular-cut text-red-400 transition-all hover:scale-105 flex items-center gap-2"
                          >
                            <Trash className="w-5 h-5" />
                            <span>Delete Team</span>
                          </button>

                          <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-primary/50 to-primary/60 hover:from-primary/60 hover:to-primary/70 angular-cut text-white flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
                          >
                            <Save size={20} />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center">
                <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Delete Team</h3>
                      <p className="text-gray-400 mt-1">This action cannot be undone.</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-8">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-white">{team?.name}</span>? All team data,
                    including members and history, will be permanently removed.
                  </p>

                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-5 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteTeam();
                        setShowDeleteConfirm(false);
                      }}
                      className="px-5 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <Trash className="w-5 h-5" />
                      <span>Delete Team</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgb(82, 82, 91);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgb(113, 113, 122);
        }
      `}</style>
    </>
  );
};

export default TeamSidebar;
