import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare, ArrowLeft } from 'lucide-react';

export default function StudentChat({ student, messages, onSendMessage }) {
  const [activeTeacher, setActiveTeacher] = useState('M. Dupont (Maths)');
  const [inputText, setInputText] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);

  const teachers = [
    { name: 'M. Dupont (Maths)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { name: 'Mme. Simon (Physique)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
  ];

  // Filter messages for this student and active teacher
  const chatMessages = messages.filter(
    msg => msg.studentId === student.id && msg.teacherName === activeTeacher
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, showMobileChat]);

  const handleSelectTeacher = (teacherName) => {
    setActiveTeacher(teacherName);
    setShowMobileChat(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      studentId: student.id,
      studentName: student.name,
      teacherName: activeTeacher,
      sender: 'student',
      content: inputText
    });

    setInputText('');
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Messagerie</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Échange en direct avec tes professeurs de soutien pour poser tes questions.
        </p>
      </div>

      <div className={`glass-card chat-wrapper ${showMobileChat ? 'show-chat-mobile' : ''}`}>
        {/* Sidebar: Teachers list */}
        <div className="chat-contacts-panel">
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <MessageSquare size={16} color="var(--primary)" /> Contacts Enseignants
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0.5rem', overflowY: 'auto' }}>
            {teachers.map((t, i) => (
              <div 
                key={i} 
                onClick={() => handleSelectTeacher(t.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: activeTeacher === t.name ? 'var(--primary-light)' : 'transparent',
                  color: activeTeacher === t.name ? 'var(--primary)' : 'var(--text-secondary)',
                  border: activeTeacher === t.name ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  transition: 'var(--transition-fast)'
                }}
              >
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: activeTeacher === t.name ? '2px solid var(--primary)' : 'none' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cliquer pour échanger</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-messages-panel">
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(18, 19, 26, 0.8)' }}>
            <button 
              className="btn btn-secondary btn-icon mobile-back-btn"
              onClick={() => setShowMobileChat(false)}
              style={{ padding: '4px', borderRadius: '6px', marginRight: '0.25rem' }}
              title="Retour aux contacts"
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{activeTeacher}</span>
          </div>

          {/* Messages body */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatMessages.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '0.5rem' }}>
                <MessageSquare size={36} />
                <span style={{ fontSize: '0.85rem' }}>Aucun message. Posez votre première question !</span>
              </div>
            ) : (
              chatMessages.map(msg => {
                const isStudent = msg.sender === 'student';
                return (
                  <div 
                    key={msg.id} 
                    style={{ 
                      alignSelf: isStudent ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isStudent ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div 
                      style={{ 
                        background: isStudent ? 'var(--primary)' : 'var(--bg-tertiary)',
                        color: isStudent ? '#fff' : 'var(--text-primary)',
                        padding: '0.75rem 1rem',
                        borderRadius: isStudent ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        fontSize: '0.9rem',
                        border: isStudent ? 'none' : '1px solid var(--border-color)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    >
                      {msg.content}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSend} style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', background: 'rgba(18, 19, 26, 0.8)' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Écrivez votre message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ margin: 0, padding: '0.75rem 1rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .chat-wrapper {
          display: grid;
          grid-template-columns: 240px 1fr;
          height: 550px;
          overflow: hidden;
          padding: 0;
        }
        .chat-contacts-panel {
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          background: rgba(18, 19, 26, 0.4);
        }
        .chat-messages-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgba(10, 11, 16, 0.2);
        }
        .mobile-back-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .chat-wrapper {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 220px);
            min-height: 420px;
          }
          .chat-contacts-panel {
            display: flex;
            width: 100%;
            height: 100%;
            border-right: none;
          }
          .chat-messages-panel {
            display: none;
            width: 100%;
            height: 100%;
          }
          .show-chat-mobile .chat-contacts-panel {
            display: none;
          }
          .show-chat-mobile .chat-messages-panel {
            display: flex;
          }
          .mobile-back-btn {
            display: inline-flex;
          }
        }
      `}</style>
    </div>
  );
}

