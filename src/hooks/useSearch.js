'use client'
import { useState, useEffect } from 'react';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const searchTournaments = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        setSearchError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search-tournaments.php?query=${encodeURIComponent(searchTerm)}`
        );
        
        const data = await response.json();

        if (data.success) {
          setSearchResults(data.tournaments);
        } else {
          throw new Error(data.message || 'Failed to search tournaments');
        }
      } catch (err) {
        setSearchError(err.message);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchTournaments();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError
  };
};