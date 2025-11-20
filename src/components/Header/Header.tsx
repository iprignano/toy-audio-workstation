import { createSignal } from 'solid-js';
import SaveSongModal from '../SaveSongModal/SaveSongModal';
import LoadSongModal from '../LoadSongModal/LoadSongModal';
import ShareSongModal from '../ShareSongModal/ShareSongModal';
import styles from './styles.module.css';
import { Save } from '../Icon/Save';
import { Load } from '../Icon/Load';
import { Share } from '../Icon/Share';

export default function Header() {
  const [isSavingSong, setIsSavingSong] = createSignal(false);
  const [isLoadingSong, setIsLoadingSong] = createSignal(false);
  const [isSharingSong, setIsSharingSong] = createSignal(false);

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
      </div>
      {isSavingSong() && <SaveSongModal onClose={() => setIsSavingSong(false)} />}
      {isLoadingSong() && <LoadSongModal onClose={() => setIsLoadingSong(false)} />}
      {isSharingSong() && <ShareSongModal onClose={() => setIsSharingSong(false)} />}
    </header>
  );
}
