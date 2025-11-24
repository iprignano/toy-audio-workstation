import { Show } from 'solid-js';
import AppContextProvider from '../AppContext/AppContextProvider';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Instruments from '../Instruments/Instruments';
import { useSamplesResource } from '../../lib/useSamplesResource';

import styles from './styles.module.css';

export default function App() {
  const { data } = useSamplesResource();

  return (
    <AppContextProvider>
      <Show when={data.loading}>
        <div class={styles.loading}>
          <img src="/logo.svg" />
        </div>
      </Show>
      <div class={styles.wrapper}>
        <Header />

        <div class={styles.body}>
          <Instruments />
        </div>

        <Footer />
      </div>
    </AppContextProvider>
  );
}
