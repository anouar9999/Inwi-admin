"use client"
import React, { useState, useEffect } from 'react';
import { Users, Trophy, CalendarDays, UserCheck, UserPlus, Award, Clock, DollarSign, Gamepad2, Shield, Target } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between angular-cut">
    <div>
      <h3 className="text-lg font-medium text-gray-200">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
    <Icon className={`w-10 h-10 ${color}`} />
  </div>
);

const DashboardStatistics = () => {
  const [stats, setStats] = useState({
    // Existing stats
    totalUsers: 0,
    totalTournaments: 0,
    recentLogins: 0,
    upcomingTournaments: 0,
    newUsers: 0,
    totalAdmins: 0,
    avgTournamentDuration: 0,
    totalPrizePool: 0,
    tournamentStatus: [0, 0, 0, 0],
    userTypes: [0, 0, 0],
    loginActivity: [],
    // New team stats
    totalTeams: 0,
    activeTeams: 0,
    averageTeamSize: 0,
    teamsPerGame: {
      valorant: 0,
      freeFire: 0
    },
    teamPrivacyDistribution: {
      public: 0,
      private: 0,
      invitationOnly: 0
    },
    pendingJoinRequests: 0
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard-stats.php`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Unknown error occurred');
        setStats(prevStats => ({ ...prevStats, ...data.data }));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);


  const gameDistributionData = {
    labels: ['Valorant', 'Free Fire'],
    datasets: [{
      data: [stats.teamsPerGame.valorant, stats.teamsPerGame.freeFire],
      backgroundColor: ['#ff4655', '#ffa726'],
      borderWidth: 0,
    }]
  };

  const privacyDistributionData = {
    labels: ['Public', 'Private', 'Invitation Only'],
    datasets: [{
      data: [
        stats.teamPrivacyDistribution.public,
        stats.teamPrivacyDistribution.private,
        stats.teamPrivacyDistribution.invitationOnly
      ],
      backgroundColor: ['#4caf50', '#2196f3', '#9c27b0'],
      borderWidth: 0,
    }]
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Users and Tournaments Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
        <StatCard title="Total Tournaments" value={stats.totalTournaments} icon={Trophy} color="text-yellow-400" />
        <StatCard title="Recent Logins" value={stats.recentLogins} icon={UserCheck} color="text-green-400" />
        <StatCard title="Upcoming Tournaments" value={stats.upcomingTournaments} icon={CalendarDays} color="text-purple-400" />
      </div>

      {/* Additional User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="New Users (30d)" value={stats.newUsers} icon={UserPlus} color="text-pink-400" />
        <StatCard title="Total Admins" value={stats.totalAdmins} icon={Award} color="text-indigo-400" />
        <StatCard title="Avg Tournament Duration" value={`${stats.avgTournamentDuration} days`} icon={Clock} color="text-orange-400" />
        <StatCard title="Total Prize Pool" value={`${stats.totalPrizePool?.toLocaleString()} MAD`} icon={DollarSign} color="text-green-400" />
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Teams" value={stats.totalTeams} icon={Shield} color="text-purple-400" />
        <StatCard title="Active Teams" value={stats.activeTeams} icon={Target} color="text-green-400" />
        <StatCard title="Avg Team Size" value={stats.averageTeamSize.toFixed(1)} icon={Users} color="text-indigo-400" />
        <StatCard title="Join Requests" value={stats.pendingJoinRequests} icon={UserPlus} color="text-orange-400" />
      </div>

     

    
    </div>
  );
};

export default DashboardStatistics;