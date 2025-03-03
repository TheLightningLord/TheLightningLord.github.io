import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/"><a>Olympian Health Solutions</a></Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/"><a>Home</a></Link>
        <Link href="/about"><a>About</a></Link>
        <Link href="/services"><a>Services</a></Link>
        <Link href="/booking"><a>Booking</a></Link>
        <Link href="/contact"><a>Contact</a></Link>
      </nav>
    </header>
  );
}

