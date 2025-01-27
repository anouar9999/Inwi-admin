"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from "./layout/vertical/header/Header";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import CustomButton from './CustomButton';
import { Home } from 'lucide-react';

const Layout = ({ children }) => {
  const [showGlow, setShowGlow] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (showGlow) {
      timer = setTimeout(() => setShowGlow(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [showGlow]);

  const triggerGlow = () => setShowGlow(true);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-900">
      {/* Background Image (1/2 of screen height) */}
      <div className="absolute top-0 left-0 right-0 h-1/3 z-0 overflow-hidden">
        <Image
          src="https://wallpaper.forfun.com/fetch/90/90bcf5ee927d2ac4487970ebb937bef2.jpeg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gray-900 bg-opacity-70 z-10"></div>

      {/* Glow Effect */}
      {showGlow && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-green-500 opacity-20 transition-opacity duration-1000"></div>
      )}

      {/* Header Section */}
      <div className="relative z-20">
        <Header setIsMobileOpen={setIsMobileOpen} />

        {/* Welcome Message */}
        <div className="mt-32 pl-4 sm:pl-8 md:pl-16">
          <h2 className="text-xl font-bold text-white">
            Welcome Back, {typeof window !== 'undefined' ? localStorage.getItem('username') : 'User'}!
          </h2>
        </div>

        {/* Navigation Tabs */}
        <nav className="mt-12 pl-4 sm:pl-8 md:pl-16">
          <ul className="flex space-x-4 text-sm text-gray-300 overflow-x-auto">
            {/* <li><CustomButton title="Home" icon={Home}  href={'/'}   /></li> */}
            <li><CustomButton title="My Tournaments" href={'/dashboards/my-tournaments'} /></li>
            <li><CustomButton title="My Teams" href={'/dashboards/teams'} /></li>
            <li><CustomButton title="Tournaments"href={'/dashboards/tournaments'}  /></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col mt-8 pl-4 sm:pl-8 md:pl-16 z-30 mb-2">
        {children}
      </main>

      {/* Sidebar (Optional) */}
      {/* <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} /> */}
    </div>
  );
};

export default Layout;
