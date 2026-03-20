import { useState } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PixelMallow from './components/PixelMallow';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import TransactionModal from './components/TransactionModal';
import TransactionList from './components/TransactionList';
import AccountModal from './components/AccountModal';
import CategoryModal from './components/CategoryModal';
import { useFinanceData } from './hooks/useFinanceData';
import { useTheme } from './hooks/useTheme';
import { usePWAInstall } from './hooks/usePWAInstall';
import { audioManager } from './utils/audioManager';
import { useEffect } from 'react';

function App() {
  const [loadingApp, setLoadingApp] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(() => {
    const saved = localStorage.getItem('mallow_privacy_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showLanding, setShowLanding] = useState(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return false;
    return !sessionStorage.getItem('skipLanding');
  });

  const { isInstallable, isInstalled, handleInstall } = usePWAInstall();

  const { 
    transactions, 
    accounts, 
    categories, 
    addTransaction, 
    deleteTransaction, 
    addAccount, 
    addCategory, 
    balance 
  } = useFinanceData();
  const { theme, toggleTheme } = useTheme();
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + Number(t.amount), 0);
  
  const expenses = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);

  useEffect(() => {
    localStorage.setItem('mallow_privacy_mode', JSON.stringify(showBalance));
  }, [showBalance]);

  const handleToggleMusic = () => {
    audioManager.playSFX('toggle');
    if (isPlayingMusic) {
      audioManager.stopAll();
      setIsPlayingMusic(false);
    } else {
      audioManager.playBGM('bgm');
      setIsPlayingMusic(true);
    }
  };

  const maskAmount = (amount) => {
    if (showBalance) return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return '• • • •';
  };

  if (loadingApp) {
    return <LoadingScreen onComplete={() => {
      setLoadingApp(false);
    }} />;
  }

  if (showLanding) {
    return (
      <LandingPage 
        onStart={() => {
          sessionStorage.setItem('skipLanding', 'true');
          setShowLanding(false);
        }}
        onInstall={handleInstall}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-mallow-light-bg dark:bg-space-bg text-mallow-light-text dark:text-white font-sans selection:bg-black/10 dark:selection:bg-white/20 transition-colors duration-300 overflow-x-hidden flex justify-center">
      <AnimatePresence>
        {/* Header / Dashboard */}
        <div className="w-full max-w-2xl px-5 pt-8 md:pt-12 min-h-screen flex flex-col">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-press-start tracking-tighter text-mallow-light-text dark:text-white">MallowMoney</h1>
              <p className="font-pixel text-lg opacity-60 leading-none mt-1">Ang iyong ipon buddy!</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  const nextTheme = theme === 'dark' ? 'light' : 'dark';
                  audioManager.playSFX(nextTheme + 'mode');
                  toggleTheme();
                }}
                className="p-3 rounded-2xl bg-mallow-light-blue/20 dark:bg-white/5 border border-mallow-light-blue/30 dark:border-white/10 hover:scale-110 active:scale-95 transition-all text-mallow-light-text dark:text-white"
              >
                {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-400" />}
              </button>
            </div>
          </header>

          <main className="relative">
            <div className="relative z-10">
              {/* Net Balance Card (The Banner) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 md:p-8 text-center relative overflow-hidden shadow-xl border-t-4 border-mallow-light-pink dark:border-transparent mx-auto"
              >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Wallet size={120} />
              </div>
              <div className="flex items-center justify-center space-x-3 mb-1">
                <p className="font-pixel text-xl opacity-40 uppercase tracking-widest leading-none">Kabuuang Ipon</p>
                <button 
                  onClick={() => {
                    audioManager.playSFX('click');
                    setShowBalance(!showBalance);
                  }}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-40 hover:opacity-100 transition-all"
                >
                  {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              <h2 className={`text-4xl md:text-5xl font-black mb-6 ${balance >= 0 ? 'text-inherit' : 'text-red-500'}`}>
                ₱{maskAmount(balance)}
              </h2>

              {/* Income/Expense Summary */}
              <div className="flex justify-around items-center pt-6 border-t border-black/5 dark:border-white/10">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-green-500 mb-1">
                    <TrendingUp size={14} />
                    <span className="font-pixel text-lg uppercase tracking-wider">KITA</span>
                  </div>
                  <p className="font-bold text-lg">₱{showBalance ? income.toLocaleString() : '••••'}</p>
                </div>
                <div className="w-[1px] h-10 bg-black/5 dark:bg-white/10" />
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-red-500 mb-1">
                    <TrendingDown size={14} />
                    <span className="font-pixel text-lg uppercase tracking-wider">GASTOS</span>
                  </div>
                  <p className="font-bold text-lg">₱{showBalance ? expenses.toLocaleString() : '••••'}</p>
                </div>
              </div>
              </motion.div>
            </div>

            {/* Pixel Mallow Widget */}
            <div className="mt-8 mb-6">
              <PixelMallow 
                balance={balance} 
                theme={theme} 
                onToggleMusic={handleToggleMusic}
                isPlayingMusic={isPlayingMusic}
              />
            </div>

            {/* Accounts Section */}
            <div className="mt-10 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
              <div className="flex space-x-4">
                <div className="flex-none w-48 glass-card p-5 border-l-4 border-mallow-light-blue dark:border-transparent">
                  <div className="flex items-center space-x-2 opacity-40 mb-2">
                    <Wallet size={14} />
                    <span className="font-pixel text-sm uppercase tracking-wider">MGA ACCOUNT</span>
                  </div>
                  <div className="space-y-3">
                    {accounts.map(acc => (
                      <div key={acc.id} className="flex justify-between items-center">
                      <p className="font-bold text-sm truncate pr-2">{acc.name}</p>
                      <p className="font-pixel text-lg">₱{showBalance ? acc.balance.toLocaleString() : '••••'}</p>
                    </div>
                    ))}
                  </div>
                </div>

                {/* Add Account Button */}
                <button 
                  onClick={() => {
                    audioManager.playSFX('click');
                    setIsAccountModalOpen(true);
                  }}
                  className="flex-none w-48 glass-card p-5 border-dashed border-2 border-black/10 dark:border-white/10 flex flex-col items-center justify-center space-y-2 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Plus size={20} />
                  <span className="font-pixel text-sm uppercase tracking-wider">Dagdag Banko</span>
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <TransactionList 
              transactions={transactions} 
              onDelete={(id) => {
                audioManager.playSFX('click');
                deleteTransaction(id);
              }}
              showBalance={showBalance}
            />
          </main>
        </div>
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          audioManager.playSFX('click');
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-mallow-light-pink to-mallow-light-blue dark:from-white dark:to-white text-white dark:text-space-bg rounded-2xl shadow-[0_8px_30px_rgba(255,179,198,0.3)] dark:shadow-[0_8px_20px_rgba(255,255,255,0.1)] flex items-center justify-center z-40"
      >
        <Plus size={32} />
      </motion.button>

      {/* Modals */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addTransaction}
        accounts={accounts}
        categories={categories}
        onAddCategory={() => setIsCategoryModalOpen(true)}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onAdd={addAccount}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAdd={addCategory}
      />
    </div>
  );
}

export default App;
