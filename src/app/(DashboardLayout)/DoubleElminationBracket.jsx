import React, { useState, useEffect } from 'react';
import { Bracket, Seed, SeedItem } from 'react-brackets';
import { Crown, Loader2, Trophy } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const DoubleEliminationBracket = ({ tournamentId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [hoveredParticipant, setHoveredParticipant] = useState(null);
  const [isTeamTournament, setIsTeamTournament] = useState(false);
  const [brackets, setBrackets] = useState({
    winners: [],
    losers: [],
    finals: []
  });

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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tournament_id: tournamentId }),
        }
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

    const winnerMatches = data.matches.filter(m => m.bracket_type === 'winners');
    const loserMatches = data.matches.filter(m => m.bracket_type === 'losers');
    const finalMatches = data.matches.filter(m => m.bracket_type === 'grand_finals');

    const formattedBrackets = {
      winners: formatBracket(winnerMatches, data.total_rounds, 'Winners'),
      losers: formatLosersBracket(loserMatches),
      finals: formatBracket(finalMatches, 1, 'Finals')
    };

    setBrackets(formattedBrackets);
  };

  const formatLosersBracket = (matches) => {
    const rounds = [];
    
    // Group matches by round
    const matchesByRound = {};
    matches.forEach(match => {
      const round = parseInt(match.round);
      if (round <= 2) {
        if (!matchesByRound[round]) {
          matchesByRound[round] = [];
        }
        matchesByRound[round].push(match);
      }
    });

    // Process regular rounds
    [1, 2].forEach(roundNum => {
      const roundMatches = matchesByRound[roundNum] || [];
      roundMatches.sort((a, b) => parseInt(a.position) - parseInt(b.position));

      const expectedMatches = roundNum === 1 ? 2 : 1;
      const matchesForRound = [...roundMatches];
      
      while (matchesForRound.length < expectedMatches) {
        matchesForRound.push({
          id: `empty-${roundNum}-${matchesForRound.length}`,
          status: 'SCHEDULED',
          teams: [
            { name: 'TBD', score: 0, winner: false },
            { name: 'TBD', score: 0, winner: false }
          ]
        });
      }

      rounds.push({
        title: `Losers Round ${roundNum}`,
        seeds: matchesForRound.map(match => ({
          id: match.id,
          status: match.status,
          teams: (match.teams || [
            { name: 'TBD', score: 0, winner: false },
            { name: 'TBD', score: 0, winner: false }
          ]).map(team => ({
            ...team,
            id: team.id || `team-${Math.random()}`
          }))
        }))
      });
    });

    // Add winner display round
    const lastRound = matchesByRound[2] || [];
    if (lastRound.length > 0) {
      const winner = lastRound[0].teams?.find(team => team.winner) || { name: 'TBD', score: 0 };
      rounds.push({
        title: 'Losers Winner',
        seeds: [{
          id: 'loser-bracket-winner',
          teams: [{
            ...winner,
            id: winner.id || `team-${Math.random()}`
          }]
        }]
      });
    }

    return rounds;
  };

  const formatBracket = (matches, totalRounds, bracketName) => {
    const rounds = [];
    
    // Group matches by round
    const matchesByRound = {};
    matches.forEach(match => {
      const round = parseInt(match.round);
      if (!matchesByRound[round]) matchesByRound[round] = [];
      matchesByRound[round].push(match);
    });

    // Format regular rounds
    for (let round = 1; round <= totalRounds; round++) {
      const roundMatches = matchesByRound[round] || [];
      roundMatches.sort((a, b) => parseInt(a.position) - parseInt(b.position));
      
      // Calculate expected matches
      const expectedMatches = Math.pow(2, totalRounds - round);
      
      // Fill with TBD matches if needed
      while (roundMatches.length < expectedMatches) {
        roundMatches.push({
          id: `empty-${round}-${roundMatches.length}`,
          status: 'SCHEDULED',
          teams: [
            { name: 'TBD', score: 0, winner: false },
            { name: 'TBD', score: 0, winner: false }
          ]
        });
      }

      rounds.push({
        title: `${bracketName} Round ${round}`,
        seeds: roundMatches.map(match => ({
          id: match.id,
          status: match.status,
          teams: (match.teams || [
            { name: 'TBD', score: 0, winner: false },
            { name: 'TBD', score: 0, winner: false }
          ]).map(team => ({
            ...team,
            id: team.id || `team-${Math.random()}`
          }))
        }))
      });
    }

    // Add winner display round
    const lastRound = matchesByRound[totalRounds] || [];
    if (lastRound.length > 0) {
      const winner = lastRound[0].teams?.find(team => team.winner) || { name: 'TBD', score: 0 };
      rounds.push({
        title: `${bracketName} Winner`,
        seeds: [{
          id: `winner-${bracketName}`,
          teams: [{
            ...winner,
            id: winner.id || `team-${Math.random()}`
          }]
        }]
      });
    }

    return rounds;
  };

  const updateMatchScore = async (matchId, score1, score2) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-match-score.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            match_id: matchId,
            score1,
            score2,
          }),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Handle auto-progression if it occurred
        if (result.auto_progressed) {
          console.log('Match was automatically progressed');
        }
        await fetchMatches();
        return true;
      }
      throw new Error(result.message || 'Failed to update score');
    } catch (err) {
      console.error('Error updating score:', err);
      return false;
    }
  };
  const CustomSeed = ({ seed, roundIndex, seedIndex }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isTBD = (team) => !team.name || team.name === 'TBD';
    const isWinnerRound = seed.teams.length === 1; // For the winner display round

    if (isWinnerRound) {
      return (
        <Seed>
          <SeedItem>
            <div className="bg-[#1a1f2e] rounded p-2 relative">
              <div className="flex items-center gap-2">
                {seed.teams[0].avatar ? (
                  <img src={seed.teams[0].avatar} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-400">
                      {seed.teams[0].name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <span className="text-white font-medium">
                  {seed.teams[0].name}
                </span>
                <Crown className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          </SeedItem>
        </Seed>
      );
    }
    const handleMatchClick = (seed, team) => {
      if (!isTBD(team) && seed.status === 'SCHEDULED') {
        setSelectedMatch({
          id: seed.id,
          teams: seed.teams.map(t => ({
            id: t.id,
            name: t.name,
            avatar: t.avatar,
            score: t.score
          }))
        });
        setDialogOpen(true);
      }
    };

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
                  relative mb-0.5 last:mb-0 transition-all duration-300
                  ${isHovered && !isTBD(team) ? 'transform scale-[1.02]' : ''}
                  ${team.winner ? 'z-10' : 'z-0'}
                `}
                onMouseEnter={() => !isTBD(team) && setHoveredParticipant(team.name)}
                onMouseLeave={() => setHoveredParticipant(null)}
                onClick={() => handleMatchClick(seed, team)}
              >
                <div className={`
                  flex items-center px-2.5 py-1.5 rounded
                  ${team.winner ? 'border-l-2 border-l-violet-500/50' : ''}
                  ${!isTBD(team) && seed.status !== 'SCORE_DONE' ? 'cursor-pointer' : ''}
                  ${team.name === hoveredParticipant ? 'bg-primary/50' : 
                    isTBD(team) ? 'bg-gray-800/50' : 'bg-[#1a1f2e] hover:bg-[#1e2538]'}
                `}>
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center shrink-0
                    ${team.winner ? 'bg-gradient-to-br from-violet-500/20 to-violet-600/20' : 
                      'bg-gray-800'}
                  `}>
                    <span className={`text-xs ${team.winner ? 'text-white' : 'text-gray-400'}`}>
                      {isTBD(team) ? '?' : team.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 ml-2">
                    <span className={`
                      text-xs truncate flex-1
                      ${team.winner ? 'text-white font-medium' : 'text-gray-300/50'}
                      ${isTBD(team) ? 'italic' : ''}
                    `}>
                      {team.name}
                    </span>
                    {team.winner && <Crown size={12} className="text-yellow-500/80" />}
                  </div>
                  
                  <span className={`
                    text-xs min-w-[20px] text-right ml-2 font-medium
                    ${team.winner ? 'text-white' : 'text-gray-300/50'}
                  `}>
                    {team.score || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
    <div className="min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="min-h-[400px] flex items-center justify-center text-gray-400">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Winners Bracket */}
          <div className="overflow-x-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Winners Bracket</h2>
            <Bracket
              rounds={brackets.winners}
              renderSeedComponent={CustomSeed}
              roundClassName="flex-none"
              lineColor="rgba(75, 85, 99, 0.2)"
              lineWidth={1}
            />
          </div>

          {/* Losers Bracket */}
          <div className="overflow-x-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Losers Bracket</h2>
            <Bracket
              rounds={brackets.losers}
              renderSeedComponent={CustomSeed}
              roundClassName="flex-none"
              lineColor="rgba(75, 85, 99, 0.2)"
              lineWidth={1}
            />
          </div>

          {/* Finals */}
          {brackets.finals.length > 0 && (
            <div className="overflow-x-auto">
              <h2 className="text-xl font-bold mb-4 text-white">Grand Finals</h2>
              <Bracket
                rounds={brackets.finals}
                renderSeedComponent={CustomSeed}
                roundClassName="flex-none"
                lineColor="rgba(75, 85, 99, 0.2)"
                lineWidth={1}
              />
            </div>
          )}
        </div>
      )}
              <ScoreDialog />

    </div>
  );
}
export default DoubleEliminationBracket;


