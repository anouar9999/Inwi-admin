import React, { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';

const FloatingLabelInput = ({ label, type = 'text', icon: Icon, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-4    text-white ">
      <input
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        value={value}
        color="white"
        placeholder={`Enter Your ${label}`}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(true)}
        className="w-full bg-gray-800 text-white rounded-xl text-sm text-[10pt] angular-cut px-6 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 peer"
      />
      <label
        className={`absolute transition-all text-[12pt] font-custom text-gray-300 leading-tight tracking-widest duration-200 pointer-events-none text-gray-400
          ${
            isFocused || value
              ? '-translate-y-7 top-5 left-4 text-xs rounded-md bg-gray-800 px-2'
              : 'text-base left-6 top-1/2 -translate-y-1/2'
          }`}
      >
        {label}
      </label>

      {type === 'password' ? (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      ) : Icon ? (
        <Icon size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      ) : null}
    </div>
  );
};

export default FloatingLabelInput;
