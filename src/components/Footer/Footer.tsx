import { createEffect, onCleanup, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { AppContext } from '../AppContext/AppContext';
import { Play } from '../Icon/Play';
import { Pause } from '../Icon/Pause';
import { Keys } from '../Icon/Keys';
import { Grid } from '../Icon/Grid';
import BpmInput from './BpmInput';

import styles from './styles.module.css';

const options = {
  play: Play,
  pause: Pause,
};

export default function Footer() {
  const context = useContext(AppContext);

  createEffect(() => {
    const onKeyDown = (evt: KeyboardEvent) => {
      // Don't intercept the event if there's
      // a meta key pressed (e.g. ctrl-t, cmd-l, etc)
      // or if a modal is currently open
      if (evt.metaKey || context?.isModalOpen()) return;
      // Don't intercept the event if an input
      // or button is currently focused
      if (['INPUT', 'BUTTON', 'TEXTAREA'].includes(document.activeElement?.tagName ?? '')) return;

      if (evt.key === ' ') {
        context?.setIsPlaying((isPlaying) => !isPlaying);
      }
      if (evt.key === ',') {
        context?.setIsSequencingKeys((isSequencing) => !isSequencing);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    onCleanup(() => {
      document.removeEventListener('keydown', onKeyDown);
    });
  });

  return (
    <footer class={`${styles.footer} monospace`}>
      <div class={styles.tempo}>
        <BpmInput />
      </div>
      <div class={styles.synthSwitch}>
        <input
          type="checkbox"
          id="synthSwitch"
          checked={context?.isSequencingKeys()}
          onChange={(evt) => context?.setIsSequencingKeys(evt.target.checked)}
        />
        <div classList={{ [styles.active]: !context?.isSequencingKeys() }}>
          <Keys />
        </div>
        <div classList={{ [styles.active]: context?.isSequencingKeys() }}>
          <Grid />
        </div>
      </div>
      <button
        type="button"
        class={`${styles.playToggle} ${context?.isPlaying() ? styles.isPlaying : ''} monospace`}
        onClick={() => context?.setIsPlaying((isPlaying) => !isPlaying)}
      >
        {context?.isPlaying() ? 'Pause' : 'Play'}
        <Dynamic component={options[context?.isPlaying() ? 'pause' : 'play']} fill="black" />
      </button>
    </footer>
  );
}
