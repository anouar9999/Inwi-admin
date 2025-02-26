'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Profile from './Profile';
import { Stack } from '@mui/material';
import CustomButton from '@/app/(DashboardLayout)/CustomButton';
import Image from 'next/image';

const Header = ({ setIsMobileOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  const toggleMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 md:h-20 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg flex items-center justify-between px-4 md:px-12 z-50">
      <div className={`relative ${isMobile ? 'mx-auto' : ''} w-32 h-32 md:w-32 md:h-20 `}>
        <Image
          src="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg"
          alt="Logo"
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
      <div className="flex items-center space-x-4">
        {!isMobile && (
          <>
            <CustomButton
              title={'New Tournament'}
              href={'/dashboards/new-tournament'}
              className="text-sm md:text-base"
              color='primary'
            />
            <Stack spacing={1} direction="row" alignItems="center">
              <Profile />
            </Stack>
          </>
        )}
        {isMobile && (
          <button className="text-white" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;