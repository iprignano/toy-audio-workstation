import { createMemo, createSignal, onCleanup, useContext } from 'solid-js';
import { AppContext } from '../AppContext/AppContext';

export type MarkerStyles = {
  height: string;
  transform: string;
  'transition-duration': string;
};

export const useTimeMarker = ({
  tableRef,
  tdRef,
}: {
  tableRef: HTMLTableElement;
  tdRef: HTMLTableCellElement;
}) => {
  const context = useContext(AppContext)!;
  const [tdSize, setTdSize] = createSignal(0);
  const [tableHeight, setTableHeight] = createSignal(0);
  const [markerTransitionDuration, setMarkerTransitionDuration] = createSignal(0);

  // The speed at which the time marker moves through a single cell
  const markerTransitionInSeconds = 60 / context?.bpm()! / 4;
  // Needed to avoid the marker animate back to step 0 when the loop wraps
  const transitionDurationInSeconds = context?.currentStep() === 0 ? 0 : markerTransitionInSeconds;
  setMarkerTransitionDuration(transitionDurationInSeconds);

  // Get the table and table cells bounding boxes and
  // store their dimensions to calculate the marker styles later
  setTableHeight(tableRef?.getBoundingClientRect().height);
  const setCellSize = () => setTdSize(tdRef?.getBoundingClientRect().width);
  setCellSize();

  // Make sure we track the table cells sizes on resize
  document.addEventListener('resize', setCellSize);
  onCleanup(() => {
    document.removeEventListener('resize', setCellSize);
  });

  const markerStyles = createMemo<MarkerStyles>(() => ({
    height: `${tableHeight()}px`,
    transform: `translate3d(${tdSize() + context?.currentStep()! * tdSize()}px, 0, 0)`,
    'transition-duration': `${markerTransitionDuration()}s`,
  }));

  return markerStyles();
};
