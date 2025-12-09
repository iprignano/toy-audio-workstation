// First octave, lower to higher notes
const firstOctave = [
  { octave: 1, note: 'C', freq: 32.7 },
  { octave: 1, note: 'C#', freq: 34.64 },
  { octave: 1, note: 'D', freq: 36.7 },
  { octave: 1, note: 'D#', freq: 38.89 },
  { octave: 1, note: 'E', freq: 41.2 },
  { octave: 1, note: 'F', freq: 43.65 },
  { octave: 1, note: 'F#', freq: 46.24 },
  { octave: 1, note: 'G', freq: 48.99 },
  { octave: 1, note: 'G#', freq: 51.91 },
  { octave: 1, note: 'A', freq: 55 },
  { octave: 1, note: 'A#', freq: 58.27 },
  { octave: 1, note: 'B', freq: 61.73 },
];

export const noteRegistry = (() => {
  // Build the notes register, starting from the base
  // first octave and doubling the frequency of the notes
  // for each octave loop
  const notes = [...firstOctave];
  let previousOctave = firstOctave;
  for (let oct = 1; oct < 6; oct++) {
    previousOctave = previousOctave.map(({ octave, note, freq }) => ({
      octave: octave + 1,
      note,
      freq: freq * 2,
    }));
    notes.push(...previousOctave);
  }
  // Reverse them as we want to show the higher notes at the top
  return notes.reverse();
})();
