import { fill } from 'es-toolkit';

import { type DrumsStore, type KeysStore } from './AppContext';

const STEPS_LENGHT = 32;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);

export const initialDrumsStore = (): DrumsStore => {
  const drumsStore: DrumsStore = {};
  for (let i = 0; i <= 3; i++) {
    drumsStore[i] = {
      kick: fill(Array(16), false),
      snare: fill(Array(16), false),
      hihats: fill(Array(16), false),
    };
  }
  return drumsStore;
};

export const initialKeysStore = (): KeysStore => {
  return STEPS_ARRAY.reduce((acc, val) => {
    for (let i = 0; i <= 3; i++) {
      acc[i] ||= {};
      acc[i][val] = [];
    }
    return acc;
  }, {} as KeysStore);
};

export const initialInstrumentsStore = () => ({
  kick: true,
  snare: true,
  hihats: true,
});
