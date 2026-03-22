import { useState } from 'react';
import { 
  X, Utensils, Car, ShoppingBag, Heart, TrendingUp, Coffee, Plane, Gift, Home, 
  Smartphone, Briefcase, Music, Film, Gamepad2, Pizza, Beer, Dumbbell, 
  BookOpen, Camera, Zap, Shield, HelpCircle, Package, Star, HeartPulse, 
  Bus, GraduationCap, Wrench, PiggyBank, CreditCard, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';
import ConfirmModal from './ConfirmModal';

const ICONS = [
  { name: 'Utensils', component: Utensils },
  { name: 'Pizza', component: Pizza },
  { name: 'Coffee', component: Coffee },
  { name: 'Beer', component: Beer },
  { name: 'Car', component: Car },
  { name: 'Bus', component: Bus },
  { name: 'Plane', component: Plane },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'Shirt', component: ShoppingBag }, // Reusing ShoppingBag for Shirt if Shirt is not available natively or just using more
  { name: 'Heart', component: Heart },
  { name: 'HeartPulse', component: HeartPulse },
  { name: 'TrendingUp', component: TrendingUp },
  { name: 'PiggyBank', component: PiggyBank },
  { name: 'CreditCard', component: CreditCard },
  { name: 'Gift', component: Gift },
  { name: 'Home', component: Home },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Zap', component: Zap }, // Electricity/Bills
  { name: 'Music', component: Music },
  { name: 'Film', component: Film },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'BookOpen', component: BookOpen },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Camera', component: Camera },
  { name: 'Dumbbell', component: Dumbbell },
  { name: 'Wrench', component: Wrench },
  { name: 'Shield', component: Shield },
  { name: 'Star', component: Star },
  { name: 'Package', component: Package },
  { name: 'HelpCircle', component: HelpCircle }
];

const CategoryModal = ({ isOpen, onClose, onAdd, categories = [], transactions = [], onDelete }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Utensils');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, selectedIcon);
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
            className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto custom-scrollbar bg-mallow-light-bg dark:bg-space-bg p-6 rounded-3xl shadow-2xl border-2 border-mallow-light-blue dark:border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-press-start text-mallow-light-text dark:text-white">Kategorya</h2>
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

            {/* Custom Categories List */}
            {categories.length > 0 && (
              <div className="mb-8 border-b-2 border-black/5 dark:border-white/5 pb-6">
                <h3 className="font-pixel text-[12px] opacity-40 mb-3 text-center uppercase font-bold tracking-tight">Ating Kategorya</h3>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map(cat => {
                    const isUsed = transactions.some(t => t.category === cat.name);
                    return (
                      <div key={cat.name} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-xl border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 transition-all">
                        <p className="font-bold text-[11px] truncate opacity-80 pl-1">{cat.name}</p>
                        {!isUsed && (
                          <button 
                            type="button"
                            onClick={() => {
                              audioManager.playSFX('click');
                              setDeleteTarget(cat.name);
                            }}
                            className="text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg active:scale-95 transition-all shrink-0"
                            title="Delete unused category"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-pixel text-lg opacity-40 mb-1">Pangalan</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Netflix, Kuryente"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-mallow-light-blue transition-colors"
                />
              </div>

              <div>
                <label className="block font-pixel text-lg opacity-40 mb-2">Pumili ng Icon</label>
                <div className="grid grid-cols-4 gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {ICONS.map((icon) => {
                    const IconComp = icon.component;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => {
                          audioManager.playSFX('click');
                          setSelectedIcon(icon.name);
                        }}
                        className={`p-3 rounded-xl flex items-center justify-center border-2 transition-all ${selectedIcon === icon.name ? 'bg-mallow-light-blue/20 border-mallow-light-blue scale-110' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-60'}`}
                      >
                        <IconComp size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-mallow-light-text dark:bg-white text-white dark:text-space-bg font-press-start text-xs py-4 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                DAGDAG KATEGORYA
              </button>
            </form>

          </motion.div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          onDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        title="BURAHIN ANG KATEGORYA?"
        message={`Sigurado ka bang nais mong burahin ang "${deleteTarget}"? Hindi ito mababawi.`}
        danger={true}
        confirmText="BURAHIN"
        cancelText="HINDI"
      />
    </AnimatePresence>
  );
};

export default CategoryModal;
