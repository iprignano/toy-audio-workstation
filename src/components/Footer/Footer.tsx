import { Dynamic } from 'solid-js/web';

import { Play } from '../Icon/Play';
import { Pause } from '../Icon/Pause';
import BpmInput from './BpmInput';

import styles from './styles.module.css';

const options = {
  play: Play,
  pause: Pause,
};

export default function Footer(props: {
  bpm: number;
  onBpmChange(newBpm: number): void;
  isPlaying: boolean;
  onPlayStateChange(): void;
}) {
  return (
    <footer class={`${styles.footer} monospace`}>
      <div class={styles.tempo}>
        <BpmInput bpm={props.bpm} onBpmChange={props.onBpmChange} />
      </div>
      <button class={`${styles.playToggle} monospace`} onClick={props.onPlayStateChange}>
        {props.isPlaying ? 'Pause' : 'Play'}
        <Dynamic component={options[props.isPlaying ? 'pause' : 'play']} fill="white" />
      </button>
    </footer>
  );
}
