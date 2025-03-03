export default function handler(req, res) {
  if (req.method === 'POST') {
    // In a real-world app, process the form data here (e.g., send email, store in database)
    console.log('Contact form submitted:', req.body);
    res.status(200).json({ message: 'Thank you for reaching out! We will contact you soon.' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

