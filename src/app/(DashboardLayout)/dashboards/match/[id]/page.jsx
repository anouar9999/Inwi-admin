"use client"
import React, { useState, useEffect } from 'react';
import { Share2, Trophy } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

const ScoreInputDialog = ({ isOpen, closeDialog, onSave, teamA, teamB }) => {
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const numScoreA = parseInt(scoreA) || 0;
    const numScoreB = parseInt(scoreB) || 0;
    if (numScoreA > numScoreB) setWinner('A');
    else if (numScoreB > numScoreA) setWinner('B');
    else setWinner(null);
  }, [scoreA, scoreB]);

  const handleScoreChange = (team, value) => {
    if (value === '' || /^\d+$/.test(value)) {
      team === 'A' ? setScoreA(value) : setScoreB(value);
    }
  };

  const handleSave = () => {
    onSave(parseInt(scoreA) || 0, parseInt(scoreB) || 0);
    closeDialog();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={closeDialog} className="relative z-50">
          <motion.div 
            className="fixed inset-0 bg-black/50" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel 
              as={motion.div}
              className="mx-auto max-w-2xl w-full rounded-3xl bg-gray-800 p-8 shadow-xl angular-cut"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dialog.Title className="text-2xl font-bold text-white mb-6 text-center">Enter Match Score</Dialog.Title>
              <div className="flex justify-between items-center space-x-4">
                {[{ team: 'A', data: teamA, score: scoreA }, { team: 'B', data: teamB, score: scoreB }].map(({ team, data, score }, index) => (
                  <React.Fragment key={team}>
                    <motion.div 
                      className={`flex-1 text-center ${winner === team ? 'scale-105 transition-transform duration-300' : ''}`}
                      animate={winner === team ? { scale: 1.05 } : { scale: 1 }}
                    >
                      <div className="relative inline-block">
                          <img src={data.logo} alt={data.name} className="w-20 h-20 object-contain rounded-[1.5rem]" />
                        <AnimatePresence>
                          {winner === team && (
                            <motion.div 
                              className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Trophy size={18} className="text-gray-800" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">TEAM {team}</p>
                      <p className="font-semibold text-white">{data.name}</p>
                    </motion.div>
                    {index === 0 && (
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={scoreA}
                          onChange={(e) => handleScoreChange('A', e.target.value)}
                          className="w-16 h-12 rounded bg-gray-700 border border-gray-600 text-white text-center text-2xl font-bold angular-cut"
                          placeholder="0"
                        />
                        <div className="text-white text-3xl font-bold mx-2">:</div>
                        <input
                          type="text"
                          value={scoreB}
                          onChange={(e) => handleScoreChange('B', e.target.value)}
                          className="w-16 h-12 rounded bg-gray-700 border border-gray-600 text-white text-center text-2xl font-bold angular-cut"
                          placeholder="0"
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <motion.button
                  onClick={handleSave}
                  className="px-8 py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 angular-cut-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Final Score
                </motion.button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};


const MatchDetailsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });

  const handleSaveScores = (scoreA, scoreB) => {
    setScores({ teamA: scoreA, teamB: scoreB });
  };

  const teamA = {
    name: 'TEAM LIQUID PRO',
    logo: 'https://img.freepik.com/vecteurs-libre/modele-logo-tigre-sport_23-2148005750.jpg?t=st=1724771924~exp=1724775524~hmac=02a693feea337b8be0c78772cf8397a56bb76e621bca9373bf2f2e2abc39a191&w=740',
    players: ['MAYHODO', 'BOOST_SMASH', 'HEAX', 'JUSTINE']
  };

  const teamB = {
    name: 'FRANCISCO SHOCK',
    logo: 'https://img.freepik.com/vecteurs-premium/embleme-plage-logo-vector-design-graphique-palmier_593008-173.jpg?w=740',
    players: ['ZAGIA', 'PIQUE', 'HEYHOOOOOOOO', 'GOVAAAA']
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header (kept from your existing code) */}
        <header className="text-center mb-8">
          <img src="/images/backgrounds/LOL_Logo_Rendered_Hi-Res_onblue-4x3-removebg-preview.png" alt="" className='w-1/6 m-auto' />
          <p className="text-2xl">Long night run all day</p>
          <p className="text-sm text-gray-400">Should be finished in 2 days from now</p>
        </header>
<TeamComparisonSection/>
<PlayerListConnection/>
      
      </div>

      {/* ScoreInputDialog component (kept from your existing code) */}
      <ScoreInputDialog
        isOpen={isDialogOpen}
        closeDialog={() => setIsDialogOpen(false)}
        onSave={handleSaveScores}
        teamA={teamA}
        teamB={teamB}
      />

      {/* Styles (kept from your existing code) */}
      <style jsx global>{`
        .angular-cut {
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }
        .angular-cut-button {
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }
      `}</style>
    </div>
  );
};

export default MatchDetailsPage;

const TeamComparisonSection = () => {
  return (
    <div className=" text-white py-8 px-12 flex items-center justify-center mx-auto rounded-lg shadow-lg space-x-16">
      {/* Team A */}
      <div className="flex flex-col items-end text-left">
        <span className="text-xs font-semibold text-gray-400 tracking-wide text-right">TEAM A</span>
        <span className="text-xl font-bold">FORESTYFOX</span>
     
      </div>
      <img 
          src="https://img.freepik.com/vecteurs-premium/conception-du-logo-du-bar-sportif_339976-60551.jpg?w=740" 
          alt="FORESTYFOX logo" 
          className="w-14 h-14  rounded-[1.2rem]"
        />
      {/* VS */}
      <div className="text-4xl font-extrabold text-white">VS</div>
      <img 
          src="https://img.freepik.com/vecteurs-premium/graphique-insigne-embleme-logo-ligue-sportive-champion-lettre-etoile_15602-1477.jpg?w=740" 
          alt="RABBITS RUSH logo" 
          className="w-14 h-14 rounded-[1.2rem]"
        />
      {/* Team B */}
      <div className="flex flex-col items-start text-left">
        <span className="text-xs font-semibold text-gray-400 tracking-wide ">TEAM B</span>
        <span className="text-xl font-bold">RABBITS RUSH</span>
      
      </div>
    </div>
  );
};








const PlayerCard = ({ name, avatar, status }) => (
  <div className="bg-gray-800 rounded-lg p-3 flex items-center mb-2 angular-cut">
    <img src={avatar} style={{clipPath:'polygon(50% 0, 100% 20%, 100% 80%, 50% 100%, 50% 100%, 0 80%, 0 20%)'}} alt={name} className="w-10 h-10 rounded-[0.8rem] mr-3" />
    <div>
      <p className="font-semibold text-white">{name}</p>
      <p className="text-xs text-gray-400">{status}</p>
    </div>
  </div>
);

const PlayerListConnection = () => {
  const [timeLeft, setTimeLeft] = useState(35 * 60 + 43); // 35:43 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const teamA = [
    { name: 'MAYHODO', avatar: 'https://img.freepik.com/psd-gratuit/illustration-3d-avatar-ligne_23-2151303097.jpg?t=st=1725379973~exp=1725383573~hmac=1f36f61a7ed7ab4d2ed7a0a9276cb17f7bf7eb3702e7ab5dbfc4fb771082e753&w=740', status: 'Connected' },
    { name: 'BOOST_SMASH', avatar: 'https://img.freepik.com/photos-premium/hommes-3d-icone-dessin-anime-logo-mode-arriere-plan-pour-pensee-creative_762678-9508.jpg?w=740', status: 'Connected' },
    { name: 'HEAX', avatar: 'https://img.freepik.com/photos-premium/pose-personnage-animation-personnage-dessin-anime-3d_762678-8192.jpg?w=740', status: 'Connected' },
    { name: 'JUSTINE', avatar: 'https://img.freepik.com/photos-premium/hommes-3d-icone-dessin-anime-logo-mode-arriere-plan-pour-pensee-creative_762678-9666.jpg?w=740', status: 'Connected' },
  ];

  const teamB = [
    { name: 'ZAGIA', avatar: 'https://img.freepik.com/photos-premium/avatar-pour-entreprise-ressources_1254967-6696.jpg?w=740', status: 'Connected' },
    { name: 'PIQUE', avatar: 'https://img.freepik.com/photos-premium/personnage-dessin-anime-avatar-3d_113255-94227.jpg?w=740', status: 'Connected' },
    { name: 'HEYHOOOOOOOO', avatar: 'https://img.freepik.com/psd-gratuit/illustration-3d-avatar-ligne_23-2151303085.jpg?t=st=1725380145~exp=1725383745~hmac=ee3189891cfecff8828cb31fbcdc9282beff3309d9a4710815e2c57964255bda&w=740', status: 'Connected' },
    { name: 'GOVAAAA', avatar: 'https://img.freepik.com/photos-premium/gros-plan-personnage-dessin-anime-chemise-qui-dit_869640-244518.jpg?w=740', status: 'Connected' },
  ];

  return (
    <div className="bg-gray-900 p-6 flex justify-between">
      <div className="w-1/3">
        {teamA.map((player, index) => (
          <PlayerCard key={index} {...player} />
        ))}
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center">
        <button className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg mb-4 hover:bg-orange-600 transition duration-300">
          CONNECT TO THE GAME SERVER
        </button>
        <p className="text-gray-400 text-sm">Time left to connect: {formatTime(timeLeft)}</p>
      </div>
      <div className="w-1/3">
        {teamB.map((player, index) => (
          <PlayerCard key={index} {...player} />
        ))}
      </div>
    </div>
  );
};

