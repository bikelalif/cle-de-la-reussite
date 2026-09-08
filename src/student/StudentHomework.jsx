import React, { useState } from 'react';
import { BookOpen, Calendar, CheckCircle2, AlertCircle, FileText, Send, Award } from 'lucide-react';

export default function StudentHomework({ student, homeworks, onSubmitHomework }) {
  const [selectedHw, setSelectedHw] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileName, setFileName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter homeworks relevant for the student's level
  const studentHws = homeworks.filter(hw => hw.level === student.level);

  const handleOpenSubmit = (hw) => {
    setSelectedHw(hw);
    setSubmissionText('');
    setFileName('');
    setSuccessMsg('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!submissionText) return;

    onSubmitHomework(selectedHw.id, {
      studentId: student.id,
      studentName: student.name,
      submittedAt: new Date().toISOString(),
      content: submissionText,
      attachments: fileName ? [fileName] : ['copie_redigee.pdf']
    });

    setSuccessMsg('Devoir rendu avec succès !');
    setTimeout(() => {
      setSelectedHw(null);
      setSuccessMsg('');
    }, 2000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Travail à faire</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Suis et rends tes devoirs pour chaque matière. Consulte les corrections de tes professeurs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedHw ? '1.2fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Homework List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {studentHws.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Aucun devoir programmé.</p>
          ) : (
            studentHws.map(hw => {
              const submission = hw.submissions?.find(s => s.studentId === student.id);
              const isSubmitted = !!submission;
              const isGraded = isSubmitted && submission.grade !== null && submission.grade !== undefined;

              return (
                <div 
                  key={hw.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '1.5rem', 
                    borderLeft: `4px solid ${isGraded ? 'var(--success)' : isSubmitted ? 'var(--warning)' : 'var(--danger)'}`,
                    cursor: 'pointer',
                    background: selectedHw?.id === hw.id ? 'var(--bg-tertiary)' : 'var(--bg-card)'
                  }}
                  onClick={() => handleOpenSubmit(hw)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', tracking: '0.05em' }}>
                        {hw.subject}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', marginTop: '0.15rem' }}>{hw.title}</h3>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {isGraded ? (
                        <span className="badge badge-success" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <Award size={12} /> Noté : {submission.grade}/20
                        </span>
                      ) : isSubmitted ? (
                        <span className="badge badge-warning" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <CheckCircle2 size={12} /> Rendu
                        </span>
                      ) : (
                        <span className="badge badge-danger" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <AlertCircle size={12} /> À faire
                        </span>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {hw.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> À rendre pour le : {hw.dueDate}
                    </span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Détails & Action →</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Action Panel for Selected Homework */}
        {selectedHw && (() => {
          const submission = selectedHw.submissions?.find(s => s.studentId === student.id);
          const isSubmitted = !!submission;
          const isGraded = isSubmitted && submission.grade !== null && submission.grade !== undefined;

          return (
            <div className="glass-card fade-in" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-seconde">{selectedHw.subject}</span>
                <button onClick={() => setSelectedHw(null)} style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>Fermer</button>
              </div>

              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{selectedHw.title}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} /> Date limite : {selectedHw.dueDate}
              </p>

              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Instructions</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>{selectedHw.description}</p>
              </div>

              {successMsg && (
                <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.75rem', borderRadius: '6px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                  {successMsg}
                </div>
              )}

              {/* Graded homework display */}
              {isGraded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--success-light)', border: '1px solid var(--success)', padding: '1rem', borderRadius: '8px' }}>
                    <Award size={36} color="var(--success)" />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>Note obtenue</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{submission.grade} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>/20</span></div>
                    </div>
                  </div>
                  
                  {submission.feedback && (
                    <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>Commentaire du professeur</h4>
                      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{submission.feedback}"</p>
                    </div>
                  )}

                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mon rendu</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{submission.content}</p>
                    {submission.attachments?.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)' }}>
                        <FileText size={14} /> <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submitted but not graded */}
              {isSubmitted && !isGraded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--warning-light)', border: '1px solid var(--warning)', padding: '0.85rem', borderRadius: '8px', color: '#fbbf24', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={20} />
                    <span>Devoir rendu le {new Date(submission.submittedAt).toLocaleDateString()}. En attente de correction.</span>
                  </div>

                  <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Contenu de ma copie</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>{submission.content}</p>
                    {submission.attachments?.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.50rem', fontSize: '0.8rem', color: 'var(--primary)' }}>
                        <FileText size={14} /> <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Open to Submit Form */}
              {!isSubmitted && (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Rédige ta réponse ou ton explication</span>
                    <textarea
                      className="input-field"
                      rows={5}
                      placeholder="Saisis ton travail ici..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      required
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Joindre un fichier (PDF, Word, photo de la copie)</span>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Nom du fichier (ex: devoir_maths.pdf)"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                    <Send size={16} /> Rendre le devoir
                  </button>
                </form>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
