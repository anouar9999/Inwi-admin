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
import LoadingScreen from './loading';
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

