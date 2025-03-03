export default function Footer() {
  return (
    <footer style={{
      padding: '1rem',
      backgroundColor: '#222',
      color: '#fff',
      textAlign: 'center'
    }}>
      <p>&copy; {new Date().getFullYear()} Olympian Health Solutions. All rights reserved.</p>
      <p>
        Follow us: 
        <a href="https://facebook.com" style={{ margin: '0 0.5rem', color: '#fff' }}>Facebook</a> | 
        <a href="https://twitter.com" style={{ margin: '0 0.5rem', color: '#fff' }}>Twitter</a>
      </p>
    </footer>
  );
}

