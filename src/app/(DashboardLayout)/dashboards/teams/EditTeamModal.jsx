import { X } from "lucide-react";
import { useEffect, useState } from "react";

const EditTeamModal = ({ isOpen, onClose, team, onSave }) => {
    const [editedTeam, setEditedTeam] = useState(team);
  
    useEffect(() => {
      setEditedTeam(team);
    }, [team]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedTeam(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(editedTeam);
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800  angular-cut shadow-xl w-full max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Edit Team</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Team Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedTeam.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 angular-cut bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Game</label>
                <select
                  name="team_game"
                  value={editedTeam.team_game}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 angular-cut bg-gray-700 border-gray-600 text-white"
                >
                  <option value="Valorant">Valorant</option>
                  <option value="Free Fire">Free Fire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Privacy Level</label>
                <select
                  name="privacy_level"
                  value={editedTeam.privacy_level}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 angular-cut bg-gray-700 border-gray-600 text-white"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Invitation Only">Invitation Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Division</label>
                <input
                  type="text"
                  name="division"
                  value={editedTeam.division}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 angular-cut bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Description</label>
              <textarea
                name="description"
                value={editedTeam.description}
                onChange={handleChange}
                className="mt-1 block w-full p-3 angular-cut bg-gray-700 border-gray-600 text-white"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 p-3 angular-cut bg-primary text-white  hover:bg-orange-600 transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    );
    };
  
  export default EditTeamModal;