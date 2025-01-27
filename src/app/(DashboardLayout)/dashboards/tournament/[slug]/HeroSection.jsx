import { useParams, useRouter } from "next/navigation";
import { Clock, Edit, MoreVertical, Share2, Trash2, Users } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useToast } from '@/utils/ToastProvider';
import LoadingOverlay from "./Loading";
import TournamentStatus from "./TournamentStatus";

export const HeroSection = ({ 
  updateTournamentStatus, 
  tournamentId, 
  title, 
  backgroundSrc, 
  startDate, 
  endDate,
  tournament 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { slug } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [Loading, setLoading] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboards/edit-tournament/${tournamentId}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_tournament.php`,
          { tournament_id: tournamentId }
        );

        if (response.data.success) {
          showToast(response.data.message, "success", 1500);
          setTimeout(() => {
            router.push('/dashboards/tournaments');
          }, 1500);
        } else {
          showToast(response.data.message, "error", 5000);
        }
      } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while deleting the tournament.${error}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (Loading) {
    return <LoadingOverlay text={'Deleting Tournament'}/>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="relative w-full overflow-hidden bg-emerald-900 rounded-lg">
      {/* Even more compact height container */}
      <div className="w-full pb-[40%] sm:pb-[30%] md:pb-[25%] lg:pb-[20%] relative">
        {/* Background Image */}
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${backgroundSrc}`}
          alt="Tournament background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black to-transparent"></div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-2 sm:p-3">
          {/* Top Bar - Responsive Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Registration Info */}
            <div className="text-white font-custom">
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl tracking-wider break-words">
                <span className="text-primary">{tournament.nombre_maximum} / </span>
                <span className="break-words">
                  {tournament.registered_count} {tournament.participation_type > 1 
                    ? `${tournament.participation_type}s` 
                    : tournament.participation_type} registred
                </span>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="text-white font-custom text-right">
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl tracking-wider">
                <span className="text-primary">prize pool: </span>
                {tournament.prize_pool} DH
              </div>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <p className="text-gray-400 font-custom text-sm sm:text-base">
                {formatDate(startDate)}
              </p>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-valorant text-white leading-tight break-words">
                {title}
              </h2>
            </div>

            {/* Tournament Status */}
            <div className="w-full sm:w-auto">
              <TournamentStatus
                tournament={tournament}
                updateTournamentStatus={updateTournamentStatus}
                className="w-full sm:w-auto text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};