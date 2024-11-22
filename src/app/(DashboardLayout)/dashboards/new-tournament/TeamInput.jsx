import React from 'react';
import { Users } from 'lucide-react';

const TournamentTeamsInput = ({ value, onChange, competitionType }) => {
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Remove non-numeric characters
    newValue = newValue.replace(/[^0-9]/g, '');
    
    // Enforce maximum of 3 digits (999)
    if (newValue.length > 3) {
      newValue = newValue.slice(0, 3);
    }
    
    // Enforce minimum of 2 teams
    if (newValue && Number(newValue) < 2) {
      newValue = '2';
    }
    
    // Common tournament bracket sizes
    if (newValue) {
      const num = Number(newValue);
      const bracketSizes = [2, 4, 8, 16, 32, 64, 128];
      const nearestSize = bracketSizes.reduce((prev, curr) => 
        Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev
      );
      newValue = nearestSize.toString();
    }

    onChange({
      target: {
        name: 'nombre_maximum',
        value: newValue
      }
    });
  };

  const recommendedSlots = {
    'Valorant': {
      sizes: [8, 16, 32],
      description: 'Tournoi tactique 5v5'
    },
    'Free Fire': {
      sizes: [12, 24, 48],
      description: 'Battle Royale'
    }
  };

  const getRecommendedSizes = (type) => {
    return recommendedSlots[type]?.sizes || [8, 16, 32];
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">
        Nombre Maximum d Équipes <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <input
          type="text"
          name="nombre_maximum"
          value={value}
          onChange={handleInputChange}
          className="w-full bg-gray-800 pl-12 pr-24 py-3 rounded-lg text-xl font-bold"
          placeholder={competitionType ? getRecommendedSizes(competitionType)[0].toString() : '16'}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
          <Users className="w-5 h-5" />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          équipes
        </div>
      </div>

      {/* Quick select buttons for common bracket sizes */}
      <div className="flex flex-wrap gap-2 mt-3">
        {(competitionType ? getRecommendedSizes(competitionType) : [8, 16, 32, 64]).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleInputChange({ target: { value: num.toString() } })}
            className={`px-4 py-1.5 text-sm  angular-cut transition-colors ${
              Number(value) === num 
                ? 'bg-primary text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {num} équipes
          </button>
        ))}
      </div>

      {/* Game-specific recommendations */}
      {competitionType && recommendedSlots[competitionType] && (
        <div className="mt-2 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">
              {competitionType}:
            </span>
            <span className="text-sm text-gray-400">
              {recommendedSlots[competitionType].description}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <p>Tailles de tournoi recommandées:</p>
            <ul className="list-disc list-inside mt-1">
              <li>{recommendedSlots[competitionType].sizes[0]} équipes - Petit tournoi</li>
              <li>{recommendedSlots[competitionType].sizes[1]} équipes - Tournoi moyen</li>
              <li>{recommendedSlots[competitionType].sizes[2]} équipes - Grand tournoi</li>
            </ul>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default TournamentTeamsInput;