import { windowed } from 'es-toolkit';
import { createMemo, createSignal, Match, Switch, useContext } from 'solid-js';
import { getSavedSongs } from '../../lib/storage';
import { AppContext } from '../AppContext/AppContext';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import styles from './styles.module.css';
import type { DeserializedSong } from '../../lib/songSerialization';

const WINDOW_SIZE = 7;

export default function LoadSongModal(props: { onClose(): void }) {
  const context = useContext(AppContext);
  const [page, setPage] = createSignal(0);
  const [activeTab, setActiveTab] = createSignal<'savedSongs' | 'loadFromString'>('savedSongs');
  const [hasError, setHasError] = createSignal(false);
  const [hasFailedParsing, setHasFailedParsing] = createSignal(false);
  const [selectedSong, setSelectedSong] = createSignal<DeserializedSong | null>(null);
  const savedSongs = getSavedSongs() || [];
  const hasSavedSongs = (savedSongs?.length ?? 0) > 0;
  const windowedSongs = createMemo(() =>
    windowed(savedSongs, WINDOW_SIZE, WINDOW_SIZE, { partialWindows: true }),
  );
  const numberOfPages = Math.ceil(savedSongs.length / WINDOW_SIZE);
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
  });

  const handleSongLoading = () => {
    setHasError(false);
    try {
      context?.setDrums(selectedSong()?.drums as DeserializedSong['drums']);
      context?.setKeys(selectedSong()?.keys as DeserializedSong['keys']);
      props.onClose();
    } catch (error) {
      setHasError(true);
    }
  };

  const handleSongStringParsing = () => {
    setHasFailedParsing(false);
    // TODO: implement me
  };

  return (
    <Modal onClose={props.onClose}>
      <div class={styles.wrapper}>
        <h2>Load a song</h2>
        <div class={styles.tabsWrapper}>
          <div class={styles.tabs}>
            <button
              onClick={() => setActiveTab('savedSongs')}
              classList={{ [styles.tab]: true, [styles.active]: activeTab() === 'savedSongs' }}
            >
              Load locally
            </button>
            <button
              onClick={() => setActiveTab('loadFromString')}
              classList={{ [styles.tab]: true, [styles.active]: activeTab() === 'loadFromString' }}
            >
              Import
            </button>
          </div>
          <div class={styles.tabContent}>
            <Switch>
              <Match when={activeTab() === 'savedSongs'}>
                {hasSavedSongs ? (
                  <>
                    <div class={styles.songList}>
                      {windowedSongs()[page()]?.map((song) => (
                        <button
                          type="button"
                          classList={{
                            [styles.song]: true,
                            [styles.selected]: selectedSong()?.name === song.name,
                          }}
                          onClick={() => setSelectedSong(song)}
                        >
                          <span>[{dateFormatter.format(new Date(song.created))}]</span> {song.name}
                        </button>
                      ))}
                    </div>
                    {numberOfPages > 1 && (
                      <div class={styles.pagination}>
                        <button
                          type="button"
                          disabled={page() === 0}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          Prev
                        </button>
                        <button
                          type="button"
                          disabled={page() === numberOfPages - 1}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div class={styles.emptyState}>
                    <strong>You don't have any saved songs yet.</strong>
                    <br />
                    Go and make some music!
                  </div>
                )}
              </Match>
              <Match when={activeTab() === 'loadFromString'}>
                <p class={styles.importCaption}>
                  Paste a song string below to import someone else's tune:
                </p>
                <textarea rows={2} class={styles.textArea} onChange={handleSongStringParsing} />
                {hasFailedParsing() && (
                  <div class={styles.error}>
                    Sorry, this doesn't look like a song we can import.
                  </div>
                )}
              </Match>
            </Switch>
          </div>
        </div>

        {hasError() && (
          <div class={styles.error}>There was a problem while loading your song. Try later.</div>
        )}

        <div class={styles.actions}>
          <Button variant="alternate" onClick={() => props.onClose()}>
            Cancel
          </Button>
          <Button disabled={!selectedSong()} type="button" onClick={handleSongLoading}>
            Load
          </Button>
        </div>
      </div>
    </Modal>
  );
}
