import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Settings,
  Users,
  ChevronRight,
  MoreVertical,
  Trash,
  Save,
  Shield,
  Search,
  Check,
  User,
  UserCog,
  Loader2,
} from 'lucide-react';

const TeamSidebar = ({ isOpen, onClose, team }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMemberMenu, setShowMemberMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [teamSettings, setTeamSettings] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    description: '',
    privacy_level: 'Public',
  });

  // API endpoint
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Initialize team settings when team data changes
  useEffect(() => {
    if (team) {
      setSettingsForm({
        name: team.name || '',
        description: team.description || '',
        privacy_level: team.privacy_level || 'Public',
      });
    }
  }, [team]);

  // Fetch data when team changes
  useEffect(() => {
    if (isOpen && team?.id) {
      fetchTeamData();
    }
  }, [isOpen, team?.id]);

  // Return early if no team
  if (!team) {
    return null;
  }

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Using the same fetch configuration for all requests
      const fetchConfig = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        // Important: Remove credentials and specify mode
        mode: 'cors',
      };

      // Make all requests with the same configuration
      const [statsRes, membersRes, requestsRes, settingsRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team_api.php?endpoint=team-stats&team_id=${team.id}`,
          fetchConfig,
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team_api.php?endpoint=team-members&team_id=${team.id}`,
          fetchConfig,
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team_api.php?endpoint=team-requests&team_id=${team.id}`,
          fetchConfig,
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team_api.php?endpoint=team-settings&team_id=${team.id}`,
          fetchConfig,
        ),
      ]);

      // Parse all responses
      const [statsData, membersData, requestsData, settingsData] = await Promise.all([
        statsRes.json(),
        membersRes.json(),
        requestsRes.json(),
        settingsRes.json(),
      ]);

      // Update states
      if (statsData.success) setTeamStats(statsData.data);
      if (membersData.success) setMembers(membersData.data);
      if (requestsData.success) setRequests(requestsData.data);
      if (settingsData.success) {
        setTeamSettings(settingsData.data);
        setSettingsForm({
          name: settingsData.data.name || '',
          description: settingsData.data.description || '',
          privacy_level: settingsData.data.privacy_level || 'Public',
        });
      }
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load team data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Handle member removal
  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch(
        `${API_URL}/team_api.php?endpoint=team-members&member_id=${memberId}`,
        {
          method: 'DELETE',
        },
      );

      const data = await response.json();

      if (data.success) {
        setMembers(members.filter((m) => m.id !== memberId));
        setShowMemberMenu(null);
      } else {
        throw new Error(data.message || 'Failed to remove member');
      }
    } catch (err) {
      setError('Failed to remove member. Please try again.');
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team.id,
          request_id: requestId,
          // The API expects 'accept' or 'reject' as the action
          action: action === 'accepted' ? 'accepted' : 'rejected',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      const data = await response.json();

      if (data.success) {
        // Show success message
        toast.success(`Request ${action}ed successfully`);
        // Refresh both requests and team data
        await Promise.all([fetchTeamData()]);
      } else {
        throw new Error(data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} request: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle settings update
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/team_api.php?endpoint=team-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team?.id,
          ...settingsForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchTeamData();
      } else {
        throw new Error(data.message || 'Failed to update settings');
      }
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    }
  };

  // Handle team deletion
  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/team_api.php?endpoint=team-settings&team_id=${team?.id}`,
        {
          method: 'DELETE',
        },
      );

      const data = await response.json();

      if (data.success) {
        onClose();
      } else {
        throw new Error(data.message || 'Failed to delete team');
      }
    } catch (err) {
      setError('Failed to delete team. Please try again.');
    }
  };

  // Component rendering based on loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50">
        <div className="p-6 bg-gray-800 rounded-xl flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          <span className="text-white">Loading team data...</span>
        </div>
      </div>
    );
  }

  // Stats Card Component
  const StatCard = ({ icon: Icon, value, label, gradient }) => (
    <div
      className={`${gradient} relative overflow-hidden group angular-cut rounded-xl p-6 transition-all duration-300 hover:scale-105`}
    >
      <div className="relative flex flex-col items-center">
        <div className="p-4 bg-white/5 rounded-xl mb-4 group-hover:scale-110 transition-transform">
          <Icon className="text-white" size={28} />
        </div>
        <span className="text-3xl font-bold text-white mb-2">{value}</span>
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
    </div>
  );

  // Member Card Component
  const MemberCard = ({ member }) => (
    <div className="group relative bg-gray-800/40 hover:bg-gray-800/60 angular-cut backdrop-blur-sm  p-6 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16  overflow-hidden">
              <img
                src={member.avatar || '/api/placeholder/64/64'}
                alt={member.name}
                className="w-full h-full object-cover angular-cut "
              />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 
              ${
                member.status === 'online'
                  ? 'bg-green-500'
                  : member.status === 'offline'
                  ? 'bg-gray-500'
                  : 'bg-yellow-500'
              }`}
            />
          </div>
          <div>
            <div className="font-bold text-lg text-white">{member.name}</div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-gray-900/50 rounded-lg text-sm font-medium text-gray-300">
                {member.role}
              </span>
              <span className="px-3 py-1.5 bg-purple-500/10 rounded-lg text-sm font-medium text-purple-400">
                {member.rank}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMemberMenu(member.id)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <MoreVertical size={20} className="text-gray-400" />
          </button>

          {showMemberMenu === member.id && (
            <div className="absolute right-0 mt-2 w-56 py-2 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl z-50">
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="w-full px-4 py-3 text-left hover:bg-red-500/10 text-red-400 flex items-center gap-3"
              >
                <Trash size={18} />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-4xl bg-gray-900 z-50 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 shadow-2xl overflow-y-auto`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Users className="text-purple-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Team Management</h2>
                <p className="text-gray-400">Manage your team members and requests</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex gap-2">
            {[
              { id: 'members', label: 'Members', icon: Users },
              { id: 'requests', label: 'Requests', icon: UserPlus, count: requests.length },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 angular-cut  transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="px-2 py-0.5 bg-purple-400/20 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {activeTab === 'members' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={Users}
                  value={teamStats?.total_members || 0}
                  label="Total Members"
                  gradient="bg-gradient-to-br from-purple-600/10 to-blue-600/10"
                />
                <StatCard
                  icon={Shield}
                  value={teamStats?.average_rank || 'N/A'}
                  label="Average Rank"
                  gradient="bg-gradient-to-br from-green-600/10 to-emerald-600/10"
                />
                <StatCard
                  icon={Check}
                  value={teamStats?.active_members || 0}
                  label="Active Now"
                  gradient="bg-gradient-to-br from-blue-600/10 to-cyan-600/10"
                />
                <StatCard
                  icon={UserPlus}
                  value={requests.length}
                  label="Pending Requests"
                  gradient="bg-gradient-to-br from-yellow-600/10 to-orange-600/10"
                />
              </div>

              {/* Search Bar */}
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
                    className="w-full bg-gray-800/50  angular-cut pl-12 pr-4 py-3 text-white  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-4">
                {members
                  .filter(
                    (member) =>
                      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                {members.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No members found. Add some members to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              {/* Request Header */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Join Requests</h3>
                    <p className="text-gray-400 mt-1">{requests.length} pending requests</p>
                  </div>
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="group relative bg-gray-800/40 hover:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden">
                          <img
                            src={request.avatar || '/api/placeholder/64/64'}
                            alt={request.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-lg text-white">{request.name}</div>
                          <div className="text-sm text-gray-400">
                            {request.experience} experience
                          </div>
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
                          onClick={() => handleRequestAction(request.id, 'rejected')}
                          className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 rounded-lg"
                        >
                          <X size={20} className="text-red-400" />
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'accepted')}
                          className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 rounded-lg text-white flex items-center gap-2"
                        >
                          <Check size={18} />
                          <span>Accept</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No pending join requests at the moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="w-full mx-auto space-y-6">
              {/* Team Settings Form */}
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="  p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Team Settings</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full bg-gray-800/50 angular-cut  px-4 py-3 text-white  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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
                        className="w-full bg-gray-800/50 angular-cut px-4 py-3 text-white  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Privacy
                      </label>
                      <select
                        value={settingsForm.privacy_level}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, privacy_level: e.target.value })
                        }
                        className="w-full bg-gray-800/50 angular-cut px-4 py-3 text-white  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                        <option value="Invitation Only">Invitation Only</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 angular-cut text-white flex items-center gap-2 transition-all hover:scale-105"
                      >
                        <Save size={20} />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Danger Zone */}
              <button
                onClick={handleDeleteTeam}
                className="w-full flex items-center justify-between p-4 bg-red-500/10 angular-cut hover:bg-red-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Trash
                    className="text-red-400 group-hover:rotate-12 transition-transform"
                    size={20}
                  />
                  <div>
                    <span className="text-sm font-medium text-red-400">Delete Team</span>
                    <p className="text-xs text-gray-400 mt-1">This action cannot be undone</p>
                  </div>
                </div>
                <ChevronRight
                  className="text-red-400 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamSidebar;
