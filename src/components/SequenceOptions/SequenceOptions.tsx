import { For, useContext } from 'solid-js';
import { AppContext } from '../AppContext/AppContext';
import { AutoPlay } from '../Icon/AutoPlay';
import styles from './styles.module.css';

export default function SequenceOptions(props: { instrument: 'drums' | 'synth' }) {
  const context = useContext(AppContext)!;

  const isAutoSequenceActive = () => {
    switch (props.instrument) {
      case 'drums':
        return context.isDrumAutoSequenced();
      case 'synth':
        return context.isSynthAutoSequenced();
      default:
        return false;
    }
  };

  const isSequenceActive = (index: number) => {
    switch (props.instrument) {
      case 'drums':
        return context.drumSequenceIndex() === index;
      case 'synth':
        return context.synthSequenceIndex() === index;
      default:
        return false;
    }
  };

  const willSequenceActivate = (index: number) => {
    switch (props.instrument) {
      case 'drums':
        return context.nextDrumSequenceIndex() === index;
      case 'synth':
        return context.nextSynthSequenceIndex() === index;
      default:
        return false;
    }
  };

  const onAutoSequenceClick = () => {
    switch (props.instrument) {
      case 'drums':
        context.setIsDrumAutoSequenced((prev) => !prev);
        break;
      case 'synth':
        context.setIsSynthAutoSequenced((prev) => !prev);
        break;
      default:
        return;
    }
  };
  const onSequenceClick = (index: number) => {
    switch (props.instrument) {
      case 'drums':
        if (!context.isPlaying()) {
          context.setDrumSequenceIndex(index);
        } else {
          context.setNextDrumSequenceIndex(index);
        }
        break;
      case 'synth':
        if (!context.isPlaying()) {
          context.setSynthSequenceIndex(index);
        } else {
          context.setNextSynthSequenceIndex(index);
        }
        break;
      default:
        return;
    }
  };

  return (
    <div class={styles.wrapper}>
      <button
        classList={{ [styles.autoplayToggle]: true, [styles.isActive]: isAutoSequenceActive() }}
        onClick={onAutoSequenceClick}
      >
        <AutoPlay />
      </button>
      <div class={styles.sequence}>
        <For each={[1, 2, 3, 4]}>
          {(_, index) => (
            <button
              onClick={() => onSequenceClick(index())}
              classList={{
                [styles.sequenceIndex]: true,
                [styles.isActive]: isSequenceActive(index()),
                [styles.willActivateNext]: willSequenceActivate(index()),
              }}
            >
              {index() + 1}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
