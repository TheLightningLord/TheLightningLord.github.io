import { useState } from 'react';
import axios from 'axios';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/contact', formData);
      setResponseMsg(res.data.message);
      // Optionally reset the form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setResponseMsg('There was an error sending your message.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <label>Name:</label>
      <input 
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required 
      />
      <label>Email:</label>
      <input 
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required 
      />
      <label>Message:</label>
      <textarea 
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows="5"
        required
      ></textarea>
      <button type="submit" style={{ marginTop: '1rem' }}>Send Message</button>
      {responseMsg && <p style={{ marginTop: '1rem' }}>{responseMsg}</p>}
    </form>
  );
}


