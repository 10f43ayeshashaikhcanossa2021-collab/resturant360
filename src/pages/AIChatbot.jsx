import { useState, useEffect } from "react";
import { getChatbotSuggestions, sendChatbotMessage } from "../services/api";

function AIChatbot() {
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Ask me about sales, inventory, occupancy, or menu performance.");

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const data = await getChatbotSuggestions();
        setSuggestions(data || []);
      } catch (error) {
        console.error('Failed to load chatbot suggestions:', error);
      }
    };

    loadSuggestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const result = await sendChatbotMessage({ message });
      setReply(result.reply || 'I can help with restaurant insights.');
      setMessage("");
    } catch (error) {
      console.error('Chatbot request failed:', error);
      setReply('I could not process that request right now.');
    }
  };

  return (
    <div style={{ padding: '24px', color: 'var(--text-main)' }}>
      <h2>AI Analyst Chatbot</h2>
      <p style={{ color: 'var(--text-sub)', marginTop: '8px' }}>
        Ask intelligent questions about restaurant performance, top selling dishes, profit margins, and menu optimization.
      </p>

      <div style={{ marginTop: '20px', background: '#111827', borderRadius: '12px', padding: '20px', maxWidth: '800px' }}>
        <div style={{ marginBottom: '16px' }}>
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => setMessage(item)}
              style={{
                marginRight: '8px',
                marginBottom: '8px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: '#e5e7eb',
                borderRadius: '999px',
                padding: '8px 12px',
                cursor: 'pointer'
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px', marginBottom: '16px', minHeight: '100px' }}>
          <strong>Response:</strong>
          <p style={{ marginTop: '8px', color: '#d1d5db' }}>{reply}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about sales, inventory, or tables..."
            style={{ flex: 1, padding: '12px 14px', borderRadius: '8px', border: '1px solid #374151', background: '#0b1220', color: '#fff' }}
          />
          <button type="submit" style={{ padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#f97316', color: '#fff', cursor: 'pointer' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChatbot;
