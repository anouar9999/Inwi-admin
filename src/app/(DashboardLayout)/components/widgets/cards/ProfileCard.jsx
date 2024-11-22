import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User, Search, LayoutGrid, List, Table as TableIcon, 
  Calendar, Mail, Clock, ChevronDown, X, Check,
  AlertCircle, Shield, Users, Ban, Filter,
  ThumbsUp, UserX, Info
} from 'lucide-react';

const ProfileView = ({ tournamentId }) => {
  // State management
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRefused, setShowRefused] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // Data fetching
  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/participants_registration.php?tournament_id=${tournamentId}`
      );
      const data = await response.json();
      
      if (data.success) {
        setProfiles(data.profiles || []);
      } else {
        throw new Error(data.message || 'Failed to fetch profiles');
      }
    } catch (error) {
      setError(error.message);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtered lists
  const { activeProfiles, refusedProfiles, filteredProfiles } = useMemo(() => {
    // Separate refused profiles
    const refused = profiles.filter(p => p.status === 'rejected');
    
    // Get active (non-refused) profiles
    const active = profiles.filter(p => p.status !== 'rejected');
    
    // Apply filters to active profiles
    let filtered = active;
    
    // Only apply status filter if not showing all
    if (filterStatus !== 'all') {
      filtered = active.filter(p => p.status === filterStatus);
    }
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query)
      );
    }
  
    return { 
      activeProfiles: active, 
      refusedProfiles: refused, 
      filteredProfiles: filtered 
    };
  }, [profiles, filterStatus, searchQuery]);

  // Status update handler
  const handleStatusUpdate = async (profileId, newStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_registration_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_id: profileId,
          status: newStatus,
          admin_id: localStorage.getItem('adminId')
        })
      });

      const data = await response.json();
      if (data.success) {
        setProfiles(profiles.map(profile => 
          profile.id === profileId ? { ...profile, status: newStatus } : profile
        ));
        showNotification(`Successfully ${newStatus} participant`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  // Components
  const StatsCard = ({ title, value, icon: Icon, color, onClick, active, count }) => (
    <div
      onClick={onClick}
      className={`bg-gray-800 rounded-lg angular-cut p-4 ${onClick ? 'cursor-pointer hover:bg-gray-700/50' : ''} 
                 transition-all duration-300 relative group`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h4 className="text-2xl font-semibold text-white mt-1">{value}</h4>
          {count > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Click to {active ? 'hide' : 'view'} list
            </p>
          )}
        </div>
        <div className="relative">
          <Icon size={24} className={`${color} transition-transform duration-300 
                                   ${active ? 'rotate-180' : ''}`} />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-gray-700 rounded-full
                          flex items-center justify-center text-xs text-white font-bold">
              {count}
            </span>
          )}
        </div>
      </div>
      
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 
                     overflow-hidden">
          <div className="absolute inset-0 bg-gray-600 animate-pulse" />
        </div>
      )}
    </div>
  );

  const FilterBar = () => (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 angular-cut bg-gray-800 text-white rounded-lg
                   border border-gray-700 focus:border-blue-500 focus:ring-1 
                   focus:ring-blue-500 transition-all duration-200"
        />
      </div>
      
     
    </div>
  );

  const ProfileCard = ({ profile }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', icon: Clock },
      accepted: { color: 'bg-green-500', icon: ThumbsUp },
      rejected: { color: 'bg-red-500', icon: UserX }
    };
  
    const { color, icon: StatusIcon } = statusConfig[profile.status];
  
    return (
      <div 
        onClick={() => setSelectedProfile(profile)}
        className="group relative h-48 rounded-lg overflow-hidden cursor-pointer transform 
                 transition-all duration-400 angular-cut hover:shadow-lg 
                 hover:shadow-blue-500/10"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform 
                   duration-300 group-hover:scale-110"
          style={{
            backgroundImage: `url(${profile.team_id ? profile.team_image || "https://via.placeholder.com/400" : profile.avatar || "https://via.placeholder.com/400"})`
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 
                     to-transparent transition-opacity duration-300 
                     group-hover:opacity-90" />
        
        {/* Status Indicator */}
        <div className={`absolute top-4 right-4 flex items-center space-x-2 px-2 py-1 
                      rounded-full ${color}/20`}>
          <StatusIcon size={14} className="text-white" />
          <span className="text-xs font-medium text-white capitalize">
            {profile.status}
          </span>
        </div>
  
        {/* Team Badge if it's a team */}
        {profile.team_id && (
          <div className="absolute top-4 left-4 bg-blue-500/20 px-2 py-1 rounded-full
                       flex items-center space-x-2">
            <Users size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-white">Team</span>
          </div>
        )}
  
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="transform transition-transform duration-300 
                       translate-y-4 group-hover:translate-y-0">
            <h3 className="text-xl font-semibold text-white mb-1">
              {profile.team_id ? profile.team_name : profile.name}
            </h3>
            {profile.team_id ? (
              <>
                <p className="text-sm text-gray-300 mb-1">
                  Captain: {profile.name}
                </p>
                <p className="text-sm text-blue-400 mb-3">
                  {profile.member_count} members
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-300 mb-3">
                {profile.email}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-300 opacity-80">
                <Calendar size={14} className="mr-2" />
                <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
              </div>
              
              <button className="opacity-0 group-hover:opacity-100 transition-opacity 
                              duration-200 p-2 rounded-full bg-blue-500/20 
                              hover:bg-blue-500/30">
                <Info size={16} className="text-blue-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RefusedSection = () => {
    if (!showRefused || refusedProfiles.length === 0) return null;

    return (
      <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border 
                    border-red-500/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Ban size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Refused Participants</h3>
                <p className="text-sm text-gray-400">
                  {refusedProfiles.length} participant{refusedProfiles.length !== 1 ? 's' : ''} refused
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowRefused(false)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors group"
            >
              <X size={20} className="text-gray-400 group-hover:text-red-400 
                                  transition-colors" />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {refusedProfiles.map(profile => (
            <div 
              key={profile.id}
              className="bg-gray-800/80 rounded-lg overflow-hidden border 
                      border-red-500/10 hover:border-red-500/30 transition-all 
                      duration-200"
            >
              <div className="relative h-24">
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale 
                          opacity-50 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${profile.avatar})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b 
                             from-transparent to-gray-800" />
              </div>

              <div className="p-4  relative">
                <div className="flex items-center space-x-3">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-16 h-16 rounded-lg border-4 border-gray-800 
                            object-cover grayscale"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-white">{profile.name}</h4>
                    <p className="text-sm text-gray-400">{profile.email}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1.5" />
                    <span>
                      Rejected on {new Date(profile.registration_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(profile.id, 'pending')}
                      className="flex-1 flex items-center justify-center px-3 py-2 
                              rounded-lg bg-yellow-500/10 text-yellow-400 
                              hover:bg-yellow-500/20 transition-colors"
                    >
                      <AlertCircle size={14} className="mr-1.5" />
                      Review Again
                    </button>
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300
                              hover:bg-gray-700 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Notification component
  const Notification = () => {
    if (!notification) return null;

    return (
      <div className="fixed bottom-4 right-4 animate-slide-up">
        <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3
                      ${notification.type === 'success' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'}`}>
          {notification.type === 'success' ? (
            <Check size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p>{notification.message}</p>
        </div>
      </div>
    );
  };


  

  // Modal Component with enhanced UX
  const ProfileModal = () => {
    if (!selectedProfile) return null;
  
    const isTeam = !!selectedProfile.team_id;
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto"
           onClick={(e) => e.target === e.currentTarget && setSelectedProfile(null)}>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
               onClick={() => setSelectedProfile(null)} />
          
          <div className="relative bg-gray-800 rounded-xl max-w-4xl w-full mx-auto
                         border border-gray-700 shadow-xl">
            {/* Header */}
            <div className="relative h-48 overflow-hidden rounded-t-xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${isTeam ? selectedProfile.team_image : selectedProfile.avatar})`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800" />
              
              <button 
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 
                          hover:bg-black/40 transition-colors text-white">
                <X size={20} />
              </button>
            </div>
  
            {/* Profile Info */}
            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start gap-6 -mt-16">
                <div className="relative z-10">
                  <img
                    src={isTeam ? selectedProfile.team_image : selectedProfile.avatar}
                    alt={isTeam ? selectedProfile.team_name : selectedProfile.name}
                    className="w-32 h-32 rounded-xl object-cover border-4 border-gray-800"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full
                                  border-4 border-gray-800
                                  ${selectedProfile.status === 'pending' ? 'bg-yellow-500' :
                                    selectedProfile.status === 'accepted' ? 'bg-green-500' :
                                    'bg-red-500'}`}
                  />
                </div>
  
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {isTeam ? selectedProfile.team_name : selectedProfile.name}
                      </h2>
                      {isTeam ? (
                        <p className="text-gray-400">Captain: {selectedProfile.name}</p>
                      ) : (
                        <p className="text-gray-400">{selectedProfile.email}</p>
                      )}
                    </div>
                    
                    {isTeam && (
                      <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users size={16} className="text-blue-400" />
                          <span className="text-blue-400 font-medium">
                            {selectedProfile.member_count} members
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
  
                  {/* Add team-specific info here */}
                  {isTeam && (
                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Team Members</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedProfile.members?.map(member => (
                            <div key={member.id} className="flex items-center space-x-3">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                              <div>
                                <p className="text-sm text-white">{member.name}</p>
                                <p className="text-xs text-gray-400">{member.role || 'Member'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  {selectedProfile.status === 'pending' && (
                    <div className="mt-8 flex space-x-4">
                      <button
                        onClick={() => handleStatusUpdate(selectedProfile.id, 'accepted')}
                        className="flex-1 flex items-center justify-center px-6 py-3 rounded-lg
                                  bg-green-500/20 text-green-400 hover:bg-green-500/30
                                  transition-colors space-x-2">
                        <Check size={20} />
                        <span>Accept Registration</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedProfile.id, 'rejected')}
                        className="flex-1 flex items-center justify-center px-6 py-3 rounded-lg
                                  bg-red-500/20 text-red-400 hover:bg-red-500/30
                                  transition-colors space-x-2">
                        <X size={20} />
                        <span>Reject Registration</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total Participants"
        value={profiles.length}
        icon={Users}
        color="text-blue-400"
      />
      <StatsCard
        title="Pending Approvals"
        value={profiles.filter(p => p.status === 'pending').length}
        icon={Clock}
        color="text-yellow-400"
      />
      <StatsCard
        title="Refused"
        value={refusedProfiles.length}
        icon={Ban}
        color="text-red-400"
        onClick={() => setShowRefused(!showRefused)}
        active={showRefused}
        count={refusedProfiles.length}
      />
    </div>

    {/* Filter Bar */}
    <FilterBar />

    {/* Refused Section - Show regardless of other filters if toggled */}
    {showRefused && <RefusedSection />}

    {/* Main Content */}
    {filteredProfiles.length === 0 && !showRefused ? (
      <div className="text-center py-12 bg-gray-800/50 rounded-lg backdrop-blur-sm">
        <Search size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">
          No Active Participants Found
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          {searchQuery 
            ? "Try adjusting your search terms or filters to find what you're looking for."
            : filterStatus !== 'all' 
              ? `No participants with status "${filterStatus}"`
              : "No active participants at the moment."}
        </p>
        {(searchQuery || filterStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg
                      hover:bg-blue-500/30 transition-colors"
          >
            Clear Filters
          </button>
        )}
        
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProfiles.map(profile => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    )}

    {/* Modal */}
    <ProfileModal />

    {/* Notification */}
    <Notification />
  </div>

  );
};

export default ProfileView;

// Add these styles to your global CSS or update your existing styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }

  .angular-cut {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
document.head.appendChild(style);
