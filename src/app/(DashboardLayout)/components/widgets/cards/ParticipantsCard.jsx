'use client';

import { Check, X, Clock, CheckCircle2, Ban, Mail, Users, Star } from 'lucide-react';

// Constants
const VIEW_CLASSES = {
  list: 'group flex items-center gap-6 w-full angular-cut bg-gray-800/80 backdrop-blur-sm p-1.5 hover:bg-gray-700/80 transition-all duration-300  shadow-lg hover:shadow-xl',
  grid: 'group relative h-36	 rounded   overflow-hidden cursor-pointer transform transition-all duration-300  shadow-lg hover:shadow-xl',
};


const STATUS_CONFIG = {
  pending: {
    color: 'yellow',
    icon: Clock,
    actions: ['accept', 'reject'],
  },
  accepted: {
    color: 'green',
    icon: CheckCircle2,
    actions: [],
  },
  rejected: {
    color: 'red',
    icon: Ban,
    actions: ['review'],
  },
};

// Default SVG Images
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
};

// Components
const ActionButton = ({ onClick, color, Icon, label, className = '' }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400 hover:bg-${color}-500/30 backdrop-blur-sm shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)] ${className}`}
  >
    {Icon ? <Icon className="w-4 h-4" /> : label}
  </button>
);

const ActionButtons = ({ status, onStatusUpdate, id, className = '' }) => (
  <div className={`flex gap-2 ${className}`}>
    {status === 'pending' && (
      <>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate(id, 'accepted');
          }}
          color="green"
          Icon={Check}
        />
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate(id, 'rejected');
          }}
          color="red"
          Icon={X}
        />
      </>
    )}
    {status === 'rejected' && (
      <ActionButton
        onClick={(e) => {
          e.stopPropagation();
          onStatusUpdate(id, 'pending');
        }}
        color="yellow"
        label="Review"
      />
    )}
  </div>
);

const Badge = ({ children, color = 'gray', className = '' }) => (
  <div
    className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.3)] 
    ${color === 'blue' ? 'bg-blue-500/20 text-blue-400' : ''} 
    ${color === 'gray' ? 'bg-gray-900/50 text-gray-300' : ''}
    ${className}`}
  >
    {children}
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 text-xs z-40 font-medium capitalize bg-${STATUS_CONFIG[status].color}-500/20 text-${STATUS_CONFIG[status].color}-400 rounded-full backdrop-blur-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.3)]`}
  >
    {status}
  </span>
);

const VerificationBadge = ({ className = '' }) => (
  <div
    className={`flex items-center gap-1 bg-gray-900/50 backdrop-blur-sm rounded-full px-2 py-1 shadow-[0_2px_8px_-3px_rgba(59,130,246,0.3)] ${className}`}
  >
    <CheckCircle2 className="w-4 h-4 text-blue-500" />
  </div>
);

const TeamBadge = ({ className = '' }) => (
  <Badge color="blue" className={className}>
    <div className="flex items-center space-x-2">
      <Users size={14} className="text-blue-400" />
      <span>Team</span>
    </div>
  </Badge>
);

const ProfileInfo = ({ profile, viewType }) => {
  const isTeam = profile.team_id != undefined;
  console.log(isTeam);

  if (viewType === 'list') {
    return (
      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
        {!isTeam && (
          <div className="flex items-center gap-2 text-gray-400">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{profile.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            Joined {new Date(profile.decision_date).toLocaleDateString()}
          </span>
        </div>
   
      </div>
    );
  }

  return isTeam ? (
    <>
      <p className="text-sm text-gray-300 mb-1">
        Joined: {new Date(profile.decision_date).toLocaleDateString()}
      </p>
      <p className="text-sm text-blue-400 mb-3">{profile.division}</p>
    </>
  ) : (
    <div className="grid grid-cols-1 gap-2 text-xs text-gray-300">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4" />
        <span className="truncate">{profile.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>Joined {new Date(profile.decision_date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// Main Component
const ProfileCard = ({ profile, viewType = 'grid', onStatusUpdate, setSelectedProfile }) => {
  const getImageUrl = () => {
    const isTeam = profile.team_id != undefined;
    const imageField = isTeam ? profile.team_avatar : profile.avatar;

    if (!imageField?.trim()) {
      return isTeam ? DEFAULT_IMAGES.team : DEFAULT_IMAGES.participant;
    }

    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageField}`;
  };
  const handleProfileClick = (e) => {
    e.preventDefault();
    if (typeof setSelectedProfile === 'function') {
      setSelectedProfile(profile);
    }
  };
  const renderGridView = () => (
    <div className={VIEW_CLASSES.grid} >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url("${getImageUrl()}")` }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gray-900/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900" />
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        {profile.is_verified && <VerificationBadge />}
        <StatusBadge status={profile.status} />
      </div>

      <ActionButtons
        status={profile.status}
        onStatusUpdate={onStatusUpdate}
        id={profile.id}
        className="absolute top-4 left-4"
      />

      {profile.team_id != undefined && <TeamBadge className="absolute top-4 left-4" />}

      <div className="absolute inset-0 p-2 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-custom text-white leading-tight uppercase tracking-wider truncate">
            {profile.team_id == null ? profile.username : profile.team_name}{' '}
          </h3>
          {profile.points > 0 && (
            <span className="flex items-center gap-1 text-yellow-500 text-sm">
              <Star className="w-4 h-4 fill-yellow-500" />
              {profile.points}
            </span>
          )}
        </div>
        <ProfileInfo profile={profile} viewType={viewType} />
      </div>
    </div>
  );

  const renderListView = () => (
    <div className={VIEW_CLASSES.list} onClick={() => setSelectedProfile(profile)}>
      <div className="shrink-0">
        <div className="relative">
          <img
            src={getImageUrl()}
            alt={profile.username}
            className="w-12 h-12 object-cover angular-cut ring-2 ring-gray-700 group-hover:ring-blue-500 transition-all shadow-md"
          />
          {profile.is_verified && (
            <div className="absolute -bottom-1 -right-1">
              <CheckCircle2 className="w-5 h-5 text-blue-500 fill-gray-900 drop-shadow-md" />
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow flex justify-between items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">
            {profile.team_id == null ? profile.username : profile.team_name}{' '}
            </h3>
            <StatusBadge status={profile.status} />
          </div>
          <ProfileInfo profile={profile} viewType={viewType} />
        </div>
      </div>
    </div>
  );

  return viewType === 'list' ? renderListView() : renderGridView();
};

export default ProfileCard;
