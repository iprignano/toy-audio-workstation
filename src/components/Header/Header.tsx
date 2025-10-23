import styles from './styles.module.css';

export default function Header() {
  return (
    <header class={styles.header}>
      <div class={styles.logo}>
        <h1 class="grotesk">taw</h1>
      </div>
    </header>
  );
}
