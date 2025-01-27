import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, Trophy, Shield, UserCircle, Users, Star, Activity } from 'lucide-react';

const ParticipantOrTeamCard = ({ item }) => {
  const isTeam = item.type === 'team';

  return (
    <div className="bg-gray-800 angular-cut shadow-md overflow-hidden flex flex-col w-48">
      <div className="relative h-24">
        {(isTeam ? item.team_avatar : item.avatar) ? (
          <img
            className="w-full h-full object-cover"
            src={isTeam ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.team_avatar}` : item.avatar}
            alt={`${isTeam ? item.team_name : item.username}'s avatar`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <UserCircle className="w-24 h-24 text-gray-500" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2.5">
          <h5 className="text-lg font-semibold text-white truncate">
            {isTeam ? item.team_name : item.username}
            {!isTeam && localStorage.getItem('username') === item.username ? ' (You)' : ''}
          </h5>
        </div>
      </div>
    </div>
  );
};

const ParticipantCardGrid = ({ tournamentId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournamentType, setTournamentType] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_accepted_participants.php?tournament_id=${tournamentId}`,
        );
        if (response.data.success) {
          setParticipants(response.data.participants);
          setTournamentType(response.data.tournament_type);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="mx-auto">
      {/* <h2 className="text-4xl text-white mb-6 font-custom">
        {tournamentType === 'team' ? 'Participating Teams' : 'Participants'}
      </h2> */}

      {participants.length === 0 ? (
        <div className="text-center mt-6">
          <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="text-purple-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No {tournamentType === 'team' ? 'Teams' : 'Participants'} Yet
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Be the first to {tournamentType === 'team' ? 'register your team' : 'join'}!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {participants.map((item) => (
            <ParticipantOrTeamCard key={item.registration_id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantCardGrid;
