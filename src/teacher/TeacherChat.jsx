import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare, ArrowLeft } from 'lucide-react';

export default function TeacherChat({ students, messages, onSendMessage }) {
  const [activeStudentId, setActiveStudentId] = useState(students[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Find active student profile
  const activeStudent = students.find(s => s.id === activeStudentId);

  // Filter messages for the active student conversation
  const chatMessages = messages.filter(
    msg => msg.studentId === activeStudentId && msg.teacherName === 'M. Dupont (Maths)'
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, showMobileChat]);

  const handleSelectStudent = (id) => {
    setActiveStudentId(id);
    setShowMobileChat(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      studentId: activeStudentId,
      studentName: activeStudent?.name || 'Élève',
      teacherName: 'M. Dupont (Maths)',
      sender: 'teacher',
      content: inputText
    });

    setInputText('');
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Messagerie</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Répondez aux questions de vos élèves et envoyez des consignes individuelles.
        </p>
      </div>

      <div className={`glass-card chat-wrapper ${showMobileChat ? 'show-chat-mobile' : ''}`}>
        {/* Sidebar: Student list conversations */}
        <div className="chat-contacts-panel">
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <MessageSquare size={16} color="var(--primary)" /> Conversations élèves
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0.5rem', overflowY: 'auto' }}>
            {students.map(s => {
              // Get last message in thread
              const threadMsgs = messages.filter(m => m.studentId === s.id && m.teacherName === 'M. Dupont (Maths)');
              const lastMsg = threadMsgs[threadMsgs.length - 1];

              return (
                <div 
                  key={s.id} 
                  onClick={() => handleSelectStudent(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: activeStudentId === s.id ? 'var(--primary-light)' : 'transparent',
                    color: activeStudentId === s.id ? 'var(--primary)' : 'var(--text-secondary)',
                    border: activeStudentId === s.id ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <img 
                    src={s.avatar} 
                    alt={s.name} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: activeStudentId === s.id ? '2px solid var(--primary)' : 'none' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lastMsg ? lastMsg.content : 'Aucun message'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-messages-panel">
          {/* Header */}
          {activeStudent ? (
            <>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(18, 19, 26, 0.8)' }}>
                <button 
                  className="btn btn-secondary btn-icon mobile-back-btn"
                  onClick={() => setShowMobileChat(false)}
                  style={{ padding: '4px', borderRadius: '6px', marginRight: '0.25rem' }}
                  title="Retour aux conversations"
                >
                  <ArrowLeft size={18} />
                </button>
                <img 
                  src={activeStudent.avatar} 
                  alt={activeStudent.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>{activeStudent.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Classe de {activeStudent.level}</span>
                </div>
              </div>

              {/* Messages body */}
              <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {chatMessages.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '0.5rem' }}>
                    <MessageSquare size={36} />
                    <span style={{ fontSize: '0.85rem' }}>Aucun message avec cet élève.</span>
                  </div>
                ) : (
                  chatMessages.map(msg => {
                    const isTeacher = msg.sender === 'teacher';
                    return (
                      <div 
                        key={msg.id} 
                        style={{ 
                          alignSelf: isTeacher ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isTeacher ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div 
                          style={{ 
                            background: isTeacher ? 'var(--primary)' : 'var(--bg-tertiary)',
                            color: isTeacher ? '#fff' : 'var(--text-primary)',
                            padding: '0.75rem 1rem',
                            borderRadius: isTeacher ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                            fontSize: '0.9rem',
                            border: isTeacher ? 'none' : '1px solid var(--border-color)',
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
                  placeholder={`Répondre à ${activeStudent.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ margin: 0, padding: '0.75rem 1rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '0.5rem' }}>
              <MessageSquare size={36} />
              <span style={{ fontSize: '0.85rem' }}>Sélectionnez une conversation.</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .chat-wrapper {
          display: grid;
          grid-template-columns: 260px 1fr;
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

