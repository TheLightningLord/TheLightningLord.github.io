import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

export default function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/booking', {
        name,
        email,
        date: selectedDate,
        message
      });
      setResponseMsg(res.data.message);
      // Reset form if needed
    } catch (error) {
      setResponseMsg('There was an error submitting your booking.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <label>Name:</label>
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        required 
      />
      <label>Email:</label>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <label>Select Date:</label>
      <DatePicker 
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMMM d, yyyy"
        className="datepicker-input"
      />
      <label>Message:</label>
      <textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="4"
      ></textarea>
      <button type="submit" style={{ marginTop: '1rem' }}>Submit Booking</button>
      {responseMsg && <p style={{ marginTop: '1rem' }}>{responseMsg}</p>}
    </form>
  );
}


