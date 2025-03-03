import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Personal Training",
    description: "One-on-one sessions tailored to your fitness level and goals.",
    icon: "💪"
  },
  {
    title: "Group Classes",
    description: "Fun, social classes designed for all ages and abilities.",
    icon: "🤸"
  },
  {
    title: "Senior Wellness",
    description: "Specialized programs to improve mobility, balance, and strength.",
    icon: "👵👴"
  },
  {
    title: "Nutritional Guidance",
    description: "Customized meal plans and nutritional advice to complement your workouts.",
    icon: "🥗"
  }
];

export default function Services() {
  return (
    <>
      <Head>
        <title>Services | Olympian Health Solutions</title>
      </Head>
      <Header />
      <motion.main
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ padding: '2rem' }}
      >
        <h1>Our Services</h1>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </motion.main>
      <Footer />
    </>
  );
}

