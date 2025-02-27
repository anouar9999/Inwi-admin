import React from 'react';
import { Check } from 'lucide-react';

const CompetitionTypeSelector = ({
  competitionTypes,
  selectedType,
  onChange
}) => {
  // Add debug output to help diagnose issues
  console.log('CompetitionTypeSelector - selectedType:', selectedType);
  
  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold">
        Type de compétition <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-8">
        {Object.entries(competitionTypes).map(([type, data]) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              // Create event with proper target structure
              const event = {
                target: {
                  name: 'competition_type',
                  value: data.title,
                  type: 'text' // Adding type to match other form elements
                }
              };
              
              // Debug the click event
              console.log('Competition type selected:', data.title);
              console.log('Event being passed to onChange:', event);
              
              // Pass the synthetic event to onChange
              onChange(event);
            }}
            className={`relative h-28 rounded-lg angular-cut overflow-hidden transition-all duration-300 
              ${
                selectedType === data.title
                  ? 'scale-[1.02]'
                  : 'hover:scale-[1.01]'
              }`}
          >
            <div className="absolute inset-0">
              <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
              <div
                className={`absolute inset-0 ${
                  selectedType === data.title
                    ? 'bg-gradient-to-b from-black/40 to-blue-900/40'
                    : 'bg-gradient-to-b from-black/60 to-gray-900/60'
                }`}
              />
            </div>

            <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-xl font-bold text-white">{data.title}</h3>
            </div>

            {selectedType === data.title && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Hidden input field to ensure the value is part of the form */}
      <input 
        type="hidden"
        name="competition_type"
        value={selectedType || ''}
      />
    </div>
  );
};

export default CompetitionTypeSelector;