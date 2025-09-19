
import React, { useState, useCallback, useRef } from 'react';
import type { MidiData } from './types';
import { parseMidiFile } from './services/midiService';
import { usePlayer } from './hooks/usePlayer';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import { UploadIcon } from './components/Icons';

const App: React.FC = () => {
  const [midiData, setMidiData] = useState<MidiData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const player = usePlayer({ duration: midiData?.duration ?? 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setMidiData(null);
      player.stop();

      try {
        // In a real app, you would parse the MIDI file here.
        // We are using a mock service for demonstration.
        const parsedData = await parseMidiFile(file);
        setMidiData(parsedData);
        setFileName(file.name);
      } catch (err) {
        setError('Failed to parse MIDI file. Please try another file.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [player]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans antialiased overflow-hidden">
      <header className="flex-shrink-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
           <h1 className="text-xl font-bold tracking-wider text-fuchsia-400">MIDI Waterfall</h1>
           {fileName && <p className="text-sm text-slate-400 truncate hidden sm:block">{fileName}</p>}
        </div>
      </header>
      
      <main className="flex-grow relative flex items-center justify-center">
        {isLoading && <div className="text-fuchsia-400">Loading...</div>}
        {error && <div className="text-red-500 max-w-sm text-center">{error}</div>}

        {!midiData && !isLoading && !error && (
            <div className="text-center">
                <div className="p-8 border-2 border-dashed border-slate-600 rounded-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-300">Visualize Your Music</h2>
                    <p className="text-slate-400 mb-6">Upload a MIDI file to begin.</p>
                    <button 
                        onClick={triggerFileSelect}
                        className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-fuchsia-900/50"
                    >
                        <UploadIcon />
                        Select MIDI File
                    </button>
                </div>
            </div>
        )}
        
        <div className="absolute top-0 left-0 w-full h-full">
            {midiData && <Visualizer midiData={midiData} currentTime={player.currentTime} isPlaying={player.isPlaying} />}
        </div>
      </main>
      
      {midiData && (
        <footer className="flex-shrink-0 z-20 p-2">
            <Controls player={player} />
        </footer>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".mid,.midi"
        className="hidden"
      />
    </div>
  );
};

export default App;
