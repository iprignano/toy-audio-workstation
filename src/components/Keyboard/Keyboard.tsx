import { createSignal, onMount } from 'solid-js';

import styles from './styles.module.css';
import { playNote as playAudioNote, releaseNote as releaseAudioNote } from '../../lib/audio';
import { difference, union } from 'es-toolkit';

const initialNotes = [
  { note: '1C', freq: 130.8 },
  { note: '1C#', freq: 138.56 },
  { note: '1D', freq: 146.8 },
  { note: '1D#', freq: 155.56 },
  { note: '1E', freq: 164.8 },
  { note: '1F', freq: 174.6 },
  { note: '1F#', freq: 184.96 },
  { note: '1G', freq: 195.96 },
  { note: '1G#', freq: 207.64 },
  { note: '1A', freq: 220 },
  { note: '1A#', freq: 233.08 },
  { note: '1B', freq: 246.92 },
  { note: '2C', freq: 261.6 },
  { note: '2C#', freq: 277.12 },
  { note: '2D', freq: 293.6 },
  { note: '2D#', freq: 311.12 },
  { note: '2E', freq: 329.6 },
  { note: '2F', freq: 349.2 },
  { note: '2F#', freq: 369.92 },
  { note: '2G', freq: 391.92 },
  { note: '2G#', freq: 415.28 },
  { note: '2A', freq: 440 },
  { note: '2A#', freq: 466.16 },
  { note: '2B', freq: 493.84 },
];

// Using Ableton's keyboard mapping
// because that's what I'm used to
const keyMap: Record<string, string> = {
  a: '1C',
  w: '1C#',
  s: '1D',
  e: '1D#',
  d: '1E',
  f: '1F',
  t: '1F#',
  g: '1G',
  y: '1G#',
  h: '1A',
  u: '1A#',
  j: '1B',
  k: '2C',
  o: '2C#',
  l: '2D',
};

const oscTypes: { wave: OscillatorType; label: string }[] = [
  { label: 'sin', wave: 'sine' },
  { label: 'tri', wave: 'triangle' },
  { label: 'sqr', wave: 'square' },
  { label: 'saw', wave: 'sawtooth' },
];

export default function Keyboard() {
  const [isPressedDown, setIsPressedDown] = createSignal(false);
  const [currentOctave, setCurrentOctave] = createSignal(2);
  const [oscWaveIndex, setOscWaveIndex] = createSignal(0);
  const [notesPlaying, setNotesPlaying] = createSignal<number[]>([]);
  const [notes, setNotes] = createSignal(initialNotes);

  const lowerOctave = () => {
    if (currentOctave() === 0) return;
    setCurrentOctave(currentOctave() - 1);
    setNotes(notes().map(({ note, freq }) => ({ note, freq: freq / 2 })));
  };
  const increaseOctave = () => {
    if (currentOctave() === 4) return;
    setCurrentOctave(currentOctave() + 1);
    setNotes(notes().map(({ note, freq }) => ({ note, freq: freq * 2 })));
  };
  const playNote = (note: number) => {
    playAudioNote(note, oscTypes[oscWaveIndex()].wave);
    setNotesPlaying(() => {
      const notes = union(notesPlaying(), [note]);
      return notes;
    });
  };
  const releaseNote = (note: number) => {
    releaseAudioNote(note);
    setNotesPlaying(() => {
      const notes = difference(notesPlaying(), [note]);
      return notes;
    });
  };

  const keypressHandler = (evt: KeyboardEvent) => {
    const noteKey = keyMap[evt.key];

    if (evt.metaKey) return;

    if (evt.type === 'keydown' && evt.key === 'z') {
      evt.preventDefault();
      lowerOctave();
      return;
    } else if (evt.type === 'keydown' && evt.key === 'x') {
      evt.preventDefault();
      increaseOctave();
      return;
    }

    const note = notes().find(({ note }) => note === noteKey)?.freq;
    if (!note) return;

    evt.preventDefault();
    if (evt.type === 'keydown') {
      playNote(note);
    } else {
      releaseNote(note);
    }
  };

  onMount(() => {
    document?.addEventListener('mouseup', () => {
      // Handles events where the `mouseleave` event is fired
      // on a key but the mouse is still pressed.
      // Without this, a `mouseenter` event would trigger
      // a `playNote` call.
      setIsPressedDown(false);
    });

    document?.addEventListener('keydown', keypressHandler);
    document?.addEventListener('keyup', keypressHandler);
  });

  return (
    <div class={styles.wrapper}>
      <div class={`${styles.ctrls} monospace`}>
        <div>
          <span>wave</span>
          <input
            type="range"
            id="waves"
            name="waves"
            min="0"
            max="3"
            step="1"
            value={oscWaveIndex()}
            list="wavesList"
            onChange={(evt) => setOscWaveIndex(Number(evt.target.value))}
          />

          <datalist id="wavesList">
            {oscTypes.map(({ label }, index) => {
              return <option value={index} label={label}></option>;
            })}
          </datalist>
        </div>
      </div>
      <div class={styles.keys}>
        {notes().map(({ note, freq }) => {
          return (
            <button
              classList={{
                [styles.black]: note.includes('#'),
                [styles.key]: true,
                [styles.highlighted]: Boolean(notesPlaying().find((f) => f === freq)),
              }}
              onMouseDown={(evt) => {
                // don't do anything if it's not a left-click
                if (evt.button !== 0) return;
                evt.preventDefault();

                setIsPressedDown(true);
                playNote(freq);
              }}
              onMouseUp={() => {
                setIsPressedDown(false);
                releaseNote(freq);
              }}
              onMouseEnter={() => {
                if (isPressedDown()) playNote(freq);
              }}
              onMouseLeave={() => {
                releaseNote(freq);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
