
let audioUnlocked = false;

// хранилище активных аудио
const activeAudios = new Map();

// ---------- UNLOCK ----------
export const unlockAudio = async (src) => {
  if (audioUnlocked) return;


  const audio = new Audio(src || "");
  try {
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audioUnlocked = true;
  } catch {
    // игнорируем ошибки autoplay policy
  }
};

// ---------- PLAY ----------
export const playSound = async (src, options = {}) => {
  // гарантируем unlock перед проигрыванием
  if (!audioUnlocked) {
    await unlockAudio(src);
  }

  const audio = new Audio(src);

  if (options.volume !== undefined) {
    audio.volume = options.volume;
  }

  if (options.playbackRate !== undefined) {
    audio.playbackRate = options.playbackRate;
  }

  if (options.loop) {
    audio.loop = options.loop;
  }

  try {
    await audio.play();
  } catch {
    // игнорируем
  }

  // сохраняем ссылку
  if (!activeAudios.has(src)) {
    activeAudios.set(src, []);
  }

  activeAudios.get(src).push(audio);
};

// ---------- STOP ----------
export const stopSound = (src) => {
  const audios = activeAudios.get(src);
  if (!audios) return;

  audios.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeAudios.delete(src);
};

// ---------- STOP ALL ----------
export const stopAllSounds = () => {
  activeAudios.forEach((audios) => {
    audios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  });

  activeAudios.clear();
};
