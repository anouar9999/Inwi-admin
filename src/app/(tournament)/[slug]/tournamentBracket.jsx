/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { Bracket, Seed, SeedItem } from 'react-brackets';
import { ChevronRight, Crown, Loader2, Trophy } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
const TournamentBracket = ({ tournamentId }) => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [hoveredParticipant, setHoveredParticipant] = useState(null);
  const [isTeamTournament, setIsTeamTournament] = useState(false);

  useEffect(() => {
    if (tournamentId) fetchMatches();
  }, [tournamentId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetch_matches_bracket.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tournament_id: tournamentId }),
        },
      );

      const result = await response.json();

      if (result.success) {
        setIsTeamTournament(result.data.is_team_tournament);
        formatMatches(result.data);
      } else {
        setError(result.message || 'Failed to load tournament data');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load tournament bracket');
    } finally {
      setLoading(false);
    }
  };
  const formatMatches = (data) => {
    if (!data?.matches?.length) {
      setError('The bracket is not implemented yet');
      return;
    }

    const totalRounds = data.total_rounds;
    const formattedRounds = [];

    // Sort matches by position within each round
    const matchesByRound = {};
    data.matches.forEach(match => {
      const round = parseInt(match.round);
      if (!matchesByRound[round]) {
        matchesByRound[round] = [];
      }
      matchesByRound[round].push(match);
    });

    // Sort matches by position within each round
    Object.keys(matchesByRound).forEach(round => {
      matchesByRound[round].sort((a, b) => parseInt(a.position) - parseInt(b.position));
    });

    for (let round = 0; round < totalRounds; round++) {
      const roundNumber = round + 1;
      const roundMatches = matchesByRound[roundNumber] || [];
      const expectedMatches = Math.pow(2, totalRounds - round - 1);

      // Fill in any missing matches with TBD
      while (roundMatches.length < expectedMatches) {
        roundMatches.push({
          id: `empty-${round}-${roundMatches.length}`,
          status: 'SCHEDULED',
          position: roundMatches.length,
          teams: [
            { name: 'TBD', score: 0, winner: false },
            { name: 'TBD', score: 0, winner: false },
          ],
        });
      }

      formattedRounds.push({
        title: getRoundTitle(round, totalRounds),
        seeds: roundMatches.map((match) => ({
          id: match.id,
          status: match.status,
          teams: (match.teams || [
            { name: 'TBD', score: 0, winner: false },
            { name: 'TBD', score: 0, winner: false },
          ]).map((team) => ({
            ...team,
            id: team.id || `team-${Math.random()}`,
          })),
        })),
      });
    }

    setRounds(formattedRounds);
  };

  const getRoundTitle = (round, totalRounds) => {
    if (round === totalRounds - 1) return <span className="font-custom text-2xl ">Finals</span>;
    if (round === totalRounds - 2)
      return <span className="font-custom text-2xl ">Semi Finals</span>;
    if (round === totalRounds - 3)
      return <span className="font-custom text-2xl ">Quarter Finals</span>;
    if (round === totalRounds - 4)
      return <span className="font-custom text-2xl ">Round of 16</span>;
    if (round === totalRounds - 5)
      return <span className="font-custom text-2xl ">Round of 32</span>;
    return `Round ${round + 1}`;
  };

 

  const CustomSeed = ({ seed, roundIndex, seedIndex }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isTBD = (team) => !team.name || team.name === 'TBD';
    const isPartOfJourney =
      hoveredParticipant && seed.teams.some((team) => team.name === hoveredParticipant);
    const hasOneParticipant = seed.teams.filter((team) => team.name !== 'TBD').length === 1;
    
    return (
      <Seed>
        <SeedItem>
          <div
            className="relative w-[240px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {seed.teams.map((team, idx) => (
              <div
                key={team.id}
                className={`
                  relative mb-0.5 last:mb-0 transition-all duration-300 ease-in-out
                  ${team.winner ? 'z-10' : 'z-0'}
                `}
                onMouseEnter={() => !isTBD(team) && setHoveredParticipant(team.name)}
                onMouseLeave={() => setHoveredParticipant(null)}
              >
                <div
                  className={`
                    flex items-center px-2.5 py-1.5  rounded
                    ${team.winner ? 'border-l-2 border-l-violet-500/50' : ''}
                    ${!isTBD(team) && seed.status !== 'SCORE_DONE' ? 'cursor-pointer' : ''}
                    ${
                      team.name === hoveredParticipant
                        ? 'bg-primary/50'
                        : isTBD(team)
                        ? 'bg-gray-800/50'
                        : 'bg-[#1a1f2e] hover:bg-[#1e2538]'
                    }
                    relative
                  `}
                >
                  {team.avatar ? (
                    <div className="relative">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.avatar}`}
                        alt={team.name}
                        className="w-5 h-5 rounded-lg object-cover shrink-0 ring-1 ring-black/10"
                      />
                      {team.winner && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full ring-1 ring-black/20" />
                      )}
                    </div>
                  ) : (
                    <div
                      className={`
                      w-5 h-5 rounded-full flex items-center justify-center shrink-0
                      ${
                        team.winner
                          ? 'bg-gradient-to-br from-violet-500/20 to-violet-600/20 ring-1 ring-violet-500/30'
                          : 'bg-gray-800'
                      }
                    `}
                    >
                      <span
                        className={`
                        text-xs
                        ${team.winner ? 'text-white' : 'text-gray-400'}
                      `}
                      >
                        {isTBD(team) ? '?' : team.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 ml-2">
                    <span
                      className={`
                      text-xs truncate flex-1
                      ${team.winner ? 'text-white font-medium' : 'text-gray-300/50'}
                      ${isTBD(team) ? 'italic text-gray-500' : ''}
                      ${isHovered && !isTBD(team) ? 'text-gray-200' : ''}
                    `}
                    >
                      {team.name}
                    </span>
                    {team.winner && !isTBD(team) && (
                      <Crown
                        size={12}
                        className={`
                        shrink-0
                        ${isHovered ? 'text-yellow-400' : 'text-yellow-500/80'}
                      `}
                      />
                    )}
                  </div>
                  <span
                    className={`
                    text-xs min-w-[20px] text-right ml-2 font-medium
                    ${team.winner ? 'text-white' : 'text-gray-300/50'}
                    ${isHovered && !isTBD(team) ? 'text-gray-300' : ''}
                  `}
                  >
                    {team.score || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Championship Banner - only for finals winner */}
          {seed.teams.some((team) => team.winner) &&
            getRoundTitle(roundIndex, rounds.length).props?.children === 'Finals' && (
              <div className="mt-3 relative group">
                <div
                  className="absolute -left-2 -right-2 h-12 bg-gradient-to-r from-yellow-600/90 to-amber-500/90 
                    shadow-lg transform hover:scale-[1.02] transition-all duration-300
                    flex items-center justify-between px-4
                    before:absolute before:left-0 before:top-full before:border-t-[8px] before:border-l-[8px] 
                    before:border-t-yellow-800 before:border-l-transparent
                    after:absolute after:right-0 after:top-full after:border-t-[8px] after:border-r-[8px] 
                    after:border-t-amber-800 after:border-r-transparent"
                >
                  <div className="flex items-center gap-2">
                    <Trophy
                      size={16}
                      className="text-white group-hover:rotate-12 transition-transform duration-300"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-medium uppercase tracking-wider">
                        Tournament
                      </span>
                      <span className="text-white text-sm font-bold">Champion</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-yellow-100/80 text-xs">Winner</span>
                      <span className="text-white text-sm font-bold">
                        {seed.teams.find((team) => team.winner)?.name}
                      </span>
                    </div>
                    <Crown size={18} className="text-white animate-pulse" />
                  </div>
                </div>

                {/* Shine effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full
                    animate-shine"
                />
              </div>
            )}
        </SeedItem>
      </Seed>
    );
  };

  const ScoreDialog = () => {
    const [scores, setScores] = useState({ score1: '', score2: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (!dialogOpen) {
        setScores({ score1: '', score2: '' });
        setError('');
      }
    }, [dialogOpen]);

    if (!dialogOpen || !selectedMatch) return null;

    const handleSubmit = async () => {
      try {
        setError('');
        setIsSubmitting(true);

        const score1 = parseInt(scores.score1);
        const score2 = parseInt(scores.score2);

        if (isNaN(score1) || isNaN(score2)) {
          throw new Error('Please enter valid scores');
        }
        if (score1 === score2) {
          throw new Error('Scores cannot be equal');
        }

        const success = await updateMatchScore(selectedMatch.id, score1, score2);

        if (success) {
          setDialogOpen(false);
        } else {
          throw new Error('Failed to update match score');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-3xl bg-gray-800 p-8 shadow-xl">
            <Dialog.Title className="text-2xl font-bold text-white mb-6 text-center">
              Enter Match Score
            </Dialog.Title>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between items-center space-x-4">
              {selectedMatch.teams.map((team, index) => (
                <div key={index} className="flex-1 text-center">
                  <div className="relative inline-block">
                    {team.avatar ? (
                      <img
                        src={team.avatar}
                        alt={team.name}
                        className="w-20 h-20 rounded-[1.5rem] object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-[1.5rem] bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl text-gray-400">
                          {team.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {isTeamTournament ? 'TEAM' : 'PLAYER'} {index + 1}
                  </p>
                  <p className="font-semibold text-white">{team.name}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <input
                type="number"
                value={scores.score1}
                onChange={(e) => setScores((prev) => ({ ...prev, score1: e.target.value }))}
                className="w-16 h-12 bg-gray-700 text-white text-center text-2xl font-bold rounded"
                placeholder="0"
              />
              <div className="text-white text-3xl font-bold mx-2">:</div>
              <input
                type="number"
                value={scores.score2}
                onChange={(e) => setScores((prev) => ({ ...prev, score2: e.target.value }))}
                className="w-16 h-12 bg-gray-700 text-white text-center text-2xl font-bold rounded"
                placeholder="0"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Score'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full h-full">
        {loading ? (
          <div messages={['Loading tournament bracket...']} />
        ) : error ? (
          <div className="min-h-[400px] flex items-center justify-center text-gray-400">
            {error}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Bracket
              rounds={rounds}
              renderSeedComponent={(props) => (
                <CustomSeed
                  key={`${props.seedIndex}-${props.roundIndex}`} // Add key here
                  {...props}
                  hoveredParticipant={hoveredParticipant}
                  setHoveredParticipant={setHoveredParticipant}
                />
              )}
              roundClassName="flex-none"
              lineColor={hoveredParticipant ? 'rgba(75, 85, 99, 0.1)' : 'rgba(75, 85, 99, 0.2)'}
              lineWidth={1}
            />

            <ScoreDialog />
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentBracket;
 