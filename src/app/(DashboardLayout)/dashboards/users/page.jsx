'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Edit, Trash2, Eye, EyeOff, Loader2, Search, Users, Shield, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UserCard = ({ user, onEdit, onDelete }) => {
  const { username, email, avatar, type, points, is_verified } = user;
  
  const handleEdit = () => onEdit(user);
  const handleDelete = () => onDelete(user.id);

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative angular-cut"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="p-4 flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-500 flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white text-xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="ml-4 flex-grow min-w-0">
          <h3 className="text-lg font-semibold text-white truncate" title={username}>
            {username}
          </h3>
          <p className="text-sm text-gray-400 truncate" title={email}>
            {email}
          </p>
          <div className="flex items-center mt-1 space-x-2">
           
            <span className="flex items-center text-xs text-gray-500">
              <Award className="w-3 h-3 mr-1" />
              {points} pts
            </span>
            {is_verified==true && (
              <span className="flex items-center text-xs text-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
      <motion.div 
        className="absolute top-0 right-0 h-full flex flex-col justify-center mr-4 space-y-2"
        variants={{
          rest: { opacity: 0, x: 20 },
          hover: { opacity: 1, x: 0 }
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          onClick={handleEdit}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={`Edit ${username}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit className="h-4 w-4" />
        </motion.button>
        <motion.button
          onClick={handleDelete}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label={`Delete ${username}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setEditedUser(user);
    setNewPassword('');
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...editedUser };
    if (newPassword) {
      updatedUser.password = newPassword;
    }
    onSave(updatedUser);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Edit User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={editedUser.username}
                onChange={handleChange}
                className="mt-1 block w-full p-2 rounded-md bg-gray-700 border-gray-600 text-white angular-cut"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md p-2 bg-gray-700 border-gray-600 text-white angular-cut"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-400">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={editedUser.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md p-2 bg-gray-700 border-gray-600 text-white angular-cut"
              >
                <option value="admin">Admin</option>
                <option value="participant">Participant</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-400">
                Points
              </label>
              <input
                type="number"
                id="points"
                name="points"
                value={editedUser.points}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md p-2 bg-gray-700 border-gray-600 text-white angular-cut"
              />
            </div>
            <div>
              <label htmlFor="rank" className="block text-sm font-medium text-gray-400">
                Rank
              </label>
              <input
                type="number"
                id="rank"
                name="rank"
                value={editedUser.rank}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md p-2 bg-gray-700 border-gray-600 text-white angular-cut"
              />
            </div>
            <div>
              <label htmlFor="is_verified" className="block text-sm font-medium text-gray-400">
                Verified
              </label>
              <select
                id="is_verified"
                name="is_verified"
                value={editedUser.is_verified}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md p-2 bg-gray-700 border-gray-600 text-white angular-cut"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-400">
                Avatar URL
              </label>
              <input
                type="text"
                id="avatar"
                name="avatar"
                value={editedUser.avatar}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md p-2 bg-gray-700 border-gray-600 text-white angular-cut"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md p-2 bg-gray-700 border-gray-600 text-white pr-10 angular-cut"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 angular-cut"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-400">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={editedUser.bio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 p-2 border-gray-600 text-white angular-cut"
              rows="3"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2  bg-primary text-white rounded hover:bg-orange-600 transition-colors angular-cut"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};





// EditUserModal component remains unchanged

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`);
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } else {
        setError(response.data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let result = users.filter(
      (user) =>
        (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterType === 'all' || user.type === filterType)
    );

    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [searchTerm, users, filterType, sortBy, sortOrder]);

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = async (editedUser) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`, editedUser);
      if (response.data.success) {
        setUsers(users.map((user) => (user.id === editedUser.id ? editedUser : user)));
        setEditingUser(null);
      } else {
        setError(response.data.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Error updating user. Please try again later.');
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`, {
          data: { id: userId },
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data && response.data.success) {
          fetchUsers();
        } else {
          setError('Error deleting user. Server responded with an error.');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Error deleting user. Please check the console for more details.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-white">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-white text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
        <p className="text-sm text-gray-400">Manage and monitor user accounts</p>
      </div>
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search users by username or email"
            value={searchTerm}
            style={{
              clipPath:
                'polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px), 0% 0%)',
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-4 bg-gray-700 text-white rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex space-x-2">
          <select
            style={{
              clipPath:
                'polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px), 0% 0%)',
            }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-800 text-white rounded-md px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="admin">Admin</option>
            <option value="participant">Participant</option>
            <option value="viewer">Viewer</option>
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="username-asc">Username (A-Z)</option>
            <option value="username-desc">Username (Z-A)</option>
            <option value="points-asc">Points (Low to High)</option>
            <option value="points-desc">Points (High to Low)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        ))}
      </div>
      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          <Users size={48} className="mx-auto mb-4" />
          <p>No users found matching your criteria.</p>
        </div>
      )}
      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}
        <style jsx global>{`
        .angular-cut {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
          
        }
        .angular-cut::before,
        .angular-cut::after {
          content: '';
          position: absolute;
          background-color: #374151;
        }
        .angular-cut::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut::after {
          bottom: 0;
          left: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
        .angular-cut-button {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut-button::before,
        .angular-cut-button::after {
          content: '';
          position: absolute;
          background-color: #78350f;
        }
        .angular-cut-button::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut-button::after {
          bottom: 0;
          left: 0;
          width: 0px;
          height: 2px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
