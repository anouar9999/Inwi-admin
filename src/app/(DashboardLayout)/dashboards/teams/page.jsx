'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Edit, Trash2, Eye, EyeOff, Loader2, Search, Users, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import EditTeamModal from './EditTeamModal';
import { useToast } from '@/utils/ToastProvider';

const TeamCard = ({ team, onEdit, onDelete }) => {
  const { name, team_game, total_members, image, owner_username } = team;
  
  const gameImage = team_game === 'Free Fire' 
    ? "https://cdn12.idcgames.com/storage/image/1258/free-new-logo/default.jpg"
    : "https://www.riotgames.com/darkroom/1440/8d5c497da1c2eeec8cffa99b01abc64b:5329ca773963a5b739e98e715957ab39/ps-f2p-val-console-launch-16x9.jpg";

  return (
    <motion.div 
      className="bg-gray-800 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="h-16 relative overflow-hidden">
        <img src={`${gameImage}`} alt={team_game} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent" />
      </div>

      <div className="p-3">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-700 flex-shrink-0">
            {image ? (
              <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br from-gray-600 to-gray-800">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-valorant text-white truncate">{name}</h3>
            <div className="flex items-center mt-1 text-gray-400 text-sm">
              <Users className="w-4 h-4 mr-1" />
              <span className="mr-3">{total_members} members</span>
            </div>
            <div className="flex items-center mt-1 text-gray-400 text-sm">
              <Award className="w-4 h-4 mr-1" />
              <span>by {owner_username}</span>
            </div>
          </div>
        </div>

        <motion.div 
          className="absolute top-2 right-2 flex space-x-2"
          variants={{
            rest: { opacity: 0.7 },
            hover: { opacity: 1 }
          }}
        >
          <motion.button
            onClick={() => onEdit(team)}
            className="p-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(team.id)}
            className="p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};



const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_teams.php`);
      if (response.data.success) {
        setTeams(response.data.data || []);
      } else {
        setError(response.data.error || 'Failed to fetch teams');
      }
    } catch (err) {
      setError('Error fetching teams: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleEditTeam = async (editedTeam) => {
    setLoading(true);
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edit_team.php`,
            {
                ...editedTeam,
                id: editedTeam.id // Ensure id is included
            }
        );
        if (response.data.success) {
            setTeams(teams.map(team => 
                team.id === editedTeam.id ? { ...team, ...editedTeam } : team
            ));
            showToast('Team updated successfully', 'success',1500);
            setEditingTeam(null);
        } else {
            setError(response.data.message || 'Failed to update team');
        }
    } catch (err) {
        setError('Error updating team: ' + err.message);
        showToast(`Error updating team: ${err.message}`, 'error',1500);

        console.error('Update error:', err);
    }finally {
        setLoading(false);
    }
};

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    setLoading(true);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_team.php`,
        { data: { team_id: teamId } }
      );
      if (response.data.success) {
        setTeams(teams.filter(team => team.id !== teamId));
        showToast('Team deleted successfully', 'success',1500);
      } else {
        setError(response.data.message || 'Failed to delete team');
        
      }
    } catch (err) {
      setError('Error deleting team: ' + err.message);
      showToast(`Error deleting team: ${err.message}`, 'error',1500);
    } finally {
      setLoading(false);}
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.team_game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
     return (
       <div className="fixed inset-0 bg-pink-500/20 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <Loader2 className="w-28 h-28 text-white animate-spin" />
            <p className="mt-4 text-5xl font-custom text-white">Loading ...</p>
          </div>
     );
   }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-5xl font-custom text-white mb-2">Teams Management</h1>
        <p className="text-sm text-gray-400">Manage and monitor teams</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search teams by name or game"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-4 bg-gray-800 text-white angular-cut pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTeams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onEdit={setEditingTeam}
            onDelete={handleDeleteTeam}
          />
        ))}
      </div>

      {filteredTeams.length === 0 && !loading && (
        <div className="text-center text-gray-400 mt-8">
          <Users size={48} className="mx-auto mb-4" />
          <p>No teams found matching your criteria.</p>
        </div>
      )}

      {editingTeam && (
        <EditTeamModal
          isOpen={!!editingTeam}
          onClose={() => setEditingTeam(null)}
          team={editingTeam}
          onSave={handleEditTeam}
        />
      )}
    </div>
  );
};

export default TeamManagement;