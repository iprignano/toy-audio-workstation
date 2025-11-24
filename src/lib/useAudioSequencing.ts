import { createEffect, createSignal, onCleanup, useContext } from 'solid-js';

import { getAudioContext, playHihats, playKick, playNote, playSnare } from './audio';

import { AppContext } from '../components/AppContext/AppContext';

const LOOP_STEPS_LENGTH = 32;

export const useAudioSequencing = () => {
  const context = useContext(AppContext)!;

  const [intervalId, setIntervalId] = createSignal<NodeJS.Timeout>();

  createEffect(() => {
    if (!context.isPlaying()) {
      return;
    }

    const interval = setInterval(() => {
      if (context.currentStep() >= LOOP_STEPS_LENGTH) {
        context.setCurrentStep(0);
      }

      const time = getAudioContext().currentTime;

      // Drums only play on 16th beats, so we
      // divide the 32nd-based current step by 2
      const drumStep = (context.currentStep() + 1) / 2;

      if (
        context.drums[context.drumSequenceIndex()].kick[drumStep] &&
        context.activeInstruments.kick
      ) {
        playKick(time, context.drumKit());
      }
      if (
        context.drums[context.drumSequenceIndex()].snare[drumStep] &&
        context.activeInstruments.snare
      ) {
        playSnare(time, context.drumKit());
      }
      if (
        context.drums[context.drumSequenceIndex()].hihats[drumStep] &&
        context.activeInstruments.hihats
      ) {
        playHihats(time, context.drumKit());
      }

      if (context.keys[context.synthSequenceIndex()][context.currentStep()]?.length) {
        context.keys[context.synthSequenceIndex()][context.currentStep()]?.forEach((note) => {
          if (note.freq) {
            playNote({
              frequency: note.freq,
              wave: context.oscWave(),
              duration: 0.1 * (note.length ?? 1),
              attack: context.synthAttack(),
              release: context.synthRelease(),
            });
          }
        });
      }

      context.setCurrentStep((step) => step + 1);
    }, 60_000 / context.bpm() / 8);
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
