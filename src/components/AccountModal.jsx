import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';
import ConfirmModal from './ConfirmModal';

const AccountModal = ({ isOpen, onClose, onAdd, accounts = [], onDelete }) => {
  const [name, setName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

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
              <h2 className="text-lg font-press-start text-mallow-light-text dark:text-white uppercase tracking-tight">Banko / Wallets</h2>
              <button 
                onClick={() => {
                  audioManager.playSFX('click');
                  onClose();
                }} 
                className="p-2 opacity-40 hover:opacity-100 bg-black/5 dark:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Existing Accounts List */}
            {accounts.length > 0 && (
              <div className="mb-8 border-b-2 border-black/5 dark:border-white/5 pb-6">
                <h3 className="font-pixel text-[12px] opacity-40 mb-3 text-center uppercase font-bold tracking-tight">Aking Listahan</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
                  {accounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-3 rounded-xl border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 transition-all">
                      <p className="font-bold text-sm truncate opacity-80 pl-1">{acc.name}</p>
                      {acc.id !== 'wallet' && ( // Prevent deleting the base Wallet
                        <button 
                          type="button"
                          onClick={() => {
                            audioManager.playSFX('click');
                            setDeleteTarget({ id: acc.id, name: acc.name });
                          }}
                          className="text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg active:scale-95 transition-all shrink-0"
                          title="Delete account"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="BURAHIN ANG ACCOUNT?"
        message={`Sigurado ka bang nais mong burahin ang "${deleteTarget?.name}"? Mabubura rin ang lahat ng records nito.`}
        danger={true}
        confirmText="BURAHIN"
        cancelText="HINDI"
      />
    </AnimatePresence>
  );
};

export default AccountModal;
