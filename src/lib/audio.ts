let audioContext: AudioContext;
let compressor: DynamicsCompressorNode;

const getAudioContext = () => {
  if (typeof audioContext !== 'undefined') return audioContext;

  audioContext = new AudioContext();
  return audioContext;
};

const getCompressorNode = (): DynamicsCompressorNode => {
  if (typeof audioContext === 'undefined') {
    throw new Error('Audio Context is undefined.');
  }
  if (typeof compressor !== 'undefined') return compressor;

  const audioCtx = getAudioContext();
  compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-0, audioCtx.currentTime);
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

const getFilterNode = (type: BiquadFilterType, frequency: number, Q?: number) => {
  const audioCtx = getAudioContext();
  return new BiquadFilterNode(audioCtx, {
    type,
    frequency,
    Q,
  });
};

const getNoiseAudioNode = () => {
  const audioCtx = getAudioContext();
  const bufferSize = audioCtx.sampleRate;

  // create an empty buffer
  const noiseBuffer = new AudioBuffer({
    length: bufferSize,
    sampleRate: audioCtx.sampleRate,
  });

  // fill the buffer with noise
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  return new AudioBufferSourceNode(audioCtx, {
    buffer: noiseBuffer,
  });
};

// ================
// Drums
// ================

// Kick - low freq sine wave
const playKick = (time: number) => {
  const audioCtx = getAudioContext();
  const destination = getDestinationNode();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(destination);

  osc.frequency.value = 150;
  osc.frequency.setValueAtTime(150, time);

  gain.gain.setValueAtTime(0.5, time);
  osc.frequency.exponentialRampToValueAtTime(0.001, time + 1);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 1);

  osc.start(time);
  osc.stop(time + 1);
};

// Snare - high freq sine wave + short high-passed noise
const playSnare = (time: number) => {
  const audioCtx = getAudioContext();
  const osc = audioCtx.createOscillator();
  const destination = getDestinationNode();

  const oscGain = audioCtx.createGain();
  const oscHighPass = getFilterNode('highpass', 700);

  osc.connect(oscHighPass).connect(oscGain);
  oscGain.connect(destination);

  osc.frequency.value = 850;
  osc.frequency.setValueAtTime(850, time);
  osc.frequency.exponentialRampToValueAtTime(550, time + 0.01);
  oscGain.gain.setValueAtTime(0.4, time);
  oscGain.gain.exponentialRampToValueAtTime(0.5, time + 0.05);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

  osc.start(time);
  osc.stop(time + 0.2);

  const noise = getNoiseAudioNode();
  const noiseHighPass = getFilterNode('lowpass', 8000);
  const noiseGain = audioCtx.createGain();

  noise.connect(noiseHighPass).connect(noiseGain);
  noiseGain.connect(destination);
  noiseGain.gain.setValueAtTime(0.2, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.2, time + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

  noise.start(time);
  noise.stop(time + 0.1);
};

// Hihats - high-passed short noise
const playHihats = (time: number) => {
  const audioCtx = getAudioContext();
  const destination = getDestinationNode();
  const noise = getNoiseAudioNode();

  const highPass = getFilterNode('highpass', 6000);
  const noiseGain = audioCtx.createGain();

  noise.connect(highPass).connect(noiseGain);
  noiseGain.connect(destination);
  noiseGain.gain.setValueAtTime(0.5, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

  noise.start(time);
  noise.stop(time + 0.2);
};

// ================
// Synth
// ================
let notesPlaying: Record<number, { osc: OscillatorNode; gain: GainNode }> = {};

const playNote = (frequency: number, wave?: OscillatorType) => {
  if (notesPlaying[frequency]) return;

  const audioCtx = getAudioContext();
  const destination = getDestinationNode();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  gain.gain.value = 0.2;
  osc.type = wave || 'sine';
  osc.connect(gain);
  gain.connect(destination);

  osc.frequency.value = frequency;
  osc.start();

  notesPlaying[frequency] = { osc, gain };
};

const releaseNote = (frequency: number) => {
  const note = notesPlaying[frequency];
  if (!note) return;

  const audioCtx = getAudioContext();
  note.gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);

  delete notesPlaying[frequency];
};

export { getAudioContext, playHihats, playKick, playSnare, playNote, releaseNote };
