import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';

const AccountModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name);
    setName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm bg-mallow-light-bg dark:bg-space-bg p-6 rounded-3xl shadow-2xl border-2 border-mallow-light-pink dark:border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-press-start text-mallow-light-text dark:text-white">Add Bank</h2>
              <button 
                onClick={() => {
                  audioManager.playSFX('click');
                  onClose();
                }} 
                className="p-2 opacity-40 hover:opacity-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-pixel text-lg opacity-40 mb-1">Pangalan ng Banko</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. GCash, PayMaya, BPI"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-mallow-light-pink transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-mallow-light-text dark:bg-white text-white dark:text-space-bg font-press-start text-xs py-4 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                DAGDAG ACCOUNT
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AccountModal;
