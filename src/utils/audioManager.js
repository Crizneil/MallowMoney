const AUDIO_URLS = {
  bgm: '/MallowMoney/sounds/bgm.mp3',
  lightmode: '/MallowMoney/sounds/lightmode.mp3',
  darkmode: '/MallowMoney/sounds/darkmode.mp3',
  click: '/MallowMoney/sounds/click.mp3',
  toggle: '/MallowMoney/sounds/toggle.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3',
  loading: 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3'
};

class AudioManager {
  constructor() {
    this.bgm = null;
    this.ambient = null;
    this.isMuted = false;
  }

  playBGM(type) {
    if (this.bgm) {
      this.bgm.pause();
    }
    this.bgm = new Audio(AUDIO_URLS[type]);
    this.bgm.loop = true;
    this.bgm.volume = 0.4;
    if (!this.isMuted) {
      this.bgm.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }

  playAmbient(type) {
    if (this.ambient) {
      this.ambient.pause();
    }
    if (AUDIO_URLS[type]) {
      this.ambient = new Audio(AUDIO_URLS[type]);
      this.ambient.loop = true;
      this.ambient.volume = 0.2;
      if (!this.isMuted) {
        this.ambient.play().catch(e => console.log("Autoplay prevented:", e));
      }
    }
  }

  playSFX(type) {
    const sfx = new Audio(AUDIO_URLS[type]);
    sfx.volume = 0.5;
    if (!this.isMuted) {
      sfx.play().catch(e => console.log("SFX error:", e));
    }
  }

  stopAll() {
    if (this.bgm) this.bgm.pause();
    if (this.ambient) this.ambient.pause();
  }
}

export const audioManager = new AudioManager();
