import AppContextProvider from '../AppContext/AppContextProvider';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Instruments from '../Instruments/Instruments';

import styles from './styles.module.css';

export default function App() {
  return (
    <AppContextProvider>
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
