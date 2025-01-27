import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Function to get initials from username
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to generate a consistent color based on username
  const generateColor = (name) => {
    const colors = [
      'bg-gray-600', 'bg-green-600', 'bg-yellow-600', 
      'bg-red-600', 'bg-purple-600', 'bg-pink-600'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    const storedUserType = localStorage.getItem('userType');
    const storedAvatarUrl = localStorage.getItem('avatarUrl');
    console.log(storedAvatarUrl)
    if (!storedUsername || !storedUserId) {
      router.push('/auth/auth1/login');
    } else {
      setUserName(storedUsername);
      setUserType(storedUserType || 'User');
      setAvatarUrl(storedAvatarUrl);
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
    localStorage.removeItem('userSessionToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('avatarUrl');
    router.push('/auth/auth1/login');
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (!userName) {
    return null;
  }

  const avatarColor = generateColor(userName);
  const userInitials = getInitials(userName);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div 
        className="flex items-center space-x-3 rounded-lg py-2 px-4 cursor-pointer transition-colors duration-200 angular-cut"
        onClick={toggleDropdown}
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          {avatarUrl ==null ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${avatarUrl}`}
              alt="Profile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full ${avatarColor} flex items-center justify-center text-white text-sm font-medium`}>
              {userInitials}
            </div>
          )}
        </div>
        <div className="text-white">
          <p className="text-sm font-semibold capitalize">{userName}</p>
         
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </div>

      {isOpen && (
        <div className="absolute right-0  mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
              role="menuitem"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 " aria-hidden="true" />
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
      `}</style>
    </div>
  );
};

export default ProfileDropdown;