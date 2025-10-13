import { createSignal } from 'solid-js';

import styles from './styles.module.css';

const STEPS_LENGHT = 16;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);
const INSTRUMENTS = ['kick', 'snare', 'hihats'];

export default function DrumsSequencer() {
  return (
    <div class={`${styles.wrapper} monospace`}>
      <div />
      {STEPS_ARRAY.map((step) => (
        <div>{step}</div>
      ))}
      {INSTRUMENTS.map((instrument) => (
        <>
          <div>{instrument}</div>
          {STEPS_ARRAY.map((step) => {
            const attributes = {
              [`data-${instrument}-step`]: step,
              type: 'checkbox' as const,
            };
            return (
              <div>
                <input {...attributes} />
              </div>
            );
          })}
        </>
      ))}
    </div>
  );
}
