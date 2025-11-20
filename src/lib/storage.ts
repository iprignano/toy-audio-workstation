import {
  deserializeSong,
  serializeSong,
  type DeserializedSong,
  type SerializedSong,
} from './songSerialization';

const STORAGE_KEY = 'taw_v0';

type TawStorage = { songs: SerializedSong[] };

export const getSongStore = () => {
  try {
    const storage = localStorage.getItem(STORAGE_KEY);
    if (storage) {
      const parsedStorage: TawStorage = JSON.parse(storage);

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
    const songStorage = getSongStore();
    if (songStorage) return songStorage.map(deserializeSong);
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const saveSong = (song: Omit<DeserializedSong, 'created'>) => {
  try {
    const savedSongs = getSongStore();

    const plainSong: DeserializedSong = JSON.parse(
      JSON.stringify({
        ...song,
        created: new Date().toISOString(),
      }),
    );
    const newSong = serializeSong(plainSong);

    if (!savedSongs) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ songs: [newSong] }));
      return true;
    }

    const newStorage = { songs: [...savedSongs, newSong] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage));

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const deleteSong = (song: DeserializedSong) => {
  try {
    const savedSongs = getSongStore();

    if (!savedSongs) {
      return true;
    }

    const newStorage = {
      songs: [...savedSongs.filter(({ n, c }) => n !== song.name && c !== song.created)],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage));

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
