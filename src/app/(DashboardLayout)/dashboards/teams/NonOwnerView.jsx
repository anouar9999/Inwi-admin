import React, { useState, useEffect } from 'react';
import { 
  X, UserPlus, Trophy, Shield, Users, Star, 
  Award, BarChart2, Target, Clock, Info
} from 'lucide-react';

// StatCard Component
const StatCard = ({ icon: Icon, value, label, gradient }) => (
  <div className={`${gradient} relative overflow-hidden group angular-cut p-4 transition-all duration-300 hover:scale-105`}>
    <div className="relative flex flex-col items-center">
      <div className="p-3 bg-white/5 rounded-lg mb-2 group-hover:scale-110 transition-transform">
        <Icon className="text-white" size={20} />
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs font-medium text-gray-300">{label}</span>
    </div>
  </div>
);

// StatBox Component
const StatBox = ({ icon, label, value, className }) => (
  <div className={`p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm text-gray-400">{label}</span>
    </div>
    <div className="text-xl font-semibold text-white">{value}</div>
  </div>
);

// DetailItem Component
const DetailItem = ({ label, value, icon }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-400 mb-1">{label}</h4>
    <p className="text-lg font-semibold text-white flex items-end gap-2">
      {icon}
      {value}
    </p>
  </div>
);

const NonOwnerView = ({ team, isOpen, onClose, onJoinRequest }) => {
  const [isInvolved, setIsInvolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkTeamInvolvement = async () => {
      if (!team) return;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // First check if user is team owner
        if (team.owner_id === parseInt(userId)) {
          setIsInvolved(true);
          setIsLoading(false);
          return;
        }

        // Then check team membership
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check_team_involvement.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            team_id: team.id,
            user_id: userId
          })
        });

        const data = await response.json();
        if (data.success) {
          setIsInvolved(data.is_involved);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error checking team involvement:', error);
        setError('Failed to check team membership status');
      } finally {
        setIsLoading(false);
      }
    };

    checkTeamInvolvement();
  }, [team]);

  if (!team) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          transition-opacity duration-300`}
        onClick={onClose}
      />

      {/* Main Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-gray-900/95 z-50 
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          transition-transform duration-300 shadow-2xl overflow-y-auto`}
      >
        {/* Hero Section */}
        <header className="relative h-72">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: team.image 
                ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.image})`
                : 'url(/api/placeholder/800/400)',
              filter: 'brightness(0.4)'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-gray-900" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-black/30 
                     hover:bg-black/50 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-white/90" />
          </button>

          {/* Team Information */}
          <div className="absolute bottom-0 inset-x-0 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-white mb-3 truncate">
                  {team.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1.5 bg-purple-500/20 angular-cut text-sm 
                                font-medium text-purple-300 backdrop-blur-sm">
                    {team.team_game}
                  </div>
                  <div className="px-3 py-1.5 bg-blue-500/20 angular-cut text-sm 
                                font-medium text-blue-300 backdrop-blur-sm">
                    Division {team.division}
                  </div>
                </div>
              </div>

              {/* Join Button - Only show if not involved and not loading */}
              {!isLoading && !isInvolved && !error && (
                <button
                  onClick={() => onJoinRequest(team.id)}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500
                           hover:from-purple-600 hover:to-blue-600 
                           flex items-center gap-2 transition-all duration-300
                           hover:scale-105 font-medium shadow-lg whitespace-nowrap angular-cut"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Join Team</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox 
              icon={<Users className="h-5 w-5 text-purple-400" />}
              label="Members"
              value={team.total_members}
              className="bg-purple-500/10 angular-cut"
            />
            <StatBox 
              icon={<Trophy className="h-5 w-5 text-green-400" />}
              label="Win Rate"
              value={`${team.win_rate}%`}
              className="bg-green-500/10 angular-cut"
            />
            <StatBox 
              icon={<Star className="h-5 w-5 text-yellow-400" />}
              label="Team MMR"
              value={team.mmr}
              className="bg-yellow-500/10 angular-cut"
            />
            <StatBox 
              icon={<Award className="h-5 w-5 text-blue-400" />}
              label="Regional Rank"
              value={team.regional_rank || '-'}
              className="bg-blue-500/10 angular-cut"
            />
          </div>

          {/* About Section */}
          {team.description && (
            <section className="bg-white/5 angular-cut p-5">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-gray-400" />
                About Team
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {team.description}
              </p>
            </section>
          )}

          {/* Details Grid */}
          <section className="bg-white/5 angular-cut p-5">
            <div className="grid grid-cols-2 gap-6">
              <DetailItem
                label="Average Rank"
                value={team.average_rank}
              />
              <DetailItem
                label="Active Members"
                value={`${team.active_members} / ${team.total_members}`}
              />
              <DetailItem
                label="Privacy Level"
                value={team.privacy_level}
                icon={<Shield className="h-4 w-4 text-purple-400" />}
              />
              <DetailItem
                label="Created"
                value={new Date(team.created_at).toLocaleDateString()}
                icon={<Clock className="h-4 w-4 text-blue-400" />}
              />
            </div>
          </section>

          {/* Performance Section */}
          <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 angular-cut p-5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Team Performance
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 angular-cut p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">MMR Rating</h3>
                <p className="text-2xl font-bold text-white">{team.mmr}</p>
              </div>
              <div className="bg-black/20 angular-cut p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Division Progress</h3>
                <p className="text-2xl font-bold text-white">{team.division}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default NonOwnerView;