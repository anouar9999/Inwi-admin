"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "@/app/(DashboardLayout)/layout/shared/customizer/RTL";
import { ThemeSettings } from "@/utils/theme/Theme";
import { store } from "@/store/store";
import { useSelector } from 'react-redux';
// import { AppState } from "@/store/store";
import { Provider } from "react-redux";
import './globals.css' ; // adjust the path if necessary
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "@/app/api/index";
import "@/utils/i18n";
import { NextAppDirEmotionCacheProvider } from "@/utils/theme/EmotionCache";
import "react-quill/dist/quill.snow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@/app/font.css'
import Image from "next/image";
 const metadata = {
  title: "Lbanka League",
  description: 'Lbanka League Dashboard',
}
export const MyApp = ({ children }) => {
  const theme = ThemeSettings();

  const customizer = useSelector((state) => state.customizer);

  return (
    <>
      <NextAppDirEmotionCacheProvider options={{ key: "key" }}>
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
          {loading ? (
            // eslint-disable-next-line react/no-children-prop
            <MyApp children={children} />
          ) : (
            <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
              backgroundColor: "#05050f",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="logo-container">
            <div className="mb-6 md:mb-8 flex justify-center">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
              alt="Brand Logo"
              width={350}
              height={100}
              className="cut-corners"
            />
          </div>
            </div>
            <div className="loading-container">
              <div className="loading-bar"></div>
              <div className="loading-text">Loading...</div>
            </div>
            <div className="background-effect"></div>
            <style jsx>{`
              .logo-container {
                text-align: center;
                margin-bottom: 2rem;
              }
              .logo {
                font-size: 4rem;
                font-weight: bold;
                color: #f0f0f0;
                text-shadow: 0 0 10px #aa2180;
                font-family: 'Arial Black', sans-serif;
              }
              .sublogo {
                font-size: 2rem;
                color: #aa2180;
                letter-spacing: 0.5em;
                margin-top: -0.5rem;
              }
              .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .loading-bar {
                width: 200px;
                height: 4px;
                background-color: #1a1a2e;
                position: relative;
                overflow: hidden;
                border-radius: 2px;
              }
              .loading-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                height: 100%;
                background-color: #aa2180;
                animation: loading 1.5s infinite ease-in-out;
              }
              .loading-text {
                color: #f0f0f0;
                margin-top: 1rem;
                font-weight:700;
                font-size: 1.5rem;
                letter-spacing: 0.1em;
                animation: pulse 1.5s infinite ease-in-out;
              }
              .background-effect {
                position: absolute;
                top: -50%;
                left: -50%;
                right: -50%;
                bottom: -50%;
                background: radial-gradient(circle, #ff990033 0%, transparent 70%);
                opacity: 0.1;
                animation: rotate 20s infinite linear;
              }
              @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
              }
              @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </Box>
          )}
        </Provider>
      </body>
    </html>
  );
}
