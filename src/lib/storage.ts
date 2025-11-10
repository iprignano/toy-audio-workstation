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

export const saveSong = (song: DeserializedSong) => {
  try {
    const savedSongs = getSongStore();

    // Spicy conversion to turn the Solid proxies
    // back into plain JavaScript objects
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
