import React, { useState, useEffect } from 'react';
import { Users, X, Shield, Trophy } from 'lucide-react';

const TeamSelectionDialog = ({ isOpen, onClose, onTeamSelect }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (isOpen && userId) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_user_teams.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setTeams(data.teams || []);
            console.log(data.teams);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-gray-900/70 to-blue-900/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-[#1a1b1e]/90 backdrop-blur-md rounded-lg w-full max-w-4xl transform transition-all shadow-xl">
        <div className="border-b border-gray-700/50 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Select Team</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No teams found</p>
              <p className="text-gray-500 mt-2">Create a team first to join team tournaments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {teams.map((team, index) => (
              <div 
  key={team.id} 
  onClick={() => {
    onTeamSelect(team.id);
    onClose();
  }}
  className="relative h-[250px] rounded-xl overflow-hidden cursor-pointer
            transform transition-all duration-300 hover:scale-[1.03]
             hover:border-primary/50 group
            shadow-xl hover:shadow-primary/20"
  style={{
    backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${team.image || '/images/default-team-bg.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Primary overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-75 transition-opacity"></div>
  
  {/* Accent overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

 

  {/* Content wrapper */}
  <div className="relative h-full z-10 p-6 flex flex-col justify-end">
    {/* Team stats */}
    <div className="flex space-x-3 mb-4">
      <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full 
                     flex items-center space-x-2 ">
        <Users className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-gray-200">
          {team.member_count} {team.member_count === 1 ? 'member' : 'members'}
        </span>
      </div>
      <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full 
                     flex items-center space-x-2 border border-gray-700/50">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-gray-200">
          {team.rank || 'Unranked'}
        </span>
      </div>
    </div>

    {/* Team icon and name */}
    <div className="flex items-center space-x-4">
      <div className="bg-gray-900/80 p-4 rounded-xl group-hover:bg-primary/20 
                     transition-all duration-300 backdrop-blur-sm border border-gray-700/50">
        <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
      </div>
      <div>
        <h3 className="font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors">
          {team.name}
        </h3>
        <p className="text-gray-400 text-sm">
          Click to select for tournament
        </p>
      </div>
    </div>

    {/* Hover effect line */}
    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
  </div>
</div>
))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamSelectionDialog;