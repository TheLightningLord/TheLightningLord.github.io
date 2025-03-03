import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { quote: "I've never felt better! The programs at Olympian Health Solutions changed my life.", author: "Jane D." },
  { quote: "Excellent trainers and personalized approach. Highly recommended for anyone starting out.", author: "Robert K." },
  { quote: "Their senior wellness program helped me regain my mobility and confidence.", author: "Eleanor M." }
];

export default function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);

  const nextTestimonial = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>What Our Clients Say</h2>
      <div style={{ position: 'relative', minHeight: '120px' }}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <p>"{testimonials[current].quote}"</p>
            <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>— {testimonials[current].author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={prevTestimonial} style={{ marginRight: '1rem' }}>Previous</button>
        <button onClick={nextTestimonial}>Next</button>
      </div>
    </div>
  );
}
