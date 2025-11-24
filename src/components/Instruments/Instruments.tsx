import { createSignal, For, useContext } from 'solid-js';
import { useAudioSequencing } from '../../lib/useAudioSequencing';
import { useMobileViewSwitch } from '../../lib/useMobileViewSwitch';
import { AppContext } from '../AppContext/AppContext';
import DrumsSequencer from '../DrumsSequencer/DrumsSequencer';
import Synth from '../Synth/Synth';
import DrumsSettings from '../DrumsSettings/DrumsSettings';
import SynthSettings from '../SynthSettings/SynthSettings';
import { Cog } from '../Icon/Cog';

import styles from './styles.module.css';

export default function Instruments() {
  const context = useContext(AppContext)!;
  const [areDrumsSettingsOpen, setAreDrumsSettingsOpen] = createSignal(false);
  const [areSynthSettingsOpen, setAreSynthSettingsOpen] = createSignal(false);

  // Automatically hides the
  // keyboard on mobile
  useMobileViewSwitch();

  // This is where all the
  // sound making happens:
  useAudioSequencing();

  return (
    <>
      <div class={`${styles.drums} ${styles.instrument}`}>
        <div class={styles.sidebar}>
          <button
            type="button"
            classList={{ [styles.settingsToggle]: true, [styles.open]: areDrumsSettingsOpen() }}
            onClick={() => setAreDrumsSettingsOpen((prev) => !prev)}
          >
            <Cog fill="white" />
          </button>
          <div class={styles.sequence}>
            <For each={[1, 2, 3, 4]}>
              {(_, index) => (
                <button
                  onClick={() => context.setDrumSequenceIndex(index())}
                  classList={{ [styles.active]: context.drumSequenceIndex() === index() }}
                >
                  {index() + 1}
                </button>
              )}
            </For>
          </div>
          <span class={styles.sidebarTitle}>drums</span>
        </div>
        <div classList={{ [styles.settingsPanel]: true, [styles.open]: areDrumsSettingsOpen() }}>
          <DrumsSettings />
        </div>
        <DrumsSequencer />
      </div>
      <div class={`${styles.synth} ${styles.instrument}`}>
        <div class={styles.sidebar}>
          <button
            type="button"
            classList={{ [styles.settingsToggle]: true, [styles.open]: areSynthSettingsOpen() }}
            onClick={() => setAreSynthSettingsOpen((prev) => !prev)}
          >
            <Cog fill="white" />
          </button>
          <div class={styles.sequence}>
            <For each={[1, 2, 3, 4]}>
              {(_, index) => (
                <button
                  onClick={() => context.setSynthSequenceIndex(index())}
                  classList={{ [styles.active]: context.synthSequenceIndex() === index() }}
                >
                  {index() + 1}
                </button>
              )}
            </For>
          </div>
          <span class={styles.sidebarTitle}>synth</span>
        </div>
        <div classList={{ [styles.settingsPanel]: true, [styles.open]: areSynthSettingsOpen() }}>
          <SynthSettings />
        </div>
        <Synth />
      </div>
    </>
  );
}
