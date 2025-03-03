export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process booking request (e.g., save to database, send confirmation email)
    console.log('Booking request received:', req.body);
    res.status(200).json({ message: 'Your booking request has been received. We will get back to you shortly.' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

