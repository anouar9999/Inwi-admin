/* eslint-disable react/no-children-prop */
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
import "@/utils/i18n";
import { NextAppDirEmotionCacheProvider } from "@/utils/theme/EmotionCache";
import "react-quill/dist/quill.snow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@/app/font.css'
import Image from "next/image";
import { motion } from 'framer-motion';
import { ToastProvider } from "./components/toast/ToastProviderContext";

 
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
        <ToastProvider>
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
            <motion.div 
              className="logo-container"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="mb-6 md:mb-8 flex justify-center">
                <div className="flex flex-col justify-center items-center h-screen">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2
                    }}
                  >
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
                      alt="Brand Logo"
                      width={350}
                      height={100}
                      className="cut-corners"
                    />
                  </motion.div>
                  <motion.div
                    className="rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-500"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      ease: "linear",
                      repeat: Infinity
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Box>
          )}
              </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
