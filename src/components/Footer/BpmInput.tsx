import { useContext } from 'solid-js';
import styles from './styles.module.css';

import { AppContext } from '../AppContext/AppContext';

const minBpm = 60;
const maxBpm = 240;

export default function BpmInput() {
  const context = useContext(AppContext);
  let tempoInputRef: HTMLInputElement;

  return (
    <>
      <button
        aria-label="Decrease BPM"
        disabled={context?.bpm() === minBpm}
        class={styles.minus}
        onClick={() => context?.setBpm((bpm) => Math.max(bpm - 1, minBpm))}
      >
        -
      </button>
      <input
        ref={(el) => (tempoInputRef = el)}
        type="text"
        id="bpm"
        aria-labelledby="bpmLabel"
        inputmode="numeric"
        pattern="[0-9]+"
        value={context?.bpm()}
        onChange={(evt) => {
          const newBpm = Number(evt.target.value);

          // Do nothing if the value is not in range
          if (newBpm < minBpm || newBpm > maxBpm || Number.isNaN(newBpm)) {
            tempoInputRef.value = String(context?.bpm());
            return;
          }

          context?.setBpm(() => newBpm);
        }}
      />
      <button
        aria-label="Increase BPM"
        disabled={context?.bpm() === maxBpm}
        class={styles.plus}
        onClick={() => context?.setBpm((bpm) => Math.min(bpm + 1, maxBpm))}
      >
        +
      </button>
    </>
  );
}
