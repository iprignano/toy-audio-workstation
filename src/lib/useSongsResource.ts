import { windowed } from 'es-toolkit';
import { createMemo, createResource } from 'solid-js';
import { getSavedSongs } from './storage';

const fetchSongs = () => getSavedSongs() || [];

export const useSongsResource = (WINDOW_SIZE: number) => {
  const [savedSongs, { refetch }] = createResource(fetchSongs);
  const hasSavedSongs = createMemo(() => (savedSongs()!.length ?? 0) > 0);
  const numberOfPages = createMemo(() => Math.ceil(savedSongs()!.length / WINDOW_SIZE));
  const windowedSongs = createMemo(() =>
    windowed(savedSongs()!, WINDOW_SIZE, WINDOW_SIZE, { partialWindows: true }),
  );

  return { hasSavedSongs, numberOfPages, windowedSongs, refetch };
};
