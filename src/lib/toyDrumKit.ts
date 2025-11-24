// 'toyDrumKit' is a silly name to describe a small set
// of synthetized drum sounds using JS's Web Audio API.

type SoundParameters = {
  audioCtx: AudioContext;
  time: number;
  destination: DynamicsCompressorNode;
};

let noiseBufferNode: AudioBuffer;

const getFilterNode = (
  audioCtx: AudioContext,
  type: BiquadFilterType,
  frequency: number,
  Q?: number,
) =>
  new BiquadFilterNode(audioCtx, {
    type,
    frequency,
    Q,
  });

const getNoiseAudioNode = (audioCtx: AudioContext) => {
  const bufferSize = audioCtx.sampleRate;
  let noiseBuffer;

  if (noiseBufferNode) {
    noiseBuffer = noiseBufferNode;
  } else {
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

    noiseBufferNode = noiseBuffer;
  }

  return new AudioBufferSourceNode(audioCtx, {
    buffer: noiseBuffer,
  });
};

export const kick = ({ audioCtx, time, destination }: SoundParameters) => {
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

export const snare = ({ audioCtx, time, destination }: SoundParameters) => {
  const osc = audioCtx.createOscillator();

  const oscGain = audioCtx.createGain();
  const oscHighPass = getFilterNode(audioCtx, 'highpass', 700);

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

  const noise = getNoiseAudioNode(audioCtx);
  const noiseHighPass = getFilterNode(audioCtx, 'lowpass', 8000);
  const noiseGain = audioCtx.createGain();

  noise.connect(noiseHighPass).connect(noiseGain);
  noiseGain.connect(destination);
  noiseGain.gain.setValueAtTime(0.2, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.2, time + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

  noise.start(time);
  noise.stop(time + 0.1);
};

export const hihats = ({ audioCtx, time, destination }: SoundParameters) => {
  const noise = getNoiseAudioNode(audioCtx);

  const highPass = getFilterNode(audioCtx, 'highpass', 6000);
  const noiseGain = audioCtx.createGain();

  noise.connect(highPass).connect(noiseGain);
  noiseGain.connect(destination);
  noiseGain.gain.setValueAtTime(0.5, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

  noise.start(time);
  noise.stop(time + 0.2);
};
