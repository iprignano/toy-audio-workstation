import { createSignal, type JSXElement } from 'solid-js';
import { createStore } from 'solid-js/store';

import { AppContext, type AppContextValue, type DrumKit } from './AppContext';
import { initialDrumsStore, initialInstrumentsStore, initialKeysStore } from './initialStoreValues';
import type { SavedSong } from '../../lib/storage';

export default function AppContextProvider(props: {
  value?: AppContextValue;
  children: JSXElement;
}) {
  const [bpm, setBpm] = createSignal(120);
  const [oscWave, setOscWave] = createSignal<OscillatorType>('sine');
  const [drumKit, setDrumKit] = createSignal<DrumKit>('toykit');
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [drumSequenceIndex, setDrumSequenceIndex] = createSignal(0);
  const [synthSequenceIndex, setSynthSequenceIndex] = createSignal(0);
  const [currentStep, setCurrentStep] = createSignal(0);
  const [synthAttack, setSynthAttack] = createSignal(0.1);
  const [synthRelease, setSynthRelease] = createSignal(0.1);
  const [isSequencingKeys, setIsSequencingKeys] = createSignal(true);
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const [drums, setDrums] = createStore(initialDrumsStore());
  const [keys, setKeys] = createStore(initialKeysStore());
  const [activeInstruments, toggleInstrument] = createStore(initialInstrumentsStore());

  const getSong = (): Omit<SavedSong, 'createdAt' | 'name' | 'id'> => {
    // Spicy conversion to turn the Solid proxies
    // back into plain JavaScript objects
    return JSON.parse(
      JSON.stringify({
        bpm: bpm(),
        waveType: oscWave(),
        drumKit: drumKit(),
        drums: drums,
        keys: keys,
        keysAttack: synthAttack(),
        keysRelease: synthRelease(),
      }),
    );
  };

  const [appStore, _] = createStore({
    bpm,
    setBpm,
    isPlaying,
    setIsPlaying,
    isSequencingKeys,
    setIsSequencingKeys,
    isModalOpen,
    setIsModalOpen,
    oscWave,
    setOscWave,
    drumKit,
    setDrumKit,
    synthAttack,
    setSynthAttack,
    synthRelease,
    setSynthRelease,
    drumSequenceIndex,
    setDrumSequenceIndex,
    synthSequenceIndex,
    setSynthSequenceIndex,
    drums,
    setDrums,
    keys,
    setKeys,
    currentStep,
    setCurrentStep,
    activeInstruments,
    toggleInstrument,
    getSong,
  });

  return (
    <AppContext.Provider value={props.value ?? appStore}>{props.children}</AppContext.Provider>
  );
}
