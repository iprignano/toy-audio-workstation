import { difference, union } from 'es-toolkit';
import { createEffect, createSignal, onCleanup, onMount, useContext } from 'solid-js';

import { AppContext } from '../AppContext/AppContext';
import { playNote as playAudioNote, releaseNote as releaseAudioNote } from '../../lib/audio';
import styles from './styles.module.css';

const initialNotes = [
  { note: '3C', freq: 130.8 },
  { note: '3C#', freq: 138.56 },
  { note: '3D', freq: 146.8 },
  { note: '3D#', freq: 155.56 },
  { note: '3E', freq: 164.8 },
  { note: '3F', freq: 174.6 },
  { note: '3F#', freq: 184.96 },
  { note: '3G', freq: 195.96 },
  { note: '3G#', freq: 207.64 },
  { note: '3A', freq: 220 },
  { note: '3A#', freq: 233.08 },
  { note: '3B', freq: 246.92 },
  { note: '4C', freq: 261.6 }, // "middle C"
  { note: '4C#', freq: 277.12 },
  { note: '4D', freq: 293.6 },
  { note: '4D#', freq: 311.12 },
  { note: '4E', freq: 329.6 },
  { note: '4F', freq: 349.2 },
  { note: '4F#', freq: 369.92 },
  { note: '4G', freq: 391.92 },
  { note: '4G#', freq: 415.28 },
  { note: '4A', freq: 440 },
  { note: '4A#', freq: 466.16 },
  { note: '4B', freq: 493.84 },
  { note: '5C', freq: 523.25 },
];

// Using Ableton's keyboard mapping
// because that's what I'm used to
const keyMap: Record<string, string> = {
  a: '3C',
  w: '3C#',
  s: '3D',
  e: '3D#',
  d: '3E',
  f: '3F',
  t: '3F#',
  g: '3G',
  y: '3G#',
  h: '3A',
  u: '3A#',
  j: '3B',
  k: '4C',
  o: '4C#',
  l: '4D',
};

const oscTypes: { wave: OscillatorType; label: string }[] = [
  { label: 'sin', wave: 'sine' },
  { label: 'tri', wave: 'triangle' },
  { label: 'sqr', wave: 'square' },
  { label: 'saw', wave: 'sawtooth' },
];

export default function Keyboard() {
  const context = useContext(AppContext);
  const [isPressedDown, setIsPressedDown] = createSignal(false);
  const [currentOctave, setCurrentOctave] = createSignal(3);
  const [oscWaveIndex, setOscWaveIndex] = createSignal(0);
  const [notesPlaying, setNotesPlaying] = createSignal<number[]>([]);
  const [notes, setNotes] = createSignal(initialNotes);

  createEffect(() => {
    context?.setOscWave(oscTypes[oscWaveIndex()].wave);
  });

  const lowerOctave = () => {
    if (currentOctave() === 2) return;

    setCurrentOctave(currentOctave() - 1);
    notesPlaying().forEach((note) => releaseNote(note));
    setNotes(notes().map(({ note, freq }) => ({ note, freq: freq / 2 })));
  };
  const increaseOctave = () => {
    if (currentOctave() === 5) return;

    setCurrentOctave(currentOctave() + 1);
    notesPlaying().forEach((note) => releaseNote(note));
    setNotes(notes().map(({ note, freq }) => ({ note, freq: freq * 2 })));
  };
  const playNote = (note: number) => {
    playAudioNote(note, context?.oscWave());
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

    // Don't intercept the event if there's
    // a meta key pressed (e.g. ctrl-t, cmd-l, etc)
    // or if a modal is currently open
    if (evt.metaKey || context?.isModalOpen()) return;

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

  onCleanup(() => {
    document?.removeEventListener('keydown', keypressHandler);
    document?.removeEventListener('keyup', keypressHandler);
  });

  return (
    <div class={styles.wrapper}>
      <div class={`${styles.mobileNotice} monospace`}>
        The keyboard is not ready for mobile yet.
        <br />
        Switch to the sequencer view!
      </div>
      <div class={`${styles.ctrls} monospace`}>
        <div class={`${styles.logo} grotesk`}>
          <img src="/taw2k.png" alt="TAW2k logo" />
        </div>

        <div class={styles.speaker} />

        <div class={styles.octavePicker}>
          <span class={styles.ctrlTitle}>octave</span>
          <div class={styles.octaveSelector}>
            <button class="monospace" onClick={() => lowerOctave()}>
              -
            </button>
            <div class={`${styles.currentOctave} doto`}>
              {currentOctave()}-{currentOctave() + 1}
            </div>
            <button class="monospace" onClick={() => increaseOctave()}>
              +
            </button>
          </div>
        </div>
        <div class={styles.wavePicker}>
          <span class={styles.ctrlTitle}>wave</span>
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
        {notes().map(({ note, freq }) => (
          <button
            classList={{
              [styles.key]: true,
              [styles.black]: note.includes('#'),
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
        ))}
      </div>
    </div>
  );
}
