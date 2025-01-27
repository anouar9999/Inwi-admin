'use client';
import React, { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  CalendarDays,
  UserCheck,
  UserPlus,
  Award,
  Clock,
  DollarSign,
  Gamepad2,
  Shield,
  Target,
} from 'lucide-react';
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
  LineElement,
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-secondary rounded-lg p-6 flex items-center justify-between angular-cut transition-colors duration-200">
    <div>
      <h3 className="text-lg font-valorant text-gray-200">{title}</h3>
      <p className={`text-3xl font-custom mt-2 ${color}`}>{value}</p>
    </div>
    <Icon className={`w-10 h-10 ${color}`} />
  </div>
);

const DashboardStatistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTournaments: 0,
    recentLogins: 0,
    upcomingTournaments: 0,
    newUsers: 0,
    totalAdmins: 0,
    avgTournamentDuration: 0,
    totalPrizePool: 0,
    totalTeams: 0,
    activeTeams: 0,
    averageTeamSize: 0,
    pendingJoinRequests: 0,
    teamsPerGame: {
      valorant: 0,
      freeFire: 0,
    },
    teamPrivacyDistribution: {
      public: 0,
      private: 0,
      invitationOnly: 0,
    },
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard-stats.php`,
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Unknown error occurred');
        setStats((prevStats) => ({ ...prevStats, ...data.data }));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-[#151c2f] rounded-lg">
      {/* Users and Tournaments Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
        <StatCard
          title="Total Tournaments"
          value={stats.totalTournaments}
          icon={Trophy}
          color="text-yellow-400"
        />
        <StatCard
          title="Recent Logins"
          value={stats.recentLogins}
          icon={UserCheck}
          color="text-green-400"
        />
        <StatCard
          title="Upcoming Tournaments"
          value={stats.upcomingTournaments}
          icon={CalendarDays}
          color="text-purple-400"
        />
      </div>

      {/* Additional User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="New Users (30d)"
          value={stats.newUsers}
          icon={UserPlus}
          color="text-pink-400"
        />
        <StatCard
          title="Total Admins"
          value={stats.totalAdmins}
          icon={Award}
          color="text-indigo-400"
        />
        <StatCard
          title="Avg Tournament Duration"
          value={`${stats.avgTournamentDuration} days`}
          icon={Clock}
          color="text-orange-400"
        />
        <StatCard
          title="Total Prize Pool"
          value={`${stats.totalPrizePool?.toLocaleString()} MAD`}
          icon={DollarSign}
          color="text-green-400"
        />
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Teams"
          value={stats.totalTeams}
          icon={Shield}
          color="text-purple-400"
        />
        <StatCard
          title="Active Teams"
          value={stats.activeTeams}
          icon={Target}
          color="text-green-400"
        />
        <StatCard
          title="Avg Team Size"
          value={stats.averageTeamSize.toFixed(1)}
          icon={Users}
          color="text-indigo-400"
        />
        <StatCard
          title="Join Requests"
          value={stats.pendingJoinRequests}
          icon={UserPlus}
          color="text-orange-400"
        />
      </div>
    </div>
  );
};

export default DashboardStatistics;
