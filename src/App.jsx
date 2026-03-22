import { useState, useEffect } from 'react';
import { 
  Plus, Wallet, TrendingUp, TrendingDown, Sun, Moon, Eye, EyeOff, 
  Cloud, CloudOff, LogOut, Package, Trash2, Calculator, 
  ArrowLeftRight, HandCoins 
} from 'lucide-react';
import { auth, provider } from './firebase-config';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import PixelMallow from './components/PixelMallow';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import TransactionModal from './components/TransactionModal';
import TransactionList from './components/TransactionList';
import AccountModal from './components/AccountModal';
import CategoryModal from './components/CategoryModal';
import CalculatorModal from './components/CalculatorModal';
import ConverterModal from './components/ConverterModal';
import { useFinanceData } from './hooks/useFinanceData';
import { useTheme } from './hooks/useTheme';
import { audioManager } from './utils/audioManager';
import DebtsModal from './components/DebtsModal';
import ConfirmModal from './components/ConfirmModal';

function App() {
  const [loadingApp, setLoadingApp] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem('guestMode') === 'true');
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Authentication State Observer
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  // Landing Page Skip Logic
  const [showLanding, setShowLanding] = useState(() => {
    // Robust standalone detection across platforms
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone || 
      navigator.standalone ||
      document.referrer.includes('android-app://') || // For Android TWA
      window.location.search.includes('mode=standalone'); // Fallback param
      
    console.log('MallowMoney Display Mode:', isStandalone ? 'Standalone' : 'Browser');
    
    if (isStandalone) return false;
    
    // For browser, always show landing first unless they just came from it
    return !sessionStorage.getItem('skipLanding');
  });

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone || 
    navigator.standalone
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('PWA Install Prompt Ready');
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (audioManager) audioManager.playSFX('click');
    if (!deferredPrompt) {
      console.log('Install prompt not deferred yet');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const { theme, toggleTheme } = useTheme();
  
  const { 
    transactions, accounts, categories, debts, subscriptions,
    addTransaction, deleteTransaction, addAccount, deleteAccount,
    addCategory, deleteCategory, addDebt, updateDebt, deleteDebt,
    addSubscription, deleteSubscription, balance 
  } = useFinanceData(user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isDebtsOpen, setIsDebtsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(() => {
    const saved = localStorage.getItem('mallow_privacy_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    localStorage.setItem('mallow_privacy_mode', JSON.stringify(showBalance));
  }, [showBalance]);

  // Auth Functions
  const login = async () => {
    try {
      if (isFabOpen) setIsFabOpen(false);
      await signInWithPopup(auth, provider);
      sessionStorage.removeItem('guestMode');
      sessionStorage.setItem('skipLanding', 'true');
      setIsGuest(false);
      setShowLanding(false);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const startAsGuest = () => {
    sessionStorage.setItem('guestMode', 'true');
    sessionStorage.setItem('skipLanding', 'true');
    setIsGuest(true);
    setShowLanding(false);
  };

  const handleLogout = async () => {
    try {
      if (user) await signOut(auth);
      sessionStorage.clear(); // Clear all session flags
      setIsGuest(false);
      setShowLanding(true);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  // Analytics
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
  const expensesByCategory = categories.map(cat => {
    const total = transactions
      .filter(t => t.amount < 0 && t.category === cat.name)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
    return { name: cat.name, value: total };
  }).filter(data => data.value > 0).sort((a, b) => b.value - a.value);

  const PIE_COLORS = ['#FFB3C6', '#7DCED9', '#5AB9C7', '#E63946', '#0077B6', '#F97316', '#2D2327'];

  // Helpers
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
    if (showBalance) return (Number(amount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return '• • • •';
  };

  if (loadingApp || !authChecked) {
    return <LoadingScreen onComplete={() => setLoadingApp(false)} />;
  }

  return (
    <div className="min-h-screen w-full bg-mallow-light-bg dark:bg-space-bg text-mallow-light-text dark:text-white font-sans selection:bg-black/10 dark:selection:bg-white/20 transition-colors duration-300 overflow-x-hidden flex justify-center">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingPage 
            key="landing"
            onStart={startAsGuest} 
            onLogin={login}
            onInstall={handleInstall}
            isInstallable={!!deferredPrompt}
            isInstalled={isInstalled}
          />
        ) : (!user && !isGuest) ? (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="min-h-screen w-full flex flex-col justify-center items-center px-6"
          >
            <motion.div className="glass-card p-8 md:p-10 text-center max-w-md w-full border-t-4 border-mallow-light-pink shadow-2xl relative">
              <div className="relative h-28 w-full flex items-center justify-center mb-6 mt-2 mx-auto pointer-events-none">
                 <PixelMallow variant="saving" scale={0.9} theme={theme} />
              </div>
              <h2 className="text-xl md:text-2xl font-press-start mb-4 leading-loose text-center tracking-tighter">WELCOME</h2>
              <p className="font-pixel text-lg opacity-60 mb-10 leading-relaxed">Choose how you want to use MallowMoney:</p>
              
              <div className="space-y-4">
                <button
                  onClick={login}
                  className="w-full py-5 bg-mallow-light-blue text-mallow-light-text font-press-start text-[10px] md:text-[12px] rounded-2xl shadow-xl border-2 border-white/50 hover:-translate-y-1 active:scale-95 transition-all flex justify-center items-center gap-2"
                >
                  <Cloud size={18} />
                  LOGIN TO SYNC
                </button>
                
                <button
                  onClick={startAsGuest}
                  className="w-full py-5 bg-black/5 dark:bg-white/5 font-press-start text-[10px] md:text-[12px] rounded-2xl border-2 border-transparent hover:border-black/10 dark:hover:border-white/20 hover:-translate-y-1 active:scale-95 transition-all text-black dark:text-white"
                >
                  USE AS GUEST (LOCALLY)
                </button>
              </div>

              <button 
                onClick={() => setShowLanding(true)}
                className="mt-8 font-pixel text-sm opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest underline decoration-dotted"
              >
                Go Back to Landing Page
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl px-5 pt-8 md:pt-12 min-h-screen flex flex-col"
          >
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-xl md:text-2xl font-press-start tracking-tighter text-mallow-light-text dark:text-white">MallowMoney</h1>
                <p className="font-pixel text-lg opacity-60 leading-none mt-1">Ang iyong ipon buddy!</p>
              </div>
              <div className="flex items-center space-x-3">
                <div 
                  className="flex items-center justify-center p-3 rounded-2xl bg-mallow-light-blue/20 dark:bg-white/5 border border-mallow-light-blue/30 dark:border-white/10"
                  title={!user ? 'Guest Mode (Local Only)' : (isOnline ? 'Synced to Cloud' : 'Working Offline')}
                >
                  {!user ? (
                    <CloudOff size={20} className="text-gray-400 dark:text-gray-500" />
                  ) : isOnline ? (
                    <Cloud size={20} className="text-green-500" />
                  ) : (
                    <CloudOff size={20} className="text-orange-500" />
                  )}
                </div>
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

            <main className="relative pb-32">
              <div className="mb-6 relative z-20">
                <PixelMallow 
                  balance={balance} 
                  theme={theme} 
                  onToggleMusic={handleToggleMusic}
                  isPlayingMusic={isPlayingMusic}
                />
              </div>

              <div className="relative z-10 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 md:p-8 text-center relative overflow-hidden shadow-xl border-t-4 border-mallow-light-pink dark:border-transparent"
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

                {/* Accounts Card */}
                <div className="glass-card p-6 border-l-4 border-mallow-light-blue dark:border-transparent">
                  <div className="flex items-center space-x-2 opacity-40 mb-4">
                    <Wallet size={16} />
                    <span className="font-pixel text-sm uppercase tracking-wider">MGA ACCOUNT</span>
                  </div>
                  <div className="space-y-3">
                    {accounts.map(acc => (
                      <div key={acc.id} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                        <p className="font-bold text-base truncate pr-2">{acc.name}</p>
                        <div className="flex items-center space-x-3">
                          <p className="font-pixel text-lg">₱{showBalance ? acc.balance.toLocaleString() : '••••'}</p>
                          {!transactions.some(t => t.accountId === acc.id) && (
                            <button 
                              onClick={() => { audioManager.playSFX('click'); deleteAccount(acc.id); }}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics Card */}
                {expensesByCategory.length > 0 && (
                  <div className="glass-card p-6 border-l-4 border-[#7DCED9] dark:border-transparent">
                    <div className="flex items-center space-x-2 opacity-40 mb-4">
                      <TrendingDown size={16} />
                      <span className="font-pixel text-sm uppercase tracking-wider">GASTOS BREAKDOWN</span>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={expensesByCategory} 
                            cx="50%" cy="50%" 
                            innerRadius={60} outerRadius={80} 
                            paddingAngle={5} dataKey="value" stroke="none"
                          >
                            {expensesByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <RechartsTooltip 
                            formatter={(v) => [`₱${v.toLocaleString()}`, 'Total']}
                            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: theme === 'dark' ? '#1a1c24' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <TransactionList 
                  transactions={transactions} 
                  onDelete={(id) => { audioManager.playSFX('click'); deleteTransaction(id); }}
                  showBalance={showBalance}
                />
              </div>
            </main>

            <AnimatePresence>
              {isFabOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-30 bg-black/5 dark:bg-black/40 backdrop-blur-[2px]"
                  onClick={() => setIsFabOpen(false)}
                />
              )}
            </AnimatePresence>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#1a1c24]/90 backdrop-blur-xl border-t-2 border-black/5 dark:border-white/5 pb-safe">
              <div className="max-w-md mx-auto relative flex items-center justify-between px-6 h-16">
                <div className="flex items-center space-x-1">
                  <button onClick={() => { audioManager.playSFX('click'); setIsCalcOpen(true); }} className="p-3 active:scale-90 transition-transform text-mallow-light-text dark:text-gray-400"><Calculator size={22} /></button>
                  <button onClick={() => { audioManager.playSFX('click'); setIsConverterOpen(true); }} className="p-3 active:scale-90 transition-transform text-mallow-light-text dark:text-gray-400"><ArrowLeftRight size={22} /></button>
                </div>
                
                <div className="relative flex flex-col items-center -mt-12">
                  <AnimatePresence>
                    {isFabOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="absolute bottom-full mb-6 flex flex-col items-center space-y-4"
                      >
                        <div className="flex items-center space-x-3 w-40 justify-end">
                          <span className="font-pixel text-[12px] uppercase bg-white dark:bg-black px-3 py-2 rounded-xl shadow-lg font-bold">Kategorya</span>
                          <button onClick={() => { setIsCategoryModalOpen(true); setIsFabOpen(false); audioManager.playSFX('click'); }} className="w-14 h-14 bg-white dark:bg-[#1a1c24] rounded-full shadow-xl flex items-center justify-center border-2 border-[#7DCED9]"><Package size={22} className="text-[#5AB9C7]" /></button>
                        </div>
                        <div className="flex items-center space-x-3 w-40 justify-end">
                          <span className="font-pixel text-[12px] uppercase bg-white dark:bg-black px-3 py-2 rounded-xl shadow-lg font-bold">Banko</span>
                          <button onClick={() => { setIsAccountModalOpen(true); setIsFabOpen(false); audioManager.playSFX('click'); }} className="w-14 h-14 bg-white dark:bg-[#1a1c24] rounded-full shadow-xl flex items-center justify-center border-2 border-mallow-light-blue"><Wallet size={22} className="text-mallow-light-blue" /></button>
                        </div>
                        <div className="flex items-center space-x-3 w-40 justify-end">
                          <span className="font-pixel text-[12px] uppercase bg-white dark:bg-black px-3 py-2 rounded-xl shadow-lg font-bold">Record</span>
                          <button onClick={() => { setIsModalOpen(true); setIsFabOpen(false); audioManager.playSFX('click'); }} className="w-14 h-14 bg-white dark:bg-[#1a1c24] rounded-full shadow-xl flex items-center justify-center border-2 border-mallow-light-pink"><TrendingUp size={22} className="text-mallow-light-pink" /></button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { audioManager.playSFX('click'); setIsFabOpen(!isFabOpen); }}
                    className={`w-16 h-16 text-white dark:text-space-bg rounded-2xl flex items-center justify-center border-4 border-mallow-light-bg dark:border-space-bg ${isFabOpen ? 'bg-[#2D2327] dark:bg-white' : 'bg-gradient-to-tr from-mallow-light-pink to-mallow-light-blue dark:from-white dark:to-white'}`}
                  >
                    <motion.div animate={{ rotate: isFabOpen ? 45 : 0 }}><Plus size={32} /></motion.div>
                  </motion.button>
                </div>

                <div className="flex items-center space-x-1">
                  <button onClick={() => { audioManager.playSFX('click'); setIsDebtsOpen(true); }} className="p-3 text-mallow-light-text dark:text-gray-400"><HandCoins size={22} /></button>
                  <button onClick={() => { audioManager.playSFX('click'); setIsLogoutConfirmOpen(true); }} className="p-3 text-red-500"><LogOut size={22} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Modals */}
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addTransaction} accounts={accounts} categories={categories} onAddCategory={() => setIsCategoryModalOpen(true)} />
      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} onAdd={addAccount} accounts={accounts} onDelete={deleteAccount} />
      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onAdd={addCategory} categories={categories} transactions={transactions} onDelete={deleteCategory} />
      <CalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
      <ConverterModal isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} />
      <DebtsModal isOpen={isDebtsOpen} onClose={() => setIsDebtsOpen(false)} debts={debts} subscriptions={subscriptions} addDebt={addDebt} updateDebt={updateDebt} deleteDebt={deleteDebt} addSubscription={addSubscription} deleteSubscription={deleteSubscription} addTransaction={addTransaction} />
      <ConfirmModal isOpen={isLogoutConfirmOpen} onClose={() => setIsLogoutConfirmOpen(false)} onConfirm={handleLogout} title="LOG OUT / EXIT" message="Sigurado ka bang nais mong lumabas? Mawawala ang session mo pero ligtas ang iyong data sa Cloud." confirmText="LALABAS NA" cancelText="TEKA LANG" />
    </div>
  );
}

export default App;
