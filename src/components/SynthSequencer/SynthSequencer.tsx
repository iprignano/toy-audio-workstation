import { createEffect, createMemo, createSignal, Index, useContext } from 'solid-js';

import { AppContext } from '../AppContext/AppContext';
import { noteRegistry } from './notes';
import { useTimeMarker, type MarkerStyles } from './useTimeMarker';

import styles from './styles.module.css';
import { useNotesDragEvents } from './useNotesDragEvents';

const STEPS_LENGHT = 32;
const STEPS_ARRAY = Array.from({ length: STEPS_LENGHT }, (_, i) => i + 1);

export default function SynthSequencer() {
  let tableRef!: HTMLTableElement;
  let tdRef!: HTMLTableCellElement;
  const context = useContext(AppContext)!;

  const [timeMarkerStyles, setTimeMarkerStyles] = createSignal<MarkerStyles>();
  const { onNoteDragStart, onNoteDragEnd, onCellDragOver } = useNotesDragEvents();

  createEffect(() => {
    const markerStyles = useTimeMarker({ tableRef, tdRef })!;
    setTimeMarkerStyles(markerStyles);
  });

  const toggleNote = ({ step, freq }: { step: number; freq: number }) => {
    if (context.keys[step].find((n) => n.freq === freq)) {
      context.setKeys(step, (n) => n.filter(({ freq: f }) => f !== freq));
    } else {
      context.setKeys(step, context.keys[step].length, { freq, length: 1 });
    }
  };

  return (
    <div class={styles.wrapper}>
      <div class={styles.timeMarker} style={timeMarkerStyles()}></div>
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
                      context.keys[step()].find((n) => n?.freq === note().freq),
                    );
                    return (
                      <td
                        onClick={() => toggleNote({ step: step(), freq: note().freq })}
                        onDragOver={(evt) => onCellDragOver(evt, { step: step() })}
                      >
                        {matchingNote() && (
                          <div
                            class={step() === context.currentStep() ? `${styles.highlight}` : ''}
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
