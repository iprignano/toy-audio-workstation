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
  const {
    draggedNote,
    dragHoveredNote,
    onNoteMouseDown,
    onNoteMouseUp,
    onCellMouseEnter,
    onNoteLengthMouseDown,
    isChangingNoteLength,
    isPressingDown,
  } = useNotesDragEvents();

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
                    const noteInSlot = createMemo(() =>
                      context.keys[step()].find((n) => n?.freq === note().freq),
                    );
                    const isDragHoveredNote = createMemo(
                      () =>
                        dragHoveredNote()?.freq === note().freq &&
                        dragHoveredNote()?.step === step(),
                    );
                    const isNoteVisible = createMemo(() => {
                      // Show the note if it's currently being hovered while dragging
                      if (
                        dragHoveredNote() &&
                        dragHoveredNote()?.freq === note().freq &&
                        dragHoveredNote()?.step === step()
                      ) {
                        return true;
                      }

                      // Temporarily hide the note if it's being dragged to another cell
                      if (
                        dragHoveredNote() &&
                        draggedNote()?.freq === note().freq &&
                        draggedNote()?.step === step()
                      ) {
                        return false;
                      }

                      // Finally, show it if it's active
                      return noteInSlot() ? true : false;
                    });

                    let noteProps = {
                      step: step(),
                      freq: note().freq,
                      length: 1,
                    };
                    createEffect(() => {
                      noteProps = {
                        step: step(),
                        freq: note().freq,
                        length: noteInSlot()?.length || 1,
                      };
                    });

                    return (
                      <td onMouseEnter={(evt) => onCellMouseEnter(evt, noteProps)}>
                        <div
                          onMouseDown={(evt) => onNoteMouseDown(evt, noteProps)}
                          onMouseUp={(evt) => onNoteMouseUp(evt, noteProps)}
                          classList={{
                            [styles.highlight]: step() === context.currentStep(),
                            [styles.visible]: isNoteVisible(),
                            [styles.grabbing]: !isChangingNoteLength() && isPressingDown(),
                            [styles.resizing]: isChangingNoteLength(),
                          }}
                          style={{
                            width: `calc(100% * ${
                              isDragHoveredNote() ? draggedNote()?.length : noteInSlot()?.length
                            })`,
                          }}
                        >
                          {note().note}
                          {note().octave}
                          <span
                            style={{
                              // Ignore pointer events on the length handle
                              // if the user is dragging a note around or
                              // if the note itself is not active
                              'pointer-events': draggedNote() || !noteInSlot() ? 'none' : 'auto',
                            }}
                            onMouseDown={(evt) => onNoteLengthMouseDown(evt, noteProps)}
                            class={styles.lengthHandle}
                          />
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
