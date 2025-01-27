"use client"
import React, { useState, useEffect } from 'react';
import { User, Mail, Star, Target, Gamepad2, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between angular-cut">
    <div>
      <h3 className="text-lg font-medium text-gray-200">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
    <Icon className={`w-10 h-10 ${color}`} />
  </div>
);

const UserStatistics = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserData = async () => {
    try {
     
  
      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('No user ID found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-stats.php?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch user data');
      }
      setUserData(data.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
   
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="text-white p-6">No user data available.</div>;
  }

  const tournamentData = [
    { name: 'Won', value: userData.tournamentsWon },
    { name: 'Participated', value: userData.tournamentsParticipated - userData.tournamentsWon }
  ];

  const COLORS = ['#00C49F', '#0088FE'];

  return (
    <div className="pr-6 space-y-6 ">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard  title="Points" value={userData.points} icon={Star} color="text-yellow-400" />
        <StatCard title="Rank" value={userData.rank} icon={Target} color="text-red-400" />
        <StatCard title="Tournaments Participated" value={userData.tournamentsParticipated} icon={Gamepad2} color="text-purple-400" />
        <StatCard title="Tournaments Won" value={userData.tournamentsWon} icon={Trophy} color="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Points and Rank</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: 'Points', value: userData.points }, { name: 'Rank', value: userData.rank }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Tournament Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tournamentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {tournamentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;