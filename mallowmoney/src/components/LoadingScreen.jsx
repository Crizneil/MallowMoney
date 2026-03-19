import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { audioManager } from '../utils/audioManager';

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
      className="fixed inset-0 z-[100] bg-[#FFF9F0] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ANIMATION AREA */}
      <div className="relative w-full h-40 flex items-center justify-center mb-12">
        {/* Bouncing Coin */}
        <motion.div
          animate={{ 
            x: [-200, 200],
            y: [0, -20, 0, -10, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            x: { duration: 4, repeat: Infinity, ease: "linear" },
            y: { duration: 0.6, repeat: Infinity },
            rotate: { duration: 1, repeat: Infinity, ease: "linear" }
          }}
          className="absolute z-20"
        >
          <div className="w-8 h-8 bg-yellow-400 border-4 border-[#2D2327] rounded-full flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
            <div className="w-2 h-4 bg-yellow-600/30 rounded-full" />
          </div>
        </motion.div>

        {/* Chasing Mallow */}
        <motion.div
          animate={{ 
            x: [-260, 140],
            y: [0, -5, 0]
          }}
          transition={{ 
            x: { duration: 4, repeat: Infinity, ease: "linear" },
            y: { duration: 0.3, repeat: Infinity }
          }}
          className="absolute z-10 flex flex-col items-center"
        >
          {/* Boxy Body */}
          <div className="w-14 h-12 bg-white border-4 border-[#2D2327] rounded-sm shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] flex flex-col items-center justify-center">
            <div className="flex space-x-4 mb-1">
              <div className="w-3 h-4 bg-[#2D2327] relative">
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white" />
              </div>
              <div className="w-3 h-4 bg-[#2D2327] relative">
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white" />
              </div>
            </div>
            <div className="w-3 h-1.5 bg-[#2D2327]" />
          </div>
          {/* Running Feet */}
          <div className="flex space-x-6 -mt-1">
            <motion.div 
              animate={{ height: [4, 6, 4] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="w-3 h-4 bg-white border-x-4 border-b-4 border-[#2D2327]" 
            />
            <motion.div 
              animate={{ height: [6, 4, 6] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="w-3 h-4 bg-white border-x-4 border-b-4 border-[#2D2327]" 
            />
          </div>
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
