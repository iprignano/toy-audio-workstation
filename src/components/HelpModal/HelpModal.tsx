import { createSignal, For } from 'solid-js';
import Modal from '../Modal/Modal';
import styles from './styles.module.css';
import { AutoPlay } from '../Icon/AutoPlay';

const examples: { text: string; videoSrc: string }[] = [
  { text: 'Lay down some beats in the drum sequencer', videoSrc: '/example-1.mp4' },
  { text: 'Write a melody in the synth sequencer', videoSrc: '/example-2.mp4' },
  { text: 'Switch between the four available sequences', videoSrc: '/example-3.mp4' },
  {
    text: 'Toggle piano view and play on top of your loop',
    videoSrc: '/example-4.mp4',
  },
  { text: 'Jam out!', videoSrc: '/example-5.mp4' },
];

export default function HelpModal(props: { onClose(): void }) {
  const [tutorialIndex, setTutorialIndex] = createSignal(0)!;

  return (
    <Modal onClose={props.onClose} variant="large">
      <div class={styles.wrapper}>
        <h2>How does this work?</h2>

        <div>
          <div class={styles.videoWrapper}>
            <For each={examples}>
              {({ text, videoSrc }, i) => (
                <div
                  classList={{ [styles.example]: true, [styles.isActive]: tutorialIndex() === i() }}
                >
                  <div class={styles.video}>
                    <video autoplay loop src={videoSrc} />
                  </div>

                  <div class={styles.text}>{text}</div>
                </div>
              )}
            </For>

            <div class={styles.arrows}>
              <button
                type="button"
                disabled={tutorialIndex() === 0}
                onClick={() => setTutorialIndex((i) => i - 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                </svg>
              </button>
              <button
                type="button"
                disabled={tutorialIndex() === examples.length - 1}
                onClick={() => setTutorialIndex((i) => i + 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                </svg>
              </button>
            </div>
          </div>

          <div class={styles.pagination}>
            <For each={examples}>
              {(_, i) => (
                <button
                  classList={{
                    [styles.paginationButton]: true,
                    [styles.isActive]: tutorialIndex() === i(),
                  }}
                  type="button"
                  onClick={() => setTutorialIndex(i())}
                />
              )}
            </For>
          </div>
        </div>
        <hr />
        <h4>Tips & tricks</h4>
        <ul class={styles.tips}>
          <li>
            <p>Use your keyboard to play the synth (letter A to L);</p>
          </li>
          <li>
            <p>Play around with the instrument settings to switch it up;</p>
          </li>
          <li>
            <p>
              Toggle the autoplay icon (<AutoPlay fill={'white'} />) to automatically cycle through
              sequences;
            </p>
          </li>
          <li>
            <p>Double click the "stop" button to reset the sequence to its initial state;</p>
          </li>
          <li>
            <p>Share your loops with your friends and import theirs!</p>
          </li>
        </ul>
        <hr />
        <div class={styles.credits}>
          <div>
            made by{' '}
            <a target="_blank" href="https://www.ivanprignano.com" rel="noopener noreferrer">
              ivan prignano
            </a>
          </div>
          <div>
            code on{' '}
            <a
              target="_blank"
              href="https://codeberg.org/iprignano/toy-audio-workstation"
              rel="noopener noreferrer"
            >
              codeberg
            </a>{' '}
            /{' '}
            <a
              target="_blank"
              href="https://github.com/iprignano/toy-audio-workstation"
              rel="noopener noreferrer"
            >
              github
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
