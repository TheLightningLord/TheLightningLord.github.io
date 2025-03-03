import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      height: '80vh',
      backgroundImage: 'url(/hero-bg.jpg)', // Ensure you add an image in the public folder
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#fff'
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Olympian Health Solutions</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
          Empowering you to live a healthier, more active life.
        </p>
        <Link href="/booking">
          <a style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ff9900',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            Book a Session Today
          </a>
        </Link>
      </motion.div>
    </section>
  );
}

