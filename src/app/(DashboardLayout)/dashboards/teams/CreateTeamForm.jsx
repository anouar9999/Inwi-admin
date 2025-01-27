import React, { useState, useEffect } from 'react';
import { PlusCircle, Upload, X, Shield, Users, Star, Lock } from 'lucide-react';
import { ToastProvider, useToast } from '@/app/components/toast/ToastProviderContext';

const CreateTeamForm = ({ isOpen, onClose, currentUser,onFinish }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'Public',
    image: null,
    requirements: {
      minRank: 'any',
      region: 'euw',
      playStyle: 'casual'
    },
    captain: {
      name: currentUser?.username || '',
      role: 'Mid',
      rank: 'any'
    }
  });

  const rankOptions = [
    { value: 'any', label: 'Any Rank' },
    { value: 'iron', label: 'Iron' },
    { value: 'bronze', label: 'Bronze' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'master', label: 'Master' },
    { value: 'grandmaster', label: 'Grandmaster' },
    { value: 'challenger', label: 'Challenger' }
  ];
  
  const regionOptions = [
    { value: 'euw', label: 'Europe West' },
    { value: 'eune', label: 'Europe Nordic & East' },
    { value: 'na', label: 'North America' },
    { value: 'kr', label: 'Korea' },
    { value: 'jp', label: 'Japan' },
    { value: 'oce', label: 'Oceania' },
    { value: 'lan', label: 'Latin America North' },
    { value: 'las', label: 'Latin America South' },
    { value: 'br', label: 'Brazil' },
    { value: 'tr', label: 'Turkey' },
    { value: 'ru', label: 'Russia' }
  ];
  
  const playStyleOptions = [
    { value: 'casual', label: 'Casual' },
    { value: 'competitive', label: 'Competitive' },
    { value: 'both', label: 'Both' }
  ];
  
  const roleOptions = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { addToast } = useToast();
  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error('Team name is required');
    }
    if (formData.name.length > 255) {
      throw new Error('Team name must be less than 255 characters');
    }
    
    if (formData.image) {
      const base64Length = formData.image.length * 0.75;
      if (base64Length > 2 * 1024 * 1024) { // 2MB limit
        throw new Error('Image must be less than 2MB');
      }
    }
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not authenticated');
    }
  };
  // Add image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB');
        return;
      }

      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this section to your form JSX after Team Requirements
  const imageUploadSection = (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h3 className="flex items-center text-lg font-semibold mb-6">
        <Upload className="mr-2 text-purple-400" size={20} />
        Team Logo
      </h3>
      
      <div className="relative group">
        <div className="w-full h-48 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl overflow-hidden group-hover:border-purple-500 transition-colors">
          {imagePreview ? (
            <img 
              src={imagePreview}
              alt="Team logo preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Upload size={32} className="mb-2" />
              <span className="text-sm">Drop your logo here</span>
              <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Call validateForm before proceeding
      validateForm();
  
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
  
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        privacy: formData.privacy,
        image: formData.image,
        owner_id: userId,
        owner_name: username || currentUser?.username,
        team_game: 'Valorant',
        requirements: {
          minRank: formData.requirements.minRank,
          region: formData.requirements.region,
          playStyle: formData.requirements.playStyle,
          role: formData.captain.role
        }
      };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create_team.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });
  
      const result = await response.json();
  
      if (result.success) {
        addToast({
          type: 'success',
          message: 'Team created successfully!',
          duration: 5000,
        });
        onClose();
        if (onFinish) onFinish();
      } else {
        throw new Error(result.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message);
      addToast({
        type: 'error',
        message: error.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };
  // Reset form
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        privacy: 'Public',
        image: null,
        requirements: {
          minRank: 'any',
          region: 'euw',
          playStyle: 'casual'
        },
        captain: {
          name: currentUser?.username || '',
          role: 'Mid',
          rank: 'any'
        }
      });
      setImagePreview(null);
      setError(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
  
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative h-full overflow-auto">
        <div className="w-full max-w-6xl mx-auto angular-cut bg-gray-900 min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-10 px-6 py-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Create New Team</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Basic Info Section */}
            <div className="bg-gray-800/50 angular-cut p-6">
              <h3 className="flex items-center text-lg font-semibold mb-6">
                <Shield className="mr-2 text-purple-400" size={20} />
                Basic Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name*
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-900/50 angular-cut  px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter your team name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows="4"
                    className="w-full bg-gray-900/50 angular-cut  px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Tell us about your team..."
                  />
                </div>
              </div>
            </div>

            {/* Team Requirements */}
            <div className="bg-gray-800/50 angular-cut p-6">
              <h3 className="flex items-center text-lg font-semibold mb-6">
                <Users className="mr-2 text-purple-400" size={20} />
                Team Requirements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Rank
                  </label>
                  <select
                    value={formData.requirements.minRank}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requirements: { ...prev.requirements, minRank: e.target.value }
                    }))}
                    className="w-full bg-gray-900/50 angular-cut  px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    {rankOptions.map(rank => (
                      <option key={rank.value} value={rank.value}>{rank.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={formData.requirements.region}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requirements: { ...prev.requirements, region: e.target.value }
                    }))}
                    className="w-full bg-gray-900/50 angular-cut px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    {regionOptions.map(region => (
                      <option key={region.value} value={region.value}>{region.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Play Style
                  </label>
                  <select
                    value={formData.requirements.playStyle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requirements: { ...prev.requirements, playStyle: e.target.value }
                    }))}
                    className="w-full bg-gray-900/50 angular-cut px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    {playStyleOptions.map(style => (
                      <option key={style.value} value={style.value}>{style.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Role
                  </label>
                  <select
                    value={formData.captain.role}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      captain: { ...prev.captain, role: e.target.value }
                    }))}
                    className="w-full bg-gray-900/50 angular-cut px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-800/50 angular-cut p-6">
              <h3 className="flex items-center text-lg font-semibold mb-6">
                <Lock className="mr-2 text-purple-400" size={20} />
                Privacy Settings
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 bg-gray-900/50 angular-cut cursor-pointer hover:bg-gray-900 transition-colors">
                  <input
                    type="radio"
                    name="privacy"
                    value="Public"
                    checked={formData.privacy === 'Public'}
                    onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value }))}
                    className="form-radio text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-white">Public Team</div>
                    <div className="text-xs text-gray-400">Anyone can view and request to join your team</div>
                  </div>
                </label>

                <label className="flex items-center p-4 bg-gray-900/50 angular-cut cursor-pointer hover:bg-gray-900 transition-colors">
                  <input
                    type="radio"
                    name="privacy"
                    value="Private"
                    checked={formData.privacy === 'Private'}
                    onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value }))}
                    className="form-radio  angular-cuttext-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-white">Private Team</div>
                    <div className="text-xs text-gray-400">Only invited members can join your team</div>
                  </div>
                </label>
                {imageUploadSection}

              </div>
            </div>

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-gray-900/95 angular-cut backdrop-blur-sm border-t border-gray-800 p-6">
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 angular-cut text-gray-300 hover:bg-gray-800 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 angular-cut bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⚪</span>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={20} />
                      <span>Create Team</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default CreateTeamForm;
