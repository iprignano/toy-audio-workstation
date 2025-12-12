import { createSignal, lazy } from 'solid-js';
import SaveSongModal from '../SaveSongModal/SaveSongModal';
import LoadSongModal from '../LoadSongModal/LoadSongModal';
import ShareSongModal from '../ShareSongModal/ShareSongModal';
import { Save } from '../Icon/Save';
import { Load } from '../Icon/Load';
import { Share } from '../Icon/Share';
import { Help } from '../Icon/Help';
import styles from './styles.module.css';

const HelpModal = lazy(() => import('../HelpModal/HelpModal'));

export default function Header() {
  const [isSavingSong, setIsSavingSong] = createSignal(false);
  const [isLoadingSong, setIsLoadingSong] = createSignal(false);
  const [isSharingSong, setIsSharingSong] = createSignal(false);
  const [isHelpOpen, setIsHelpOpen] = createSignal(false);

  return (
    <header class={styles.header}>
      <div class={styles.logo}>
        <img src="/logo.svg" />
        <span class="monospace">toy audio workstation</span>
      </div>
      <div class={styles.menu}>
        <button class={styles.button} type="button" onClick={() => setIsSavingSong(true)}>
          <Save />
          <span>Save</span>
        </button>
        <button class={styles.button} type="button" onClick={() => setIsLoadingSong(true)}>
          <Load />
          <span>Load</span>
        </button>
        <button class={styles.button} type="button" onClick={() => setIsSharingSong(true)}>
          <Share />
          <span>Share</span>
        </button>
        <button class={styles.button} type="button" onClick={() => setIsHelpOpen(true)}>
          <Help />
          <span>Help</span>
        </button>
      </div>
      {isSavingSong() && <SaveSongModal onClose={() => setIsSavingSong(false)} />}
      {isLoadingSong() && <LoadSongModal onClose={() => setIsLoadingSong(false)} />}
      {isSharingSong() && <ShareSongModal onClose={() => setIsSharingSong(false)} />}
      {isHelpOpen() && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </header>
  );
}
