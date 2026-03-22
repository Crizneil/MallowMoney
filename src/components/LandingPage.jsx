import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Smartphone, Monitor } from 'lucide-react';
import PixelMallow from './PixelMallow';
import { audioManager } from '../utils/audioManager';

const TypingAnimation = ({ text, className }) => {
  return (
    <motion.div
      className={`font-press-start text-[10px] md:text-[12px] text-black flex flex-wrap gap-x-[2px] ${className || 'justify-center mb-8'}`}
    >
      {Array.from(text).map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.1,
            delay: index * 0.05
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const LandingPage = ({ onStart, onLogin, onInstall, isInstallable, isInstalled }) => {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger|Pinterest|Snapchat|Line|WhatsApp/i.test(navigator.userAgent);

  const handleDownloadClick = () => {
    if (audioManager) audioManager.playSFX('click');
    
    if (isInstallable) {
      onInstall(); 
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F8FB] to-white transition-colors duration-500 overflow-x-hidden flex flex-col items-center relative py-12">
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
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative border-4 border-mallow-light-blue"
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
                <h2 className="font-press-start text-[14px] leading-relaxed text-mallow-light-text uppercase">How to Install</h2>
                <p className="font-pixel text-lg opacity-60 mt-2 tracking-tight">Sulitin ang MallowMoney sa iyong device!</p>
              </div>

              <div className="space-y-6">
                {isInAppBrowser && (
                  <div className="flex items-start gap-4 p-4 bg-orange-500/10 rounded-2xl border-2 border-orange-500/20">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Share size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1 text-orange-600">Open in Browser</h3>
                      <p className="text-xs opacity-70 leading-relaxed">I-tap ang three dots o Share icon at piliin ang **"Open in Browser"**.</p>
                    </div>
                  </div>
                )}

                {isIOS && !isInAppBrowser && (
                  <div className="flex items-start gap-4 p-4 bg-mallow-light-blue/10 rounded-2xl">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Smartphone size={20} className="text-mallow-light-text" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">iOS (iPhone/iPad)</h3>
                      <p className="text-xs opacity-70 leading-relaxed">I-tap ang <Share size={14} className="inline mx-1" /> icon at piliin ang **"Add to Home Screen"**.</p>
                    </div>
                  </div>
                )}

                {!isIOS && !isInAppBrowser && (
                  <div className="flex items-start gap-4 p-4 bg-mallow-light-blue/10 rounded-2xl border-2 border-mallow-light-blue/20">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Monitor size={20} className="text-mallow-light-text" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">Chrome / Android</h3>
                      <p className="text-xs opacity-70 leading-relaxed">
                        I-copy ang link at i-paste sa **Google Chrome**. 
                        I-click ang three dots at piliin ang **"Install App"** o **"Create Shortcut"**.
                      </p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          if (audioManager) audioManager.playSFX('click');
                          alert('Link copied! Paste it in Chrome.');
                        }}
                        className="mt-2 text-[10px] font-press-start text-mallow-light-blue underline"
                      >
                        COPY APP LINK
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full mt-8 py-5 bg-mallow-light-blue text-mallow-light-text font-press-start text-[10px] rounded-2xl shadow-lg border-2 border-white hover:scale-[1.02] active:scale-95 transition-all uppercase"
              >
                Maliwanag, Mallow!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center min-h-[45vh]">
        <div className="text-center w-full">
          <div className="relative h-24 mb-6 overflow-hidden w-full max-w-sm mx-auto flex items-center justify-center">
            <motion.div
              animate={{ x: [-120, 120], y: [0, -10, 0, -10, 0] }}
              transition={{ x: { duration: 3, repeat: Infinity, ease: "linear" }, y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute z-20"
            >
              <div className="w-4 h-4 bg-yellow-400 border-2 border-[#2D2327] rounded-sm shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] flex items-center justify-center">
                <div className="w-1 h-1 bg-white opacity-60" />
              </div>
            </motion.div>
            <motion.div
              animate={{ x: [-150, 90] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute z-10"
            >
              <PixelMallow variant="running" scale={0.8} theme="light" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter text-center w-full px-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-mallow-light-blue to-[#7DCED9] block w-full">
              MallowMoney
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-pixel text-black mb-12 max-w-2xl mx-auto leading-none opacity-60"
          >
            Handle your money the malumanay way.
          </motion.p>
        </div>
      </section>

      {/* Description Area with Waving Avatar */}
      <section className="w-full max-w-4xl px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-md rounded-[40px] p-8 md:p-12 border-4 border-mallow-light-blue shadow-xl flex flex-col items-center"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div 
              className="relative shrink-0 cursor-pointer"
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
            >
              <motion.img
                src={isHoveringAvatar ? "/MallowMoney/dev-crizneil-waving.png" : "/MallowMoney/dev-crizneil.png"}
                alt="Dev Crizneil"
                className="w-32 h-32 md:w-40 md:h-40 relative z-10"
                style={{ imageRendering: 'pixelated' }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex flex-col md:items-start text-center md:text-left">
              <TypingAnimation text="Hello, I'm Dev Crizneil!" className="justify-center md:justify-start mb-4" />
              <p className="font-pixel text-lg md:text-xl text-black leading-relaxed">
                I built <span className="text-mallow-light-blue font-black">MallowMoney</span> because I believe that managing your money should feel calm and pixel-perfect.
              </p>
            </div>
          </div>
          
          <div className="w-full h-[2px] bg-mallow-light-blue/20 mb-10" />

          <div className="flex flex-col items-center w-full max-w-md">
            <button
              onClick={handleDownloadClick}
              className="group relative px-8 py-6 bg-mallow-light-blue text-mallow-light-text font-press-start text-[14px] md:text-[16px] rounded-2xl shadow-lg hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/50 w-full"
            >
              <Download size={28} />
              DOWNLOAD NOW
            </button>
          </div>
        </motion.div>
      </section>

      <footer className="py-8 px-6 text-center">
        <p className="font-pixel text-sm uppercase tracking-widest text-black opacity-30">
          MallowMoney v1.4 2026 • Developed by Crizneil
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
