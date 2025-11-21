import { useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { SawtoothWave } from '../Icon/SawtoothWave';
import { SineWave } from '../Icon/SineWave';
import { SquareWave } from '../Icon/SquareWave';
import { TriangleWave } from '../Icon/TriangleWave';
import { AppContext } from '../AppContext/AppContext';
import styles from './styles.module.css';

const waves: OscillatorType[] = ['sine', 'triangle', 'square', 'sawtooth'];

const waveIcons = {
  sine: (props: { fill: string }) => <SineWave {...props} />,
  square: (props: { fill: string }) => <SquareWave {...props} />,
  triangle: (props: { fill: string }) => <TriangleWave {...props} />,
  sawtooth: (props: { fill: string }) => <SawtoothWave {...props} />,
  custom: (props: { fill: string }) => <SineWave {...props} />,
};

export default function SynthSettings() {
  const context = useContext(AppContext);

  return (
    <div class={styles.wrapper}>
      <h3 class={styles.optionTitle}>wave type</h3>
      <fieldset>
        <div class={styles.waves}>
          {waves.map((wave) => (
            <div
              classList={{
                [styles.radioContainer]: true,
                [styles.isSelected]: context?.oscWave() === wave,
              }}
            >
              <Dynamic component={waveIcons[wave]} fill={'currentColor'} />
              <input
                class={styles.radio}
                type="radio"
                name="waveType"
                value={wave}
                id={wave}
                onChange={(evt) => context?.setOscWave(evt.target.value as OscillatorType)}
              />
              <label for={wave}>{wave}</label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
