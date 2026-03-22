import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Share, Cloud, User } from 'lucide-react';
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

const LandingPage = ({ onStart, onLogin, onInstall, isInstalled, isInstallable, isInAppBrowser }) => {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const handleDownloadClick = () => {
    if (audioManager) audioManager.playSFX('click');
    onInstall();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F8FB] to-white transition-colors duration-500 overflow-x-hidden flex flex-col items-center relative py-12">
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
            {isInAppBrowser && (
              <div className="mb-4 p-4 bg-orange-500/10 rounded-2xl border-2 border-orange-500/20 text-center">
                <p className="font-pixel text-[12px] text-orange-600">
                  I-tap ang <span className="font-bold underline">"Open in Browser"</span> para madownload ang app!
                </p>
              </div>
            )}
            
            <button
              onClick={handleDownloadClick}
              className="group relative px-8 py-6 bg-mallow-light-blue text-mallow-light-text font-press-start text-[14px] md:text-[16px] rounded-2xl shadow-lg hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/50 w-full"
            >
              {isInstalled ? <Smartphone size={28} /> : <Download size={28} />}
              {isInstalled ? 'MALLOWMONEY INSTALLED' : (isInstallable ? 'DOWNLOAD NOW' : 'DOWNLOAD NOW')}
            </button>

            {!isInstalled && !isInstallable && !isInAppBrowser && !isIOS && (
              <p className="mt-4 font-pixel text-[10px] opacity-40 text-center uppercase tracking-widest">
                Inihahanda ang installation... pakihintay lang!
              </p>
            )}

            {isIOS && !isInstalled && (
              <p className="mt-4 font-pixel text-[10px] text-mallow-light-text opacity-60 text-center uppercase tracking-widest leading-relaxed">
                iOS (Safari): I-tap ang <Share size={12} className="inline mx-1" /> at piliin ang <br/> **"Add to Home Screen"**
              </p>
            )}

            <div className="w-full flex items-center gap-4 my-8">
              <div className="h-[1px] flex-1 bg-mallow-light-blue/20" />
              <span className="font-pixel text-[12px] opacity-30 uppercase tracking-widest">OR</span>
              <div className="h-[1px] flex-1 bg-mallow-light-blue/20" />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => { if (audioManager) audioManager.playSFX('click'); onLogin(); }}
                className="w-full py-5 bg-white text-mallow-light-blue font-press-start text-[10px] rounded-2xl border-2 border-mallow-light-blue/30 hover:bg-mallow-light-blue/5 active:scale-95 transition-all flex justify-center items-center gap-3 uppercase"
              >
                <Cloud size={18} />
                LOGIN TO SYNC
              </button>
              
              <button
                onClick={() => { if (audioManager) audioManager.playSFX('click'); onStart(); }}
                className="w-full py-5 bg-black/5 text-black/60 font-press-start text-[10px] rounded-2xl hover:bg-black/10 active:scale-95 transition-all flex justify-center items-center gap-3 uppercase"
              >
                <User size={18} />
                USE AS GUEST (BROWSER)
              </button>
            </div>
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
