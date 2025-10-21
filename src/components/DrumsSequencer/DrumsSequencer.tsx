import styles from './styles.module.css';
import type { Store } from 'solid-js/store';

const STEPS_LENGHT = 16;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);
const INSTRUMENTS = ['kick', 'snare', 'hihats'] as const;

type Instrument = (typeof INSTRUMENTS)[number];
export type OnStepToggle = (instrument: Instrument, step: number, isChecked: boolean) => void;

export default function DrumsSequencer(props: {
  activeStep: number;
  drumsStore: Store<any>;
  onStepToggle: OnStepToggle;
  isPlaying: boolean;
}) {
  return (
    <div class={`${styles.wrapper} monospace`}>
      <div />
      {STEPS_ARRAY.map((step) => (
        <div classList={{ [styles.step]: true, [styles.activeStep]: step === props.activeStep }}>
          {step}
        </div>
      ))}
      {INSTRUMENTS.map((instrument) => (
        <>
          <div class={styles.instrument}>{instrument}</div>
          {STEPS_ARRAY.map((step) => (
            <div classList={{ [styles.activeStep]: props.isPlaying && step === props.activeStep }}>
              <input
                type="checkbox"
                checked={props.drumsStore?.[instrument][step]}
                onChange={(evt) => {
                  evt.preventDefault();
                  props.onStepToggle(instrument, step + 1, evt.target.checked);
                }}
              />
            </div>
          ))}
        </>
      ))}
    </div>
  );
}
