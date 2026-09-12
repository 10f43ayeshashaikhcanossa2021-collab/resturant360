import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  BarChart3,
  Lightbulb,
  Trash2,
  RefreshCw,
  User,
  ChevronRight,
} from 'lucide-react';

import { getChatbotSuggestions, sendChatbotMessage } from '../services/api';
import '../styles/aiChatbot.css';

const fallbackSuggestions = [
  {
    title: 'Sales Performance',
    question: 'How are my sales performing today?',
    icon: TrendingUp,
  },
  {
    title: 'Best Sellers',
    question: 'Which menu items are selling the most?',
    icon: ShoppingBag,
  },
  {
    title: 'Customer Insights',
    question: 'Give me insights about my customers.',
    icon: Users,
  },
  {
    title: 'Inventory Alert',
    question: 'Which inventory items need attention?',
    icon: Package,
  },
];

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your Restaurant360 AI Analyst. I can help you understand sales, orders, customers, inventory and restaurant performance. Ask me anything about your business.",
};

function AIChatbot() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState(fallbackSuggestions);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, loading]);

  const loadSuggestions = async () => {
    try {
      const data = await getChatbotSuggestions();

      if (Array.isArray(data) && data.length > 0) {
        setSuggestions(
          data.slice(0, 4).map((item, index) => ({
            title: item.title || `Insight ${index + 1}`,
            question: item.question || item.prompt || item.text || '',
            icon:
              [TrendingUp, ShoppingBag, Users, Package][index] ||
              Lightbulb,
          })),
        );
      }
    } catch {
      // Keep fallback suggestions
    }
  };

  const sendMessage = async (question = input) => {
    const text = question.trim();

    if (!text || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatbotMessage({
        message: text,
        query: text,
      });

      const answer =
        typeof response === 'string'
          ? response
          : response?.message ||
            response?.reply ||
            response?.response ||
            response?.answer ||
            'I could not generate an analysis for that question.';

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            error.message ||
            'Unable to connect to the Restaurant360 AI Analyst. Please make sure the backend server is running on port 5000.',
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const clearChat = () => {
    setMessages([welcomeMessage]);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="ai-page">
      <div className="ai-header">
        <div className="ai-title-section">
          <div className="ai-icon">
            <Bot size={25} />
            <span className="ai-status-dot" />
          </div>

          <div>
            <div className="ai-title-row">
              <h1>AI Analyst</h1>
              <span className="ai-badge">
                <Sparkles size={13} />
                Intelligence
              </span>
            </div>

            <p>
              Ask questions about your restaurant and get actionable business
              insights.
            </p>
          </div>
        </div>

        <button className="ai-clear-btn" onClick={clearChat}>
          <Trash2 size={16} />
          Clear Chat
        </button>
      </div>

      <div className="ai-layout">
        <section className="ai-chat-card">
          <div className="ai-chat-topbar">
            <div className="ai-online">
              <span />
              AI Analyst Online
            </div>

            <div className="ai-model">
              <Sparkles size={14} />
              Restaurant Intelligence
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message-row ${
                  message.role === 'user' ? 'user-message-row' : ''
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="message-avatar ai-avatar">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`ai-message ${
                    message.role === 'user'
                      ? 'user-message'
                      : 'assistant-message'
                  } ${message.isError ? 'error-message' : ''}`}
                >
                  <div className="message-label">
                    {message.role === 'user' ? 'You' : 'AI Analyst'}
                  </div>

                  <div className="message-content">
                    {message.content}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="message-avatar user-avatar">
                    <User size={17} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-message-row">
                <div className="message-avatar ai-avatar">
                  <Bot size={18} />
                </div>

                <div className="ai-message assistant-message">
                  <div className="message-label">AI Analyst</div>

                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                    <em>Analyzing restaurant data...</em>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="ai-input-area" onSubmit={handleSubmit}>
            <div className="ai-input-wrapper">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask your AI Analyst anything..."
                rows={1}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                type="submit"
                className="ai-send-btn"
                disabled={!input.trim() || loading}
              >
                <Send size={18} />
              </button>
            </div>

            <div className="ai-input-hint">
              Press <strong>Enter</strong> to send · Shift + Enter for a new
              line
            </div>
          </form>
        </section>

        <aside className="ai-sidebar">
          <div className="ai-side-card">
            <div className="side-card-heading">
              <div className="side-heading-icon">
                <Lightbulb size={17} />
              </div>

              <div>
                <h3>Ask the Analyst</h3>
                <p>Popular business questions</p>
              </div>
            </div>

            <div className="suggestion-list">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon || Lightbulb;

                return (
                  <button
                    key={`${suggestion.title}-${index}`}
                    className="suggestion-item"
                    onClick={() => sendMessage(suggestion.question)}
                    disabled={loading}
                  >
                    <div className="suggestion-icon">
                      <Icon size={17} />
                    </div>

                    <div className="suggestion-copy">
                      <strong>{suggestion.title}</strong>
                      <span>{suggestion.question}</span>
                    </div>

                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ai-side-card capabilities-card">
            <div className="side-card-heading">
              <div className="side-heading-icon">
                <BarChart3 size={17} />
              </div>

              <div>
                <h3>What I Can Analyze</h3>
                <p>Restaurant intelligence</p>
              </div>
            </div>

            <div className="capability-list">
              <div>
                <TrendingUp size={16} />
                <span>Revenue & sales trends</span>
              </div>

              <div>
                <ShoppingBag size={16} />
                <span>Orders & menu performance</span>
              </div>

              <div>
                <Users size={16} />
                <span>Customer & loyalty insights</span>
              </div>

              <div>
                <Package size={16} />
                <span>Inventory & stock alerts</span>
              </div>

              <div>
                <BarChart3 size={16} />
                <span>Business performance</span>
              </div>
            </div>
          </div>

          <div className="ai-side-card analyst-tip">
            <div className="tip-icon">
              <Sparkles size={17} />
            </div>

            <div>
              <strong>Analyst Tip</strong>
              <p>
                Ask specific questions such as “Which products should I
                promote this week?” for more useful recommendations.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AIChatbot;