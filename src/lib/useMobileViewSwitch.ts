import { throttle } from 'es-toolkit';
import { createEffect, onCleanup, useContext } from 'solid-js';
import { AppContext } from '../components/AppContext/AppContext';

export const useMobileViewSwitch = () => {
  const context = useContext(AppContext);

  const onWindowResize = throttle(() => {
    // Make sure we always show the
    // sequencer on tablet and mobile
    if (window.innerWidth < 900) {
      context?.setIsSequencingKeys(true);
    }
  }, 100);

  createEffect(() => {
    window.addEventListener('resize', onWindowResize);

    onCleanup(() => {
      window.removeEventListener('resize', onWindowResize);
    });
  });
};
