import { motion } from 'framer-motion';
import { Download, Rocket, Shield, Heart, ArrowRight, Wallet } from 'lucide-react';
import PixelMallow from './PixelMallow';

const LandingPage = ({ onStart, onInstall, isInstallable, isInstalled }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F8FB] to-white dark:from-space-bg dark:to-[#0A0D12] transition-colors duration-500 overflow-x-hidden flex flex-col justify-center items-center">
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
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-mallow-light-blue to-[#7DCED9] dark:from-white dark:to-[#B0E0E6]">
              MallowMoney
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-pixel text-mallow-light-text/70 dark:text-white/70 mb-14 max-w-2xl mx-auto leading-none"
          >
            Budgeting made fluffy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {isInstallable && !isInstalled ? (
              <button
                onClick={onInstall}
                className="group relative px-10 py-5 bg-mallow-light-blue text-mallow-light-text font-press-start text-[10px] rounded-2xl shadow-[0_10px_40px_rgba(176,224,230,0.5)] hover:shadow-[0_15px_50px_rgba(176,224,230,0.7)] transform hover:-translate-y-1.5 active:scale-95 transition-all flex items-center gap-3 overflow-hidden border-2 border-white/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Download size={20} />
                DOWNLOAD NOW
              </button>
            ) : null}

            <button
              onClick={onStart}
              className="px-10 py-5 bg-white/40 dark:bg-white/5 border-2 border-mallow-light-blue/40 dark:border-white/10 text-mallow-light-text dark:text-white font-press-start text-[10px] rounded-2xl hover:bg-mallow-light-blue/20 dark:hover:bg-white/10 transform hover:-translate-y-1.5 active:scale-95 transition-all flex items-center gap-3 backdrop-blur-md shadow-lg"
            >
              {isInstalled ? 'OPEN WEB APP' : 'USE IN BROWSER'}
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-mallow-light-blue/5 dark:bg-black/20 pointer-events-none" />
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
        <p className="font-pixel text-sm uppercase tracking-widest leading-loose">
          MallowMoney v1.3 2026• Developed by Crizneil<br />

        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card p-8 border-t-4 border-transparent hover:border-mallow-light-pink transition-all"
  >
    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="font-press-start text-[10px] mb-4 tracking-wider">{title}</h3>
    <p className="font-pixel text-lg opacity-60 leading-tight">{desc}</p>
  </motion.div>
);

export default LandingPage;
