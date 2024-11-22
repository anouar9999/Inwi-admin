import React from 'react';
import { Users } from 'lucide-react';

const ParticipantInput = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Remove non-numeric characters
    newValue = newValue.replace(/[^0-9]/g, '');
    
    // Enforce maximum of 3 digits (999)
    if (newValue.length > 3) {
      newValue = newValue.slice(0, 3);
    }
    
    // Enforce minimum of 8 participants
    if (newValue && Number(newValue) < 8) {
      newValue = '8';
    }
    
    // Round to power of 2 (8, 16, 32, 64, 128, 256)
    if (newValue) {
      const num = Number(newValue);
      const powers = [8, 16, 32, 64, 128, 256];
      const nearestPower = powers.reduce((prev, curr) => 
        Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev
      );
      newValue = nearestPower.toString();
    }

    onChange({
      target: {
        name: 'nombre_maximum',
        value: newValue
      }
    });
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">Nombre Maximum de Participants</label>
      
      <div className="flex relative">
        <div className="flex-grow relative">
          <input
            type="text"
            name="nombre_maximum"
            value={value}
            onChange={handleInputChange}
            className="w-full bg-gray-800 pl-12 pr-32 py-3 angular-cut focus:ring-2 
                     focus:ring-blue-500 focus:outline-none text-xl font-bold"
            placeholder="32"
          />
          {/* Left Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
            <Users className="w-5 h-5" />
          </div>
          {/* Right Text */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            Participants
          </div>
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="flex gap-2 mt-2">
        {[8, 16, 32, 64, 128].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleInputChange({ target: { value: num.toString() } })}
            className={`px-4 py-1 text-sm  angular-cut transition-colors ${
              Number(value) === num 
                ? 'bg-primary text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

    

     
    </div>
  );
};

export default ParticipantInput;