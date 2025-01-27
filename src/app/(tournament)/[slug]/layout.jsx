'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/app/(DashboardLayout)/layout/vertical/header/Header';
import { TournamentProvider, useTournament } from '@/contexts/TournamentContext';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  Plus,
  AlertCircle,
  Check,
  X,
  PlayCircle,
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import TeamSelectionDialog from './TeamSelectionDialog';
import axios from 'axios';

const LoadingPage = () => (
  <div className="fixed inset-0 flex flex-col justify-center items-center w-full h-full bg-[#05050f] z-50">
    <div className="mb-6 md:mb-8 flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
          alt="Brand Logo"
          width={350}
          height={100}
          className="cut-corners"
        />
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-500 mt-8"></div>
      </div>
    </div>
  </div>
);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const LayoutContent = ({ children }) => {
  const [showGlow, setShowGlow] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { fetchTournament, tournament, hasJoined, setHasJoined, registrationStatus, teamName } =
    useTournament();
  const { slug } = useParams();
  const { addToast } = useToast();
  const [showTeamDialog, setShowTeamDialog] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchTournament(slug);
    }
  }, [slug, fetchTournament]);

  const handleJoinClick = () => {
    if (tournament?.participation_type === 'team') {
      setShowTeamDialog(true);
    } else {
      joinTournament();
    }
  };

  const handleTeamSelect = async (teamId) => {
    setShowTeamDialog(false);
    joinTournament(teamId);
  };

  const joinTournament = async (teamId = null) => {
    setIsJoining(true);
    const userId = localStorage.getItem('userId');

    try {
      if (!userId) {
        addToast({
          type: 'error',
          message: 'Please login to join the tournament',
          duration: 5000,
          position: 'bottom-right',
        });
        return;
      }

      if (!tournament?.id) {
        throw new Error('Invalid tournament data');
      }

      // Add debug logs
      console.log('Join Tournament Request:', {
        userId,
        teamId,
        tournamentId: tournament.id,
        tournamentType: tournament.participation_type
      });

      const requestBody = {
        tournament_id: tournament.id,
        user_id: parseInt(userId),
        ...(teamId && { team_id: parseInt(teamId) }),
      };

      // Log the full request
      console.log('Request payload:', requestBody);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_join_tournament.php`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the response
      console.log('Server response:', response.data);

      const { data } = response;

      if (data.success) {
        addToast({
          type: 'success',
          message: data.message || 'Successfully joined the tournament!',
          duration: 5000,
          position: 'bottom-right',
        });
        setHasJoined(true);
        return true;
      }

      throw new Error(data.message || 'Failed to join the tournament');

    } catch (error) {
      console.error('Error joining tournament:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Server error response:', error.response.data);
        console.error('Server error status:', error.response.status);
      }
      
      let errorMessage = 'An error occurred while joining the tournament';

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Unable to reach the server. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      addToast({
        type: 'error',
        message: errorMessage,
        duration: 5000,
        position: 'bottom-right',
      });
      return false;
    } finally {
      setIsJoining(false);
    }
  };

const renderJoinButton = () => {
  const renderStatusBadge = () => {
    // Early return if essential states aren't available
    if (!hasJoined) return null;

    const statusConfig = {
      pending: {
        icon: Clock,
        bgColor: 'bg-yellow-500',
        textColor: 'text-yellow-500',
        borderColor: 'border-yellow-500',
        label: 'Under Review',
        animation: 'animate-pulse',
      },
      accepted: {
        icon: Check,
        bgColor: 'bg-green-500',
        textColor: 'text-green-500',
        borderColor: 'border-green-500',
        label: 'Accepted',
      },
      rejected: {
        icon: X,
        bgColor: 'bg-red-500',
        textColor: 'text-red-500',
        borderColor: 'border-red-500',
        label: 'Rejected',
      },
    };

    // Default to pending if no status is set
    const status = registrationStatus || 'pending';
    const config = statusConfig[status];
    if (!config) return null;

    const StatusIcon = config.icon;

    return (
      <div className={`relative group cursor-pointer px-12 py-3 rounded-xl ${config.textColor} 
        transition-all duration-300 hover:border-opacity-50 backdrop-blur-sm z-[9999999999]`}>
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${config.bgColor}/10 ${config.animation || ''}`}>
            <StatusIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-custom text-3xl">Registration {config.label}</span>
            {teamName && (
              <span className="text-sm text-gray-400">
                With Team: <span className="uppercase font-bold">{teamName}</span>
              </span>
            )}
          </div>
        </div>

        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
          w-72 p-4 rounded-lg bg-gray-900 border border-gray-700
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-300 transform group-hover:-translate-y-full z-50`}>
          <div className="relative">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${config.bgColor}/10 shrink-0`}>
                <StatusIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Registration {config.label}</h4>
                <p className="text-sm text-gray-400">
                  {status === 'pending' &&
                    "Your registration is being reviewed by our team. We'll notify you once a decision is made."}
                  {status === 'accepted' &&
                    "Congratulations! You're officially registered for this tournament."}
                  {status === 'rejected' &&
                    'Unfortunately, your registration was not accepted. You may try again for future tournaments.'}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 
              border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderJoinTournamentButton = () => (
    <button
      onClick={handleJoinClick}
     
      className="group relative overflow-hidden bg-primary text-primary px-4 py-3
        flex items-center space-x-3 transition-all duration-300 angular-cut
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0
        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      <Plus className="text-white group-hover:scale-110 transition-transform duration-300 w-4 h-4" />
      <span className="relative text-white font-medium">
        {tournament?.participation_type === 'team' ? 'Join with Team' : 'Join Tournament'}
      </span>
    </button>
  );

  const renderTournamentStatus = () => {
    const statusConfig = {
      'En cours': {
        icon: PlayCircle,
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500',
        label: 'Tournament in Progress',
      },
      'Terminé': {
        icon: Trophy,
        bgColor: 'bg-gray-500',
        textColor: 'text-gray-400',
        borderColor: 'border-gray-500',
        label: 'Tournament Ended',
      },
      'Annulé': {
        icon: AlertCircle,
        bgColor: 'bg-red-500',
        textColor: 'text-red-400',
        borderColor: 'border-red-500',
        label: 'Tournament Cancelled',
      },
    };

    const config = statusConfig[tournament?.status] || statusConfig['Terminé'];
    const StatusIcon = config.icon;

    return (
      <div className={`flex items-center space-x-3 px-6 py-3 ${config.textColor} 
        font-custom text-2xl rounded-xl backdrop-blur-sm`}>
        {tournament?.status === 'En cours' ? (
          <div className="relative">
            <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></div>
          </div>
        ) : (
          <StatusIcon className="w-5 h-5" />
        )}
        <span className="font-medium">{config.label}</span>
      </div>
    );
  };

  // Only show join options if tournament exists
  if (!tournament) return null;

  // Determine which component to render based on tournament status
  if (tournament.status === 'Ouvert aux inscriptions') {
    return hasJoined ? renderStatusBadge() : renderJoinTournamentButton();
  }

  return renderTournamentStatus();
};
  const renderTournamentStats = () => {
    if (!tournament) return null;

    const stats = [
      {
        icon: Clock,
        value: tournament.status,
        label: 'Status',
      },
      {
        icon: Calendar,
        value: `Registrations close on ${formatDate(tournament.end_date)}`,
        label: 'Registration Period',
      },
      {
        icon: Users,
        value: (
          <div className="flex items-center space-x-2">
            <span>{tournament.spots_remaining} of {tournament.nombre_maximum} spots left</span>
            <div className="h-1.5 w-20 bg-gray-700/50 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (tournament.registered_count / tournament.nombre_maximum) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>
        ),
        label: 'Available Slots',
        subtext: `${tournament.registered_count} registrations so far`,
      },
      {
        icon: Trophy,
        value: tournament.participation_type === 'team' ? 'Team Based' : 'Individual',
        label: 'Tournament Type',
      },
    ];

    return (
      <div className="flex flex-wrap gap-6 mt-6">
        {stats.map(({ icon: Icon, value, label, subtext }, index) => (
          <div key={index} className="flex items-center group">
            <div className="p-2 rounded-full bg-gray-800/40 group-hover:bg-primary/10 transition-all">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-custom text-gray-400">{label}</p>
              <div className="text-base font-semibold text-white">{value}</div>
              {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
            </div>
            {index < stats.length - 1 && (
              <div className="mx-6 h-8 w-px bg-gray-700/50 hidden lg:block" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {isJoining && <LoadingPage />}
      <div className="relative flex flex-col min-h-screen bg-gray-900">
        <div className="absolute top-0 left-0 right-0 h-1/3 z-0 overflow-hidden">
          {tournament && (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.image}`}
              alt="Background"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          )}
        </div>

        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gray-900 bg-opacity-70 z-10"></div>

        {showGlow && (
          <div className="fixed inset-0 z-50 pointer-events-none bg-green-500 opacity-20 transition-opacity duration-1000"></div>
        )}

        <div className="relative z-20">
          <Header setIsMobileOpen={setIsMobileOpen} />
          <div className="mt-40 pl-4 sm:pl-8 md:pl-16">
            {tournament && (
              <>
                <div className="flex justify-between items-start pr-4 sm:pr-8 md:pr-16"><h2 className="text-5xl font-custom text-white mb-4">
                    {tournament.nom_des_qualifications}
                  </h2>
                  {renderJoinButton()}
                </div>
                {renderTournamentStats()}
              </>
            )}
          </div>
        </div>

        <main className="flex-1 flex flex-col mt-8 pl-4 sm:pl-8 md:pl-16 z-30 mb-2">
          {children}
        </main>

        <TeamSelectionDialog
          isOpen={showTeamDialog}
          onClose={() => setShowTeamDialog(false)}
          onTeamSelect={handleTeamSelect}
        />
      </div>
    </>
  );
};

const Layout = ({ children }) => {
  return (
    <TournamentProvider>
      <LayoutContent>{children}</LayoutContent>
    </TournamentProvider>
  );
};

export default Layout;
