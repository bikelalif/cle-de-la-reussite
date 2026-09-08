import React, { useState } from 'react';
import { Plus, Send, Award, FileText, CheckCircle2, User, HelpCircle, Calendar } from 'lucide-react';

export default function TeacherHomework({ homeworks, students, onCreateHomework, onGradeSubmission }) {
  const [selectedHw, setSelectedHw] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  // New Homework Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subject, setSubject] = useState('Mathématiques');
  const [level, setLevel] = useState('Terminale');
  const [dueDate, setDueDate] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successCreateMsg, setSuccessCreateMsg] = useState('');

  // Grading Form State
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [successGradeMsg, setSuccessGradeMsg] = useState('');

  const handleCreateHw = (e) => {
    e.preventDefault();
    if (!title || !desc || !dueDate) return;

    onCreateHomework({
      id: 'hw_' + Date.now(),
      title,
      description: desc,
      subject,
      level,
      dueDate,
      status: 'Actif',
      submissions: []
    });

    setSuccessCreateMsg('Devoir créé et notifié aux élèves !');
    setTitle('');
    setDesc('');
    setDueDate('');
    setTimeout(() => {
      setSuccessCreateMsg('');
      setShowCreateForm(false);
    }, 2000);
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    const parsedGrade = parseFloat(grade);
    if (isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 20) {
      alert('Veuillez saisir une note valide entre 0 et 20.');
      return;
    }

    onGradeSubmission(selectedHw.id, selectedSub.studentId, parsedGrade, feedback);
    
    // Update local state views
    const updatedHw = {
      ...selectedHw,
      submissions: selectedHw.submissions.map(s => {
        if (s.studentId === selectedSub.studentId) {
          return { ...s, grade: parsedGrade, feedback };
        }
        return s;
      })
    };
    setSelectedHw(updatedHw);
    
    setSuccessGradeMsg('Copie corrigée avec succès !');
    setGrade('');
    setFeedback('');
    setTimeout(() => {
      setSuccessGradeMsg('');
      setSelectedSub(null);
    }, 2000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Gestion des devoirs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Créez de nouveaux devoirs pour vos classes et corrigez les copies rendues en ligne.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={18} /> {showCreateForm ? 'Masquer formulaire' : 'Créer un devoir'}
        </button>
      </div>

      {/* Create Homework Form */}
      {showCreateForm && (
        <div className="glass-card fade-in" style={{ padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>➕ Nouveau devoir à rendre</h3>
          
          {successCreateMsg && (
            <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.75rem', borderRadius: '6px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              {successCreateMsg}
            </div>
          )}

          <form onSubmit={handleCreateHw} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Niveau</span>
                <select className="input-field" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="Seconde">Seconde</option>
                  <option value="Première">Première</option>
                  <option value="Terminale">Terminale</option>
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Matière</span>
                <select className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Physique-Chimie">Physique-Chimie</option>
                  <option value="SVT">SVT</option>
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Date limite de rendu</span>
                <input
                  type="date"
                  className="input-field"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <span className="input-label">Titre du devoir</span>
              <input
                type="text"
                placeholder="ex: DM 3 : Suites géométriques et limites"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <span className="input-label">Description / Énoncé / Instructions</span>
              <textarea
                rows={4}
                placeholder="Détaillez le travail à effectuer..."
                className="input-field"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>Annuler</button>
              <button type="submit" className="btn btn-primary">Publier le devoir</button>
            </div>
          </form>
        </div>
      )}

      {/* Main split: List of devoirs at left, rendering submissions / grading at right */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedHw ? '1.2fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: list of devoirs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {homeworks.map(hw => {
            const submissionsCount = hw.submissions?.length || 0;
            const gradedCount = hw.submissions?.filter(s => s.grade !== null && s.grade !== undefined).length || 0;
            const isSelected = selectedHw?.id === hw.id;

            return (
              <div 
                key={hw.id} 
                className="glass-card" 
                style={{ 
                  padding: '1.5rem', 
                  cursor: 'pointer',
                  background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                  borderLeft: isSelected ? '4px solid var(--primary)' : '1px solid var(--border-color)'
                }}
                onClick={() => { setSelectedHw(hw); setSelectedSub(null); }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge badge-seconde" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                        {hw.subject}
                      </span>
                      <span className={`badge ${hw.level === 'Terminale' ? 'badge-terminale' : hw.level === 'Première' ? 'badge-premiere' : 'badge-seconde'}`}>
                        {hw.level}
                      </span>
                    </span>
                    <h3 style={{ fontSize: '1.15rem', marginTop: '0.45rem' }}>{hw.title}</h3>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Fait le : {hw.dueDate}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Rendus : <strong>{submissionsCount}</strong> élèves
                  </span>
                  <span className={`badge ${gradedCount === submissionsCount ? 'badge-success' : 'badge-warning'}`}>
                    {gradedCount} / {submissionsCount} corrigés
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: details and correction desk */}
        {selectedHw && (
          <div className="glass-card fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-terminale">{selectedHw.level} • {selectedHw.subject}</span>
              <button onClick={() => { setSelectedHw(null); setSelectedSub(null); }} style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>Fermer</button>
            </div>

            <h3 style={{ fontSize: '1.3rem' }}>{selectedHw.title}</h3>
            
            {/* List of submissions */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Copies des élèves</h4>
              
              {selectedHw.submissions.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '6px' }}>
                  Aucun élève n'a encore rendu sa copie pour ce devoir.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedHw.submissions.map((sub, idx) => {
                    const isGraded = sub.grade !== null && sub.grade !== undefined;
                    const isSubSelected = selectedSub?.studentId === sub.studentId;

                    return (
                      <div 
                        key={idx}
                        onClick={() => { setSelectedSub(sub); setGrade(isGraded ? sub.grade.toString() : ''); setFeedback(isGraded ? sub.feedback : ''); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: isSubSelected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                          padding: '0.75rem 1rem',
                          borderRadius: '6px',
                          border: isSubSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <User size={14} color="var(--text-muted)" />
                          <span style={{ fontWeight: 500 }}>{sub.studentName}</span>
                        </div>
                        
                        {isGraded ? (
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--success)' }}>{sub.grade}/20</span>
                        ) : (
                          <span style={{ fontWeight: 500, fontSize: '0.75rem', color: 'var(--warning)' }}>À corriger</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grading board for active selection */}
            {selectedSub && (
              <div className="glass-card fade-in" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>Correction de la copie</h4>
                  <button onClick={() => setSelectedSub(null)} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Annuler</button>
                </div>
                
                <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Copie de {selectedSub.studentName} :</div>
                  <p style={{ fontStyle: 'italic', whiteSpace: 'pre-line' }}>"{selectedSub.content}"</p>
                  {selectedSub.attachments?.map((file, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: 'var(--primary)', fontSize: '0.8rem' }}>
                      <FileText size={12} /> <span>{file} (Fichier joint)</span>
                    </div>
                  ))}
                </div>

                {successGradeMsg && (
                  <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.5rem', borderRadius: '6px', color: '#34d399', fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.75rem' }}>
                    {successGradeMsg}
                  </div>
                )}

                <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Note sur 20</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      className="input-field"
                      placeholder="ex: 14.5"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Commentaire de correction</span>
                    <textarea
                      rows={3}
                      className="input-field"
                      placeholder="Indiquez les forces et axes d'amélioration de la copie..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <CheckCircle2 size={16} /> Enregistrer la correction
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: selectedHw"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
