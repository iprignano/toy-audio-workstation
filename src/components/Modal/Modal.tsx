import { onCleanup, onMount, useContext } from 'solid-js';
import type { JSXElement } from 'solid-js';
import styles from './styles.module.css';
import { AppContext } from '../AppContext/AppContext';

export default function Modal(props: { onClose(): void; children: JSXElement }) {
  const context = useContext(AppContext);

  onMount(() => {
    context?.setIsModalOpen(true);
  });
  onCleanup(() => {
    context?.setIsModalOpen(false);
  });

  const handleOverlayClick = (evt: MouseEvent) => {
    evt.preventDefault();

    if ((evt.target as HTMLElement).id === 'overlay') {
      props.onClose();
    }
  };

  return (
    <div id="overlay" class={styles.overlay} onClick={handleOverlayClick}>
      <div class={styles.modal}>{props.children}</div>
    </div>
  );
}
