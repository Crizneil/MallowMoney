import { motion, AnimatePresence } from 'framer-motion';
import { Download, Rocket, Shield, Heart, ArrowRight, Wallet, X, Share, Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';
import PixelMallow from './PixelMallow';

const LandingPage = ({ onStart, onInstall, isInstallable, isInstalled }) => {
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleDownloadClick = () => {
    if (isInstallable) {
      onInstall();
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F8FB] to-white transition-colors duration-500 overflow-x-hidden flex flex-col justify-center items-center relative">
      <AnimatePresence>
        {showInstallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-4 border-mallow-light-blue"
            >
              <button
                onClick={() => setShowInstallModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-mallow-light-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Download className="text-mallow-light-text" size={32} />
                </div>
                <h2 className="font-press-start text-[14px] leading-relaxed text-mallow-light-text">HOW TO INSTALL</h2>
                <p className="font-pixel text-lg opacity-60 mt-2">Get MallowMoney on your device!</p>
              </div>

              <div className="space-y-6">
                {/* iOS Instructions */}
                <div className="flex items-start gap-4 p-4 bg-mallow-light-blue/10 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Smartphone size={20} className="text-mallow-light-text" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">iOS (iPhone/iPad)</h3>
                    <p className="text-xs opacity-70 leading-relaxed">Tap the <Share size={14} className="inline mx-1" /> icon then select <strong>"Add to Home Screen"</strong></p>
                  </div>
                </div>

                {/* Android / Chrome Instructions */}
                <div className="flex items-start gap-4 p-4 bg-mallow-light-blue/10 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Monitor size={20} className="text-mallow-light-text" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">Android / Desktop</h3>
                    <p className="text-xs opacity-70 leading-relaxed">Look for the <strong>Install Icon</strong> in your browser's address bar or menu.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full mt-8 py-4 bg-mallow-light-blue text-mallow-light-text font-press-start text-[10px] rounded-2xl shadow-lg border-2 border-white hover:scale-[1.02] active:scale-95 transition-all"
              >
                GOT IT!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center w-full">
          {/* Running Mallow Chasing Coin */}
          <div className="relative h-24 mb-6 overflow-hidden w-full max-w-sm mx-auto flex items-center justify-center">
            {/* The Coin */}
            <motion.div
              animate={{
                x: [-120, 120],
                y: [0, -10, 0, -10, 0]
              }}
              transition={{
                x: { duration: 3, repeat: Infinity, ease: "linear" },
                y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute z-20"
            >
              <div className="w-4 h-4 bg-yellow-400 border-2 border-[#2D2327] rounded-sm shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] flex items-center justify-center">
                <div className="w-1 h-1 bg-white opacity-60" />
              </div>
            </motion.div>

            {/* Mallow Chasing */}
            <motion.div
              animate={{
                x: [-150, 90],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute z-10"
            >
              <PixelMallow variant="running" scale={0.8} theme="light" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter text-center w-full px-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-mallow-light-blue to-[#7DCED9] block w-full">
              MallowMoney
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-pixel text-mallow-light-text/70 mb-14 max-w-2xl mx-auto leading-none"
          >
            Budgeting made fluffy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-6"
          >
            {/* Primary Action: Download for Free */}
            {(!isInstalled) && (
              <button
                onClick={handleDownloadClick}
                className="group relative px-12 py-6 bg-mallow-light-blue text-mallow-light-text font-press-start text-[12px] md:text-[14px] rounded-2xl shadow-[0_20px_50px_rgba(176,224,230,0.6)] hover:shadow-[0_25px_60px_rgba(176,224,230,0.8)] transform hover:-translate-y-2 active:scale-95 transition-all flex items-center gap-4 overflow-hidden border-2 border-white/50 w-full max-w-sm justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Download size={24} />
                DOWNLOAD FOR FREE
              </button>
            )}

            {/* Secondary Action: Use in Browser */}
            <button
              onClick={onStart}
              className="px-8 py-4 bg-white/40 border-2 border-mallow-light-blue/20 text-mallow-light-text/60 font-press-start text-[9px] rounded-xl hover:bg-mallow-light-blue/10 hover:text-mallow-light-text transform hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 backdrop-blur-md"
            >
              {isInstalled ? 'OPEN WEB APP' : 'USE IN BROWSER'}
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-mallow-light-blue/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          <FeatureCard
            icon={<Rocket className="text-[#5AB9C7]" />}
            title="SNAZZY LOGS"
            desc="Mabilis at masayang ilista ang iyong mga ginastos!"
          />
          <FeatureCard
            icon={<Shield className="text-[#5AB9C7]" />}
            title="TOTALLY SECURE"
            desc="Ang data mo ay privacy mo. Walang spies, puro buddies lang."
          />
          <FeatureCard
            icon={<Wallet className="text-[#5AB9C7]" />}
            title="SIMPLE KITA"
            desc="Tingnan ang iyong yaman sa isang mabilis na sulyap."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center opacity-40">
        <p className="font-pixel text-sm uppercase tracking-widest leading-loose text-mallow-light-text">
          MallowMoney v1.3 2026 • Developed by Crizneil<br />
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/70 backdrop-blur-sm p-8 border-t-4 border-transparent hover:border-mallow-light-pink transition-all rounded-3xl shadow-lg"
  >
    <div className="w-12 h-12 bg-mallow-light-blue/10 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="font-press-start text-[10px] mb-4 tracking-wider text-mallow-light-text">{title}</h3>
    <p className="font-pixel text-lg opacity-60 leading-tight text-mallow-light-text">{desc}</p>
  </motion.div>
);

export default LandingPage;
