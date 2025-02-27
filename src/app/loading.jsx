"use client"
import Image from "next/image";

 const LoadingScreen = ({text}) => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black overflow-hidden font-pilot">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-10 opacity-90 hover:opacity-100 transition-opacity duration-300 ">
          <Image
            src="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg"
            alt="Brand Logo"
            width={350}
            height={100}
            className="drop-shadow-2xl"
          />
        </div>

        {/* Loading Text */}
        <div className="flex space-x-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-primary animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
       {text&&text} 
      </div>

      {/* Dots Animation at Bottom */}
     
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s infinite;
        }
      `}</style>

    </div>
  );
};
export default LoadingScreen;