import { throttle } from 'es-toolkit/function';
import { createEffect, createMemo, createSignal, Index, onCleanup, useContext } from 'solid-js';

import { AppContext } from '../AppContext/AppContext';
import { noteRegistry } from './notes';

import styles from './styles.module.css';

const STEPS_LENGHT = 32;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);

export default function SynthSequencer() {
  const context = useContext(AppContext);
  const [tdSize, setTdSize] = createSignal(0);
  const [tableHeight, setTableHeight] = createSignal(0);
  const [markerTransitionDuration, setMarkerTransitionDuration] = createSignal(0);
  const [draggedNote, setDraggedNote] = createSignal<{ step: number; freq: number } | null>(null);

  const toggleNote = ({ step, freq }: { step: number; freq: number }) => {
    if (context?.keys[step].find((n) => n.freq === freq)) {
      context?.setKeys(step, (n) => n.filter(({ freq: f }) => f !== freq));
    } else {
      context?.setKeys(step, context?.keys[step].length, { freq, length: 1 });
    }
  };

  const onNoteDragStart = (evt: DragEvent, { step, freq }: { step: number; freq: number }) => {
    // Prevents cursor from going ham when dragging the note
    if (evt.dataTransfer) evt.dataTransfer.effectAllowed = 'none';

    setDraggedNote({ step, freq });
  };
  const onNoteDragEnd = (_: DragEvent) => {
    setDraggedNote(null);
  };
  const onCellDragOver = throttle((evt: DragEvent, { step }: { step: number }) => {
    evt.preventDefault();

    if (evt.target !== evt.currentTarget) {
      // Ignore dragover events that originated
      // from targets different than the table cells
      // on which the handler is defined
      // (namely, the note div itself)
      return;
    }

    if (step < (draggedNote()?.step ?? 0)) {
      // Ignore events where the user dragged the
      // handle beyond the start of the note
      return;
    }

    context?.setKeys(draggedNote()?.step as number, (note) => note?.freq === draggedNote()?.freq, {
      freq: draggedNote()?.freq,
      length: Math.max(1, step + 1 - (draggedNote()?.step ?? 0)),
    });
  }, 100);

  let tableRef!: HTMLTableElement;
  let tdRef!: HTMLTableCellElement;
  createEffect(() => {
    setTableHeight(tableRef.getBoundingClientRect().height);
    const setCellSize = () => setTdSize(tdRef.getBoundingClientRect().width);
    setCellSize();

    // Needed to avoid the marker animate back to step 0 when the loop wraps
    setMarkerTransitionDuration(context?.currentStep() === 32 ? 0 : 60 / context?.bpm()! / 4);

    document.addEventListener('resize', setCellSize);
    onCleanup(() => {
      document.removeEventListener('resize', setCellSize);
    });
  });

  return (
    <div class={styles.wrapper}>
      <div
        class={styles.timeMarker}
        style={{
          height: `${tableHeight()}px`,
          transform: `translate3d(${tdSize() + context?.currentStep()! * tdSize()}px, 0, 0)`,
          'transition-duration': `${markerTransitionDuration()}s`,
        }}
      ></div>
      <table class={styles.noteTable} ref={tableRef}>
        <tbody>
          <Index each={noteRegistry}>
            {(note) => (
              <tr>
                <td class={styles.noteName} ref={tdRef}>
                  <span>
                    {note().note}
                    {note().octave}
                  </span>
                </td>
                <Index each={STEPS_ARRAY}>
                  {(step) => {
                    const matchingNote = createMemo(() =>
                      context?.keys[step()].find((n) => n?.freq === note().freq),
                    );
                    return (
                      <td
                        onClick={() => toggleNote({ step: step(), freq: note().freq })}
                        onDragOver={(evt) => onCellDragOver(evt, { step: step() })}
                      >
                        {matchingNote() && (
                          <div
                            class={step() === context?.currentStep() ? `${styles.highlight}` : ''}
                            style={{ width: `calc(100% * ${matchingNote()?.length})` }}
                          >
                            {note().note}
                            {note().octave}
                            <span
                              class={styles.noteHandle}
                              draggable="true"
                              onDragStart={(evt) =>
                                onNoteDragStart(evt, { step: step(), freq: note().freq })
                              }
                              onDragEnd={(evt) => onNoteDragEnd(evt)}
                            />
                          </div>
                        )}
                      </td>
                    );
                  }}
                </Index>
              </tr>
            )}
          </Index>
        </tbody>
      </table>
    </div>
  );
}
