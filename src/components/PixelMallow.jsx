import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';

const MONEY_NOTES = [
  "Ipon-ipon din pag may time! 🐷",
  "Money can't buy happiness, but it can buy marshmallows! 🍥",
  "Don't spend what you haven't earned yet. 💸",
  "Small savings lead to big dreams! ✨",
  "Treat yourself, but don't cheat your future! 🎁",
  "Track your centavos, and the pesos will follow! 🪙",
  "Budgeting is just telling your money where to go. 🗺️",
  "Piso-piso, lalago rin yan! 💹",
  "CLICK ME FOR SURPRISES! 🎁",
  "Pera mo, alagaan mo! 🛡️",
  "Wag budol, be cool! 😎",
  "Savings is the new sexy! 💃",
  "Mallow knows your secrets... 🤫",
];

const PixelMallow = ({ balance, theme, variant = 'default', scale = 1, onToggleMusic, isPlayingMusic }) => {
  const [noteIndex, setNoteIndex] = useState(0);
  const [showNote, setShowNote] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [mallowScale, setMallowScale] = useState(1);
  const [isMoneyEyes, setIsMoneyEyes] = useState(false);
  const [coinKey, setCoinKey] = useState(0);

  // Consolidated timer effect
  useEffect(() => {
    // Note rotation timer
    const noteInterval = setInterval(() => {
      setShowNote(false);
      setTimeout(() => {
        setNoteIndex(prev => (prev + 1) % MONEY_NOTES.length);
        setShowNote(true);
      }, 500);
    }, 5000);

    // Blink timer
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);

    // Wobble timer (only if music is playing)
    let wobbleInterval;
    if (isPlayingMusic) {
      wobbleInterval = setInterval(() => {
        setMallowScale(s => s === 1 ? 1.05 : 1);
      }, 500);
    }

    return () => {
      clearInterval(noteInterval);
      clearInterval(blinkInterval);
      if (wobbleInterval) clearInterval(wobbleInterval);
    };
  }, [isPlayingMusic]);

  // Welcome Animation Timer
  useEffect(() => {
    if (variant !== 'welcome') return;

    const coinInterval = setInterval(() => {
      setCoinKey(prev => prev + 1);
      // Wait for the coin to "hit" (around 1.8s into a 2s animation)
      setTimeout(() => {
        setIsMoneyEyes(true);
        setTimeout(() => setIsMoneyEyes(false), 5000); // 5 seconds duration
      }, 1800);
    }, 8000); // 8 seconds cycle

    return () => clearInterval(coinInterval);
  }, [variant]);

  const isRunning = variant === 'running';
  const isSaving = variant === 'saving';
  const isWelcome = variant === 'welcome';
  const isTransparent = isRunning || isSaving || isWelcome;

  // Memoize scene elements to prevent re-calculations
  const lightScene = useMemo(() => {
    if (theme !== 'light' || isTransparent) return null;
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-12 h-10 bg-[#0077B6]/20" />
        <div className="absolute bottom-12 inset-x-0 h-4 overflow-hidden">
          <motion.div 
            animate={{ x: [-20, 0, -20] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="flex"
            style={{ willChange: 'transform' }}
          >
            {[...Array(15)].map((_, i) => (
              <div key={i} className="min-w-[40px] h-4 bg-white/30 rounded-t-lg mx-1" />
            ))}
          </motion.div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[#FFE8B6]" />
        
        <motion.div 
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-4 left-10 flex space-x-2"
          style={{ translateZ: 0 }}
        >
          <div className="w-8 h-4 bg-white rounded-sm opacity-60" />
          <div className="w-12 h-6 bg-white rounded-sm opacity-40 mt-2" />
        </motion.div>

        <motion.div
          animate={{ x: [20, 100, 20], rotate: [0, 5, -5, 0] }}
          transition={{ x: { duration: 15, repeat: Infinity }, rotate: { duration: 0.5, repeat: Infinity } }}
          className="absolute bottom-4 left-0 z-30"
          style={{ willChange: 'transform' }}
        >
          <div className="relative w-6 h-4 bg-[#E63946] rounded-sm">
            <div className="absolute -left-1 top-1 w-2 h-2 bg-[#E63946] rounded-sm" />
            <div className="absolute -right-1 top-1 w-2 h-2 bg-[#E63946] rounded-sm" />
            <div className="absolute top-1 left-1 w-1 h-1 bg-black" />
            <div className="absolute top-1 right-1 w-1 h-1 bg-black" />
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-24 scale-75 opacity-60">
          <div className="flex items-end space-x-1">
            <div className="w-6 h-8 bg-[#D4A373] rounded-sm" />
            <div className="w-10 h-12 bg-[#D4A373] rounded-sm" />
            <div className="w-6 h-8 bg-[#D4A373] rounded-sm" />
          </div>
        </div>
      </div>
    );
  }, [theme, isTransparent]);

  const darkScene = useMemo(() => {
    if (theme !== 'dark' || isTransparent) return null;
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[#140D06]" />
        
        <div className="absolute bottom-12 inset-x-0 h-24 flex justify-around items-end px-10">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ skewX: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              className="w-10 h-20 bg-green-950/20" 
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', willChange: 'transform' }} 
            />
          ))}
        </div>

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
              top: `${20 + Math.random() * 50}%`,
              willChange: 'transform, opacity'
            }}
          />
        ))}

        <div className="absolute bottom-6 left-8 z-20 flex flex-col items-center">
          <motion.div 
            animate={{ height: [10, 14, 9, 12, 10], opacity: [0.6, 0.9, 0.5, 0.8, 0.6] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-5 bg-[#F97316] rounded-sm"
            style={{ willChange: 'height, opacity' }}
          />
          <div className="flex -space-x-1 mt-[-2px]">
            <div className="w-5 h-1.5 bg-[#2a1d15] rounded-sm" />
            <div className="w-5 h-1.5 bg-[#2a1d15] rounded-sm mt-0.5" />
          </div>
        </div>
      </div>
    );
  }, [theme, isTransparent]);

  return (
    <div 
      className={`relative ${isTransparent ? 'w-24 h-24 overflow-visible' : 'w-full h-[180px] overflow-hidden rounded-[1.5rem] border-4 border-[#2D2327]/10 dark:border-white/5 bg-[#AEE2FF] dark:bg-[#06080D] shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]'}`}
      style={isTransparent ? { transform: `scale(${scale})` } : {}}
    >
      {lightScene}
      {darkScene}

      <div className={`absolute inset-0 flex items-center ${isTransparent ? 'justify-center' : 'justify-end px-10 md:px-14'}`}>
        <div className={`flex items-center ${isTransparent ? '' : 'space-x-6'}`}>
          {!isTransparent && (
            <AnimatePresence>
            {showNote && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="bg-white/95 dark:bg-[#1a1c24]/95 border-4 border-[#2D2327] px-5 py-3 rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] z-40 max-w-[200px] md:max-w-[280px] relative"
                style={{ willChange: 'transform, opacity' }}
              >
                <p className="font-pixel text-[13px] md:text-[15px] leading-tight text-space-bg dark:text-white">
                  {MONEY_NOTES[noteIndex]}
                </p>
                <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-white/95 dark:bg-[#1a1c24]/95 border-r-4 border-t-4 border-[#2D2327] rotate-45" />
              </motion.div>
            )}
            </AnimatePresence>
          )}

          <motion.div
            animate={isWelcome ? { scale: mallowScale } : isTransparent ? { 
              y: isSaving ? [0, -2, 0] : [0, -4, 0],
              x: isSaving ? 0 : [-2, 2, -2]
            } : { 
              y: [0, 2, 0],
              scale: mallowScale
            }}
            transition={isWelcome ? { duration: 0.5 } : isTransparent ? { duration: isSaving ? 2 : 0.3, repeat: Infinity, ease: "easeInOut" } : { duration: isPlayingMusic ? 0.5 : 3, repeat: Infinity, ease: "easeInOut" }}
            className={`flex flex-col items-center ${onToggleMusic ? 'cursor-pointer' : ''} ${isSaving ? '-ml-8' : ''}`}
            onClick={onToggleMusic}
            style={{ translateZ: 0 }}
          >
            {isPlayingMusic && !isTransparent && (
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
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <Music size={16} />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="relative w-13 h-12 bg-white border-4 border-[#2D2327] rounded-sm shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] z-10 flex flex-col items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div className="absolute -left-4 top-0 w-2 h-1 bg-pink-300 opacity-60" />
                <div className="absolute -right-4 top-0 w-2 h-1 bg-pink-300 opacity-60" />
                
                <div className="flex space-x-4 mb-1">
                  <motion.div 
                    animate={isBlinking ? { height: 1 } : { height: 4 }}
                    className={`w-3 h-4 ${isMoneyEyes ? '' : 'bg-[#2D2327]'} relative flex items-center justify-center`}
                    style={{ willChange: 'height' }}
                  >
                    {!isBlinking && (
                      isMoneyEyes ? (
                        <span className="text-[14px] text-black font-bold leading-none select-none">₱</span>
                      ) : (
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white" />
                      )
                    )}
                  </motion.div>
                  <motion.div 
                    animate={isBlinking ? { height: 1 } : { height: 4 }}
                    className={`w-3 h-4 ${isMoneyEyes ? '' : 'bg-[#2D2327]'} relative flex items-center justify-center`}
                    style={{ willChange: 'height' }}
                  >
                    {!isBlinking && (
                      isMoneyEyes ? (
                        <span className="text-[14px] text-black font-bold leading-none select-none">₱</span>
                      ) : (
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white" />
                      )
                    )}
                  </motion.div>
                </div>

                <div className="w-2 h-1 bg-[#2D2327]" />
              </div>
            </div>

            <div className="flex space-x-4 -mt-1">
              <motion.div 
                animate={isRunning ? { y: [0, -3, 0], scaleY: [1, 0.8, 1] } : {}}
                transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
                className="w-3 h-2 bg-white border-x-4 border-b-4 border-[#2D2327]" 
                style={{ willChange: 'transform' }}
              />
              <motion.div 
                animate={isRunning ? { y: [0, -3, 0], scaleY: [1, 0.8, 1] } : {}}
                transition={{ duration: 0.15, repeat: Infinity, ease: "linear", delay: 0.075 }}
                className="w-3 h-2 bg-white border-x-4 border-b-4 border-[#2D2327]" 
                style={{ willChange: 'transform' }}
              />
            </div>
            
            {!isTransparent && <div className="w-14 h-2 bg-black/10 mt-1 rounded-full blur-[1px]" />}
          </motion.div>

          {isSaving && (
            <div className="absolute -bottom-2 -right-14 z-20">
              <div className="w-12 h-10 bg-[#FFB3C6] dark:bg-[#7DCED9] border-4 border-[#2D2327] rounded-sm relative shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#2D2327]" />
                  <motion.div
                    animate={{ y: [-40, 5], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn" }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-30"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="w-4 h-4 bg-yellow-400 border-2 border-[#2D2327] rounded-sm shadow-[1px_1px_0_0_rgba(0,0,0,0.1)] flex items-center justify-center">
                      <div className="w-1 h-1 bg-white opacity-60" />
                    </div>
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-40 mt-1">
                    <div className="w-3 h-3 text-[#2D2327]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </div>
                  </div>
              </div>
            </div>
          )}

          {isWelcome && (
            <div className="absolute inset-x-0 -top-20 z-0 flex justify-center pointer-events-none">
              <AnimatePresence>
                <motion.div
                  key={coinKey}
                  initial={{ y: -20, opacity: 0, scale: 0.5 }}
                  animate={{ y: 60, opacity: [0, 1, 1, 0], scale: 1 }}
                  transition={{ duration: 2, ease: "easeIn" }}
                  className="absolute"
                >
                  <div className="w-5 h-5 bg-yellow-400 border-2 border-[#2D2327] rounded-sm shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white opacity-60" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PixelMallow);
