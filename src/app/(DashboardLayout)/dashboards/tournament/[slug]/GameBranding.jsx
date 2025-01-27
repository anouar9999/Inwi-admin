import React from 'react';
import { 
  Gamepad2, 
  Shapes, 
  CircleUserRound, 
  AwardIcon,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';

const GameBranding = ({ gameType, className }) => {
  // Game-specific configurations
  const gameConfigs = {
    'Call of Duty': {
      gradient: 'from-[#2A0E0E] to-[#1A1A1A]',
      accentColor: 'border-orange-500',
      platforms: ['PC', 'PlayStation', 'Xbox'],
      logo: (
        <div className="text-2xl font-bold tracking-wider text-gray-100">
          <span className="text-orange-500">CALL</span> OF <span className="text-orange-500">DUTY</span>
        </div>
      ),
      platformIcons: {
        PC: <Monitor className="w-4 h-4" />,
        PlayStation: 
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M9.5 6.5v-2h-5v2h5zm0 4.5h-5v2h5v-2zm6.5-6.5h-5v2h5v-2zm0 6.5h-5v2h5v-2zm-6.5 6.5h-5v2h5v-2zm6.5 0h-5v2h5v-2z"/>
          </svg>,
        Xbox: 
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10z"/>
          </svg>
      }
    },
    'FIFA': {
      gradient: 'from-[#013A6B] to-[#004377]',
      accentColor: 'border-blue-500',
      platforms: ['PlayStation', 'Xbox'],
      logo: (
        <div className="text-2xl font-bold tracking-wider text-gray-100">
          <span className="text-blue-500">FIFA</span> 24
        </div>
      ),
      platformIcons: {
        PlayStation: 
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M9.5 6.5v-2h-5v2h5zm0 4.5h-5v2h5v-2zm6.5-6.5h-5v2h5v-2zm0 6.5h-5v2h5v-2zm-6.5 6.5h-5v2h5v-2zm6.5 0h-5v2h5v-2z"/>
          </svg>,
        Xbox: 
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10z"/>
          </svg>
      }
    },
    // Add more games as needed
  };

  const defaultConfig = {
    gradient: 'from-gray-800 to-gray-900',
    accentColor: 'border-gray-600',
    platforms: ['All Platforms'],
    logo: (
      <div className="text-2xl font-bold tracking-wider text-gray-100">
        <Gamepad2 className="inline-block mr-2" />
        {"gameType"}
      </div>
    ),
    platformIcons: {
      'All Platforms': <Globe className="w-4 h-4" />
    }
  };

  const config = gameConfigs[gameType] || defaultConfig;

  return (
    <div className={`relative ${className}`}>
      <div className={`bg-gradient-to-br ${config.gradient} rounded-lg p-6 border-l-4 ${config.accentColor}`}>
        {/* Game Logo */}
        <div className="mb-4">
          {config.logo}
        </div>

        {/* Platform Badges */}
        <div className="flex flex-wrap gap-2">
          {config.platforms.map(platform => (
            <div
              key={platform}
              className="flex items-center bg-black/30 px-3 py-1 rounded-full text-xs"
            >
              {config.platformIcons[platform]}
              <span className="ml-1">{platform}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const EnhancedSquadFormatCard = ({ icon, title, subTitle, gameType }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {gameType ? (
        <GameBranding gameType={gameType} className="mb-4" />
      ) : (
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="ml-3 font-semibold text-lg">{title}</h3>
        </div>
      )}
      <div className="text-sm text-gray-400">
        <p>{subTitle}</p>
      </div>
    </div>
  );
};

export default GameBranding;