import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = "Search participants..." }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative flex-1">
      {/* Search Icon */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 
        ${isFocused ? 'text-blue-400' : 'text-gray-400'}`}>
        <Search className="w-5 h-5" />
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full pl-12 pr-10 py-3 bg-gray-800/80 text-white 
           outline-none transition-all duration-200
          placeholder-gray-500  angular-cut
         `}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
            text-gray-400 hover:text-gray-300 hover:bg-gray-700/50
            transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;