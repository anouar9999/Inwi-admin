import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
} from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

// Dropdown Component
const Dropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-secondary angular-cut text-gray-300 hover:bg-gray-700 transition-all duration-200"
      >
        {Icon && <Icon size={18} />}
        <span>{value || label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-48 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
        >
          {options.map((option) => (
            <button
              key={option.value}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 angular-cut transition-colors duration-200"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchAndFilters = ({ onSearch, onFilterChange, initialFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError
  } = useSearch();

  const [filters, setFilters] = useState(initialFilters);

  const filterOptions = {
    format_des_qualifications: [
      { value: '', label: 'Tous les formats' },
      { value: 'Single Elimination', label: 'Single Elimination' },
      { value: 'Double Elimination', label: 'Double Elimination' },
      { value: 'Round Robin', label: 'Round Robin' },
    ],
    status: [
      { value: '', label: 'Tous les statuts' },
      { value: 'Ouvert aux inscriptions', label: 'Ouvert aux inscriptions' },
      { value: 'En cours', label: 'En cours' },
      { value: 'Terminé', label: 'Terminé' },
      { value: 'Annulé', label: 'Annulé' },
    ],
  };

  // Handle search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      // Update search param
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }
      
      // Update filter params
      if (filters.format_des_qualifications) {
        params.set('format', filters.format_des_qualifications);
      } else {
        params.delete('format');
      }
      
      if (filters.status) {
        params.set('status', filters.status);
      } else {
        params.delete('status');
      }
      
      // Reset to page 1 when search or filters change
      params.set('page', '1');
      
      // Update URL and notify parent
      router.push(`?${params.toString()}`);
      onSearch(searchTerm);
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const handleSearchSelect = (tournament) => {
    setSearchTerm('');
    setIsSearchOpen(false);
    router.push(`/tournaments/${tournament.slug}`);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Rechercher un tournoi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          className="w-full px-4 py-3 bg-secondary text-white angular-cut pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        {isSearchOpen && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto z-50">
            {isSearching ? (
              <div className="p-4 text-center text-gray-400">
                Recherche en cours...
              </div>
            ) : searchError ? (
              <div className="p-4 text-center text-red-400">
                {searchError}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                Aucun résultat trouvé
              </div>
            ) : (
              <div className="py-2">
                {searchResults.map((tournament) => (
                  <button
                    key={tournament.id}
                    onClick={() => handleSearchSelect(tournament)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-300"
                  >
                    <div className="font-medium">{tournament.nom_des_qualifications}</div>
                    <div className="text-sm text-gray-400">{tournament.type_de_jeu}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Dropdown
          label="Format"
          options={filterOptions.format_des_qualifications}
          value={filters.format_des_qualifications}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, format_des_qualifications: value }))
          }
          icon={Filter}
        />
        <Dropdown
          label="Statut"
          options={filterOptions.status}
          value={filters.status}
          onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          icon={Star}
        />
      </div>
    </div>
  );
};

export default SearchAndFilters;