import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingForm from '../components/BookingForm';
import { motion } from 'framer-motion';

export default function Booking() {
  return (
    <>
      <Head>
        <title>Book a Session | Olympian Health Solutions</title>
      </Head>
      <Header />
      <motion.main
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem' }}
      >
        <h1>Book a Session</h1>
        <BookingForm />
      </motion.main>
      <Footer />
    </>
  );
}
