
interface PianoKeyInfo {
  midi: number;
  type: 'white' | 'black';
  xOffset: number;
}

const buildPianoKeys = (): PianoKeyInfo[] => {
  const keys: PianoKeyInfo[] = [];
  let whiteKeyIndex = 0;
  // Standard 88-key piano starts at MIDI 21 (A0) and ends at 108 (C8)
  for (let midi = 21; midi <= 108; midi++) {
    const note = midi % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(note);
    if (isBlack) {
      keys.push({ midi, type: 'black', xOffset: whiteKeyIndex - 0.3 });
    } else {
      keys.push({ midi, type: 'white', xOffset: whiteKeyIndex });
      whiteKeyIndex++;
    }
  }
  return keys;
};

export const PIANO_KEY_INFO: PianoKeyInfo[] = buildPianoKeys();

export const TRACK_COLORS = [
  '#f0abfc', // fuchsia-300
  '#a78bfa', // violet-400
  '#7dd3fc', // sky-300
  '#67e8f9', // cyan-300
  '#5eead4', // teal-300
  '#86efac', // green-300
  '#fde047', // yellow-300
  '#fda4af', // rose-300
];
