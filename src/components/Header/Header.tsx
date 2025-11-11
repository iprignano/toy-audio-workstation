import { createSignal } from 'solid-js';
import SaveSongModal from '../SaveSongModal/SaveSongModal';
import LoadSongModal from '../LoadSongModal/LoadSongModal';
import ShareSongModal from '../ShareSongModal/ShareSongModal';
import styles from './styles.module.css';

export default function Header() {
  const [isSavingSong, setIsSavingSong] = createSignal(false);
  const [isLoadingSong, setIsLoadingSong] = createSignal(false);
  const [isSharingSong, setIsSharingSong] = createSignal(false);

  return (
    <header class={styles.header}>
      <div class={styles.logo}>
        <img src="/logo.svg" />
      </div>
      <button class={styles.button} type="button" onClick={() => setIsSavingSong(true)}>
        Save
      </button>
      <button class={styles.button} type="button" onClick={() => setIsLoadingSong(true)}>
        Load
      </button>
      <button class={styles.button} type="button" onClick={() => setIsSharingSong(true)}>
        Share
      </button>
      {isSavingSong() && <SaveSongModal onClose={() => setIsSavingSong(false)} />}
      {isLoadingSong() && <LoadSongModal onClose={() => setIsLoadingSong(false)} />}
      {isSharingSong() && <ShareSongModal onClose={() => setIsSharingSong(false)} />}
    </header>
  );
}
