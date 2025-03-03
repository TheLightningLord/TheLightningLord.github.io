import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PromoBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000); // Show banner after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: '#ff9900',
        color: '#fff',
        padding: '1rem',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <span>New! Sign up today and get <strong>20% off</strong> your first session!</span>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '1.2rem',
          cursor: 'pointer'
        }}
      >
        &times;
      </button>
    </motion.div>
  );
};

export default PromoBanner;

