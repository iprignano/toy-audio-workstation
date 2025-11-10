export type SerializedSong = {
  n: string;
  d: {
    k: Array<0 | 1>;
    s: Array<0 | 1>;
    h: Array<0 | 1>;
  };
  k: {
    [step: number]: [freq: number, length: number][];
  };
  c: string;
};

export type DeserializedSong = {
  name: string;
  drums: {
    kick: boolean[];
    snare: boolean[];
    hihats: boolean[];
  };
  keys: {
    [step: number]: { freq: number; length: number }[];
  };
  created: string;
};

export const serializeSong = (song: DeserializedSong): SerializedSong => {
  // we convert booleans to bits to save storage space:
  // this data will be stringified before being saved
  const serializeDrumSequence = (sequence: boolean[]) => sequence.map((bool) => (bool ? 1 : 0));
  const serializeKeysSequence = (sequence: DeserializedSong['keys']) =>
    Object.entries(sequence).reduce((acc, [step, notes]) => {
      acc[Number(step)] = notes.map(({ freq, length }) => [freq, length]);
      return acc;
    }, {} as SerializedSong['k']);

  return {
    n: song.name,
    d: {
      k: serializeDrumSequence(song.drums.kick),
      s: serializeDrumSequence(song.drums.snare),
      h: serializeDrumSequence(song.drums.hihats),
    },
    k: serializeKeysSequence(song.keys),
    c: song.created,
  };
};

export const deserializeSong = (song: SerializedSong): DeserializedSong => {
  const deserializeDrumSequence = (sequence: Array<0 | 1>) => sequence.map((bit) => Boolean(bit));
  const deserializeKeysSequence = (sequence: SerializedSong['k']) =>
    Object.entries(sequence).reduce((acc, [step, notes]) => {
      acc[Number(step)] = notes.map(([freq, length]) => ({ freq: freq, length: length }));
      return acc;
    }, {} as DeserializedSong['keys']);

  return {
    name: song.n,
    drums: {
      kick: deserializeDrumSequence(song.d.k),
      snare: deserializeDrumSequence(song.d.s),
      hihats: deserializeDrumSequence(song.d.h),
    },
    keys: deserializeKeysSequence(song.k),
    created: song.c,
  };
};
