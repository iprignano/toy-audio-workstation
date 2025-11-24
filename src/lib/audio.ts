import type { SampleBufferTuple, SampledDrumKitName } from './useSamplesResource';
import { hihats, kick, snare } from './toyDrumKit';
import { type DrumKit } from '../components/AppContext/AppContext';

type SampleBuffers = Record<
  SampledDrumKitName,
  {
    kick: AudioBuffer;
    snare: AudioBuffer;
    hihat: AudioBuffer;
  }
>;

let audioContext: AudioContext;
let compressor: DynamicsCompressorNode;
let sampleAudioBuffers: SampleBuffers;

const getAudioContext = () => {
  if (typeof audioContext !== 'undefined') return audioContext;

  audioContext = new AudioContext();
  return audioContext;
};

export const setupSamples = async (samples: SampleBufferTuple[]) => {
  const audioCtx = getAudioContext();

  const audioBuffers = samples.reduce(async (acc, [sampleName, arrayBuffer]) => {
    const [kitName, sample] = sampleName.split('_') as [
      SampledDrumKitName,
      keyof SampleBuffers[SampledDrumKitName],
    ];

    const sampleBuffers = await acc;

    sampleBuffers[kitName] ||= {} as SampleBuffers[SampledDrumKitName];
    sampleBuffers[kitName][sample] = await audioCtx.decodeAudioData(arrayBuffer);

    return sampleBuffers;
  }, Promise.resolve({} as SampleBuffers));

  sampleAudioBuffers = await audioBuffers;
};

const getCompressorNode = (): DynamicsCompressorNode => {
  if (typeof audioContext === 'undefined') {
    throw new Error('Audio Context is undefined.');
  }
  if (typeof compressor !== 'undefined') return compressor;

  const audioCtx = getAudioContext();
  compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(0, audioCtx.currentTime);
  compressor.knee.setValueAtTime(30, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(10, audioCtx.currentTime);
  compressor.attack.setValueAtTime(0.02, audioCtx.currentTime);
  compressor.release.setValueAtTime(0.2, audioCtx.currentTime);
  compressor.connect(audioContext.destination);
  return compressor;
};

const getDestinationNode = () => {
  return getCompressorNode();
};

// ================
// Drums
// ================
const playKick = (time: number, drumKit: DrumKit) => {
  const audioCtx = getAudioContext();
  const destination = getDestinationNode();

  if (drumKit === 'toykit') {
    kick({ audioCtx, time, destination });
  } else {
    const sample = new AudioBufferSourceNode(audioContext, {
      buffer: sampleAudioBuffers[drumKit]['kick'],
      playbackRate: 1,
    });
    sample.connect(destination);
    sample.start(time);
  }
};

const playSnare = (time: number, drumKit: DrumKit) => {
  const audioCtx = getAudioContext();
  const destination = getDestinationNode();

  if (drumKit === 'toykit') {
    snare({ audioCtx, time, destination });
  } else {
    const sample = new AudioBufferSourceNode(audioContext, {
      buffer: sampleAudioBuffers[drumKit]['snare'],
      playbackRate: 1,
    });
    sample.connect(audioCtx.destination);
    sample.start(time);
  }
};

const playHihats = (time: number, drumKit: DrumKit) => {
  const audioCtx = getAudioContext();
  const destination = getDestinationNode();

  if (drumKit === 'toykit') {
    hihats({ audioCtx, time, destination });
  } else {
    const sample = new AudioBufferSourceNode(audioContext, {
      buffer: sampleAudioBuffers[drumKit]['hihat'],
      playbackRate: 1,
    });
    sample.connect(audioCtx.destination);
    sample.start(time);
  }
};

// ================
// Synth
// ================
let notesPlaying: Record<number, { osc: OscillatorNode; gain: GainNode }> = {};
const outputVolume = 0.4;

const playNote = (params: {
  frequency: number;
  wave?: OscillatorType;
  duration?: number;
  attack?: number;
  release?: number;
}) => {
  const { frequency, wave, duration, attack = 0.2, release = 0.1 } = params;
  if (notesPlaying[frequency]) return;

  const audioCtx = getAudioContext();
  const destination = getDestinationNode();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  gain.gain.value = 0;
  osc.type = wave || 'sine';
  osc.connect(gain);
  gain.connect(destination);

  osc.frequency.value = frequency;
  osc.start();

  if (duration) {
    gain.gain.setTargetAtTime(outputVolume, audioCtx.currentTime, attack);
    gain.gain.setTargetAtTime(0, audioCtx.currentTime + duration, release);

    setTimeout(() => {
      // Disconnect nodes for GC
      osc.disconnect();
      gain.disconnect();
    }, duration * 1000 + release * 6000);
  } else {
    gain.gain.setTargetAtTime(outputVolume, audioCtx.currentTime, attack);
    notesPlaying[frequency] = { osc, gain };
  }
};

const releaseNote = (params: { frequency: number; release?: number }) => {
  const { frequency, release = 0.1 } = params;
  const note = notesPlaying[frequency];
  if (!note) return;

  const audioCtx = getAudioContext();
  note.gain.gain.setTargetAtTime(0, audioCtx.currentTime, release);

  delete notesPlaying[frequency];

  setTimeout(() => {
    // Disconnect nodes for GC
    note.osc.disconnect();
    note.gain.disconnect();
  }, release * 6000);
};

export { getAudioContext, playHihats, playKick, playSnare, playNote, releaseNote };
