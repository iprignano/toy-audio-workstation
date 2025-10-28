import { createContext, type Accessor, type Setter } from 'solid-js';
import type { Store, SetStoreFunction } from 'solid-js/store';

type DrumsStore = Store<Record<'kick' | 'snare' | 'hihats', boolean[]>>;
type KeysStore = Store<Record<number, { freq?: number; length?: number }[]>>;
type InstrumentsStore = Store<Record<'kick' | 'snare' | 'hihats', boolean>>;

export type AppContextValue = Store<{
  bpm: Accessor<number>;
  setBpm: Setter<number>;
  isPlaying: Accessor<boolean>;
  setIsPlaying: Setter<boolean>;
  isSequencingKeys: Accessor<boolean>;
  setIsSequencingKeys: Setter<boolean>;
  currentStep: Accessor<number>;
  setCurrentStep: Setter<number>;
  oscWave: Accessor<OscillatorType>;
  setOscWave: Setter<OscillatorType>;
  drums: DrumsStore;
  setDrums: SetStoreFunction<DrumsStore>;
  keys: KeysStore;
  setKeys: SetStoreFunction<KeysStore>;
  activeInstruments: InstrumentsStore;
  toggleInstrument: SetStoreFunction<InstrumentsStore>;
}>;

export const AppContext = createContext<AppContextValue>();
