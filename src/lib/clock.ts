// Clock web worker
// Posts a `tick` message every n milliseconds (`interval`)

type ClockWorkerMessage =
  | { type: 'start' }
  | { type: 'stop' }
  | { type: 'setInterval'; interval: number };

let timeoutId: NodeJS.Timeout | null;
let interval = 50;

self.onmessage = (event: MessageEvent<ClockWorkerMessage>) => {
  const { type } = event.data;

  if (type === 'start') {
    startClock();
  } else if (type === 'stop') {
    stopClock();
  } else if (type === 'setInterval') {
    setTickInterval(event.data.interval);
  }
};

const startClock = () => {
  timeoutId = setInterval(() => {
    postMessage({ type: 'tick' });
  }, interval);
};

const stopClock = () => {
  clearInterval(timeoutId as NodeJS.Timeout);
  timeoutId = null;
};

const setTickInterval = (newInterval: number) => {
  interval = newInterval;

  if (timeoutId) {
    clearInterval(timeoutId as NodeJS.Timeout);
    timeoutId = null;
  }
};
