import { useContext } from 'solid-js';

import { AppContext } from '../AppContext/AppContext';
import Keyboard from '../Keyboard/Keyboard';
import SynthSequencer from '../SynthSequencer/SynthSequencer';

import styles from './styles.module.css';

export default function Synth() {
  const context = useContext(AppContext);

  return (
    <>
      <div
        class={styles.wrapper}
        style={{ display: context?.isSequencingKeys() ? 'block' : 'none' }}
      >
        <SynthSequencer />
      </div>
      <div
        class={styles.wrapper}
        style={{ display: context?.isSequencingKeys() ? 'none' : 'block' }}
      >
        <Keyboard />
      </div>
    </>
  );
}
