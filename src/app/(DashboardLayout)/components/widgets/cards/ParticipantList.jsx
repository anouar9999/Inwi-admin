import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users, UserSearch, LayoutGrid, List, CheckCircle2, Badge, MapPin, Mail, Star, Clock, Check, X, Ban, User, Shield } from 'lucide-react';
import TransparentLoader from '@/app/(DashboardLayout)/dashboards/tournament/[slug]/Loader';
import ProfileCard from './ParticipantsCard';

const ViewToggle = ({ view, onViewChange }) => (
  <div className="flex gap-2">
    <button
      onClick={() => onViewChange('grid')}
      className={`p-2 rounded ${view === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
    >
      <LayoutGrid className="w-5 h-5" />
    </button>
    <button
      onClick={() => onViewChange('list')}
      className={`p-2 rounded ${view === 'list' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
    >
      <List className="w-5 h-5" />
    </button>
  </div>
);


const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
    <div className="bg-gray-800/50 rounded-full p-6 mb-4">
      <UserSearch className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-300 mb-2">
      Aucun participant pour le moment
    </h3>
    <p className="text-gray-400 text-center max-w-md">
      Les participants acceptés apparaîtront ici. Revenez plus tard pour voir les mises à jour.
    </p>
  </div>
);

const ParticipantCardGrid = ({ tournamentId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('grid');
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_accepted_participants.php?tournament_id=${tournamentId}`
        );
        if (response.data.success) {
          console.log(response.data)
          setParticipants(response.data.participants);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch participants. Please try again later.');
        console.error('Error fetching participants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [tournamentId]);

  if (loading) return  <TransparentLoader
  messages={[
    'Loading...'
  ]}
/>;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500 text-center">
          <p className="font-semibold">Une erreur est survenue</p>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!participants || participants.length === 0) {
    return <EmptyState />;
  }
  const ProfileModal = () => {
    if (!selectedProfile) return null;
  
    const profileSpecs = [
      {
        icon: <User className="w-5 h-5 text-gray-400" />,
        label: 'Username',
        value: selectedProfile.username,
        subValue: selectedProfile.status,
      },
      {
        icon: <Mail className="w-5 h-5 text-gray-400" />,
        label: 'Email',
        value: selectedProfile.email,
        subValue: 'Contact',
      },
      {
        icon: <Clock className="w-5 h-5 text-gray-400" />,
        label: 'Registration Date',
        value: new Date(selectedProfile.registration_date).toLocaleDateString(),
        subValue: 'Joined',
      },
      {
        icon: <Shield className="w-5 h-5 text-gray-400" />,
        label: 'Status',
        value: selectedProfile.is_verified ? 'Verified' : 'Unverified',
        subValue: 'Account Verification',
      },
      {
        icon: <Star className="w-5 h-5 text-gray-400" />,
        label: 'Points',
        value: selectedProfile.points || '0',
        subValue: 'Achievement Score',
      },
      {
        icon: <Users className="w-5 h-5 text-gray-400" />,
        label: 'Team',
        value: selectedProfile.team_id ? 'Team Member' : 'Individual',
        subValue: selectedProfile.team_id ? `${selectedProfile.member_count} members` : 'No Team',
      },
    ];
  
    const statusColors = {
      pending: 'yellow',
      accepted: 'green',
      rejected: 'red',
    };
  
    const color = statusColors[selectedProfile.status];
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/90 backdrop-blur-sm">
        <div className="min-h-screen px-4 text-center">
          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg">
            <div className="relative h-48">
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${selectedProfile.avatar || '/api/placeholder/800/400'})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-transparent" />
              </div>
  
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-900/50 text-white hover:bg-gray-900/80 transition-all"
              >
                <X size={20} />
              </button>
            </div>
  
            <div className="relative px-6 pb-6 -mt-12">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={selectedProfile.avatar || '/api/placeholder/128/128'}
                    alt={selectedProfile.name}
                    className="w-24 h-24 rounded-lg border-4 border-gray-800 object-cover"
                  />
                  <div
                    className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-${color}-500 border-2 border-gray-800`}
                  />
                </div>
  
                <div className="flex-1 pt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedProfile.name}</h3>
                      <p className="text-gray-400 mt-1">{selectedProfile.email}</p>
                    </div>
  
                    <div
                      className={`px-3 py-1.5 rounded-full bg-${color}-500/20 text-${color}-400`}
                    >
                      <span className="text-sm font-medium capitalize">
                        {selectedProfile.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="mt-8 p-6 bg-gray-900/50 rounded-lg backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {profileSpecs.map((spec, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        {spec.icon}
                        <h3 className="text-sm font-medium text-gray-400">{spec.label}</h3>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">{spec.value}</p>
                        <p className="text-xs text-gray-500">{spec.subValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {selectedProfile.status === 'pending' && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleStatusUpdate(selectedProfile.id, 'accepted')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    <Check size={20} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedProfile.id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <X size={20} />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="relative py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="text-5xl tracking-wide  text-white font-custom">
                Accepted Participants
              </h3>
              <p className="text-gray-400 font-pilot mt-2 text-base">
                {participants.length} participant{participants.length !== 1 ? 's' : ''} accepted
              </p>
            </div>
          </div>
          <ViewToggle view={viewType} onViewChange={setViewType} />
        </div>
      </div>

      <div className={viewType === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6"
        : "flex flex-col space-y-4"
      }>
        {participants.map((participant) => (
          <ProfileCard 
            key={participant.registration_id} 
            profile={participant}
            viewType={viewType}
          />
        ))}
      </div>
      <ProfileModal />
    </>
  );
  
};

export default ParticipantCardGrid;