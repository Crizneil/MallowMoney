import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { audioManager } from '../utils/audioManager';
import PixelMallow from './PixelMallow';

const LoadingScreen = ({ onComplete }) => {
  const [textVisible, setTextVisible] = useState(false);
  const [creditVisible, setCreditVisible] = useState(false);

  useEffect(() => {
    // Fast sequence for 3 seconds
    const startTimer = setTimeout(() => setTextVisible(true), 100);
    const creditTimer = setTimeout(() => setCreditVisible(true), 1500);
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3200); // 3 seconds + small buffer

    return () => {
      clearTimeout(startTimer);
      clearTimeout(creditTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const characters = "MallowMoney".split("");

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#E8F8FB] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ANIMATION AREA */}
      <div className="relative w-full h-40 flex items-center justify-center mb-12">
        {/* The Coin */}
        <motion.div
          animate={{
            x: [-120, 120],
            y: [0, -10, 0, -10, 0]
          }}
          transition={{
            x: { duration: 3, repeat: Infinity, ease: "linear" },
            y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute z-20"
        >
          <div className="w-6 h-6 bg-yellow-400 border-2 border-[#2D2327] rounded-sm shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white opacity-60" />
          </div>
        </motion.div>

        {/* Chasing Mallow */}
        <motion.div
          animate={{
            x: [-150, 90],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute z-10"
        >
          <PixelMallow variant="running" scale={1.2} theme="light" />
        </motion.div>
      </div>

      {/* TITLE REVEAL */}
      <div className="flex space-x-2 mb-4">
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
            animate={textVisible ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="font-pixel text-4xl md:text-6xl text-[#2D2327] block"
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* CREDITS POP-UP */}
      <AnimatePresence>
        {creditVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-8 px-6 py-2 bg-[#2D2327] rounded-full shadow-lg"
          >
            <p className="font-pixel text-sm text-[#FFF9F0] tracking-widest">
              DEVELOPED BY CRIZNEIL
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS BAR (Visual Cue) */}
      <div className="absolute bottom-10 w-64 h-2 bg-[#2D2327]/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "linear" }}
          className="h-full bg-[#2D2327]"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
