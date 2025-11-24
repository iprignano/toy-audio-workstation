import { createResource } from 'solid-js';
import { drumKits, type DrumKit } from '../components/AppContext/AppContext';
import { setupSamples } from './audio';

export type SampledDrumKitName = Exclude<DrumKit, 'toykit'>;
type SampleName = `${SampledDrumKitName}_${string}`;
export type SampleBufferTuple = [SampleName, ArrayBuffer];

const getArrayBufferFromFile = async (path: string) => {
  const response = await fetch(path);
  return response.arrayBuffer();
};

const sampledDrumkits = drumKits.filter((name) => name !== 'toykit');
const getSampleNamesForKit = (kit: SampledDrumKitName): SampleName[] => [
  `${kit}_kick`,
  `${kit}_snare`,
  `${kit}_hihat`,
];

const fetchSamples = async () => {
  const promiseMap = sampledDrumkits.flatMap((kit) =>
    getSampleNamesForKit(kit).map<Promise<SampleBufferTuple>>(async (sampleName) => {
      const arrBuf = await getArrayBufferFromFile(`/samples/${sampleName}.wav`);
      return [sampleName, arrBuf];
    }),
  );

  const samples = await Promise.all(promiseMap);

  setupSamples(samples);
};

export const useSamplesResource = () => {
  const [data] = createResource(fetchSamples);
  return { data };
};
