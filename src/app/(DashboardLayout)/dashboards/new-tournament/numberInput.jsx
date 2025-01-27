import React from 'react';
import { DollarSign } from 'lucide-react';

const PrizePoolInput = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Remove non-numeric characters and spaces
    newValue = newValue.replace(/[^0-9]/g, '');
    
    // Enforce maximum of 6 digits (999,999)
    if (newValue.length > 6) {
      newValue = newValue.slice(0, 6);
    }
    
    // Enforce minimum step of 1000
    if (newValue && Number(newValue) < 1000) {
      newValue = '1000';
    }
    
    // Round to nearest 1000
    if (newValue) {
      const numValue = Math.round(Number(newValue) / 1000) * 1000;
      newValue = numValue.toString();
    }

    onChange({
      target: {
        name: 'prize_pool',
        value: newValue
      }
    });
  };

  const formatDisplayValue = (val) => {
    if (!val) return '';
    return Number(val).toLocaleString('fr-FR');
  };

  // Common prize pool amounts
  const quickSelectAmounts = [1000, 5000, 10000, 25000, 50000];

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2 ">Prize Pool</label>
      
      <div className="flex relative">
        <div className="flex-grow relative">
          <input
            type="text"
            name="prize_pool"
            value={formatDisplayValue(value)}
            onChange={handleInputChange}
            className="w-full bg-gray-800 pl-12 pr-24 py-3 angular-cut focus:ring-2 
                     focus:ring-blue-500 focus:outline-none text-xl font-bold"
            placeholder="1 000"
          />
          {/* Left Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary ">
            <DollarSign className="w-5 h-5 " />
          </div>
          {/* Right Text */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            MAD
          </div>
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {quickSelectAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handleInputChange({ target: { value: amount.toString() } })}
            className={`px-3 py-1 text-sm  angular-cut transition-colors ${
              Number(value) === amount 
                ? 'bg-primary text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {amount.toLocaleString('fr-FR')} MAD
          </button>
        ))}
      </div>

 

  
  
    </div>
  );
};

export default PrizePoolInput;