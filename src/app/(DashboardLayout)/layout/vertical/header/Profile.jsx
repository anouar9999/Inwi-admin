import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('adminUsername');
    const storedAdminId = localStorage.getItem('adminId');
    
    if (!storedUsername || !storedAdminId) {
      router.push('/auth/auth1/login');
    } else {
      setAdminName(storedUsername);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('adminSessionToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminUsername');
    router.push('/auth/auth1/login');
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (!adminName) {
    return null;
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div 
        className="flex items-center space-x-3 rounded-lg py-2 px-4 cursor-pointer transition-colors duration-200 angular-cut"
        onClick={toggleDropdown}
      >
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
        <img 
          src="/images/profile/user-1.jpg" 
          alt="Profile" 
          className="w-8 h-8 rounded-full"
        />
        </div>
        <div className="text-white">
          <p className="text-sm font-semibold">{adminName}</p>
          <p className="text-xs text-primary">Admin</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-300  transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
              role="menuitem"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
        <style jsx global>{`
        .angular-cut {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut::before,
        .angular-cut::after {
          content: '';
          position: absolute;
          background-color: #374151;
        }
        .angular-cut::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut::after {
          bottom: 0;
          left: 0;
          width: 0px;
          height: 2px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
        .angular-cut-button {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut-button::before,
        .angular-cut-button::after {
          content: '';
          position: absolute;
          background-color: #78350f;
        }
        .angular-cut-button::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut-button::after {
          bottom: 0;
          left: 0;
          width: 0px;
          height: 2px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
      `}</style>
    </div>
  );
};

export default ProfileDropdown;