import { Dynamic } from 'solid-js/web';
import { Load } from '../Icon/Load';
import { Save } from '../Icon/Save';
import { Copy } from '../Icon/Copy';
import { Check } from '../Icon/Check';
import styles from './styles.module.css';
import type { ComponentProps, ValidComponent } from 'solid-js';

const iconComponents: Record<string, ValidComponent> = {
  load: () => <Load />,
  save: () => <Save />,
  copy: () => <Copy />,
  check: () => <Check />,
};

export default function Button(
  props: {
    icon?: string;
    variant?: 'primary' | 'alternate' | 'red' | 'green';
  } & ComponentProps<'button'>,
) {
  return (
    <button class={`${styles.button} ${styles[props.variant ?? 'primary']}`} {...props}>
      {props.icon && <Dynamic component={iconComponents[props.icon]} />}
      {props.children}
    </button>
  );
}
