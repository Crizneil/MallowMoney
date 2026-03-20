import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Trash2 } from 'lucide-react';

const TransactionList = ({ transactions, onDelete, showBalance }) => {
  const getIcon = (categoryName) => {
    // In a real app, we'd store the icon name in the transaction. 
    // For now, let's try to match by common category names or default to 'Package'
    const iconMap = {
      'Food': 'Utensils',
      'Transport': 'Car',
      'Shopping': 'ShoppingBag',
      'Health': 'Heart',
      'Income': 'TrendingUp',
      'Entertainment': 'Music'
    };

    const iconName = iconMap[categoryName] || 'Package';
    const IconComp = Icons[iconName] || Icons.Package;
    
    return <IconComp className="text-mallow-light-text dark:text-white opacity-60" />;
  };

  return (
    <div className="mt-8 pb-24 px-1">
      <h3 className="font-pixel text-lg opacity-40 uppercase tracking-widest mb-4 text-mallow-light-text dark:text-white">Huling Transaksyon</h3>
      <AnimatePresence mode="popLayout">
        {transactions.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 opacity-30 italic font-pixel text-xl"
          >
            Walang nakitang listahan...
          </motion.p>
        ) : (
          <div className="space-y-3">
            {transactions.map(t => (
              <motion.div
                layout
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-4 flex justify-between items-center group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-mallow-light-blue/10 dark:bg-white/5 p-3 rounded-xl transition-colors">
                    {getIcon(t.category)}
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">{t.category}</p>
                    <p className="font-pixel text-sm opacity-40">
                      {new Date(t.date).toLocaleDateString(['en-PH'], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className={`font-pixel text-2xl ${t.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {t.amount >= 0 ? '+' : ''}₱{showBalance ? Math.abs(t.amount).toLocaleString() : '••••'}
                  </p>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
