import { useState, useRef, useEffect, useCallback } from 'react';

interface UsePlayerProps {
  duration: number;
}

export interface UsePlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
}

export const usePlayer = ({ duration }: UsePlayerProps): UsePlayerReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationFrameIdRef = useRef<number>();
  const playbackStartTimeRef = useRef<number>(0);
  const timeAtPauseRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      return;
    }

    // FIX: The tick function is now defined inside the useEffect to avoid stale closures.
    // The animation loop is self-contained and will be correctly restarted if `isPlaying` or `duration` changes.
    const tick = () => {
      const elapsed = (performance.now() - playbackStartTimeRef.current) / 1000;
      const newTime = timeAtPauseRef.current + elapsed;
      
      if (newTime >= duration) {
        setCurrentTime(duration);
        setIsPlaying(false);
      } else {
        setCurrentTime(newTime);
        animationFrameIdRef.current = requestAnimationFrame(tick);
      }
    };

    playbackStartTimeRef.current = performance.now();
    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, duration]);
  
  // Reset when duration changes (new file loaded)
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const play = useCallback(() => {
    if (currentTime >= duration) {
        timeAtPauseRef.current = 0;
        setCurrentTime(0);
    }
    setIsPlaying(true);
  }, [currentTime, duration]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    timeAtPauseRef.current = currentTime;
  }, [currentTime]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    timeAtPauseRef.current = 0;
    setCurrentTime(0);
  }, []);

  const seek = useCallback((time: number) => {
    const newTime = Math.max(0, Math.min(time, duration));
    timeAtPauseRef.current = newTime;
    setCurrentTime(newTime);
    if (isPlaying) {
      playbackStartTimeRef.current = performance.now();
    }
  }, [duration, isPlaying]);

  return { isPlaying, currentTime, duration, play, pause, stop, seek };
};