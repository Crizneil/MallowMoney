import { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Plus, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';

const TransactionModal = ({ isOpen, onClose, onAdd, accounts = [], categories = [], onAddCategory }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Food');
  const [type, setType] = useState('expense');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'wallet');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    
    onAdd({
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      category,
      accountId,
      date: new Date().toISOString()
    });
    setAmount('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-mallow-light-bg dark:bg-space-bg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden border-t-8 border-mallow-light-pink dark:border-transparent"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-press-start text-mallow-light-text dark:text-white">New Record</h2>
              <button 
                onClick={() => {
                  audioManager.playSFX('click');
                  onClose();
                }}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Switcher */}
              <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    audioManager.playSFX('click');
                    setType('expense');
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all font-pixel text-xl ${type === 'expense' ? 'bg-red-500 text-white shadow-lg' : 'opacity-40'}`}
                >
                  <ArrowDownRight size={18} />
                  <span>GASTOS</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioManager.playSFX('click');
                    setType('income');
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all font-pixel text-xl ${type === 'income' ? 'bg-green-500 text-white shadow-lg' : 'opacity-40'}`}
                >
                  <ArrowUpRight size={18} />
                  <span>KITA</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-pixel text-lg opacity-40 mb-1">Magkano?</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg opacity-40">₱</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      autoFocus
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-xl font-bold focus:outline-none focus:border-mallow-light-pink dark:focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-pixel text-lg opacity-40 mb-1">Account</label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-4 focus:outline-none text-sm font-bold"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id} className="bg-white dark:bg-space-bg text-black dark:text-white font-pixel">
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-pixel text-lg opacity-40 mb-1">Kategorya</label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-4 focus:outline-none text-sm font-bold"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name} className="bg-white dark:bg-space-bg text-black dark:text-white font-pixel">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      audioManager.playSFX('click');
                      onAddCategory();
                    }}
                    className="flex items-center justify-center space-x-2 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl opacity-60 hover:opacity-100 transition-opacity text-xs font-press-start"
                  >
                    <Plus size={14} />
                    <span>ADD</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-mallow-light-text dark:bg-white text-white dark:text-space-bg font-press-start text-xs py-5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition shadow-lg dark:shadow-none bg-gradient-to-r from-mallow-light-pink to-mallow-light-blue dark:from-white dark:to-white"
              >
                ILISTA NA!
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
