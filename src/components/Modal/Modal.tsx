import { onCleanup, onMount, useContext } from 'solid-js';
import { AppContext } from '../AppContext/AppContext';
import { Close } from '../Icon/Close';
import styles from './styles.module.css';
import type { JSXElement } from 'solid-js';

export default function Modal(props: { onClose(): void; children: JSXElement }) {
  const context = useContext(AppContext);

  onMount(() => {
    context?.setIsModalOpen(true);
  });
  onCleanup(() => {
    context?.setIsModalOpen(false);
  });

  const handleOverlayClick = (evt: MouseEvent) => {
    if ((evt.target as HTMLElement).id === 'overlay') {
      props.onClose();
    }
  };

  return (
    <div id="overlay" class={styles.overlay} onClick={handleOverlayClick}>
      <div class={styles.modal}>
        <button class={styles.closeButton} onClick={() => props.onClose()}>
          <Close />
        </button>
        {props.children}
      </div>
    </div>
  );
}
