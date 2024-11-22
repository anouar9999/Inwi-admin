import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users, UserSearch } from 'lucide-react'; // Import the Users icon from lucide-react
const ProfileCard = ({ profile }) => {
  const statusColors = {
    pending: 'bg-yellow-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500'
  };

  return (
    <div 
      onClick={() => setSelectedProfile(profile)}
      className="group relative h-32 rounded-lg overflow-hidden cursor-pointer transform 
                 transition-all duration-400 angular-cut"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform 
                   duration-300 "
        style={{
          backgroundImage: `url(${profile.avatar || "https://img.freepik.com/photos-premium/portrait-homme-confiant-annees-30-poils-portant-t-shirt-decontracte-posant-isole-blanc_171337-91828.jpg?w=740"})`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
      
    
 {/* Status Indicator */}
 <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-white
                     bg-green-500`} />
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="transform transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-xl font-semibold text-white mb-1">
            {profile.username}
          </h3>
        
          
          {/* <div className="flex items-center text-sm text-gray-300 opacity-80">
            <Calendar size={14} className="mr-2" />
            <span>{new Date(profile.decision_date).toLocaleDateString()}</span>
          </div> */}
          
       
        </div>
      </div>
    </div>
  );
};
const ParticipantCard = ({ participant }) => (
  <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105">
    <div className="p-4 flex flex-col items-center">
      <img
        src={participant.avatar}
        alt={participant.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <h3 className="mt-2 text-lg font-semibold text-white truncate">{participant.name}</h3>
      <p className="text-sm text-gray-400 truncate">{participant.username}</p>
    </div>
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

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_accepted_participants.php?tournament_id=${tournamentId}`
        );
        if (response.data.success) {
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
  const LoadingSkeleton = () => (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-12 bg-gray-800 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-800 rounded-lg" />
        ))}
      </div>
    </div>
  );
  if (loading) return <LoadingSkeleton />;

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

  return (
    <>
    <div className="relative py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-4xl font-medium text-white font-custom">
              Accepted Participants
            </h3>
            <p className="text-gray-400 mt-2 text-sm">
              {participants.length} participant{participants.length !== 1 ? 's' : ''} accepted for this tournament
            </p>
          </div>
        </div>
     
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {participants.map((participant) => (
        <>
                <ProfileCard key={participant.registration_id} profile={participant} />
                <ProfileCard key={participant.registration_id} profile={participant} />
                <ProfileCard key={participant.registration_id} profile={participant} />
                <ProfileCard key={participant.registration_id} profile={participant} />
                <ProfileCard key={participant.registration_id} profile={participant} />
                <ProfileCard key={participant.registration_id} profile={participant} />
                </>
      ))}
    </div>
  </>
   
  );
};

export default ParticipantCardGrid;