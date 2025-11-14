import { createEffect, createSignal, onCleanup, useContext } from 'solid-js';
import { AppContext } from '../AppContext/AppContext';

type NoteStyles = {
  transform: string;
};

type NoteProps = { step: number; freq: number };

export const useNotesDragEvents = () => {
  const context = useContext(AppContext)!;

  const [isPressingDown, setIsPressingDown] = createSignal<boolean>(false);
  const [draggedNote, setDraggedNote] = createSignal<NoteProps | null>(null);
  const [dragTargetNote, setDragTargetNote] = createSignal<NoteProps | null>(null);

  const onNoteMouseDown = (evt: MouseEvent, noteProps: NoteProps) => {
    evt.preventDefault();
    setIsPressingDown(true);

    setDraggedNote(noteProps);
  };

  const onNoteMouseUp = (_: MouseEvent, { step, freq }: NoteProps) => {
    setIsPressingDown(false);

    // If the user was dragging a note, remove that one from the sequence
    if (draggedNote()) {
      context.setKeys(draggedNote()!.step, (n) =>
        n.filter(({ freq: f }) => f !== draggedNote()!.freq),
      );
    }

    // Toggle target note on/off
    if (context.keys[step].find((n) => n.freq === freq)) {
      context.setKeys(step, (n) => n.filter(({ freq: f }) => f !== freq));
    } else {
      context.setKeys(step, context.keys[step].length, { freq, length: 1 });
    }

    setDraggedNote(null);
  };

  const onCellMouseEnter = (_: MouseEvent, noteProps: NoteProps) => {
    if (!isPressingDown()) return;
    setDragTargetNote(noteProps);
  };

  // const onNoteLengthDragStart = (
  //   evt: DragEvent,
  //   { step, freq }: { step: number; freq: number },
  // ) => {
  //   // Prevents cursor from going ham when dragging the note
  //   if (evt.dataTransfer) evt.dataTransfer.effectAllowed = 'none';

  //   setDraggedNote({ step, freq });
  // };

  // const onNoteLengthDragEnd = (_: DragEvent) => {
  //   setDraggedNote(null);
  // };

  // const onCellDragOver = throttle((evt: DragEvent, { step }: { step: number }) => {
  //   evt.preventDefault();

  //   if (evt.target !== evt.currentTarget) {
  //     // Ignore dragover events that originated
  //     // from targets different than the table cells
  //     // on which the handler is defined
  //     // (namely, the note div itself)
  //     return;
  //   }

  //   if (step < (draggedNote()?.step ?? 0)) {
  //     // Ignore events where the user dragged the
  //     // handle beyond the start of the note
  //     return;
  //   }

  //   context.setKeys(draggedNote()?.step as number, (note) => note?.freq === draggedNote()?.freq, {
  //     freq: draggedNote()?.freq,
  //     length: Math.max(1, step + 1 - (draggedNote()?.step ?? 0)),
  //   });
  // }, 100);

  return {
    onNoteMouseDown,
    onNoteMouseUp,
    onCellMouseEnter,
    draggedNote,
    dragTargetNote,
  };
};
