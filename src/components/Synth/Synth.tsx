import { Switch, Match, createSignal } from 'solid-js';

import Keyboard from '../Keyboard/Keyboard';
import SynthSequencer from '../SynthSequencer/SynthSequencer';

import styles from './styles.module.css';

export default function Synth(props: { isSequencing: boolean; isPlaying: boolean; bpm: number }) {
  return (
    <div class={styles.wrapper}>
      <Switch>
        <Match when={props.isSequencing}>
          <SynthSequencer isPlaying={props.isPlaying} bpm={props.bpm} />
        </Match>
        <Match when={!props.isSequencing}>
          <Keyboard />
        </Match>
      </Switch>
    </div>
  );
}
