import { useParams, useRouter } from 'next/navigation';
import { Clock, Edit, MoreVertical, Share2, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/utils/ToastProvider';
import LoadingOverlay from './Loading';
import TournamentStatus from './TournamentStatus';
import { formatDate } from './../../../../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroSection = ({
  updateTournamentStatus,
  tournamentId,
  title,
  backgroundSrc,
  startDate,
  endDate,
  tournament,
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
    if (
      window.confirm(
        'Are you sure you want to delete this tournament? This action cannot be undone.',
      )
    ) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_tournament.php`,
          { tournament_id: tournamentId },
        );

        if (response.data.success) {
          showToast(response.data.message, 'success', 1500);
          setTimeout(() => {
            router.push('/dashboards/tournaments');
          }, 1500);
        } else {
          showToast(response.data.message, 'error', 5000);
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
    return <LoadingOverlay  />;
  }

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
                  {tournament.registered_count}{' '}
                  {tournament.participation_type > 1
                    ? `${tournament.participation_type}s`
                    : tournament.participation_type}{' '}
                  registred
                </span>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="text-white font-custom text-right flex items-center justify-end gap-3">
      {/* Edit Button */}
      <motion.button 
        className="p-2 bg-blue-500 rounded-full text-white"
        initial="initial"
        whileHover="hover"
        onClick={handleEdit}
        whileTap="tap"
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </motion.svg>
      </motion.button>
      
      {/* Delete Button */}
      <motion.button 
        className="p-2 bg-red-500 rounded-full text-white"
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={handleDelete}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </motion.svg>
      </motion.button>
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
