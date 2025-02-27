import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = ({ text }) => {
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const loaderVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear"
      }
    }
  };
  
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    },
    exit: { opacity: 0, y: -20 }
  };
  
  const dotVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };
  
  const loadingDots = {
    animate: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
    >
      {/* Background with gradient and blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/70 backdrop-blur-md" />
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Custom loader */}
        <div className="relative flex items-center justify-center w-36 h-36">
          <motion.div 
            className="absolute w-56 h-56 border-9 border-white/20 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div 
            className="absolute w-56 h-56 border-t-9 border-l-8 border-primary rounded-full"
            variants={loaderVariants}
            animate="animate"
          />
          <img 
            src='https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg' 
            className="w-64 h-64 z-10" 
            alt="Morocco Gaming Expo 2025" 
          />
        </div>
        {/* Text with animated dots */}
   {
    text &&      
    <motion.div 
      className="mt-16 flex items-center"
      variants={textVariants}
    >
      <p className="text-4xl font-custom text-white tracking-wider">{text}</p>
      <motion.div 
        className="flex ml-2" 
        variants={loadingDots}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-4xl text-white w-3 mx-1"
            variants={dotVariants}
            initial="initial"
            animate={{
              opacity: [0, 1, 0],
              y: [0, -10, 0],
              transition: {
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2
              }
            }}
          >
            .
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
   }
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;