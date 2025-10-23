import { createEffect, createSignal, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';
import { getAudioContext, playNote } from '../../lib/audio';

import styles from './styles.module.css';

// First Octave, bottom to top
const baseNotes = [
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

const allNotes = (() => {
  let notes = [...baseNotes];
  let previousOctave = baseNotes;
  for (let round = 1; round < 5; round++) {
    previousOctave = previousOctave.map(({ octave, note, freq }) => {
      return { octave: octave + 1, note, freq: freq * 2 };
    });
    notes.push(...previousOctave);
  }
  return notes.reverse();
})();

const STEPS_LENGHT = 32;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);

type Store = Record<number, { freq?: number; length?: number }[]>;

export default function SynthSequencer(props: { isPlaying: boolean; bpm: number }) {
  const [currentStep, setCurrentStep] = createSignal(0);
  const [intervalId, setIntervalId] = createSignal<NodeJS.Timeout>();
  const [notesStore, setNotesStore] = createStore<Store>(
    STEPS_ARRAY.reduce((acc, val) => {
      acc[val] = [];
      return acc;
    }, {} as Store),
  );

  const toggleNote = ({ step, freq }: { step: number; freq: number }) => {
    if (notesStore[step].find((n) => n.freq === freq)) {
      setNotesStore(step, (n) => n.filter(({ freq: f }) => f !== freq));
    } else {
      setNotesStore(step, notesStore[step].length, { freq, length: 1 });
    }
  };

  createEffect(() => {
    if (!props.isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      if (currentStep() === 1) {
        console.log('synth', performance.now());
      }
      if (currentStep() >= STEPS_LENGHT) {
        setCurrentStep(0);
      }

      const time = getAudioContext().currentTime;
      if (notesStore[currentStep()]?.length) {
        notesStore[currentStep()].forEach((note) => {
          if (note.freq) {
            playNote(note.freq, 'sine', 0.1);
          }
        });
      }

      setCurrentStep((step) => step + 1);
    }, 60_000 / props.bpm / 8);
    // 1 minute is 60_000ms
    // 60_000 / 8 gives us the interval between 32th notes

    setIntervalId(interval);

    // Clean up any running timer when the BPM
    // changes or the playback is stopped
    onCleanup(() => {
      clearInterval(intervalId());
    });
  });

  return (
    <div class={styles.wrapper}>
      <table class={styles.noteTable}>
        <tbody>
          {allNotes.map(({ note, octave, freq }) => (
            <tr>
              <td class={styles.noteName}>
                {note}
                {octave}
              </td>
              {STEPS_ARRAY.map((step) => (
                <td onClick={() => toggleNote({ step, freq })}>
                  {notesStore[step].find((n) => n?.freq === freq) && (
                    <span class={step === currentStep() ? `${styles.highlight}` : ''}>
                      {note}
                      {octave}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
