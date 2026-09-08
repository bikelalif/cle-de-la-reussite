import React from 'react';
import { Users, AlertCircle, FileText, CheckSquare, Plus, ArrowRight, UserCheck, Calendar } from 'lucide-react';

export default function TeacherDashboard({ teacher, students, homeworks, onTabChange }) {
  // Count total students
  const totalStudents = students.length;

  // Find all pending submissions that need grading (grade is null or undefined)
  const pendingGradingSubmissions = [];
  homeworks.forEach(hw => {
    hw.submissions?.forEach(sub => {
      if (sub.grade === null || sub.grade === undefined) {
        pendingGradingSubmissions.push({
          homeworkId: hw.id,
          homeworkTitle: hw.title,
          subject: hw.subject,
          level: hw.level,
          ...sub
        });
      }
    });
  });

  // Calculate overall average grade for all students
  let allGradesSum = 0;
  let allGradesCount = 0;
  students.forEach(s => {
    s.grades.forEach(g => {
      allGradesSum += g.grade;
      allGradesCount++;
    });
  });
  const overallAvg = allGradesCount > 0 ? (allGradesSum / allGradesCount).toFixed(2) : 'N/A';

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Tableau de bord Enseignant 👩‍🏫</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Portail de M. Dupont. Gérez vos classes de Seconde, Première et Terminale.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--primary-light)', padding: '0.8rem', borderRadius: '12px', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Élèves Suivis</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{totalStudents}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.8rem', borderRadius: '12px', color: 'var(--warning)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Copies à corriger</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)' }}>{pendingGradingSubmissions.length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--success-light)', padding: '0.8rem', borderRadius: '12px', color: 'var(--success)' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Moyenne Générale Cle</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{overallAvg} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/20</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }} onClick={() => onTabChange('calendar')}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.8rem', borderRadius: '12px', color: '#38bdf8' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Calendrier Scolaire</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>Planning →</div>
          </div>
        </div>
      </div>

      {/* Main Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Pending grading queue */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>⚠️ Rendu de devoirs en attente de correction</h3>
            <button 
              onClick={() => onTabChange('homework')} 
              style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
            >
              Gérer les devoirs <ArrowRight size={14} />
            </button>
          </div>

          {pendingGradingSubmissions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
              ✨ Toutes les copies sont corrigées ! Bon travail.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingGradingSubmissions.map((sub, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sub.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {sub.level} • {sub.homeworkTitle} ({sub.subject})
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-ghost" 
                    onClick={() => onTabChange('homework')} 
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: 'var(--warning)' }}
                  >
                    Noter
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick actions & widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Raccourcis rapides</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => onTabChange('homework')} style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.85rem' }}>
                <Plus size={16} /> Créer un nouveau devoir
              </button>
              <button className="btn btn-secondary" onClick={() => onTabChange('courses')} style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.85rem' }}>
                <Plus size={16} /> Publier un cours / ressource
              </button>
              <button className="btn btn-secondary" onClick={() => onTabChange('attendance')} style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.85rem' }}>
                <UserCheck size={16} /> Prendre les présences
              </button>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>📅 Agenda de la semaine</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div><strong>Samedi 10h-12h</strong> : Soutien Terminales (Mathématiques) - Salle 2B</div>
              <div><strong>Samedi 13h30-15h</strong> : Soutien Premières (Mathématiques) - Salle 1A</div>
              <div><strong>Mercredi 17h30</strong> : Bureau Virtuel (Aide en ligne)</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 1.5fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
