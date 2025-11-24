import { useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { AppContext } from '../AppContext/AppContext';
import { Snare } from '../Icon/Snare';
import { Kick } from '../Icon/Kick';
import { Hihats } from '../Icon/Hihats';

import styles from './styles.module.css';

const STEPS_LENGHT = 16;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);
const INSTRUMENTS = ['kick', 'snare', 'hihats'] as const;

type Instrument = (typeof INSTRUMENTS)[number];
type OnStepToggle = (instrument: Instrument, step: number, isChecked: boolean) => void;

const instrumentIcons = {
  snare: (props: { fill: string }) => <Snare {...props} />,
  kick: (props: { fill: string }) => <Kick {...props} />,
  hihats: (props: { fill: string }) => <Hihats {...props} />,
};

export default function DrumsSequencer() {
  const context = useContext(AppContext)!;

  const onStepToggle: OnStepToggle = (instrument, step, isChecked) => {
    context.setDrums(context.drumSequenceIndex(), instrument, step - 1, isChecked);
  };

  const isHiglighted = (
    isPlaying: boolean | undefined,
    step: number,
    currentStep: number | undefined,
  ) => {
    if (!isPlaying || typeof currentStep === 'undefined') return false;
    const eigthStep = Math.floor(currentStep / 2);
    return isPlaying && eigthStep === step;
  };

  return (
    <div class={`${styles.wrapper} monospace`}>
      <div />
      {STEPS_ARRAY.map((step) => (
        <div
          classList={{
            [styles.step]: true,
            [styles.activeStep]: isHiglighted(context.isPlaying(), step, context.currentStep()),
          }}
        >
          {step}
        </div>
      ))}
      {INSTRUMENTS.map((instrument) => (
        <>
          <div
            classList={{
              [styles.instrument]: true,
              [styles.active]: context?.activeInstruments[instrument],
            }}
          >
            <button onClick={() => context.toggleInstrument(instrument, (active) => !active)}>
              <Dynamic component={instrumentIcons[instrument]} fill={'white'} />
            </button>
          </div>
          {STEPS_ARRAY.map((step) => (
            <div
              classList={{
                [styles.activeStep]: isHiglighted(
                  context?.isPlaying(),
                  step,
                  context?.currentStep(),
                ),
              }}
            >
              <input
                type="checkbox"
                checked={context.drums[context.drumSequenceIndex()][instrument][step]}
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
