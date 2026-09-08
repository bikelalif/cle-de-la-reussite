import React from 'react';
import { Calendar, CheckSquare, Award, Clock, ArrowRight, BookOpen } from 'lucide-react';

export default function StudentDashboard({ student, homeworks, courses, onTabChange }) {
  // Calculate average
  const totalGrades = student.grades.length;
  const averageGrade = totalGrades > 0
    ? (student.grades.reduce((sum, g) => sum + g.grade, 0) / totalGrades).toFixed(2)
    : 'N/A';

  // Count pending homeworks (homeworks for student's level with no submission from this student, or status not graded/submitted)
  const pendingHw = homeworks.filter(hw => {
    if (hw.level !== student.level) return false;
    const userSubmission = hw.submissions?.find(s => s.studentId === student.id);
    return !userSubmission;
  });

  const recentCourses = courses.filter(c => c.level === student.level).slice(0, 2);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Bonjour, {student.name} ! 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Ravi de te revoir. Voici un aperçu de ta progression en classe de <strong>{student.level === 'Non assigné' ? 'Classe non assignée' : student.level}</strong>.
          </p>
        </div>
        <span className="badge badge-terminale" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{student.level}</span>
      </div>

      {student.level === 'Non assigné' && (
        <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', padding: '1.25rem', borderRadius: '12px', color: '#f87171', fontSize: '0.9rem', lineHeight: 1.5 }}>
          ⚠️ <strong>Attention :</strong> Vous n'êtes actuellement assigné à aucune classe. Veuillez contacter l'administration de <em>La Clé de la Réussite</em> pour être affecté à une classe et accéder à vos cours et devoirs.
        </div>
      )}


      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--primary-light)', padding: '0.8rem', borderRadius: '12px', color: 'var(--primary)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Moyenne Générale</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{averageGrade} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/20</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.8rem', borderRadius: '12px', color: 'var(--secondary)' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Devoirs à faire</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>{pendingHw.length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--success-light)', padding: '0.8rem', borderRadius: '12px', color: 'var(--success)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Assiduité</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>
              {student.attendance.filter(a => a.status === 'Présent').length} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>présences</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }} onClick={() => onTabChange('calendar')}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.8rem', borderRadius: '12px', color: '#38bdf8' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Planning & Examens</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>Calendrier →</div>
          </div>
        </div>
      </div>

      {/* Main content split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Next courses and homework */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Prochains devoirs</h3>
              <button 
                onClick={() => onTabChange('homework')} 
                style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
              >
                Tout voir <ArrowRight size={14} />
              </button>
            </div>
            {pendingHw.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem' }}>
                🎉 Bravo ! Tu n'as aucun devoir en attente.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingHw.slice(0, 3).map(hw => (
                  <div key={hw.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{hw.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{hw.subject} • Rendu le {hw.dueDate}</div>
                    </div>
                    <button className="btn btn-secondary btn-ghost" onClick={() => onTabChange('homework')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Faire
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Derniers cours ajoutés</h3>
              <button 
                onClick={() => onTabChange('courses')} 
                style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
              >
                Tout voir <ArrowRight size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentCourses.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.subject} • Par {c.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule & Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Mon Planning de Soutien</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { day: 'Samedi 10:00', title: 'Séance collective de Mathématiques', mode: 'En présentiel', room: 'Salle 2B' },
                { day: 'Mercredi 17:30', title: 'Aide aux devoirs - Physique', mode: 'En visioconférence', link: 'Lien Teams' }
              ].map((sch, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', borderLeft: '3px solid var(--primary)', paddingLeft: '0.75rem', py: '2px' }}>
                  <div style={{ minWidth: '100px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{sch.day}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sch.mode}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{sch.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sch.room || sch.link}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>💡 Le mot de l'association</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              "N'oubliez pas que l'erreur fait partie de l'apprentissage. La régularité de votre travail est la clé pour atteindre vos objectifs au Bac !"
              <br />
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '0.5rem' }}>— L'équipe pédagogique</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
