import { fill } from 'es-toolkit/array';
import { createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

import { getAudioContext, playSnare, playKick, playHihats } from '../../lib/audio';
import Header from '../Header/Header';
import DrumsSequencer from '../DrumsSequencer/DrumsSequencer';
import Keyboard from '../Keyboard/Keyboard';
import Footer from '../Footer/Footer';
import type { OnStepToggle } from '../DrumsSequencer/DrumsSequencer';

import styles from './styles.module.css';

export default function App() {
  const initialDrumsStore = {
    kick: fill(Array(16), false),
    snare: fill(Array(16), false),
    hihats: fill(Array(16), false),
  };
  const [step, setStep] = createSignal(0);
  const [intervalId, setIntervalId] = createSignal<NodeJS.Timeout>();
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [drumsStore, setDrumsStore] = createStore(initialDrumsStore);

  const onStepToggle: OnStepToggle = (instrument, step, isChecked) => {
    setDrumsStore(instrument, step - 1, isChecked);
  };

  createEffect(() => {
    if (!isPlaying()) {
      clearInterval(intervalId());
      return;
    }

    const interval = setInterval(() => {
      if (step() >= 16) {
        setStep(0);
      }

      const time = getAudioContext().currentTime;
      if (drumsStore.kick.at(step() + 1)) {
        playKick(time);
      }
      if (drumsStore.snare.at(step() + 1)) {
        playSnare(time);
      }
      if (drumsStore.hihats.at(step() + 1)) {
        playHihats(time);
      }

      setStep((step) => step + 1);
    }, 250);

    setIntervalId(interval);
  });

  return (
    <div class={styles.wrapper}>
      <Header />

      <div class={styles.body}>
        <div class={`${styles.drums} ${styles.instrument}`}>
          <div class={styles.title}>
            <span class="monospace">drums</span>
          </div>
          <DrumsSequencer
            activeStep={step()}
            isPlaying={isPlaying()}
            drumsStore={drumsStore}
            onStepToggle={onStepToggle}
          />
        </div>
        <div class={`${styles.keyboard} ${styles.instrument}`}>
          <div class={styles.title}>
            <span class="monospace">keyboard</span>
          </div>
          <Keyboard />
        </div>
      </div>

      <Footer onPlayStateChange={() => setIsPlaying((prev) => !prev)} isPlaying={isPlaying()} />
    </div>
  );
}
