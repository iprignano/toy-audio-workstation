import styles from './styles.module.css';
import { fill } from 'es-toolkit/array';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

import { getAudioContext, playSnare, playKick, playHihats } from '../../lib/audio';

const STEPS_LENGHT = 16;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);
const INSTRUMENTS = ['kick', 'snare', 'hihats'] as const;

type Instrument = (typeof INSTRUMENTS)[number];
type OnStepToggle = (instrument: Instrument, step: number, isChecked: boolean) => void;

export default function DrumsSequencer(props: { bpm: number; isPlaying: boolean }) {
  const initialDrumsStore = {
    kick: fill(Array(16), false),
    snare: fill(Array(16), false),
    hihats: fill(Array(16), false),
  };
  const [currentStep, setCurrentStep] = createSignal(0);
  const [intervalId, setIntervalId] = createSignal<NodeJS.Timeout>();
  const [drumsStore, setDrumsStore] = createStore(initialDrumsStore);

  const onStepToggle: OnStepToggle = (instrument, step, isChecked) => {
    setDrumsStore(instrument, step - 1, isChecked);
  };

  createEffect(() => {
    if (!props.isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      if (currentStep() === 1) {
        console.log('synth', performance.now());
      }

      if (currentStep() >= 16) {
        setCurrentStep(0);
      }

      const time = getAudioContext().currentTime;
      if (drumsStore.kick.at(currentStep() + 1)) {
        playKick(time);
      }
      if (drumsStore.snare.at(currentStep() + 1)) {
        playSnare(time);
      }
      if (drumsStore.hihats.at(currentStep() + 1)) {
        playHihats(time);
      }

      setCurrentStep((step) => step + 1);
    }, 60_000 / props.bpm / 4);
    // 1 minute is 60_000ms
    // 60_000 / 4 gives us the interval between quarter notes
    // we divide by 4 because we want 16th notes

    setIntervalId(interval);

    // Clean up any running timer when the BPM
    // changes or the playback is stopped
    onCleanup(() => {
      clearInterval(intervalId());
    });
  });

  return (
    <div class={`${styles.wrapper} monospace`}>
      <div />
      {STEPS_ARRAY.map((step) => (
        <div classList={{ [styles.step]: true, [styles.activeStep]: step === currentStep() }}>
          {step}
        </div>
      ))}
      {INSTRUMENTS.map((instrument) => (
        <>
          <div class={styles.instrument}>{instrument}</div>
          {STEPS_ARRAY.map((step) => (
            <div classList={{ [styles.activeStep]: props.isPlaying && step === currentStep() }}>
              <input
                type="checkbox"
                checked={drumsStore?.[instrument][step]}
                onChange={(evt) => {
                  evt.preventDefault();
                  onStepToggle(instrument, step + 1, evt.target.checked);
                }}
              />
            </div>
          ))}
        </>
      ))}
    </div>
  );
}
