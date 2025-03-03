import { useState } from 'react';
import { motion } from 'framer-motion';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you with your fitness journey today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: "Thank you for your message! One of our experts will get back to you shortly.", sender: "bot" }
      ]);
    }, 1000);
  };

  return (
    <div>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: '60px',
            right: '20px',
            width: '300px',
            height: '400px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          <div style={{ padding: '0.5rem', background: '#0070f3', color: '#fff', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
            <span>Live Chat</span>
            <button 
              onClick={() => setOpen(false)}
              style={{ float: 'right', background: 'none', border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}
            >
              ✖
            </button>
          </div>
          <div style={{ flex: 1, padding: '0.5rem', overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ textAlign: msg.sender === 'bot' ? 'left' : 'right', margin: '0.5rem 0' }}>
                <span style={{
                  background: msg.sender === 'bot' ? '#eee' : '#0070f3',
                  color: msg.sender === 'bot' ? '#333' : '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  display: 'inline-block'
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ padding: '0.5rem', borderTop: '1px solid #ccc' }}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
        </motion.div>
      )}
      {!open && (
        <button 
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '1.5rem',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget;

