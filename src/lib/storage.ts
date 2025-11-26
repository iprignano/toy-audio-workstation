import { compress, decompress } from 'lz-string';
import type { DrumKit, DrumsStore, KeysStore } from '../components/AppContext/AppContext';

export type SavedSong = {
  id: string;
  name: string;
  bpm: number;
  waveType: OscillatorType;
  drumKit: DrumKit;
  drums: DrumsStore;
  keys: KeysStore;
  keysAttack: number;
  keysRelease: number;
  isDrumAutoSequenced: boolean;
  isSynthAutoSequenced: boolean;
  createdAt: string;
};
type TawStorage = { songs: SavedSong[] };

const STORAGE_KEY = 'taw_v0';

export const getSongStore = () => {
  try {
    const storage = localStorage.getItem(STORAGE_KEY);
    if (storage) {
      const compressedStorage = decompress(storage);
      const parsedStorage: TawStorage = JSON.parse(compressedStorage);
      return parsedStorage.songs;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getSavedSongs = () => {
  try {
    return getSongStore();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const saveSong = (song: Omit<SavedSong, 'createdAt' | 'id'>) => {
  try {
    const savedSongs = getSongStore();

    const newSong: SavedSong = JSON.parse(
      JSON.stringify({
        ...song,
        createdAt: new Date().toISOString(),
        id: crypto.randomUUID(),
      }),
    );

    if (!savedSongs) {
      const compressedStorage = compress(JSON.stringify({ songs: [newSong] }));
      localStorage.setItem(STORAGE_KEY, compressedStorage);
      return true;
    }

    const compressedStorage = compress(JSON.stringify({ songs: [...savedSongs, newSong] }));
    localStorage.setItem(STORAGE_KEY, compressedStorage);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const deleteSong = (song: SavedSong) => {
  try {
    const savedSongs = getSongStore();

    if (!savedSongs) {
      return true;
    }

    const compressedStorage = compress(
      JSON.stringify({
        songs: [...savedSongs.filter(({ id }) => id !== song.id)],
      }),
    );
    localStorage.setItem(STORAGE_KEY, compressedStorage);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
