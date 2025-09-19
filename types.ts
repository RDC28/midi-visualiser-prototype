
// These types are simplified representations of what a MIDI parsing library like @tonejs/midi would provide.

export interface Note {
  midi: number;
  time: number; // in seconds from the start
  duration: number; // in seconds
  velocity: number; // 0-1
  name: string; // e.g., "C4"
}

export interface Track {
  name: string;
  notes: Note[];
  channel: number;
}

export interface MidiData {
  tracks: Track[];
  duration: number; // total duration in seconds
}
