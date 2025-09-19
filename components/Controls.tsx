
import React, { useRef, useCallback } from 'react';
import type { UsePlayerReturn } from '../hooks/usePlayer';
import { PlayIcon, PauseIcon, ReplayIcon } from './Icons';

interface ControlsProps {
  player: UsePlayerReturn;
}

const Controls: React.FC<ControlsProps> = ({ player }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { isPlaying, play, pause, stop, currentTime, duration, seek } = player;

  const handleSeek = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    seek(percentage * duration);
  }, [duration, seek]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={stop} className="text-slate-300 hover:text-white transition-colors">
          <ReplayIcon />
        </button>
        <button
          onClick={isPlaying ? pause : play}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full p-3 text-white transition-all transform hover:scale-110"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <span className="text-sm font-mono text-slate-400 w-12 text-center">{formatTime(currentTime)}</span>
        <div 
          ref={progressBarRef}
          onClick={handleSeek}
          className="w-full h-2 bg-slate-700 rounded-full cursor-pointer group"
        >
          <div className="h-full bg-fuchsia-500 rounded-full relative" style={{ width: `${progressPercentage}%` }}>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
        <span className="text-sm font-mono text-slate-400 w-12 text-center">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default Controls;
