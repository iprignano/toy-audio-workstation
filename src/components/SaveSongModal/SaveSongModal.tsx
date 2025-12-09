import { random } from 'es-toolkit';
import { createSignal, useContext } from 'solid-js';
import { AppContext } from '../AppContext/AppContext';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';
import styles from './styles.module.css';
import { saveSong } from '../../lib/storage';

export default function SaveSongModal(props: { onClose(): void }) {
  const context = useContext(AppContext);
  const [songName, setSongName] = createSignal('');
  const [hasSaved, setHasSaved] = createSignal(false);
  const [hasError, setHasError] = createSignal(false);
  const placeholderSongs = [
    'Holy, Holy',
    'Another brick in the wall',
    'Mesh cinereaL',
    'heavy focus',
    'IZ-US',
    'Se telefonando',
    'Immaterial',
    'Response to Subdivisions ☾',
    'Chase the Tear',
    'Alone but moving',
    `Gollum's song`,
    'One More Red Nightmare',
    'Alien Observer',
    'Melt!',
    'So Good, So Right',
    'Gravity that Binds',
    'all end',
  ];

  const handleSubmit = (evt: SubmitEvent) => {
    evt.preventDefault();

    if (hasSaved()) return;

    const song = {
      name: songName(),
      ...context!.getSong()!,
    };

    const success = saveSong(song);

    if (success) {
      setHasSaved(true);

      setTimeout(() => {
        setHasSaved(false);
        props.onClose();
      }, 2000);
    } else {
      setHasError(true);
    }
  };

  return (
    <Modal onClose={props.onClose}>
      <div class={styles.wrapper}>
        <h2>Save this song</h2>
        <form onSubmit={handleSubmit}>
          <TextInput
            id="songName"
            label="New song name"
            required
            onChange={(evt) => setSongName(evt.target.value)}
            placeholder={`e.g. ${placeholderSongs.at(random(placeholderSongs.length))}`}
          />

          {hasError() && (
            <div class={styles.error}>There was a problem saving your song. Try later.</div>
          )}

          <div class={styles.actions}>
            <Button type="button" variant="alternate" onClick={() => props.onClose()}>
              Cancel
            </Button>
            <Button
              type="submit"
              icon={hasSaved() ? 'check' : 'save'}
              variant={hasSaved() ? 'green' : 'primary'}
            >
              {hasSaved() ? 'Saved!' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
