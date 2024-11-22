"use client"
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomButton from '../(DashboardLayout)/CustomButton';

const GameLandingPage = () => {
  return (
    <div className="relative text-white min-h-screen bg-cover bg-center" style={{backgroundImage: "url('https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77700860580.jpg')"}}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 container mx-auto px-4">
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center py-4"
        >
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center"
          >
            <h1 className="text-4xl font-custom">GAMIUS</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-gray-300 font-semibold transition-colors duration-200">
              REGISTER
            </button>
            <CustomButton title={'Login'} icon={ <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>} color={'red'} />
          </div>
        </motion.header>
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center h-[calc(100vh-80px)] ml-4"
        >
          <div className="">
            <motion.h1 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-7xl  mb-4 leading-tight font-custom text"
            >
              YOUR OWN STORY<br />IN FROZEVERSE
            </motion.h1>
            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg mb-8"
            >
              Adventure with Olaf and friends through a series of<br />
              magical landscapes and mini games
            </motion.p>
      
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300"
            >
              TRY NOW FOR FREE
            </motion.button>

       
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default GameLandingPage;