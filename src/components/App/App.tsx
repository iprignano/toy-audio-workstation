import { createSignal } from 'solid-js';

import styles from './styles.module.css';

export default function App() {
  const [isPlaying, setIsPlaying] = createSignal(false);

  return (
    <div class={styles.wrapper}>
      <footer class={styles.footer}>
        <div>bpm</div>
        <div>play/pause</div>
      </footer>
    </div>
  );
}
