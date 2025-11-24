import { createContext, type Accessor, type Setter } from 'solid-js';
import type { Store, SetStoreFunction } from 'solid-js/store';
import type { SavedSong } from '../../lib/storage';

export const drumKits = ['toykit', 'rock', 'trap', 'hiphop'] as const;

export type DrumsStore = Store<{
  [sequence: number]: Record<'kick' | 'snare' | 'hihats', boolean[]>;
}>;
export type KeysStore = Store<{
  [sequence: number]: Record<number, { freq: number; length: number }[]>;
}>;
type InstrumentsStore = Store<Record<'kick' | 'snare' | 'hihats', boolean>>;
export type DrumKit = (typeof drumKits)[number];

export type AppContextValue = Store<{
  bpm: Accessor<number>;
  setBpm: Setter<number>;
  isPlaying: Accessor<boolean>;
  setIsPlaying: Setter<boolean>;
  isSequencingKeys: Accessor<boolean>;
  setIsSequencingKeys: Setter<boolean>;
  isModalOpen: Accessor<boolean>;
  setIsModalOpen: Setter<boolean>;
  currentStep: Accessor<number>;
  setCurrentStep: Setter<number>;
  oscWave: Accessor<OscillatorType>;
  setOscWave: Setter<OscillatorType>;
  drumKit: Accessor<DrumKit>;
  setDrumKit: Setter<DrumKit>;
  synthAttack: Accessor<number>;
  setSynthAttack: Setter<number>;
  synthRelease: Accessor<number>;
  setSynthRelease: Setter<number>;
  drumSequenceIndex: Accessor<number>;
  setDrumSequenceIndex: Setter<number>;
  synthSequenceIndex: Accessor<number>;
  setSynthSequenceIndex: Setter<number>;
  drums: DrumsStore;
  setDrums: SetStoreFunction<DrumsStore>;
  keys: KeysStore;
  setKeys: SetStoreFunction<KeysStore>;
  activeInstruments: InstrumentsStore;
  toggleInstrument: SetStoreFunction<InstrumentsStore>;
  getSong(): Omit<SavedSong, 'createdAt' | 'name' | 'id'>;
}>;

export const AppContext = createContext<AppContextValue>();
