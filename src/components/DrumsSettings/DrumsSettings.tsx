import { useContext } from 'solid-js';
import { AppContext, drumKits, type DrumKit } from '../AppContext/AppContext';
import styles from './styles.module.css';

export default function DrumsSettings() {
  const context = useContext(AppContext);

  return (
    <div class={styles.wrapper}>
      <div>
        <h3 class={styles.optionTitle}>drum kit</h3>
        <fieldset>
          <div class={styles.kits}>
            {drumKits.map((kit) => (
              <div
                classList={{
                  [styles.radioContainer]: true,
                  [styles.isSelected]: context?.drumKit() === kit,
                }}
              >
                <input
                  class={styles.radio}
                  type="radio"
                  name="drumKit"
                  value={kit}
                  id={kit}
                  checked={context?.drumKit() === kit}
                  onChange={(evt) => context?.setDrumKit(evt.target.value as DrumKit)}
                />
                <label for={kit}>{kit}</label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
