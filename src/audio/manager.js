let isUnlocked = false;
const audioPools = new Map();
const POOL_SIZE = 4; // Увеличим до 4, чтобы реже случалась ситуация, когда все заняты

export function preloadSound(src) {
  if (!audioPools.has(src)) {
    const pool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      pool.push(audio);
    }
    audioPools.set(src, pool);
  }
}

export function unlockAudio() {
  if (isUnlocked) return;
  const silent = new Audio('data:audio/wav;base64,U3RlYWx0aCBpcyB0aGUgYmVzdCBwbGF5ZXI=');
  silent.volume = 0;
  silent.play().then(() => {
    silent.pause();
    isUnlocked = true;
  }).catch(() => {});
}

export async function playSound(src, options = {}) {
  if (!isUnlocked) unlockAudio();

  if (!audioPools.has(src)) {
    // Предзагружаем на лету
    const pool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      pool.push(audio);
    }
    audioPools.set(src, pool);
  }

  const pool = audioPools.get(src);
  // Ищем свободный элемент (не играет и не на паузе в процессе загрузки)
  let audio = pool.find(a => a.paused || a.ended);
  if (!audio) {
    // Все заняты — просто игнорируем этот звук (не прерываем предыдущие)
    // console.warn(`All audio instances busy for ${src}, skipping`);
    return;
  }

  // Настройки
  if (options.volume !== undefined) audio.volume = options.volume;
  if (options.playbackRate !== undefined) audio.playbackRate = options.playbackRate;
  if (options.loop !== undefined) audio.loop = options.loop;

  // Сбрасываем текущее время (если элемент не играет, это безопасно)
  audio.currentTime = 0;

  try {
    await audio.play();
  } catch (e) {
    // Игнорируем AbortError, так как он может возникнуть, если элемент внезапно был остановлен извне (но мы его не останавливаем)
    if (e.name !== 'AbortError') {
      console.warn(`Play sound failed: ${src}`, e);
    }
  }
}

export function stopAllSounds() {
  for (const pool of audioPools.values()) {
    for (const audio of pool) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}