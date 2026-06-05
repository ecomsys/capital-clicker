// hooks/useWheelSound.js
import { useRef, useState, useEffect, useCallback } from 'react';

export function useWheelSound(soundPath = "/sounds/wheel-rotate.mp3") {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const soundBufferRef = useRef(null);
  const [soundLoaded, setSoundLoaded] = useState(false);

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = context;
    gainNodeRef.current = context.createGain();
    gainNodeRef.current.connect(context.destination);
    gainNodeRef.current.gain.value = 1;

    const loadSound = async () => {
      try {
        const response = await fetch(soundPath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        soundBufferRef.current = audioBuffer;
        setSoundLoaded(true);
      } catch (error) {
        console.error("Ошибка загрузки звука:", error);
      }
    };
    loadSound();

    return () => {
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch (e) {
            console.log(e);
        }
      }
      context.close();
    };
  }, [soundPath]);

  const playSoundWithFade = useCallback(() => {
    if (!soundLoaded || !audioContextRef.current || !gainNodeRef.current || !soundBufferRef.current) return;

    const ctx = audioContextRef.current;
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (e) {
        console.log(e);
      }
    }
    const newSource = ctx.createBufferSource();
    newSource.buffer = soundBufferRef.current;
    newSource.connect(gainNodeRef.current);
    sourceRef.current = newSource;

    const now = ctx.currentTime;
    gainNodeRef.current.gain.cancelScheduledValues(now);
    gainNodeRef.current.gain.setValueAtTime(1, now);
    gainNodeRef.current.gain.setValueAtTime(1, now + 4);
    gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 8);

    newSource.start();
  }, [soundLoaded]);

  const stopCurrentSound = useCallback(() => {
    if (sourceRef.current && audioContextRef.current) {
      try { sourceRef.current.stop(); } catch (e) {
        console.log(e);
      }
      sourceRef.current = null;
    }
  }, []);

  const resumeAudioContext = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, []);

  return { playSoundWithFade, stopCurrentSound, resumeAudioContext, soundLoaded };
}