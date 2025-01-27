"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from "./layout/vertical/header/Header";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
 const metadata = {
  title: 'Dashboard | Gaming Tournament Platform',
  description: 'View real-time statistics and insights about tournaments, users, and team performance.',
}
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

  const triggerGlow = () => {
    setShowGlow(true);
  };

  return (
    <div className="relative flex flex-col min-h-screen text-white font-pilot">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://wallpaper.forfun.com/fetch/90/90bcf5ee927d2ac4487970ebb937bef2.jpeg"
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="Background"
          priority
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-10"></div>
      
      {/* Tall, Faded Green Glow Frame */}
      <div className={`fixed inset-0 z-[999] pointer-events-none transition-opacity duration-1000 ${showGlow ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top edge */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-green-500 via-green-500/20 to-transparent"></div>
        {/* Bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-500 via-green-500/20 to-transparent"></div>
        {/* Left edge */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-green-500 via-green-500/20 to-transparent"></div>
        {/* Right edge */}
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-green-500 via-green-500/20 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-30 flex flex-col min-h-screen">
        <Header setIsMobileOpen={setIsMobileOpen} />
        <div className="flex flex-1 pt-16 md:pt-20">
          <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
          <main className="flex-1 md:ml-24 overflow-y-auto ">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;