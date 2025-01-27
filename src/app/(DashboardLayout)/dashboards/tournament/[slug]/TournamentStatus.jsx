import React, { useState } from 'react';
import { Plus, Trophy, AlertCircle, Ban, Loader2, Shield, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, Tooltip } from '@mui/material';

const statusConfig = {
  'En cours': {
    icon: Trophy,
    color: 'blue',
    label: 'Tournament In Progress',
    description: 'Matches are currently being played',
    bgGradient: 'from-blue-600/20 to-blue-500/10'
  },
  'Ouvert aux inscriptions': {
    icon: Users,
    color: 'emerald',
    label: 'Open for Registration',
    description: 'Players can join the tournament',
    bgGradient: 'from-emerald-600/20 to-emerald-500/10'
  },
  'Terminé': {
    icon: Shield,
    color: 'gray',
    label: 'Tournament Ended',
    description: 'All matches have been completed',
    bgGradient: 'from-gray-600/20 to-gray-500/10'
  },
  'Annulé': {
    icon: Ban,
    color: 'red',
    label: 'Tournament Cancelled',
    description: 'This tournament has been cancelled',
    bgGradient: 'from-red-600/20 to-red-500/10'
  }
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center px-2 py-1 rounded-lg text-xs sm:text-sm font-medium backdrop-blur-sm"
    >
      <Icon className="w-3 h-3 mr-1" />
      <span className="truncate">{config.label}</span>
    </motion.div>
  );
};

const TournamentStatus = ({ tournament, updateTournamentStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusUpdate = async (newStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateTournamentStatus(newStatus);
    } catch (err) {
      setError('Failed to update tournament status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ButtonGroup = ({ children }) => (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 w-full sm:w-auto">
      {children}
    </div>
  );

  const ActionButton = ({ onClick, className, children }) => (
    <button
      onClick={onClick}
      className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-sm angular-cut 
        transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );

  const renderStatusContent = () => {
    switch (tournament.status) {
      case 'En cours':
        return (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-2 p-2"
          >
            <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span className="font-semibold text-xs sm:text-sm">
                Matches in progress
              </span>
            </div>
            
            <ButtonGroup>
              <ActionButton 
                onClick={() => handleStatusUpdate('Terminé')}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                End Tournament
              </ActionButton>
              <ActionButton 
                onClick={() => handleStatusUpdate('Ouvert aux inscriptions')}
                className="bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Reopen Registrations
              </ActionButton>
            </ButtonGroup>
          </motion.div>
        );

      case 'Ouvert aux inscriptions':
        return (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-2"
          >
            <Tooltip title="Start the tournament" placement="top">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusUpdate('En cours')}
                disabled={isLoading}
                className="w-full sm:w-auto angular-cut bg-gradient-to-r from-primary to-primary/50 
                  text-white px-3 py-1 sm:py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2
                  transition-all duration-300 text-xs sm:text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                Start Tournament
              </motion.button>
            </Tooltip>
          </motion.div>
        );

      case 'Terminé':
        return (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-2 bg-gradient-to-b from-gray-600/5 to-transparent rounded-lg"
          >
            <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="font-semibold text-xs sm:text-sm">
                Tournament ended
              </span>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-1 sm:mb-2"
          >
            <Alert 
              severity="error"
              action={
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-600 text-xs sm:text-sm"
                >
                  Dismiss
                </motion.button>
              }
            >
              <span className="text-xs sm:text-sm">{error}</span>
            </Alert>
          </motion.div>
        )}
        {renderStatusContent()}
      </AnimatePresence>
    </div>
  );
};

export default TournamentStatus;