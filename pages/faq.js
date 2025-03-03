
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "What types of personal training services do you offer?",
    answer: "We offer a range of services including one-on-one personal training, group classes, specialized senior wellness programs, and nutritional guidance."
  },
  {
    question: "Are your programs suitable for beginners?",
    answer: "Absolutely! Our programs are designed to cater to all levels of fitness, and our trainers customize sessions to match your unique needs."
  },
  {
    question: "How can I book a session?",
    answer: "You can easily book a session through our online booking page. Simply choose your preferred time and trainer, and we'll take care of the rest."
  },
  {
    question: "Do you offer free consultations?",
    answer: "Yes, we offer a free initial consultation to assess your needs and help you get started on your wellness journey."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>FAQ | Olympian Health Solutions</title>
      </Head>
      <Header />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <button 
              onClick={() => toggleFAQ(index)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                padding: '0.5rem',
                cursor: 'pointer'
              }}
            >
              {faq.question}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ padding: '0.5rem 1rem' }}>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}
