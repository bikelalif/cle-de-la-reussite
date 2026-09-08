import React, { useState } from 'react';
import { Search, User, Phone, Plus, Award, Calendar, ChevronRight } from 'lucide-react';

export default function TeacherStudents({ students, onAddGrade }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  
  // Grade Form State
  const [gradeVal, setGradeVal] = useState('');
  const [gradeSubject, setGradeSubject] = useState('Mathématiques');
  const [gradeCoeff, setGradeCoeff] = useState('2');
  const [gradeTitle, setGradeTitle] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesLevel = selectedLevel === 'All' || s.level === selectedLevel;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getStudentAverage = (student) => {
    if (student.grades.length === 0) return 'N/A';
    const sum = student.grades.reduce((acc, g) => acc + g.grade, 0);
    return (sum / student.grades.length).toFixed(2);
  };

  const handleAddGradeSubmit = (e) => {
    e.preventDefault();
    const parsedGrade = parseFloat(gradeVal);
    if (isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 20) {
      alert('Veuillez saisir une note valide entre 0 et 20.');
      return;
    }

    onAddGrade(selectedStudent.id, {
      id: 'g_' + Date.now(),
      subject: gradeSubject,
      grade: parsedGrade,
      max: 20,
      coeff: parseInt(gradeCoeff),
      title: gradeTitle || 'Évaluation',
      date: new Date().toISOString().split('T')[0]
    });

    setSuccessMsg('Note ajoutée !');
    setGradeVal('');
    setGradeTitle('');
    
    // Update local preview state
    setTimeout(() => {
      setSuccessMsg('');
    }, 2000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Gestion des Élèves</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Consultez la liste des élèves, analysez leurs bulletins et ajoutez de nouvelles notes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Students directory list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Filters header */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Rechercher un élève..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            
            <select
              className="input-field"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ width: 'auto', minWidth: '130px' }}
            >
              <option value="All">Tous les niveaux</option>
              <option value="Seconde">Seconde</option>
              <option value="Première">Première</option>
              <option value="Terminale">Terminale</option>
            </select>
          </div>

          {/* Students Directory Grid/List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredStudents.map(student => {
              const avg = getStudentAverage(student);
              const isSelected = selectedStudent?.id === student.id;

              return (
                <div 
                  key={student.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '1rem 1.25rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                    borderLeft: isSelected ? '4px solid var(--primary)' : '1px solid var(--border-color)'
                  }}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {student.level} • {student.email}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Moyenne</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>{avg}</div>
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected student profile and controls */}
        {selectedStudent ? (
          <div className="glass-card fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img 
                  src={selectedStudent.avatar} 
                  alt={selectedStudent.name} 
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>{selectedStudent.name}</h3>
                  <span className={`badge ${selectedStudent.level === 'Terminale' ? 'badge-terminale' : selectedStudent.level === 'Première' ? 'badge-premiere' : 'badge-seconde'}`}>
                    {selectedStudent.level}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>Fermer</button>
            </div>

            {/* Parent Info block */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Parents & Contacts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>Responsable : <strong>{selectedStudent.parentName}</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
                  <Phone size={12} /> {selectedStudent.parentPhone}
                </div>
              </div>
            </div>

            {/* GPA indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-light)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Moyenne générale :</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {getStudentAverage(selectedStudent)} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>/20</span>
              </span>
            </div>

            {/* Form: Add new grade */}
            <form onSubmit={handleAddGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>➕ Ajouter une évaluation</h4>
              
              {successMsg && (
                <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.5rem', borderRadius: '6px', color: '#34d399', fontSize: '0.8rem', textAlign: 'center' }}>
                  {successMsg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Matière</span>
                  <select className="input-field" value={gradeSubject} onChange={(e) => setGradeSubject(e.target.value)}>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique-Chimie">Physique-Chimie</option>
                    <option value="SVT">SVT</option>
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                  </select>
                </div>
                
                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Note /20</span>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    placeholder="ex: 15.5"
                    className="input-field"
                    value={gradeVal}
                    onChange={(e) => setGradeVal(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Titre / Devoir</span>
                  <input
                    type="text"
                    placeholder="ex: DS 3: Dérivées"
                    className="input-field"
                    value={gradeTitle}
                    onChange={(e) => setGradeTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Coefficient</span>
                  <select className="input-field" value={gradeCoeff} onChange={(e) => setGradeCoeff(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                <Plus size={16} /> Enregistrer la note
              </button>
            </form>

            {/* List: Student's grades history */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Évaluations passées</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {selectedStudent.grades.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aucune note enregistrée.</p>
                ) : (
                  [...selectedStudent.grades].reverse().map((g, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{g.title}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{g.subject} • Coeff. {g.coeff}</div>
                      </div>
                      <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{g.grade.toFixed(1)}/20</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <User size={48} style={{ margin: '0 auto 1rem auto' }} />
            <p>Sélectionnez un élève à gauche pour afficher son dossier complet et gérer ses notes.</p>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
