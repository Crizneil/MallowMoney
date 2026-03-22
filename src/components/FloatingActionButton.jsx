import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Wallet, TrendingUp } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

const FloatingActionButton = ({ 
  setIsCategoryModalOpen, 
  setIsAccountModalOpen, 
  setIsModalOpen 
}) => {
  const [isFabOpen, setIsFabOpen] = useState(false);

  const toggleFab = () => {
    audioManager.playSFX('click');
    setIsFabOpen(!isFabOpen);
  };

  const handleAction = (action) => {
    audioManager.playSFX('click');
    setIsFabOpen(false);
    action();
  };

  return (
    <div className="relative flex flex-col items-center -mt-12">
      <AnimatePresence>
        {isFabOpen && (
          <>
            {/* Backdrop for FAB only */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/5 dark:bg-black/40 backdrop-blur-[2px]"
              onClick={() => setIsFabOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-full mb-6 flex flex-col items-center space-y-4 z-40"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="flex items-center space-x-3 w-40 justify-end">
                <span className="font-pixel text-[12px] uppercase bg-white dark:bg-black px-3 py-2 rounded-xl shadow-lg font-bold">Kategorya</span>
                <button 
                  onClick={() => handleAction(() => setIsCategoryModalOpen(true))} 
                  className="w-14 h-14 bg-white dark:bg-[#1a1c24] rounded-full shadow-xl flex items-center justify-center border-2 border-[#7DCED9] active:scale-90 transition-transform"
                >
                  <Package size={22} className="text-[#5AB9C7]" />
                </button>
              </div>
              <div className="flex items-center space-x-3 w-40 justify-end">
                <span className="font-pixel text-[12px] uppercase bg-white dark:bg-black px-3 py-2 rounded-xl shadow-lg font-bold">Banko</span>
                <button 
                  onClick={() => handleAction(() => setIsAccountModalOpen(true))} 
                  className="w-14 h-14 bg-white dark:bg-[#1a1c24] rounded-full shadow-xl flex items-center justify-center border-2 border-mallow-light-blue active:scale-90 transition-transform"
                >
                  <Wallet size={22} className="text-mallow-light-blue" />
                </button>
              </div>
              <div className="flex items-center space-x-3 w-40 justify-end">
                <span className="font-pixel text-[12px] uppercase bg-white dark:bg-black px-3 py-2 rounded-xl shadow-lg font-bold">Record</span>
                <button 
                  onClick={() => handleAction(() => setIsModalOpen(true))} 
                  className="w-14 h-14 bg-white dark:bg-[#1a1c24] rounded-full shadow-xl flex items-center justify-center border-2 border-mallow-light-pink active:scale-90 transition-transform"
                >
                  <TrendingUp size={22} className="text-mallow-light-pink" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleFab}
        className={`w-16 h-16 text-white dark:text-space-bg rounded-2xl flex items-center justify-center border-4 border-mallow-light-bg dark:border-space-bg z-40 ${
          isFabOpen 
            ? 'bg-[#2D2327] dark:bg-white' 
            : 'bg-gradient-to-tr from-mallow-light-pink to-mallow-light-blue dark:from-white dark:to-white'
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        <motion.div animate={{ rotate: isFabOpen ? 45 : 0 }} className="flex items-center justify-center">
          <Plus size={32} />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default React.memo(FloatingActionButton);
