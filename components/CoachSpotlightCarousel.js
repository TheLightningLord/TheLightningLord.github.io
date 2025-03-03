import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const coaches = [
  {
    name: "Alexandra Reed",
    title: "Senior Wellness Specialist",
    bio: "With over 15 years of experience in senior fitness, Alexandra tailors workouts to improve mobility and balance.",
    image: "/coaches/alexandra.jpg" // Place an image in public/coaches/
  },
  {
    name: "Michael Turner",
    title: "Strength and Conditioning Coach",
    bio: "Michael brings a dynamic approach to strength training, ensuring safe and effective workouts.",
    image: "/coaches/michael.jpg"
  },
  {
    name: "Sophia Lee",
    title: "Holistic Health Coach",
    bio: "Specializing in nutritional guidance and holistic health, Sophia helps integrate wellness into your lifestyle.",
    image: "/coaches/sophia.jpg"
  }
];

export default function CoachSpotlightCarousel() {
  const [current, setCurrent] = useState(0);

  const nextCoach = () => {
    setCurrent((current + 1) % coaches.length);
  };

  const prevCoach = () => {
    setCurrent((current - 1 + coaches.length) % coaches.length);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>Meet Our Coaches</h2>
      <div style={{ position: 'relative', height: '300px' }}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={coaches[current].name}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', width: '100%' }}
          >
            <img
              src={coaches[current].image}
              alt={coaches[current].name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h3>{coaches[current].name}</h3>
            <p><strong>{coaches[current].title}</strong></p>
            <p>{coaches[current].bio}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={prevCoach} style={{ marginRight: '1rem' }}>Previous</button>
        <button onClick={nextCoach}>Next</button>
      </div>
    </div>
  );
}
