import { createEffect, onCleanup, useContext } from 'solid-js';

import { getAudioContext, playHihats, playKick, playNote, playSnare } from './audio';

import { AppContext } from '../components/AppContext/AppContext';

const LOOP_STEPS_LENGTH = 32;

// This is the audio scheduling logic for the sequencer.
// Based off "A tale of two clocks": https://web.dev/articles/audio-scheduling
export const useAudioSequencing = () => {
  const context = useContext(AppContext)!;
  const clock = new Worker(new URL('clock.js', import.meta.url));
  const audioCtx = getAudioContext()!;

  createEffect(() => {
    const lookaheadTime = 0.2; // in seconds
    const schedulingInterval = 25; // in milliseconds
    let nextNoteTime = audioCtx.currentTime; // in seconds

    if (!context.isPlaying()) {
      clock.postMessage({ type: 'stop' });
      audioCtx.suspend();
      return;
    }

    clock.postMessage({ type: 'setInterval', interval: schedulingInterval });
    clock.postMessage({ type: 'start' });
    audioCtx.resume();

    // The scheduler clock is ticking in a web worker off the main thread.
    // Each tick will trigger the execution of the callback below which will:
    //   - Schedule new audio (using the Web Audio Context timer);
    //   - Advance the sequencer step to the next beat;
    //   - Wrap around the loop and switch to the next sequence,
    //     if needed.
    clock.onmessage = (event: MessageEvent<{ type: 'tick' }>) => {
      if (event.data.type !== 'tick') {
        throw new Error('Unsupported clock message type');
      }

      // 1. Schedule notes to play
      // -------------------------
      // Here we check whether there are notes to play in the
      // next slice of audio time, and schedule them if so.
      while (nextNoteTime < audioCtx.currentTime + lookaheadTime) {
        // Drums only play on 16th beats, so we
        // divide the 32nd-based step pointer by 2
        const drumStep = (context.currentStep() + 1) / 2;
        const drumSequence = context.drumSequenceIndex();

        if (context.activeInstruments.kick && context.drums[drumSequence].kick[drumStep]) {
          playKick(nextNoteTime, context.drumKit());
        }
        if (context.activeInstruments.snare && context.drums[drumSequence].snare[drumStep]) {
          playSnare(nextNoteTime, context.drumKit());
        }
        if (context.activeInstruments.hihats && context.drums[drumSequence].hihats[drumStep]) {
          playHihats(nextNoteTime, context.drumKit());
        }

        const synthSequence = context.synthSequenceIndex();
        if (context.keys[synthSequence][context.currentStep()]?.length) {
          context.keys[synthSequence][context.currentStep()]?.forEach((note) => {
            if (note.freq) {
              playNote({
                scheduledTime: nextNoteTime,
                frequency: note.freq,
                wave: context.oscWave(),
                duration: 0.1 * (note.length ?? 1),
                attack: context.synthAttack(),
                release: context.synthRelease(),
              });
            }
          });
        }

        // 2. Advance the audio scheduling time by the length
        //    of a 32nd note (1/8 of a quarter note).
        // -------------------------
        nextNoteTime += 60 / context.bpm() / 8;
        //              (60 seconds / beats per minute) = seconds per beat
        //              seconds per beat / 8 = 32nd note length in seconds

        // 3. Advance the current step and switch to the
        //    next sequence if necessary.
        // -------------------------
        //   - If the user queued a specific sequence next,
        //     switch to it.
        //   - If the auto sequence control is on,
        //     switch to the next one in numerical order.
        //   - Otherwise, just stay in the current sequence.
        if (context.currentStep() + 1 === LOOP_STEPS_LENGTH) {
          if (context.nextDrumSequenceIndex() !== null) {
            context.setDrumSequenceIndex(context.nextDrumSequenceIndex() as number);
            context.setNextDrumSequenceIndex(null);
          } else if (context.isDrumAutoSequenced()) {
            context.setDrumSequenceIndex((prev) => (prev === 3 ? 0 : prev + 1));
          }

          if (context.nextSynthSequenceIndex() !== null) {
            context.setSynthSequenceIndex(context.nextSynthSequenceIndex() as number);
            context.setNextSynthSequenceIndex(null);
          } else if (context.isSynthAutoSequenced()) {
            context.setSynthSequenceIndex((prev) => (prev === 3 ? 0 : prev + 1));
          }
        }

        // Advance the step
        context.setCurrentStep((step) => (step + 1 === LOOP_STEPS_LENGTH ? 0 : step + 1));
      }
    };

    onCleanup(() => {
      clock.postMessage({ type: 'stop' });
    });
  });
};
