import { useState, useEffect, useMemo } from 'react';
// SW registration is handled in main.jsx via virtual:pwa-register
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
import FloatingActionButton from './components/FloatingActionButton';
import NicknameModal from './components/NicknameModal';

function App() {
  const [loadingApp, setLoadingApp] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem('guestMode') === 'true');
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Authentication State Observer
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
      if (currentUser) {
        const lastLogin = sessionStorage.getItem('lastLoginTime');
        if (!lastLogin) {
          setIsFirstLogin(true);
          sessionStorage.setItem('lastLoginTime', Date.now().toString());
        }
      }
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
      document.referrer.includes('android-app://') || 
      window.location.search.includes('mode=standalone');
      
    // Set a flag that we've checked this
    if (isStandalone) sessionStorage.setItem('skipLanding', 'true');
    return !isStandalone && !sessionStorage.getItem('skipLanding');
  });

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone || 
    navigator.standalone
  );

  const [isInAppBrowser] = useState(() => 
    /FBAN|FBAV|Instagram|Messenger|Pinterest|Snapchat|Line|WhatsApp/i.test(navigator.userAgent)
  );

  useEffect(() => {
    // Initial check for captured prompt
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPrompt = e;
      console.log('PWA Install Prompt Ready');
    };

    // Periodic check since some browsers might fire before this effect or globally
    const interval = setInterval(() => {
      if (window.deferredPrompt && !deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
      }
    }, 1000);

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearInterval(interval);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (audioManager) audioManager.playSFX('click');
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isStandalone) {
      alert('Naka-install na si Mallow! Buksan ang app gamit ang icon sa Home Screen o Desktop.');
      setIsInstalled(true);
      return;
    }

    if (!isSecure) {
      alert('OPPS! PWA requires a SECURE connection (HTTPS). Kung gumagamit ka ng mobile, i-access ang app gamit ang "localhost" via USB o gumamit ng HTTPS connection para mainstall.');
      return;
    }

    if (!deferredPrompt) {
      console.log('PWA: No prompt available');
      // If no prompt, it might be already installed but browser hasn't detected it, or browser doesn't support it.
      alert('Paki-wait lang, Mallow! Kung ayaw lumabas ng prompt, subukan ang (...) "Install App" o "Add to Home Screen" sa iyong browser menu.');
      return;
    }
    
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        window.deferredPrompt = null;
        setIsInstalled(true);
        sessionStorage.setItem('skipLanding', 'true');
        setShowLanding(false);
      }
    } catch (err) {
      console.error('PWA Error:', err);
    }
  };

  const { theme, toggleTheme } = useTheme();
  
  const { 
    transactions, accounts, categories, debts, subscriptions,
    addTransaction, deleteTransaction, addAccount, deleteAccount,
    addCategory, deleteCategory, addDebt, updateDebt, deleteDebt,
    addSubscription, deleteSubscription, balance,
    nickname, loadingProfile, updateNickname
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

  const [showWelcome, setShowWelcome] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(() => localStorage.getItem('mallow_has_visited') === 'true');

  // Trigger Welcome Screen
  useEffect(() => {
    if ((user || isGuest) && !sessionStorage.getItem('welcomeShown')) {
      setShowWelcome(true);
      sessionStorage.setItem('welcomeShown', 'true');
      if (!isReturningUser) {
        localStorage.setItem('mallow_has_visited', 'true');
      }
    }
  }, [user, isGuest, isReturningUser]);

  // Auth Functions
  const login = async () => {
    try {
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
      setLoadingApp(true); // Start the loading animation
      if (user) await signOut(auth); // Sign out from Firebase
      
      // Wait for 2 seconds to show the loading screen for a smooth aesthetic
      setTimeout(() => {
        // Clear all session states and force a hard refresh
        // This ensures the App component remounts cleanly and triggers the standard loading flow
        sessionStorage.clear();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error signing out', error);
      setLoadingApp(false);
    }
  };

  // Analytics
  const { income, expenses, expensesByCategory } = useMemo(() => {
    const inc = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + Number(t.amount), 0);
    const exp = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
    
    const expCat = categories.map(cat => {
      const total = transactions
        .filter(t => t.amount < 0 && t.category === cat.name)
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      return { name: cat.name, value: total };
    }).filter(data => data.value > 0).sort((a, b) => b.value - a.value);

    return { income: inc, expenses: exp, expensesByCategory: expCat };
  }, [transactions, categories]);

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

  if (loadingApp || !authChecked || loadingProfile) {
    return <LoadingScreen onComplete={() => setLoadingApp(false)} />;
  }

  return (
    <div className="min-h-screen w-full lg:max-w-7xl mx-auto bg-mallow-light-bg dark:bg-space-bg text-mallow-light-text dark:text-white font-sans selection:bg-black/10 dark:selection:bg-white/20 transition-colors duration-300 overflow-x-hidden flex justify-center scrollbar-hide">
      <NicknameModal 
        isOpen={user && !loadingProfile && isFirstLogin && !nickname} 
        onSubmit={updateNickname} 
      />
      
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingPage 
            key="landing"
            onStart={startAsGuest} 
            onLogin={login}
            onInstall={handleInstall}
            isInstalled={isInstalled}
            isInstallable={!!deferredPrompt}
            isInAppBrowser={isInAppBrowser}
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
                 <PixelMallow variant="welcome" scale={0.9} theme={theme} />
              </div>
              <h2 className="text-xl md:text-2xl font-press-start mb-4 leading-loose text-center tracking-tighter text-mallow-light-text dark:text-[#7DCED9]">WELCOME</h2>
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

              {!isInstalled && (
                <button 
                  onClick={() => setShowLanding(true)}
                  className="mt-8 font-pixel text-sm opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest underline decoration-dotted"
                >
                  Go Back to Landing Page
                </button>
              )}
            </motion.div>
          </motion.div>
        ) : showWelcome ? (
          <motion.div 
            key="welcome-splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-4"
          >
            <div className="text-center space-y-4 mb-2">
              <h1 className="text-3xl font-pixel text-mallow-light-text dark:text-[#7DCED9]">
                {isReturningUser ? 'WELCOME BACK' : 'WELCOME'}
              </h1>
              <p className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter">
                {nickname ? (
                  <span className="font-pixel text-[2.5rem] leading-none mb-2 block">{nickname}</span>
                ) : 'MallowMoney'}
              </p>
            </div>
            <div className="relative h-64 w-full flex items-center justify-center pointer-events-none">
               <PixelMallow variant="welcome" onComplete={() => setShowWelcome(false)} theme={theme} />
            </div>
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
                <h1 className="text-xl md:text-2xl font-press-start tracking-tighter text-mallow-light-text dark:text-white uppercase">
                  {nickname ? `HI ${nickname}!` : 'MallowMoney'}
                </h1>
                {!nickname && (
                  <p className="font-pixel text-lg opacity-60 leading-none mt-1">
                    Ang iyong ipon buddy!
                  </p>
                )}
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

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#1a1c24]/90 backdrop-blur-xl border-t-2 border-black/5 dark:border-white/5 pb-safe">
              <div className="max-w-md mx-auto relative flex items-center justify-between px-6 h-16">
                <div className="flex items-center space-x-1">
                  <button onClick={() => { audioManager.playSFX('click'); setIsCalcOpen(true); }} className="p-3 active:scale-90 transition-transform text-mallow-light-text dark:text-gray-400"><Calculator size={22} /></button>
                  <button onClick={() => { audioManager.playSFX('click'); setIsConverterOpen(true); }} className="p-3 active:scale-90 transition-transform text-mallow-light-text dark:text-gray-400"><ArrowLeftRight size={22} /></button>
                </div>

                <FloatingActionButton 
                  setIsCategoryModalOpen={setIsCategoryModalOpen}
                  setIsAccountModalOpen={setIsAccountModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />

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
      <ConfirmModal 
        isOpen={isLogoutConfirmOpen} 
        onClose={() => setIsLogoutConfirmOpen(false)} 
        onConfirm={handleLogout} 
        title="LOG OUT / EXIT" 
        message={isGuest 
          ? "Sigurado ka bang nais mong lumabas? Ang data mo ay naka-save lang sa device na ito. Kapag na-delete ang app, mawawala din ang iyong progress."
          : "Sigurado ka bang nais mong lumabas? Mawawala ang session mo pero ligtas ang iyong data sa Cloud."
        } 
        confirmText="SIGE" 
        cancelText="HINDI" 
      />
      </div>
  );
}

export default App;
