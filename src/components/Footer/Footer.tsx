import styles from './styles.module.css';

export default function Footer(props: { isPlaying: boolean; onPlayStateChange(): void }) {
  return (
    <footer class={styles.footer}>
      <div>bpm</div>
      <button class={`${styles.playToggle} monospace`} onClick={props.onPlayStateChange}>
        {props.isPlaying ? 'Pause' : 'Play'}
      </button>
    </footer>
  );
}
