"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const UserSettings = () => {
  const router = useRouter();
  const id = localStorage.getItem('userId');

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
    points: 0,
    rank: '',
    bio: '',
    avatar: '',
    user_type: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserSettings();
    }
  }, [id]);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_settings.php?id=${id}`);
      if (response.data) {
        setUser(prevState => ({
          ...prevState,
          ...response.data.data,
          password: '',
          confirmPassword: ''
        }));
        console.log(response.data);
      } else {
        setError(response.data.message || 'Failed to fetch user settings');
      }
    } catch (err) {
      setError('Failed to fetch user settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password && user.password !== user.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const updateData = {
        id: id,
        username: user.username,
        email: user.email,
        type: user.type,
        points: user.points,
        rank: user.rank,
        bio: user.bio,
        avatar: user.avatar,
        user_type: user.user_type
      };
      
      if (user.password) {
        updateData.password = user.password;
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_settings.php`, updateData);
      if (response.data.success) {
        setSuccess('User settings updated successfully');
        setUser(prevState => ({ ...prevState, password: '', confirmPassword: '' }));
        localStorage.setItem('username', user.username);
      } else {
        setError(response.data.message || 'Failed to update user settings');
      }
    } catch (err) {
      setError('Failed to update user settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">User Settings</h1>
    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
    {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="username" className="block mb-1">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className="w-full px-3 py-3 bg-gray-800 rounded angular-cut"
            required
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="email" className="block mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="w-full px-3 py-3 bg-gray-800 rounded angular-cut"
            required
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="password" className="block mb-1">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            className="w-full px-3 py-3 bg-gray-800 rounded angular-cut"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="confirmPassword" className="block mb-1">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-3 bg-gray-800 rounded angular-cut"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="type" className="block mb-1">User Type:</label>
          <select
            id="type"
            name="type"
            value={user.type}
            onChange={handleInputChange}
            className="w-full px-3 py-3 bg-gray-800 rounded angular-cut"
            required
          >
            <option value="admin">Admin</option>
            <option value="participant">Participant</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="w-1/2">
          <label htmlFor="points" className="block mb-1">Points:</label>
          <input
            type="number"
            id="points"
            name="points"
            value={user.points}
            onChange={handleInputChange}
            className="w-full px-3 py-3 bg-gray-800 rounded angular-cut"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="rank" className="block mb-1">Rank:</label>
          <input
            type="text"
            id="rank"
            name="rank"
            value={user.rank}
            onChange={handleInputChange}
            className="w-full px-3 py-3 bg-gray-800 rounded angular-cut"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="avatar" className="block mb-1">Avatar URL:</label>
          <input
            type="url"
            id="avatar"
            name="avatar"
            value={user.avatar}
            onChange={handleInputChange}
            className="w-full px-3 py-3 bg-gray-800 rounded angular-cut"
          />
        </div>
      </div>
      <div>
        <label htmlFor="bio" className="block mb-1">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={user.bio}
          onChange={handleInputChange}
          className="w-full px-3 py-4 bg-gray-800 rounded angular-cut"
          rows="3"
        ></textarea>
      </div>
      <button type="submit" className="angular-cut bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
        Update Settings
      </button>
    </form>
  </div>  
  );
};

export default UserSettings;