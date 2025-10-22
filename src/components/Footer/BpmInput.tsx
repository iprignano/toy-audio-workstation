import styles from './styles.module.css';

const minBpm = 60;
const maxBpm = 240;

export default function BpmInput(props: { bpm: number; onBpmChange(newBpm: number): void }) {
  let tempoInputRef: HTMLInputElement;
  return (
    <>
      <label for="bpm" id="bpmLabel" class={styles.bpm}>
        BPM
      </label>
      <button
        aria-label="Decrease BPM"
        disabled={props.bpm === minBpm}
        class={styles.minus}
        onClick={() => props.onBpmChange(Math.max(props.bpm - 1, minBpm))}
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
        value={props.bpm}
        onChange={(evt) => {
          const newBpm = Number(evt.target.value);

          // Do nothing if the value is not in range
          if (newBpm < minBpm || newBpm > maxBpm || Number.isNaN(newBpm)) {
            tempoInputRef.value = String(props.bpm);
            return;
          }

          props.onBpmChange(newBpm);
        }}
      />
      <button
        aria-label="Increase BPM"
        disabled={props.bpm === maxBpm}
        class={styles.plus}
        onClick={() => props.onBpmChange(Math.min(props.bpm + 1, maxBpm))}
      >
        +
      </button>
    </>
  );
}
