'use client';
import React, { useState, useEffect } from 'react';



import { Search ,SearchX} from 'lucide-react';
import TournamentCard from '../../TournamentCard';
import { ToastContainer } from 'react-toastify';

const Dropdown = ({ label, options, value, onChange }) => {
  // ... (keep the existing Dropdown component code)
};

const LeagueOfLegendsProfile = () => {
  const [filters, setFilters] = useState({
    format_des_qualifications: '',
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments.php`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const filteredTournaments = data.tournaments.filter(tournament => 
            tournament.status === "En cours" || tournament.status === "Ouvert aux inscriptions"
          );
          setTournaments(filteredTournaments);
          setFilteredTournaments(filteredTournaments);
        } else {
          setError(data.message || 'Échec de la récupération des tournois.');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        setError('Une erreur est survenue lors de la récupération des tournois');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // Apply filters and search logic here
    const filtered = tournaments.filter(tournament => {
      const matchesFilters = (
        (filters.format_des_qualifications === '' || tournament.format_des_qualifications === filters.format_des_qualifications) &&
        (filters.status === '' || tournament.status === filters.status)
      );
      const matchesSearch = tournament.nom_des_qualifications.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilters && matchesSearch;
    });
    setFilteredTournaments(filtered);
  }, [filters, tournaments, searchTerm]);

  const filterOptions = {
    format_des_qualifications: [
      { value: '', label: 'Format' },
      { value: 'Single Elimination', label: 'Single Elimination' },
      // Add other formats if needed
    ],
    status: [
      { value: '', label: 'Statut' },
      { value: 'Ouvert aux inscriptions', label: 'Ouvert aux inscriptions' },
      { value: 'En cours', label: 'En cours' },
    ],
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return (
    <div className="bg-transparent text-white p-4 rounded-lg shadow-lg">
    <ToastContainer />

    <h3 className="text-5xl   my-6 font-custom">        TOURNOIS EN COURS ET OUVERTS AUX INSCRIPTIONS
    </h3>

    {tournaments.length === 0 ? (
      <div className="text-center text-gray-400 mt-8">
        <SearchX className="mx-auto mb-4 w-16 h-16" />
        <p>Vous n avez participé à aucun tournoi correspondant à votre recherche.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <>
            <TournamentCard
              key={tournament.id}
              id={tournament.id}
              name={tournament.nom_des_qualifications}
              startDate={tournament.start_date}
              endDate={tournament.end_date}
              status={tournament.status}
              description_des_qualifications={tournament.description_des_qualifications}
              maxParticipants={tournament.nombre_maximum}
              format_des_qualifications={tournament.format_des_qualifications}
              type_de_match={tournament.type_de_match}
              type_de_jeu={tournament.type_de_jeu}
              image={tournament.image}
              prizePool={tournament.prize_pool}
              slug={tournament.slug}
              spots_remaining= {tournament.spots_remaining}
              tournamentType={tournament.participation_type}
              registered_count={tournament.registered_count}
            />{' '}
          
          </>
        ))}
      </div>
    )}
  </div>
  );
};

export default LeagueOfLegendsProfile;
