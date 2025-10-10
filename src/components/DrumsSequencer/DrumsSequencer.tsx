import { createSignal } from 'solid-js';

import styles from './styles.module.css';

const STEPS_LENGHT = 16;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);
const INSTRUMENTS = ['kick', 'snare', 'hihats'];

export default function DrumsSequencer() {
  return (
    <div class={styles.wrapper}>
      <table class="monospace">
        <thead id="steps">
          <tr>
            <th></th>
            {STEPS_ARRAY.map((step) => (
              <th scope="col" data-step={step} class="monospace">
                {step}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {INSTRUMENTS.map((instrument) => (
            <tr id={instrument}>
              <td scope="row" class="monospace">
                {instrument}
              </td>
              {STEPS_ARRAY.map((step) => {
                const attributes = {
                  [`data-${instrument}-step`]: step,
                  type: 'checkbox' as const,
                };
                return (
                  <td>
                    <input {...attributes} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
