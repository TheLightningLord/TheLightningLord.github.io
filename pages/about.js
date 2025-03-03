import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | Olympian Health Solutions</title>
      </Head>
      <Header />
      <motion.main
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ padding: '2rem' }}
      >
        <h1>About Olympian Health Solutions</h1>
        <p>
          Founded on the principle that health is a lifelong journey, Olympian Health Solutions offers customized personal training and wellness programs that adapt to your pace and goals. Our mission is to empower individuals—especially seniors—to embrace a more active lifestyle safely and joyfully.
        </p>
        <h2>Our Team</h2>
        <p>
          Our expert trainers and wellness coaches bring years of experience and a passion for helping you succeed. We blend modern fitness techniques with traditional care, ensuring every client gets the support they need.
        </p>
      </motion.main>
      <Footer />
    </>
  );
}

