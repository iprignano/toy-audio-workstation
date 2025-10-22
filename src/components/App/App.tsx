import { createSignal } from 'solid-js';

import Header from '../Header/Header';
import DrumsSequencer from '../DrumsSequencer/DrumsSequencer';
import Synth from '../Synth/Synth';
import Footer from '../Footer/Footer';

import styles from './styles.module.css';

export default function App() {
  const [bpm, setBpm] = createSignal(120);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [isSequencingKeys, setIsSequencingKeys] = createSignal(true);

  return (
    <div class={styles.wrapper}>
      <Header />

      <div class={styles.body}>
        <div class={`${styles.drums} ${styles.instrument}`}>
          <div class={styles.title}>
            <span class="monospace">drums</span>
          </div>
          <DrumsSequencer isPlaying={isPlaying()} bpm={bpm()} />
        </div>
        <div class={`${styles.keyboard} ${styles.instrument}`}>
          <div class={styles.title}>
            <span class="monospace">keyboard</span>
          </div>
          <Synth isSequencing={isSequencingKeys()} />
        </div>
      </div>

      <Footer
        bpm={bpm()}
        isSequencingKeys={isSequencingKeys()}
        onSequencingKeysChange={setIsSequencingKeys}
        onBpmChange={(newBpm) => setBpm(newBpm)}
        onPlayStateChange={() => setIsPlaying((prev) => !prev)}
        isPlaying={isPlaying()}
      />
    </div>
  );
}
