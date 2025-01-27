'use client';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RTL from '@/app/(DashboardLayout)/layout/shared/customizer/RTL';
import { ThemeSettings } from '@/utils/theme/Theme';
import { store } from '@/store/store';
import { useSelector } from 'react-redux';
// import { AppState } from "@/store/store";
import { Provider } from 'react-redux';
import './globals.css'; // adjust the path if necessary
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '@/utils/i18n';
import { NextAppDirEmotionCacheProvider } from '@/utils/theme/EmotionCache';
import 'react-quill/dist/quill.snow.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/app/font.css';
import Image from 'next/image';
import ToastProvider from '@/utils/ToastProvider';

export const MyApp = ({ children }) => {
  const theme = ThemeSettings();

  const customizer = useSelector((state) => state.customizer);

  return (
    <>
      <NextAppDirEmotionCacheProvider options={{ key: 'key' }}>
        <ThemeProvider theme={theme}>
          <RTL direction={customizer.activeDir}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
          </RTL>
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </>
  );
};

export default function RootLayout({ children }) {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setLoading(true), 3000);
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider store={store}>
          <ToastProvider>
            {loading ? (
              // eslint-disable-next-line react/no-children-prop
              <MyApp children={children} />
            ) : (
              <LoadingScreen />
            )}
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
const LoadingScreen = () => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black overflow-hidden font-pilot">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-10 opacity-90 hover:opacity-100 transition-opacity duration-300 animate-bounce">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
            alt="Brand Logo"
            width={350}
            height={100}
            className="drop-shadow-2xl"
          />
        </div>

        {/* Loading Text */}
        <div className="text-white font-custom text-2xl tracking-widest uppercase font-light opacity-80">
          Loading ...
        </div>
      </div>

      {/* Dots Animation at Bottom */}
      <div className="absolute bottom-8 w-full flex justify-center">
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
      </div>
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

// Custom animation keyframes
const LoadingStyles = {
  '@keyframes blob': {
    '0%': { transform: 'translate(0px, 0px) scale(1)' },
    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
    '100%': { transform: 'translate(0px, 0px) scale(1)' }
  },
  '@keyframes loadingBar': {
    '0%': { transform: 'translateX(-100%)' },
    '50%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(-100%)' }
  }
};

const BlobAnimation = {
  animation: 'blob 7s infinite'
};

const LoadingBarAnimation = {
  animation: 'loading-bar 1.5s infinite'
};

const AnimationDelay2000 = {
  animationDelay: '2s'
};

const AnimationDelay4000 = {
  animationDelay: '4s'
};

