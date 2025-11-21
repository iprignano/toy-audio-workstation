import { createContext, type Accessor, type Setter } from 'solid-js';
import type { Store, SetStoreFunction } from 'solid-js/store';
import type { DeserializedSong } from '../../lib/songSerialization';

type DrumsStore = Store<Record<'kick' | 'snare' | 'hihats', boolean[]>>;
type KeysStore = Store<Record<number, { freq: number; length: number }[]>>;
type InstrumentsStore = Store<Record<'kick' | 'snare' | 'hihats', boolean>>;
export type DrumKit = 'ecmakit' | 'dnb';

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
  drums: DrumsStore;
  setDrums: SetStoreFunction<DrumsStore>;
  keys: KeysStore;
  setKeys: SetStoreFunction<KeysStore>;
  activeInstruments: InstrumentsStore;
  toggleInstrument: SetStoreFunction<InstrumentsStore>;
  getSong(): Omit<DeserializedSong, 'created' | 'name'>;
}>;

export const AppContext = createContext<AppContextValue>();
