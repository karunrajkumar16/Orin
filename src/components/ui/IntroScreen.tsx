"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling during the intro
    document.body.style.overflow = 'hidden';

    // Total intro takes 3.0s to allow both texts to be properly read before the cinematic zoom
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Release scroll lock after the massive zoom finishes
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="intro-screen"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background pointer-events-none overflow-hidden"
        >
          {/* Properly readable presentation, followed by a cinematic Netflix zoom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale:   [0.95, 1, 1.05, 120], 
              y:       [15, 0, 0, 0] 
            }}
            transition={{ 
              duration: 3.0, 
              times: [0, 0.15, 0.75, 1], // Reveal (15%), Legible Action/Drift (60%), Massive Zoom Out (25%)
              ease: ["easeOut", "linear", "easeIn"] // Segmented bezier curves matching the exact effect
            }}
            className="flex flex-col items-center justify-center transform origin-center will-change-transform drop-shadow-md"
          >
            {/* Apple-style sleek typography, but mapped perfectly to the website's brand colors */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 pb-2">
              ORINCORE
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 5, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="mt-1 text-xs md:text-sm lg:text-base font-medium tracking-[0.2em] md:tracking-[0.3em] text-foreground/60 uppercase"
            >
              Premium 3D Printing Studio
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
