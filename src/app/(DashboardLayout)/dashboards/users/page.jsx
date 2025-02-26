'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  X,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Users,
  Shield,
  Award,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import EditUserModal from './EditUser';

const UserCard = ({ user, onEdit, onDelete }) => {
  const { username, email, avatar, type, points, is_verified } = user;

  const handleEdit = () => onEdit(user);
  const handleDelete = () => onDelete(user.id);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg angular-cut shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative angular-cut"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="p-4 flex-col items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mb-2 flex-shrink-0">
          {avatar ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${avatar}`}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white text-xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-valorant  text-white truncate" title={username}>
            {username}
          </h3>

          <div className="flex items-center mt-1 space-x-2">
            <span className="flex items-center text-xs text-gray-500">
              <Award className="w-3 h-3 mr-1" />
              {points} pts
            </span>
            {is_verified == true && (
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
          hover: { opacity: 1, x: 0 },
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`,
      );
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        console.log(response.data.users);
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
        (filterType === 'all' || user.type === filterType),
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

  const handleSaveUser = async (formData) => {
    try {
      // Add the user ID to the form data
      formData.append('id', editingUser.id);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for sending files
          },
        },
      );

      if (response.data.success) {
        await fetchUsers(); // Refresh the users list
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
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`,
          {
            data: { id: userId },
            headers: { 'Content-Type': 'application/json' },
          },
        );

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
        <h1 className="font-custom text-white  leading-tight uppercase tracking-wider text-5xl  ">
          User Management
        </h1>
        <p className="text-sm text-gray-400">Manage and monitor user accounts</p>
      </div>
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search users by username or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-4 angular-cut bg-[#14192D] text-white angular-cut pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="bg-gray-800 angular-cut text-white  px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
};

export default UserManagement;
