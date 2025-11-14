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
  const { draggedNote, dragTargetNote, onNoteMouseDown, onNoteMouseUp, onCellMouseEnter } =
    useNotesDragEvents();

  createEffect(() => {
    const markerStyles = useTimeMarker({ tableRef, tdRef })!;
    setTimeMarkerStyles(markerStyles);
  });

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
                    const activeNote = createMemo(() =>
                      context.keys[step()].find((n) => n?.freq === note().freq),
                    );
                    const noteProps = { step: step(), freq: note().freq };
                    const opacity = createMemo(() => {
                      // Show the note if it's currently being hovered while dragging
                      if (
                        dragTargetNote()?.freq === note().freq &&
                        dragTargetNote()?.step === step()
                      ) {
                        return 1;
                      }

                      // Temporarily hide the note if it's being dragged to another cell
                      if (
                        dragTargetNote() &&
                        draggedNote()?.freq === note().freq &&
                        draggedNote()?.step === step()
                      ) {
                        return 0;
                      }

                      // Finally, show it if it's active
                      return activeNote() ? 1 : 0;
                    });

                    return (
                      <td onMouseEnter={(evt) => onCellMouseEnter(evt, noteProps)}>
                        <div
                          onMouseDown={(evt) => onNoteMouseDown(evt, noteProps)}
                          onMouseUp={(evt) => onNoteMouseUp(evt, noteProps)}
                          class={step() === context.currentStep() ? `${styles.highlight}` : ''}
                          style={{
                            opacity: opacity(),
                            width: `calc(100% * ${activeNote()?.length})`,
                          }}
                        >
                          {note().note}
                          {note().octave}
                          {/* <span class={styles.noteHandle} /> */}
                        </div>
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
