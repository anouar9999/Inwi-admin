'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Settings,
  Home,
  Users,
  ChevronRight,
  Gamepad2,
  X,
  Group,
  UsersRound,
  UserRound,
} from 'lucide-react';
import CustomButton from '@/app/(DashboardLayout)/CustomButton';
import { Profile } from './SidebarProfile/Profile';
import { Tooltip } from '@mui/material';

const menuItems = [
  { id: 1, icon: Home, name: 'Home', href: '/' },
  { id: 2, icon: Gamepad2, name: 'tournaments', href: '/dashboards/tournaments' },
  { id: 3, icon: UserRound, name: 'Users', href: '/dashboards/users' },
  { id: 3, icon: UsersRound, name: 'teams', href: '/dashboards/teams' },
  // { id: 4, icon: Settings, name: 'Settings', href: '/dashboards/settings' },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const isOpen = isMobile ? isMobileOpen : isExpanded;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full ${
          isOpen ? 'w-full md:w-64' : 'w-16'
        } md:left-5 md:top-24 md:h-[calc(100vh-96px)] bg-gray-900 bg-opacity-80  flex flex-col items-center py-6 rounded-none md:rounded-2xl shadow-lg transition-all duration-300 z-50 ${
          isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        {isMobile && isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Menu items container with added top padding */}
        <div className="flex flex-col items-start space-y-6 mb-auto w-full px-3 pt-12">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
               // eslint-disable-next-line react/jsx-key
               <Tooltip color='red' title={item.name} placement="right">
              <Link
                href={item.href}
                key={item.id}
                className="w-full"
                onClick={() => isMobile && setIsMobileOpen(false)}
              >
                <div
                  className={`relative flex items-center justify-start w-full h-10 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-primary  shadow-md' : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'} ml-2`}
                    strokeWidth={2}
                  />
                  {isOpen && (
                    <span className={`ml-3 text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {item.name}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute right-0 w-1.5 h-5 bg-[#151c2f] rounded-l-full"></div>
                  )}
                </div>
              </Link>
              </Tooltip>
            );
          })}

          {/* New Tournament Button (visible only when open) */}
          {isOpen && (
            <CustomButton
              title={'New Tournament'}
              href={'/dashboards/new-tournament'}
              className="text-sm md:text-base w-full"
            />
          )}
        </div>

        {/* Profile (visible only when open) */}
        {isOpen && (
          <div className="mt-auto mb-4 w-full px-3">
            <Profile />
          </div>
        )}

        {/* {!isMobile && (
          <button
            onClick={handleToggle}
            className="mt-auto p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronRight
              className={`w-6 h-6 text-white transform transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        )} */}
      </aside>
    </>
  );
};

export default Sidebar;
