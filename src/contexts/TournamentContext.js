import React, { createContext, useContext, useState, useCallback } from 'react';

const TournamentContext = createContext();

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider = ({ children }) => {
  const [tournament, setTournament] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resetStates = useCallback(() => {
    setHasJoined(false);
    setRegistrationStatus(null);
    setTeamName(null);
    setUserRole(null);
    setRegistrationDetails(null);
  }, []);


const checkJoinStatus = useCallback(async (tournamentId) => {
  try {
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('No userId found');
      resetStates();
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_check_tournament_join.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tournament_id: tournamentId,
        user_id: userId 
      }),
    });

    const data = await response.json();
    console.log('Response from tournament check:', data);

    if (data.success) {
      // Update tournament info
      setTournament(prev => ({
        ...prev,
        tournament_status: data.tournament_status,
        current_registrations: data.current_registrations,
        tournament_type: data.tournament_type // Make sure we store the tournament type
      }));

      // Set joined status
      setHasJoined(data.has_joined);

      if (data.has_joined && data.registrations?.length > 0) {
        const registration = data.registrations[0];

        // Set basic registration info
        setRegistrationStatus(registration.status);
        setRegistrationDetails({
          id: registration.id,
          registrationDate: registration.registration_date,
          username: registration.username
        });

        // Handle team tournament registration
        if (data.tournament_type === 'team' && registration.team_name) {
          console.log('Team registration found:', registration);
          // For team tournaments, make sure we have team info
          if (registration.team_name && registration.role) {
            setTeamName(registration.team_name);
            setUserRole(registration.role); // This should be either 'owner' or 'member'
          } else {
            console.log('Incomplete team data:', registration);
            resetStates();
          }
        }
      } else {
        // If no registration found or joined status is false
        console.log('No registration found');
        resetStates();
      }
    } else {
      console.error('API Error:', data.message);
      resetStates();
      setError(data.message || 'Failed to check registration status');
    }
  } catch (error) {
    console.error('Error checking tournament status:', error);
    resetStates();
    setError('Error checking tournament registration status');
  } finally {
    setLoading(false);
  }
}, [resetStates]);


  const fetchTournament = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/single_tournament.php?slug=${slug}`
      );
      const data = await response.json();

      if (data.success) {
        setTournament(data.tournament);
        await checkJoinStatus(data.tournament.id);
      } else {
        setError(data.message || 'Failed to fetch tournament data');
        resetStates();
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching tournament data');
      resetStates();
    } finally {
      setLoading(false);
    }
  }, [checkJoinStatus, resetStates]);

  const value = {
    tournament,
    hasJoined,
    registrationStatus,
    teamName,
    userRole,
    registrationDetails,
    loading,
    error,
    checkJoinStatus,
    fetchTournament,
    setHasJoined,
    resetStates
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};
