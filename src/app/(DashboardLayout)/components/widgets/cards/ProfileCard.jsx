import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Check, XIcon, Mail, Gamepad, User, Trophy, Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

const ProfileCard = ({ name, username, avatar, onClick }) => (
  <div
    className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
    onClick={onClick}
  >
    <div className="p-4 flex flex-col items-center">
      <img
        src={avatar}
        alt={name}
        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
      />
      <h3 className="mt-2 text-lg font-semibold text-white truncate">{name}</h3>
      <p className="text-sm text-gray-400 truncate">{username}</p>
    </div>
  </div>
);

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Modal = ({ isOpen, onClose, profile, onStatusUpdate }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      fetchUserDetails();
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_user_details.php?user_id=${profile.id}`);
      if (response.data.success) {
        setUserDetails(response.data.user);
      } else {
        console.error('Failed to fetch user details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleStatusUpdate = useCallback(
    async (status) => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_registration_status.php`, {
          registration_id: profile.id,
          status: status,
          admin_id: localStorage.getItem('adminId'),
        });

        if (response.data.success) {
          onStatusUpdate(profile.id, status);
          onClose();
        } else {
          console.error('Failed to update status:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    },
    [profile.id, onStatusUpdate, onClose],
  );

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div
        className={`relative bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-auto transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="flex items-start space-x-6">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
              <p className="text-lg text-gray-400">@{profile.username}</p>
              <div className="mt-4 flex items-center text-gray-300">
                <Mail size={16} className="mr-2" />
                <span>{profile.email}</span>
              </div>
              <div className="mt-2 flex items-center text-gray-300">
                <Calendar size={16} className="mr-2" />
                <span>Joined: {new Date(userDetails?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-3">Personal Information</h3>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-300">
                  <User size={16} className="inline mr-2" />
                  <span className="font-medium">Type:</span> {userDetails?.type}
                </p>
                <p className="text-sm text-gray-300">
                  <Trophy size={16} className="inline mr-2" />
                  <span className="font-medium">Points:</span> {userDetails?.points}
                </p>
                <p className="text-sm text-gray-300">
                  <Gamepad size={16} className="inline mr-2" />
                  <span className="font-medium">Rank:</span> {userDetails?.rank || 'N/A'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-3">Tournament Registration</h3>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Status:</span> {profile.status}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Registered:</span>{' '}
                  {new Date(profile.registration_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-300 mb-3">About</h3>
            <p className="text-sm text-gray-400 bg-gray-700 rounded-lg p-4">
              {userDetails?.bio || `No additional information available for ${profile.name}.`}
            </p>
          </div>

          {profile.status === 'pending' && (
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => handleStatusUpdate('accepted')}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <Check size={20} className="mr-2" />
                Accept Registration
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected')}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <XIcon size={20} className="mr-2" />
                Reject Registration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    registration_date: PropTypes.string.isRequired,
  }).isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

const ProfileCardGrid = ({ tournamentId }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/participants_registration.php?tournament_id=${tournamentId}`,
      );
      if (response.data.success) {
        setProfiles(response.data.profiles);
      } else {
        setError(response.data.message || 'Failed to fetch profiles');
      }
    } catch (err) {
      setError('Error fetching profiles. Please try again later.');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleStatusUpdate = useCallback(
    (profileId, newStatus) => {
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === profileId ? { ...profile, status: newStatus } : profile,
        ),
      );
      fetchProfiles();
    },
    [fetchProfiles],
  );

  if (loading) {
    return <div className="text-white text-center">Loading participants...</div>;
  }

  if (error) {
    return <div className="text-white text-center">{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            name={profile.name}
            username={profile.email}
            avatar={profile.avatar}
            onClick={() => setSelectedProfile(profile)}
          />
        ))}
      </div>
      {selectedProfile && (
        <Modal
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          profile={selectedProfile}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

ProfileCardGrid.propTypes = {
  tournamentId: PropTypes.number.isRequired,
};

export default ProfileCardGrid;
