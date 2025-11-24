import { createMemo, createSignal, useContext } from 'solid-js';
import { AppContext } from '../AppContext/AppContext';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import styles from './styles.module.css';
import type { SavedSong } from '../../lib/storage';

export default function ShareSongModal(props: { onClose(): void }) {
  const context = useContext(AppContext);
  const [hasCopied, setHasCopied] = createSignal(false);

  const shareableSong = createMemo(() => {
    const song: Omit<SavedSong, 'id'> = {
      name: 'shared tune',
      createdAt: new Date().toISOString(),
      ...context?.getSong()!,
    };
    return btoa(JSON.stringify(song));
  });

  const handleClipboardCopy = async () => {
    setHasCopied(true);

    await navigator.clipboard.writeText(shareableSong());

    setTimeout(() => {
      setHasCopied(false);
    }, 1500);
  };

  return (
    <Modal onClose={props.onClose}>
      <div class={styles.wrapper}>
        <h2>Share your song</h2>

        <p class={styles.caption}>Share this string with a friend to let them import your song!</p>

        <textarea readonly rows={3} class={styles.textArea}>
          {shareableSong()}
        </textarea>

        <div class={styles.actions}>
          <Button variant="alternate" onClick={() => props.onClose()}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleClipboardCopy}
            icon={hasCopied() ? 'check' : 'copy'}
            variant={hasCopied() ? 'green' : 'primary'}
          >
            {hasCopied() ? 'Copied!' : 'Copy to clipboard'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
