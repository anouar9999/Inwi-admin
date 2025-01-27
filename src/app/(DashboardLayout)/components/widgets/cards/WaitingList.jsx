/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Users,
  Clock,
  Ban,
  Filter,
  Mail,
  Shield,
  CheckCircle2,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  LayoutGrid,
  List,
  Info,
  Star,
  User,
  Gamepad2,
  Crown,
  Trophy,
  Percent,
  PercentCircle,
} from 'lucide-react';
import TransparentLoader from '@/app/(DashboardLayout)/dashboards/tournament/[slug]/Loader';
import SearchAndFilterBar from './SearchAndFilterBar';
import { set } from 'lodash';
const DEFAULT_IMAGES = {
  team: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" fill="#0F172A"/>
      <path d="M0 0L80 80M80 0L0 80" stroke="#1E293B" stroke-width="1"/>
      <g opacity="0.9">
        <circle cx="25" cy="32" r="8" fill="#475569"/>
        <path d="M17 45C17 41.134 20.134 38 24 38H26C29.866 38 33 41.134 33 45V48H17V45Z" fill="#475569"/>
        <circle cx="40" cy="28" r="10" fill="#475569"/>
        <path d="M30 44C30 39.582 33.582 36 38 36H42C46.418 36 50 39.582 50 44V48H30V44Z" fill="#475569"/>
        <circle cx="55" cy="32" r="8" fill="#475569"/>
        <path d="M47 45C47 41.134 50.134 38 54 38H56C59.866 38 63 41.134 63 45V48H47V45Z" fill="#475569"/>
      </g>
      <rect x="0" y="0" width="80" height="2" fill="#3B82F6" opacity="0.5"/>
      <rect x="20" y="60" width="40" height="4" rx="2" fill="#3B82F6" opacity="0.3"/>
    </svg>
  `)}`,
  participant: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" fill="#0F172A"/>
      <path d="M0 0L80 80M80 0L0 80" stroke="#1E293B" stroke-width="1"/>
      <g opacity="0.9">
        <circle cx="40" cy="30" r="12" fill="#475569"/>
        <path d="M20 55C20 48.373 25.373 43 32 43H48C54.627 43 60 48.373 60 55V60H20V55Z" fill="#475569"/>
      </g>
      <rect x="0" y="0" width="80" height="2" fill="#6366F1" opacity="0.5"/>
      <rect x="25" y="65" width="30" height="3" rx="1.5" fill="#6366F1" opacity="0.3"/>
    </svg>
  `)}`,
}
const RefusedParticipants = ({ profiles, onReview, onViewDetails }) => (
  <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-red-500/20">
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Ban className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Refused Participants</h3>
            <p className="text-sm text-gray-400">{profiles.length} participants refused</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-gray-800/80 rounded-lg overflow-hidden border border-red-500/10 hover:border-red-500/30"
          >
            <div className="flex items-center p-4 gap-4">
              <div className="relative">
                <img
                  src={profile.avatar || '/api/placeholder/64/64'}
                  alt={profile.name}
                  className="w-16 h-16 rounded-lg object-cover grayscale"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-gray-800" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{profile.name}</h4>
                <p className="text-sm text-gray-400 truncate">{profile.email}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Refused on {new Date(profile.registration_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => onReview(profile.id)}
                className="flex-1 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 
                         hover:bg-yellow-500/20 transition-colors text-sm"
              >
                Review Again
              </button>
              <button
                onClick={() => onViewDetails(profile)}
                className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300
                         hover:bg-gray-700 transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
const ProfileView = ({ tournamentId }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRefused, setShowRefused] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Add this function to handle search:
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  const handleReviewAgain = async (profileId) => {
    await handleStatusUpdate(profileId, 'pending');
    setShowRefused(false);
  };
  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/participants_registration.php?tournament_id=${tournamentId}`,
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message || 'Failed to fetch');
      setProfiles(data.profiles || []);
    } catch (err) {
      setError(err.message);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);
  const [showFilter, setShowFilter] = useState(false);


  // Add click outside handler
  useEffect(() => {
    const closeFilter = (e) => {
      if (showFilter && !e.target.closest('.filter-dropdown')) {
        setShowFilter(false);
      }
    };
    document.addEventListener('click', closeFilter);
    return () => document.removeEventListener('click', closeFilter);
  }, [showFilter]);
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);
// Debounce search query
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 300);
  
  return () => clearTimeout(timer);
}, [searchQuery]);
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleStatusUpdate = async (profileId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_registration_status.php`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registration_id: profileId,
            status: newStatus,
            admin_id: localStorage.getItem('adminId'),
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === profileId ? { ...profile, status: newStatus } : profile,
        ),
      );
      showNotification(`Successfully ${newStatus} participant`);
      setSelectedProfile(null);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const { activeProfiles, refusedProfiles, filteredProfiles } = useMemo(() => {
    // Start with all profiles
    let filtered = [...profiles];
  
    // Filter by status first
    if (filterStatus !== 'all') {
      filtered = filtered.filter(profile => profile.status === filterStatus);
    }
  
    // Apply search if there is a search term
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(profile => {
        if (profile.team_id) {
          // Search in team fields
          return (
            (profile.team_name || '').toLowerCase().includes(term) ||
            (profile.owner_name || '').toLowerCase().includes(term) ||
            (profile.description || '').toLowerCase().includes(term)
          );
        } else {
          // Search in individual profile fields
          return (
            (profile.name || '').toLowerCase().includes(term) ||
            (profile.email || '').toLowerCase().includes(term)
          );
        }
      });
    }
  
    return {
      activeProfiles: profiles.filter(p => p.status !== 'rejected'),
      refusedProfiles: profiles.filter(p => p.status === 'rejected'),
      filteredProfiles: filtered
    };
  }, [profiles, filterStatus, searchQuery]);
  // Components
  const Header = () => (
    <div className="mb-8">
      <h1 className="text-5xl  text-white font-custom">Registration Management</h1>
      <div className="flex items-center justify-between">
        <p className="text-gray-400">Manage and review tournament registrations</p>
      </div>
    </div>
  );

  const StatsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[
        { title: 'Total Participants', value: profiles.length, icon: Users, color: 'blue' },
        {
          title: 'Pending Review',
          value: profiles.filter((p) => p.status === 'pending').length,
          icon: Clock,
          color: 'yellow',
        },
        {
          title: 'Refused',
          value: refusedProfiles.length,
          icon: Ban,
          color: 'red',
          onClick: () => setShowRefused(!showRefused),
        },
      ].map((stat) => (
        <div
          key={stat.title}
          onClick={stat.onClick}
          className={`bg-gray-800/80 backdrop-blur-sm  p-6 angular-cut ${
            stat.onClick ? 'cursor-pointer hover:bg-gray-700/50 ' : ''
          }`}
        >
          <div className="flex justify-between items-start angular-cut">
            <div>
              <p className="text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
              <stat.icon className={`text-${stat.color}-400`} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ProfileCard = ({ profile, viewType, onStatusUpdate }) => {
    const gridViewClass =
      'group relative h-48 angular-cut overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl';
    const listViewClass =
      'group flex items-center gap-6 w-full angular-cut bg-gray-800/80 backdrop-blur-sm p-2 hover:bg-gray-800 transition-all duration-300';

    const statusConfig = {
      pending: { color: 'yellow', icon: Clock },
      accepted: { color: 'green', icon: CheckCircle2 },
      rejected: { color: 'red', icon: Ban },
    };

    const { color } = statusConfig[profile.status];

    // Default SVG content for profile and team
    const defaultProfileSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#1F2937"/>
      <path d="M0 0 L400 400 M400 0 L0 400" stroke="#374151" stroke-width="2" opacity="0.2"/>
      <circle cx="200" cy="200" r="150" fill="none" stroke="#374151" stroke-width="2" opacity="0.2"/>
      <circle cx="200" cy="150" r="60" fill="#4B5563"/>
      <path d="M200 230 C130 230 80 280 80 350 L320 350 C320 280 270 230 200 230" fill="#4B5563"/>
      <circle cx="200" cy="200" r="180" fill="none" stroke="#6B7280" stroke-width="4" opacity="0.1"/>
      <circle cx="200" cy="200" r="190" fill="none" stroke="#6B7280" stroke-width="2" opacity="0.1"/>
    </svg>`)}`;

    const defaultTeamSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#1F2937"/>
      <path d="M0 0 L400 400 M400 0 L0 400" stroke="#374151" stroke-width="2" opacity="0.2"/>
      <circle cx="200" cy="200" r="150" fill="none" stroke="#374151" stroke-width="2" opacity="0.2"/>
      <circle cx="160" cy="150" r="40" fill="#4B5563"/>
      <path d="M160 200 C110 200 80 230 80 280 L240 280 C240 230 210 200 160 200" fill="#4B5563"/>
      <circle cx="240" cy="150" r="40" fill="#4B5563"/>
      <path d="M240 200 C190 200 160 230 160 280 L320 280 C320 230 290 200 240 200" fill="#4B5563"/>
      <circle cx="200" cy="200" r="40" fill="#4B5563"/>
      <path d="M200 250 C150 250 120 280 120 330 L280 330 C280 280 250 250 200 250" fill="#4B5563"/>
      <circle cx="200" cy="200" r="180" fill="none" stroke="#6B7280" stroke-width="4" opacity="0.1"/>
      <circle cx="200" cy="200" r="190" fill="none" stroke="#6B7280" stroke-width="2" opacity="0.1"/>
    </svg>`)}`;

    // Function to get the appropriate image URL with fallback
    const getImageUrl = () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (profile.team_id) {
        // For teams
        if (profile.team_image && profile.team_image !== '') {
          return `${baseUrl}${profile.team_image}`;
        }
        return defaultTeamSvg;
      } else {
        // For individual profiles
        if (profile.avatar && profile.avatar !== '') {
          return `${baseUrl}${profile.avatar}`;
        }
        return defaultProfileSvg;
      }
    };

    const ActionButtons = () => (
      <div className="absolute top-4 left-4 flex gap-2">
        {profile.status === 'pending' && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusUpdate(profile.id, 'accepted');
              }}
              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 backdrop-blur-sm"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusUpdate(profile.id, 'rejected');
              }}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );

    return (
      <div className={gridViewClass} onClick={() => setSelectedProfile(profile)}>
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundImage: `url("${getImageUrl()}")`,
            }}
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gray-900/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900" />
        </div>

        {/* Rest of the component remains the same */}
        {profile.team_id && (
          <div className="absolute top-4 right-4 bg-blue-500/20 px-2 py-1 rounded-full flex items-center space-x-2">
            <Users size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-white">Team</span>
          </div>
        )}

        {profile.team_id && <ActionButtons />}

        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
            <h3 className="text-xl font-custom text-white leading-tight uppercase tracking-wider truncate">
              {profile.team_id ? profile.team_name : profile.name}
            </h3>

            {profile.team_id ? (
              <>
                <p className="text-sm text-gray-300 mb-1">Captain: {profile.owner_name}</p>
                <p className="text-sm text-blue-400 mb-3">{profile.member_count} members</p>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-1 text-xs text-gray-300 mt-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Joined {new Date(profile.registration_date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

 
  const ProfileModal = () => {
    if (!selectedProfile) return null;
    
    const isTeam = Boolean(selectedProfile.team_name);
  
    // Color scheme configuration
    const colors = {
      background: {
        primary: 'bg-[#0F1623]',     // Main modal background
        overlay: 'bg-gray-800/10',    // Card backgrounds
        backdrop: 'backdrop-blur-md', // Blur effect
      },
      status: {
        success: {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          hover: 'hover:bg-green-500/20'
        },
        error: {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          hover: 'hover:bg-red-500/20'
        },
        warning: {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-400'
        },
        online: 'bg-green-500',
        offline: 'bg-gray-500'
      },
      text: {
        primary: 'text-white',
        secondary: 'text-gray-400',
        accent: 'text-purple-400'
      },
      border: {
        ring: 'ring-2 ring-gray-700/50',
        divider: 'border-2 border-gray-900'
      }
    };
  
    const getStats = () => {
      if (isTeam) {
        return [
          { icon: Trophy, label: 'MMR', value: selectedProfile.mmr || '0', color: colors.status.warning.text },
          { icon: Percent, label: 'Win Rate', value: `${selectedProfile.win_rate || 0}%`, color: colors.status.success.text },
          { icon: Users, label: 'Team Size', value: selectedProfile.member_count || 0, color: 'text-blue-400' },
        ];
      }
      return [
        { icon: Shield, label: 'Status', value: selectedProfile.is_verified ? 'Verified' : 'Unverified', color: 'text-blue-400' },
        { icon: Star, label: 'Points', value: selectedProfile.points || '0', color: colors.status.warning.text },
        { icon: Clock, label: 'Joined', value: new Date(selectedProfile.registration_date).toLocaleDateString(), color: colors.status.success.text },
      ];
    };
  
    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop with blur */}
        <div className={`fixed inset-0 ${colors.background.backdrop}`} />
        
        {/* Modal content wrapper */}
        <div className="relative h-full overflow-y-auto">
          <div className="min-h-screen w-full py-8">
            <div className={`mx-auto w-full max-w-5xl ${colors.background.primary} rounded-2xl`}>
              {/* Header Section */}
              <div className="flex items-start gap-6 p-8">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-24 h-24 rounded-2xl overflow-hidden ${colors.border.ring}`}>
                    <img
                      src={isTeam 
                        ? (selectedProfile.team_image 
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedProfile.team_image}` 
                          : DEFAULT_IMAGES.team)
                        : (selectedProfile.avatar 
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedProfile.avatar}` 
                          :  DEFAULT_IMAGES.participant)
                      }
                      alt={isTeam ? selectedProfile.team_name : selectedProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                     
                {/* Profile Info */}
                <div className=" relative flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className={`text-3xl font-valorant ${colors.text.primary} mb-2`}>
                        {isTeam ? selectedProfile.team_name : selectedProfile.name}
                      </h1>
                      {selectedProfile.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatusUpdate(selectedProfile.id, 'accepted')}
                          className={`flex items-center gap-2 px-6 py-2 text-lg tracking-wider font-custom ${colors.status.success.bg} ${colors.status.success.hover} ${colors.status.success.text} rounded-lg transition-all`}
                        >
                          <Check className="w-5 h-5" />
                          <span>Accept Team</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedProfile.id, 'rejected')}
                          className={`flex items-center gap-2 px-6 py-2 text-lg tracking-wider font-custom ${colors.status.error.bg} ${colors.status.error.hover} ${colors.status.error.text} rounded-lg transition-all`}
                        >
                          <X className="w-5 h-5" />
                          <span>Reject Team</span>
                        </button>
                      </div>
                    )}
                    </div>
  
                    {/* Action Buttons */}
                    <div className='absolute top-4 right-4 items-end'  >
                     
                      </div>
  
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedProfile(null)}
                      className={`p-2 hover:bg-gray-800/50 rounded-lg transition-colors ml-2 ${colors.text.secondary}`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
  
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
                {getStats().map((stat, index) => (
                  <div key={index}
                    className={`flex flex-col items-center p-8 ${colors.background.overlay} rounded-xl`}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                    <span className={`text-4xl font-custom tracking-wider ${colors.text.primary} mb-2`}>{stat.value}</span>
                    <span className={`text-2xl font-valorant  ${colors.text.secondary}`}>{stat.label}</span>
                  </div>
                ))}
              </div>
  {/* Description Section (for teams) */}
  {isTeam && selectedProfile.description && (
                <div className="mt-8 p-8 bg-gray-900/50 rounded-xl backdrop-blur-sm">
                  <h3 className="text-2xl tracking-wider font-custom text-white mb-2">About Team</h3>
                  <p className="text-gray-400 font-pilot">{selectedProfile.description}</p>
                </div>
              )}
              {/* Team Members Section */}
              {isTeam && selectedProfile.members && (
                <div className="space-y-4 px-8 py-8">
                  <h2 className={`text-2xl tracking-wider font-custom ${colors.text.primary}`}>Team Members</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProfile.members.map((member, index) => (
                      <div key={index}
                        className={`flex items-center gap-4 p-4 ${colors.background.overlay} rounded-xl`}
                      >
                        <div className="relative">
                          <img
                            src={member.avatar 
                              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${member.avatar}` 
                              : `/api/placeholder/48/48`}
                            alt={member.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          {member.name === selectedProfile.owner_name && (
                            <Crown className={`absolute -top-2 -right-2 w-5 h-5 ${colors.status.warning.text}`} />
                          )}
                         
                        </div>
  
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-valorant ${colors.text.primary}`}>{member.name}</span>
                            {member.name === selectedProfile.owner_name && (
                              <span className={`px-2 py-0.5 text-xs ${colors.status.warning.bg} ${colors.status.warning.text} rounded`}>
                                Captain
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-sm ${colors.text.secondary}`}>{member.role || 'Mid'}</span>
                            <span className={`text-sm ${colors.text.accent}`}>{member.rank || 'Unranked'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <TransparentLoader messages={['Loading Users...']} />;
  }

  return (
    <div className="space-y-6">
      <Header />
      <StatsGrid />

      <SearchAndFilterBar
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  filterStatus={filterStatus}
  setFilterStatus={setFilterStatus}
  viewMode={viewMode}
  setViewMode={setViewMode}
  profiles={profiles}
  showFilter={showFilter}
  setShowFilter={setShowFilter}
/>
      <div
        className={`grid gap-4 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {showRefused && (
        <RefusedParticipants
          profiles={refusedProfiles}
          onReview={handleReviewAgain}
          onViewDetails={setSelectedProfile}
        />
      )}

      <ProfileModal />

      {/* Notification remains the same */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 
            ${
              notification.type === 'success'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <p>{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};
const TeamCard = ({ team, onStatusUpdate }) => (
  <div className="group relative h-48 angular-cut overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl">
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${team.image || '/api/placeholder/400/320'})`,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gray-900/90 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900" />
    </div>

    {/* Status Badge */}
    <div className="absolute top-4 right-4">
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm
        ${
          team.status === 'pending'
            ? 'bg-yellow-500/20 text-yellow-400'
            : team.status === 'accepted'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        }`}
      >
        {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
      </span>
    </div>

    {/* Action Buttons */}
    {team.status === 'pending' && (
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate(team.id, 'accepted');
          }}
          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 backdrop-blur-sm"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate(team.id, 'rejected');
          }}
          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )}

    {/* Team Info */}
    <div className="absolute inset-0 p-4 flex flex-col justify-end">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-custom text-white leading-tight uppercase tracking-wider truncate">
          {team.name}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-1 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <User className="w-3 h-3" />
          <span className="truncate">Owner: {team.owner_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>{team.member_count} members</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>Joined {new Date(team.registration_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  </div>
);
export default ProfileView;
