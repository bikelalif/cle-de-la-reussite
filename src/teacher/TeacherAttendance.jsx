import React, { useState } from 'react';
import { UserCheck, Check, AlertTriangle, Clock, Save } from 'lucide-react';

export default function TeacherAttendance({ students, onSaveAttendance }) {
  const [level, setLevel] = useState('Terminale');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceSheet, setAttendanceSheet] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // Filter students for the active class level
  const classStudents = students.filter(s => s.level === level);

  // Initialize sheet if empty or change of level
  React.useEffect(() => {
    const initialSheet = {};
    classStudents.forEach(s => {
      // default status is "Présent"
      initialSheet[s.id] = { status: 'Présent', comment: '' };
    });
    setAttendanceSheet(initialSheet);
  }, [level]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleCommentChange = (studentId, comment) => {
    setAttendanceSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        comment
      }
    }));
  };

  const handleSave = () => {
    // Save to global state (which persists to localStorage)
    Object.keys(attendanceSheet).forEach(studentId => {
      onSaveAttendance(studentId, {
        id: 'a_' + Date.now() + '_' + studentId.substring(4),
        date: date,
        status: attendanceSheet[studentId].status,
        comment: attendanceSheet[studentId].comment,
        justified: attendanceSheet[studentId].status === 'Absent' ? false : undefined
      });
    });

    setSuccessMsg('Feuille de présence enregistrée !');
    setTimeout(() => {
      setSuccessMsg('');
    }, 2000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Feuille d'Appel & Assiduité</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Sélectionnez une classe pour faire l'appel des élèves de votre séance de soutien scolaire.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        {/* Controls: Select Class and Date */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem', alignItems: 'end' }}>
          <div className="input-group" style={{ margin: 0 }}>
            <span className="input-label">Classe / Niveau</span>
            <select className="input-field" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Seconde">Seconde</option>
              <option value="Première">Première</option>
              <option value="Terminale">Terminale</option>
            </select>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <span className="input-label">Date de la séance</span>
            <input 
              type="date" 
              className="input-field" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%' }}>
              <Save size={18} /> Enregistrer l'appel
            </button>
          </div>
        </div>

        {successMsg && (
          <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.75rem', borderRadius: '6px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        {/* Attendance List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Liste d'appel • {classStudents.length} élèves
          </h3>

          {classStudents.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Aucun élève dans cette classe.</p>
          ) : (
            classStudents.map(student => {
              const current = attendanceSheet[student.id] || { status: 'Présent', comment: '' };

              return (
                <div 
                  key={student.id} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1.2fr 1.5fr 2fr', 
                    gap: '1.5rem', 
                    alignItems: 'center',
                    background: 'var(--bg-tertiary)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {/* Student info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{student.name}</span>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, 'Présent')}
                      style={{
                        flex: 1,
                        padding: '0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: current.status === 'Présent' ? 'var(--success)' : 'transparent',
                        color: current.status === 'Présent' ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      <Check size={12} /> Présent
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, 'En retard')}
                      style={{
                        flex: 1,
                        padding: '0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: current.status === 'En retard' ? 'var(--warning)' : 'transparent',
                        color: current.status === 'En retard' ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      <Clock size={12} /> Retard
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, 'Absent')}
                      style={{
                        flex: 1,
                        padding: '0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: current.status === 'Absent' ? 'var(--danger)' : 'transparent',
                        color: current.status === 'Absent' ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      <AlertTriangle size={12} /> Absent
                    </button>
                  </div>

                  {/* Comment input */}
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Commentaire ou motif du retard/absence..."
                    value={current.comment}
                    onChange={(e) => handleCommentChange(student.id, e.target.value)}
                    style={{ margin: 0, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 1.2fr 1.5fr 2fr"] {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
