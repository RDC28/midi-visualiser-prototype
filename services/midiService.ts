
import type { MidiData, Note, Track } from '../types';

/**
 * In a real application, you would use a library like @tonejs/midi to parse the file.
 * `const midi = new Midi(await file.arrayBuffer())`
 * This mock function generates sample data to demonstrate the visualizer.
 */
export const parseMidiFile = (file: File): Promise<MidiData> => {
  console.log(`"Parsing" file: ${file.name}`);
  
  return new Promise(resolve => {
    // Simulate parsing delay
    setTimeout(() => {
      // "Twinkle Twinkle Little Star"
      const notes: Note[] = [
        { midi: 60, name: 'C4', time: 0.0, duration: 0.4, velocity: 0.8 },
        { midi: 60, name: 'C4', time: 0.5, duration: 0.4, velocity: 0.8 },
        { midi: 67, name: 'G4', time: 1.0, duration: 0.4, velocity: 0.8 },
        { midi: 67, name: 'G4', time: 1.5, duration: 0.4, velocity: 0.8 },
        { midi: 69, name: 'A4', time: 2.0, duration: 0.4, velocity: 0.8 },
        { midi: 69, name: 'A4', time: 2.5, duration: 0.4, velocity: 0.8 },
        { midi: 67, name: 'G4', time: 3.0, duration: 0.9, velocity: 0.8 },

        { midi: 65, name: 'F4', time: 4.0, duration: 0.4, velocity: 0.8 },
        { midi: 65, name: 'F4', time: 4.5, duration: 0.4, velocity: 0.8 },
        { midi: 64, name: 'E4', time: 5.0, duration: 0.4, velocity: 0.8 },
        { midi: 64, name: 'E4', time: 5.5, duration: 0.4, velocity: 0.8 },
        { midi: 62, name: 'D4', time: 6.0, duration: 0.4, velocity: 0.8 },
        { midi: 62, name: 'D4', time: 6.5, duration: 0.4, velocity: 0.8 },
        { midi: 60, name: 'C4', time: 7.0, duration: 0.9, velocity: 0.8 },
      ];
      
       const harmony: Note[] = [
        { midi: 48, name: 'C3', time: 0.0, duration: 1.0, velocity: 0.6 },
        { midi: 55, name: 'G3', time: 1.0, duration: 1.0, velocity: 0.6 },
        { midi: 57, name: 'A3', time: 2.0, duration: 1.0, velocity: 0.6 },
        { midi: 55, name: 'G3', time: 3.0, duration: 1.0, velocity: 0.6 },
        { midi: 53, name: 'F3', time: 4.0, duration: 1.0, velocity: 0.6 },
        { midi: 52, name: 'E3', time: 5.0, duration: 1.0, velocity: 0.6 },
        { midi: 48, name: 'C3', time: 6.0, duration: 1.0, velocity: 0.6 },
        { midi: 55, name: 'G3', time: 7.0, duration: 1.0, velocity: 0.6 },
      ];


      const track1: Track = { name: "Melody", notes: notes, channel: 0 };
      const track2: Track = { name: "Harmony", notes: harmony, channel: 1 };
      
      const allNotes = [...notes, ...harmony];
      const duration = allNotes.reduce((max, note) => Math.max(max, note.time + note.duration), 0);

      const mockMidiData: MidiData = {
        tracks: [track1, track2],
        duration: duration,
      };
      resolve(mockMidiData);
    }, 1000);
  });
};
