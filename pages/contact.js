import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us | Olympian Health Solutions</title>
      </Head>
      <Header />
      <motion.main
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem' }}
      >
        <h1>Contact Us</h1>
        <ContactForm />
      </motion.main>
      <Footer />
    </>
  );
}
