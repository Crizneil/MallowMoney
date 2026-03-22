import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "YES", cancelText = "NO", danger = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-space-bg p-8 rounded-[32px] shadow-2xl border-4 border-mallow-light-blue dark:border-white/10 overflow-hidden"
          >
            {/* Top accent */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${danger ? 'bg-red-500' : 'bg-mallow-light-pink'}`} />

            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${danger ? 'bg-red-500/10 text-red-500' : 'bg-mallow-light-pink/10 text-mallow-light-pink'}`}>
                <AlertTriangle size={32} />
              </div>

              <h2 className="font-press-start text-[12px] leading-relaxed text-mallow-light-text dark:text-white mb-4 uppercase">
                {title}
              </h2>
              
              <p className="font-pixel text-lg opacity-60 dark:text-white/60 mb-8 leading-tight">
                {message}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => {
                    audioManager.playSFX('click');
                    onClose();
                  }}
                  className="py-4 bg-black/5 dark:bg-white/5 text-mallow-light-text dark:text-white font-press-start text-[10px] rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    audioManager.playSFX('click');
                    onConfirm();
                    onClose();
                  }}
                  className={`py-4 text-white font-press-start text-[10px] rounded-2xl shadow-lg active:scale-95 transition-all ${danger ? 'bg-red-500 shadow-red-500/20' : 'bg-mallow-light-pink shadow-mallow-light-pink/20'}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
