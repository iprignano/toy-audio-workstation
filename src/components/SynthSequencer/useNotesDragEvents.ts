import { createSignal, useContext } from 'solid-js';
import { AppContext } from '../AppContext/AppContext';

type NoteProps = { step: number; freq: number };

export const useNotesDragEvents = () => {
  const context = useContext(AppContext)!;

  const [isPressingDown, setIsPressingDown] = createSignal<boolean>(false);
  const [isChangingNoteLength, setIsChangingNoteLength] = createSignal<boolean>(false);
  const [clickedNote, setClickedNote] = createSignal<NoteProps | null>(null);
  const [draggedNote, setDraggedNote] = createSignal<NoteProps | null>(null);
  const [dragTargetNote, setDragTargetNote] = createSignal<NoteProps | null>(null);

  const onNoteMouseDown = (evt: MouseEvent, noteProps: NoteProps) => {
    evt.preventDefault();
    setIsPressingDown(true);

    // We store this for later reference
    // in case the user is dragging it
    setClickedNote(noteProps);
  };

  const onNoteMouseUp = (_: MouseEvent, { step, freq }: NoteProps) => {
    setIsPressingDown(false);

    if (isChangingNoteLength()) {
      setDraggedNote(null);
      setIsChangingNoteLength(false);
    } else {
      // If the user was dragging a note, remove it from the sequence
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

      setClickedNote(null);
      setDraggedNote(null);
      setDragTargetNote(null);
    }
  };

  const onCellMouseEnter = (_: MouseEvent, noteProps: NoteProps) => {
    if (!isPressingDown()) return;

    if (isChangingNoteLength()) {
      // Discard events where the user dragged the
      // handle beyond the start of the note
      if (noteProps.step < (draggedNote()!.step ?? 0)) return;

      // Set the note length
      context.setKeys(draggedNote()!.step, (note) => note?.freq === draggedNote()?.freq, {
        freq: draggedNote()?.freq,
        length: Math.max(1, noteProps.step + 1 - (draggedNote()?.step ?? 0)),
      });
    } else {
      // The user is dragging a note
      // to a different cell
      setDraggedNote(clickedNote);
      setDragTargetNote(noteProps);
    }
  };

  const onNoteLengthMouseDown = (evt: MouseEvent, noteProps: NoteProps) => {
    // Don't let this event bubble to
    // the event listener above
    evt.preventDefault();

    setIsChangingNoteLength(true);
    setDraggedNote(noteProps);
  };

  return {
    onNoteMouseDown,
    onNoteMouseUp,
    onNoteLengthMouseDown,
    onCellMouseEnter,
    draggedNote,
    dragTargetNote,
    isChangingNoteLength,
  };
};
