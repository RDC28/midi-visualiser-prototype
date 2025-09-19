import React, { useRef, useEffect } from 'react';
import type { MidiData, Note } from '../types';
import { PIANO_KEY_INFO, TRACK_COLORS } from '../constants';

interface VisualizerProps {
  midiData: MidiData;
  currentTime: number;
  isPlaying: boolean;
}

const PIANO_HEIGHT_RATIO = 0.25;
const SECONDS_IN_VIEW = 3.5;

const Visualizer: React.FC<VisualizerProps> = ({ midiData, currentTime, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number>();
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = `https://picsum.photos/1920/1080?blur=5`; // Placeholder background
    img.onload = () => {
      backgroundImageRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // FIX: Moved the draw function inside the useEffect to capture the current `currentTime` from props.
    // This prevents a stale closure where the animation would not update.
    const draw = (width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
  
      // Draw Background
      if (backgroundImageRef.current) {
          ctx.drawImage(backgroundImageRef.current, 0, 0, width, height);
          ctx.fillStyle = 'rgba(18, 18, 27, 0.7)'; // Dark overlay for better note visibility
          ctx.fillRect(0, 0, width, height);
      } else {
          const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
          bgGradient.addColorStop(0, '#1e293b');
          bgGradient.addColorStop(1, '#0f172a');
          ctx.fillStyle = bgGradient;
          ctx.fillRect(0, 0, width, height);
      }
      
      const pianoHeight = height * PIANO_HEIGHT_RATIO;
      const waterfallHeight = height - pianoHeight;
      const whiteKeyCount = PIANO_KEY_INFO.filter(k => k.type === 'white').length;
      const whiteKeyWidth = width / whiteKeyCount;
      const blackKeyWidth = whiteKeyWidth * 0.6;
      const blackKeyHeight = pianoHeight * 0.6;
  
      const pixelsPerSecond = waterfallHeight / SECONDS_IN_VIEW;
  
      // Draw Notes
      midiData.tracks.forEach((track, trackIndex) => {
        const color = TRACK_COLORS[trackIndex % TRACK_COLORS.length];
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
  
        track.notes.forEach(note => {
          const timeUntilNote = note.time - currentTime;
          if (timeUntilNote > SECONDS_IN_VIEW || (note.time + note.duration) < currentTime) {
            return;
          }
  
          const keyInfo = PIANO_KEY_INFO.find(k => k.midi === note.midi);
          if (!keyInfo) return;
  
          const keyX = keyInfo.xOffset * whiteKeyWidth;
          const keyWidth = keyInfo.type === 'white' ? whiteKeyWidth : blackKeyWidth;
          
          const noteTopY = waterfallHeight - (timeUntilNote * pixelsPerSecond);
          const noteHeight = Math.max(1, note.duration * pixelsPerSecond);
  
          const gradient = ctx.createLinearGradient(keyX, noteTopY, keyX, noteTopY + noteHeight);
          gradient.addColorStop(0, `${color}ff`);
          gradient.addColorStop(1, `${color}b0`);
          ctx.fillStyle = gradient;
  
          ctx.fillRect(keyX, noteTopY - noteHeight, keyWidth, noteHeight);
        });
      });
      ctx.shadowBlur = 0;
  
      // Draw pink glow above piano
      const glowGradient = ctx.createLinearGradient(0, waterfallHeight - 50, 0, waterfallHeight);
      glowGradient.addColorStop(0, 'rgba(217, 70, 239, 0)');
      glowGradient.addColorStop(1, 'rgba(217, 70, 239, 0.4)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, waterfallHeight - 50, width, 50);
  
      // Draw Piano
      const whiteKeys = PIANO_KEY_INFO.filter(k => k.type === 'white');
      whiteKeys.forEach((key, index) => {
          ctx.fillStyle = 'white';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.fillRect(index * whiteKeyWidth, waterfallHeight, whiteKeyWidth, pianoHeight);
          ctx.strokeRect(index * whiteKeyWidth, waterfallHeight, whiteKeyWidth, pianoHeight);
      });
  
      const blackKeys = PIANO_KEY_INFO.filter(k => k.type === 'black');
      blackKeys.forEach(key => {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(key.xOffset * whiteKeyWidth, waterfallHeight, blackKeyWidth, blackKeyHeight);
      });
      
      // Draw Key Highlights
      ctx.globalAlpha = 0.5;
      midiData.tracks.forEach((track, trackIndex) => {
        const color = TRACK_COLORS[trackIndex % TRACK_COLORS.length];
        track.notes.forEach(note => {
          const isNoteActive = currentTime >= note.time && currentTime < note.time + note.duration;
          if (isNoteActive) {
            const keyInfo = PIANO_KEY_INFO.find(k => k.midi === note.midi);
            if (!keyInfo) return;
  
            const keyX = keyInfo.xOffset * whiteKeyWidth;
            const keyWidth = keyInfo.type === 'white' ? whiteKeyWidth : blackKeyWidth;
            const keyHeight = keyInfo.type === 'white' ? pianoHeight : blackKeyHeight;
            
            ctx.fillStyle = color;
            ctx.fillRect(keyX, waterfallHeight, keyWidth, keyHeight);
          }
        });
      });
      ctx.globalAlpha = 1.0;
    };

    const render = () => {
      draw(rect.width, rect.height);
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiData, currentTime]); // FIX: Added `currentTime` to dependencies.

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Visualizer;