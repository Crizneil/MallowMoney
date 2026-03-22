import { useState, useEffect } from 'react';
import { X, ArrowDownUp, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';

const ConverterModal = ({ isOpen, onClose }) => {
  const [usd, setUsd] = useState('');
  const [php, setPhp] = useState('');
  const [rate, setRate] = useState(56.50); // Default fallback
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      fetchRate();
    }
  }, [isOpen]);

  const fetchRate = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data && data.rates && data.rates.PHP) {
        setRate(data.rates.PHP);
      }
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsdChange = (val) => {
    setUsd(val);
    if (val === '') { setPhp(''); return; }
    setPhp((parseFloat(val) * rate).toFixed(2));
  };

  const handlePhpChange = (val) => {
    setPhp(val);
    if (val === '') { setUsd(''); return; }
    setUsd((parseFloat(val) / rate).toFixed(2));
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
            className="relative w-full max-w-sm bg-mallow-light-bg dark:bg-space-bg p-6 rounded-3xl shadow-2xl border-2 border-mallow-light-blue dark:border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-press-start text-mallow-light-text dark:text-white mt-1 uppercase">LIVE CONVERTER</h2>
              <button onClick={() => { audioManager.playSFX('click'); onClose(); }} className="p-2 opacity-40 hover:opacity-100 bg-black/5 dark:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="block font-pixel text-[12px] opacity-40 mb-2 font-bold tracking-tight">US Dollars ($)</label>
                <div className="flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden focus-within:border-mallow-light-blue transition-colors">
                  <span className="font-bold px-4 py-4 bg-black/5 dark:bg-white/10 shrink-0">USD</span>
                  <input
                    type="number"
                    value={usd}
                    onChange={(e) => handleUsdChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent px-4 py-4 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="p-2 bg-mallow-light-bg dark:bg-space-bg rounded-full shadow-sm">
                  <ArrowDownUp size={16} className="text-mallow-light-pink" />
                </div>
              </div>

              <div className="relative">
                <label className="block font-pixel text-[12px] opacity-40 mb-2 font-bold tracking-tight">Philippine Peso (₱)</label>
                <div className="flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden focus-within:border-mallow-light-blue transition-colors">
                  <span className="font-bold px-4 py-4 bg-black/5 dark:bg-white/10 shrink-0">PHP</span>
                  <input
                    type="number"
                    value={php}
                    onChange={(e) => handlePhpChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent px-4 py-4 font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center bg-black/5 dark:bg-white/5 p-4 rounded-xl flex flex-col items-center justify-center min-h-[60px]">
              {loading ? (
                <div className="flex items-center space-x-2 opacity-60">
                  <RefreshCw size={14} className="animate-spin" />
                  <span className="font-pixel text-[11px] font-bold tracking-tight">UPDATING RATE...</span>
                </div>
              ) : (
                <>
                  <p className="font-pixel text-[11px] opacity-60 font-bold tracking-tight mb-1">Live Rate: $1 = ₱{rate.toFixed(2)}</p>
                  <p className="font-pixel text-[8px] opacity-30 uppercase tracking-widest">Powered by Open Exchange</p>
                </>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConverterModal;

