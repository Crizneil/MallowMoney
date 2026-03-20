import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Music, Volume2 } from 'lucide-react';

const MONEY_NOTES = [
  "Ipon-ipon din pag may time! 🐷",
  "Money can't buy happiness, but it can buy marshmallows! 🍥",
  "Don't spend what you haven't earned yet. 💸",
  "Small savings lead to big dreams! ✨",
  "Treat yourself, but don't cheat your future! 🎁",
  "Track your centavos, and the pesos will follow! 🪙",
  "Budgeting is just telling your money where to go. 🗺️",
  "Piso-piso, lalago rin yan! 💹"
];

const PixelMallow = ({ balance, theme, variant = 'default', scale = 1, onToggleMusic, isPlayingMusic }) => {
  const [note, setNote] = useState(MONEY_NOTES[0]);
  const [showNote, setShowNote] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [mallowScale, setMallowScale] = useState(1);

  // Wobble effect when music is playing
  useEffect(() => {
    if (isPlayingMusic) {
      const wobbleInterval = setInterval(() => {
        setMallowScale(s => s === 1 ? 1.05 : 1);
      }, 500);
      return () => clearInterval(wobbleInterval);
    } else {
      setMallowScale(1);
    }
  }, [isPlayingMusic]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNote(false);
      setTimeout(() => {
        setNote(MONEY_NOTES[Math.floor(Math.random() * MONEY_NOTES.length)]);
        setShowNote(true);
      }, 500);
    }, 8000);

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(blinkInterval);
    };
  }, []);

  const isRunning = variant === 'running';

  return (
    <div 
      className={`relative ${isRunning ? 'w-24 h-24 overflow-visible' : 'w-full h-[180px] overflow-hidden rounded-[1.5rem] border-4 border-[#2D2327]/10 dark:border-white/5 bg-[#AEE2FF] dark:bg-[#06080D] shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]'}`}
      style={isRunning ? { transform: `scale(${scale})` } : {}}
    >
      {/* BEACH SCENE (Light Mode) */}
      {theme === 'light' && !isRunning && (
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 bottom-12 h-10 bg-[#0077B6]/20" />
          {/* Pixel Waves */}
          <div className="absolute bottom-12 inset-x-0 h-4 overflow-hidden">
            <motion.div 
              animate={{ x: [-20, 0, -20] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="flex"
            >
              {[...Array(15)].map((_, i) => (
                <div key={i} className="min-w-[40px] h-4 bg-white/30 rounded-t-lg mx-1" />
              ))}
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[#FFE8B6]" />
          
          {/* Pixel clouds */}
          <motion.div 
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-4 left-10 flex space-x-2"
          >
            <div className="w-8 h-4 bg-white rounded-sm opacity-60" />
            <div className="w-12 h-6 bg-white rounded-sm opacity-40 mt-2" />
          </motion.div>

          {/* Walking Crab (2D Pixel) */}
          <motion.div
            animate={{ x: [20, 100, 20], rotate: [0, 5, -5, 0] }}
            transition={{ x: { duration: 15, repeat: Infinity }, rotate: { duration: 0.5, repeat: Infinity } }}
            className="absolute bottom-4 left-0 z-30"
          >
            <div className="relative w-6 h-4 bg-[#E63946] rounded-sm">
              <div className="absolute -left-1 top-1 w-2 h-2 bg-[#E63946] rounded-sm" />
              <div className="absolute -right-1 top-1 w-2 h-2 bg-[#E63946] rounded-sm" />
              <div className="absolute top-1 left-1 w-1 h-1 bg-black" />
              <div className="absolute top-1 right-1 w-1 h-1 bg-black" />
            </div>
          </motion.div>

          {/* Sandcastle */}
          <div className="absolute bottom-6 left-24 scale-75 opacity-60">
            <div className="flex items-end space-x-1">
              <div className="w-6 h-8 bg-[#D4A373] rounded-sm" />
              <div className="w-10 h-12 bg-[#D4A373] rounded-sm" />
              <div className="w-6 h-8 bg-[#D4A373] rounded-sm" />
            </div>
          </div>
        </div>
      )}

      {/* FOREST SCENE (Dark Mode) */}
      {theme === 'dark' && !isRunning && (
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[#140D06]" />
          
          {/* Wavy Pixel Trees */}
          <div className="absolute bottom-12 inset-x-0 h-24 flex justify-around items-end px-10">
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ skewX: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                className="w-10 h-20 bg-green-950/20" 
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} 
              />
            ))}
          </div>

          {/* Fireflies (Light Green Pixel Dots) */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, -10, 0],
                x: [0, Math.random() * 10 - 5, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-1.5 h-1.5 bg-[#B5FFB5] rounded-full blur-[1px] shadow-[0_0_4px_#B5FFB5]"
              style={{ 
                left: `${15 + Math.random() * 70}%`,
                top: `${20 + Math.random() * 50}%`
              }}
            />
          ))}

          {/* Bonfire */}
          <div className="absolute bottom-6 left-8 z-20 flex flex-col items-center">
            <motion.div 
              animate={{ height: [10, 14, 9, 12, 10], opacity: [0.6, 0.9, 0.5, 0.8, 0.6] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-5 bg-[#F97316] rounded-sm"
            />
            <div className="flex -space-x-1 mt-[-2px]">
              <div className="w-5 h-1.5 bg-[#2a1d15] rounded-sm" />
              <div className="w-5 h-1.5 bg-[#2a1d15] rounded-sm mt-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* CHARACTER & TEXT LAYER */}
      <div className={`absolute inset-0 flex items-center ${isRunning ? 'justify-center' : 'justify-end px-10 md:px-14'}`}>
        <div className={`flex items-center ${isRunning ? '' : 'space-x-6'}`}>
          {/* Landscape Speech Bubble */}
          {!isRunning && (
            <AnimatePresence>
            {showNote && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="bg-white/95 dark:bg-[#1a1c24]/95 border-4 border-[#2D2327] px-5 py-3 rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] z-40 max-w-[200px] md:max-w-[280px] relative"
              >
                <p className="font-pixel text-[13px] md:text-[15px] leading-tight text-space-bg dark:text-white">
                  {note}
                </p>
                {/* Pixel Arrow */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-white/95 dark:bg-[#1a1c24]/95 border-r-4 border-t-4 border-[#2D2327] rotate-45" />
              </motion.div>
            )}
            </AnimatePresence>
          )}

          {/* Small 2D Pixel Mallow */}
          <motion.div
            animate={isRunning ? { 
              y: [0, -4, 0],
              x: [-2, 2, -2]
            } : { 
              y: [0, 2, 0],
              scale: mallowScale
            }}
            transition={isRunning ? { duration: 0.3, repeat: Infinity, ease: "linear" } : { duration: isPlayingMusic ? 0.5 : 3, repeat: Infinity, ease: "easeInOut" }}
            className={`flex flex-col items-center ${onToggleMusic ? 'cursor-pointer' : ''}`}
            onClick={onToggleMusic}
          >
            {/* Music Notes */}
            {isPlayingMusic && !isRunning && (
              <div className="absolute -top-12 -right-4 flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -20], 
                      x: [0, (i - 1) * 10], 
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5] 
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                    className="text-pink-400"
                  >
                    <Music size={16} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* 2D Boxy Body */}
            <div className="relative w-13 h-12 bg-white border-4 border-[#2D2327] rounded-sm shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] z-10 flex flex-col items-center justify-center">
              {/* FACE (Small Pixel Style) */}
              <div className="relative flex flex-col items-center">
                {/* Blushes */}
                <div className="absolute -left-4 top-0 w-2 h-1 bg-pink-300 opacity-60" />
                <div className="absolute -right-4 top-0 w-2 h-1 bg-pink-300 opacity-60" />
                
                {/* Eyes */}
                <div className="flex space-x-4 mb-1">
                  <motion.div 
                    animate={isBlinking ? { height: 1 } : { height: 4 }}
                    className="w-3 h-4 bg-[#2D2327] relative"
                  >
                    {!isBlinking && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white" />}
                  </motion.div>
                  <motion.div 
                    animate={isBlinking ? { height: 1 } : { height: 4 }}
                    className="w-3 h-4 bg-[#2D2327] relative"
                  >
                    {!isBlinking && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white" />}
                  </motion.div>
                </div>

                {/* Smile */}
                <div className="w-2 h-1 bg-[#2D2327]" />
              </div>
            </div>

            {/* Stubby Feet */}
            <div className="flex space-x-4 -mt-1">
              <motion.div 
                animate={isRunning ? { 
                  y: [0, -3, 0],
                  scaleY: [1, 0.8, 1]
                } : {}}
                transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
                className="w-3 h-2 bg-white border-x-4 border-b-4 border-[#2D2327]" 
              />
              <motion.div 
                animate={isRunning ? { 
                  y: [0, -3, 0],
                  scaleY: [1, 0.8, 1]
                } : {}}
                transition={{ duration: 0.15, repeat: Infinity, ease: "linear", delay: 0.075 }}
                className="w-3 h-2 bg-white border-x-4 border-b-4 border-[#2D2327]" 
              />
            </div>
            
            {/* Shadow */}
            {!isRunning && <div className="w-14 h-2 bg-black/10 mt-1 rounded-full blur-[1px]" />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PixelMallow;
