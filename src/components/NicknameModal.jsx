import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PixelMallow from './PixelMallow';

const NicknameModal = ({ isOpen, onSubmit }) => {
  const [nickname, setNickname] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-[#1a1c24] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-black dark:border-white/10"
        >
          <div className="p-8 flex flex-col items-center">
            {/* Mallow Character */}
            <div className="mb-6 scale-125">
              <PixelMallow variant="welcome" isSaving={false} />
            </div>

            {/* Speech Bubble */}
            <div className="relative bg-white dark:bg-white text-black p-6 rounded-3xl mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="font-pixel text-center leading-relaxed text-sm uppercase tracking-tight">
                HI! I'M MALLOW, YOUR PET <span className="font-black">IPON BUDDY</span>.<br />
                PLEASE SET A NICKNAME<br />
                SO I'LL KNOW WHO MY OWNER IS!
              </p>
              {/* Triangle pointer */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l-4 border-t-4 border-black" />
            </div>

            {/* Input Field */}
            <div className="w-full space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.toUpperCase())}
                  placeholder="ENTER NICKNAME..."
                  className="w-full bg-black/5 dark:bg-white/5 border-4 border-black dark:border-white/20 p-5 rounded-2xl font-pixel text-xl text-center placeholder:opacity-30 focus:outline-none focus:border-mallow-light-blue transition-colors text-black dark:text-white"
                  maxLength={12}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => nickname.trim() && onSubmit(nickname.trim())}
                disabled={!nickname.trim()}
                className={`w-full p-5 rounded-2xl font-pixel text-2xl transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] ${
                  nickname.trim() 
                  ? 'bg-mallow-light-blue text-white active:shadow-none' 
                  : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                SIGE!
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NicknameModal;
