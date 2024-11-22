'use client';
import React, { useState,useEffect } from 'react';

import { useRef } from 'react';
import { Share2, Users, Trophy, Star, Calendar, Clock, Award, Target, Search, X } from 'lucide-react';
import CustomButton from '../../CustomButton';
import TournamentCard from '../../TournamentCard';
import TeamProfileCard from '../../TeamProfileCard';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ToastContainer } from 'react-toastify';

const Dropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative"  ref={dropdownRef}>
      <button   style={{
          clipPath:
            'polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px), 0% 0%)',
        }}
        className="flex items-center  justify-between w-40 px-4 py-4 text-sm bg-gray-800    rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || label}
        <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-40 mt-1 bg-gray-800 rounded-md shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments.php`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTournaments(data.tournaments);
          setFilteredTournaments(data.tournaments);
        } else {
          setError(data.message || 'Échec de la récupération des tournois');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        setError('Une erreur est survenue lors de la récupération des tournois');
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
      { value: 'Terminé', label: 'Terminé' },
      { value: 'Annulé', label: 'Annulé' },
    ],
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  
  return (
    <div className="bg-transparent text-white p-4 rounded-lg shadow-lg">
              <ToastContainer />

      <h3 className="text-5xl font-custom mb-8">
        EXPLOREZ TOUS LES TOURNOIS 
      </h3>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-grow relative">
          <input
            style={{
              clipPath:
                'polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px), 0% 0%)',
            }}
            type="text"
            placeholder="Rechercher un tournoi"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-4 bg-gray-700 text-white rounded-lg pr-10 focus:outline-none "
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        {Object.entries(filterOptions).map(([key, options]) => (
          <Dropdown
            key={key}
            label={options[0].label}
            options={options}
            value={filters[key]}
            onChange={(value) => handleFilterChange(key, value)}
          />
        ))}
      </div>

      {filteredTournaments.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-800/50 rounded-full p-6 mb-4">
        <X className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">
      Aucun tournoi ne correspond à votre recherche.
      </h3>
      <p className="text-gray-400 text-center max-w-md">
        Les tournois apparaîtront ici. Revenez plus tard pour voir les mises à jour.
      </p>
    </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map(tournament => (
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeagueOfLegendsProfile;
