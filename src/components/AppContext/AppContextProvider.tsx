import { createSignal, type JSXElement } from 'solid-js';
import { createStore } from 'solid-js/store';
import { fill } from 'es-toolkit';

import { AppContext, type AppContextValue } from './AppContext';

const STEPS_LENGHT = 32;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);

type KeysStore = Record<number, { freq?: number; length?: number }[]>;

export default function AppContextProvider(props: {
  value?: AppContextValue;
  children: JSXElement;
}) {
  const [bpm, setBpm] = createSignal(120);
  const [oscWave, setOscWave] = createSignal<OscillatorType>('sine');
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [currentStep, setCurrentStep] = createSignal(0);
  const [isSequencingKeys, setIsSequencingKeys] = createSignal(true);

  const initialDrumsStore = {
    kick: fill(Array(16), false),
    snare: fill(Array(16), false),
    hihats: fill(Array(16), false),
  };
  const initialKeysStore = STEPS_ARRAY.reduce((acc, val) => {
    acc[val] = [];
    return acc;
  }, {} as KeysStore);

  const [drums, setDrums] = createStore(initialDrumsStore);
  const [keys, setKeys] = createStore(initialKeysStore);

  const [appStore, _] = createStore({
    bpm,
    setBpm,
    isPlaying,
    setIsPlaying,
    isSequencingKeys,
    setIsSequencingKeys,
    oscWave,
    setOscWave,
    drums,
    setDrums,
    keys,
    setKeys,
    currentStep,
    setCurrentStep,
  });

  return (
    <AppContext.Provider value={props.value ?? appStore}>{props.children}</AppContext.Provider>
  );
}
