import React, { useState, useEffect } from 'react';

const TransparentLoader = ({messages=[]}) => {
  

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
      <div className="text-center  p-8 rounded-xl">
        {/* Spinner */}
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
        </div>

        {/* Message */}
        <p className="mt-4 text-white text-2xl animate-pulse">
          {messages[currentMessage]}
        </p>
      </div>
    </div>
  );
};

export default TransparentLoader;