"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AdminSettings = () => {
  const router = useRouter();
  const id = localStorage.getItem('adminId');

  const [admin, setAdmin] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchAdminSettings();
    }
  }, [id]);

  const fetchAdminSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings.php?id=${id}`);
      console.log(response.data.data);
      setAdmin(prevState => ({
        ...prevState,
        username: response.data.data.username,
        email: response.data.data.email,
      }));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch admin settings');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin.password && admin.password !== admin.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const updateData = {
        id: id,
        username: admin.username,
        email: admin.email,
      };
      
      // Only include password if it has been changed
      if (admin.password) {
        updateData.password = admin.password;
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings.php`, updateData);
      setSuccess('Admin settings updated successfully');
      setAdmin(prevState => ({ ...prevState, password: '', confirmPassword: '' }));
      localStorage.setItem('adminUsername', admin.username);
      setLoading(false);
    } catch (err) {
      setError('Failed to update admin settings');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={admin.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2  bg-gray-800 rounded angular-cut"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={admin.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2  bg-gray-800 rounded angular-cut"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={admin.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2  bg-gray-800 rounded angular-cut"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={admin.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2  bg-gray-800 rounded angular-cut"
          />
        </div>
        <button type="submit" className="angular-cut bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Settings
        </button>
      </form>
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
          width: 2px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut::after {
          bottom: 0;
          left: 0;
          width: 10px;
          height: 2px;
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
          width: 2px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut-button::after {
          bottom: 0;
          left: 0;
          width: 10px;
          height: 2px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;