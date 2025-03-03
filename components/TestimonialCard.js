export default function TestimonialCard({ testimonial }) {
  return (
    <div style={{
      border: '1px solid #eee',
      padding: '1rem',
      margin: '1rem',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <p>"{testimonial.quote}"</p>
      <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>— {testimonial.author}</p>
    </div>
  );
}

