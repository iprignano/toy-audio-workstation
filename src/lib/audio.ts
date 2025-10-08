const audioCtx = new AudioContext();

const getNoiseAudioNode = () => {
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
}

const getFilterNode = (type: BiquadFilterType, frequency: number, Q?: number) => {
  return new BiquadFilterNode(audioCtx, {
    type,
    frequency,
    Q
  });
}

// Kick - low freq sine wave
const playKick = (time: number) => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = 150;
  osc.frequency.setValueAtTime(150, time);

  gain.gain.setValueAtTime(1, time);
  osc.frequency.exponentialRampToValueAtTime(0.001, time + 1);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 1);

  osc.start(time);
  osc.stop(time + 1);
};

// Snare - high freq sine wave + short high-passed noise
const playSnare = (time: number) => {
  const osc = audioCtx.createOscillator();

  const oscGain = audioCtx.createGain();
  const oscHighPass = getFilterNode('highpass', 700)

  osc.connect(oscHighPass).connect(oscGain);
  oscGain.connect(audioCtx.destination);

  osc.frequency.value = 850;
  osc.frequency.setValueAtTime(850, time);
  osc.frequency.exponentialRampToValueAtTime(550, time + 0.5);
  oscGain.gain.setValueAtTime(1, time);
  oscGain.gain.exponentialRampToValueAtTime(0.5, time + 0.05);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

  osc.start(time);
  osc.stop(time + 0.6);

  const noise = getNoiseAudioNode()
  const noiseHighPass = getFilterNode('lowpass', 8000)
  const noiseGain = audioCtx.createGain();

  noise.connect(noiseHighPass).connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noiseGain.gain.setValueAtTime(0.3, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.2, time + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

  noise.start(time);
  noise.stop(time + 0.1);
};

// Hihats - high-passed short noise
const playHihats = (time: number) => {
  const noise = getNoiseAudioNode()

  const highPass = getFilterNode('highpass', 6000)
  const noiseGain = audioCtx.createGain();

  noise.connect(highPass).connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noiseGain.gain.setValueAtTime(1, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

  noise.start(time);
  noise.stop(time + 0.2);
};

export {
  audioCtx, playHihats, playKick, playSnare
};
