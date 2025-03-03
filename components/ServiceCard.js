import { motion } from 'framer-motion';

export default function ServiceCard({ service }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        maxWidth: '300px',
        textAlign: 'center',
        backgroundColor: '#fff'
      }}
    >
      <div style={{ fontSize: '3rem' }}>{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </motion.div>
  );
}

