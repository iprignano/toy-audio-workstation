import { createEffect, createSignal, onCleanup, useContext } from 'solid-js';

import { getAudioContext, playHihats, playKick, playNote, playSnare } from './audio';

import { AppContext } from '../components/AppContext/AppContext';

const LOOP_STEPS_LENGTH = 32;

export const useAudioSequencing = () => {
  const context = useContext(AppContext);

  const [intervalId, setIntervalId] = createSignal<NodeJS.Timeout>();

  createEffect(() => {
    if (!context?.isPlaying()) {
      return;
    }

    const interval = setInterval(() => {
      if (context?.currentStep() >= LOOP_STEPS_LENGTH) {
        context?.setCurrentStep(0);
      }

      const time = getAudioContext().currentTime;

      // Drums only play on 16th beats, so we
      // divide the 32nd-based current step by 2
      const drumStep = (context?.currentStep() + 1) / 2;

      if (context?.drums.kick[drumStep]) {
        playKick(time);
      }
      if (context?.drums.snare[drumStep]) {
        playSnare(time);
      }
      if (context?.drums.hihats[drumStep]) {
        playHihats(time);
      }

      if (context?.keys[context?.currentStep()]?.length) {
        context?.keys[context?.currentStep()]?.forEach((note) => {
          if (note.freq) {
            playNote(note.freq, context?.oscWave(), 0.1);
          }
        });
      }

      context?.setCurrentStep((step) => step + 1);
    }, 60_000 / context?.bpm() / 8);
    // 1 minute is 60_000ms
    // `60_000 / bpm` gives us the interval between quarter
    //                notes in a minute at the chosen tempo
    // `60_000 / bpm / 8` makes that the interval between 32nd notes,
    //                    as they are 1/8 of a quarter note

    setIntervalId(interval);

    onCleanup(() => {
      clearInterval(intervalId());
    });
  });
};
