import React from 'react';
import { Award, BookOpen, AlertCircle, ArrowUpRight, BarChart3 } from 'lucide-react';

export default function StudentGrades({ student }) {
  // Group grades by subject to calculate averages
  const gradesBySubject = student.grades.reduce((acc, current) => {
    if (!acc[current.subject]) {
      acc[current.subject] = [];
    }
    acc[current.subject].push(current);
    return acc;
  }, {});

  const subjectAverages = Object.keys(gradesBySubject).map(subject => {
    const grades = gradesBySubject[subject];
    const totalWeight = grades.reduce((sum, g) => sum + g.coeff, 0);
    const weightedSum = grades.reduce((sum, g) => sum + (g.grade * g.coeff), 0);
    const average = totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : 0;
    return { subject, average: parseFloat(average), count: grades.length };
  });

  const overallAverage = subjectAverages.length > 0
    ? (subjectAverages.reduce((sum, sa) => sum + sa.average, 0) / subjectAverages.length).toFixed(2)
    : 'N/A';

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Notes & Bulletins</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Consulte ton relevé de notes détaillé et suis l'évolution de tes moyennes par matière.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Left Side: Report card summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            
            <Award size={48} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Moyenne Générale</h3>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-title)' }}>
              {overallAverage} <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/20</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Moyenne calculée sur {student.grades.length} évaluations
            </p>
          </div>

          {/* Subject Averages Table */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="var(--primary)" /> Moyennes par matière
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {subjectAverages.map((sa, idx) => {
                const isGood = sa.average >= 12;
                const isLow = sa.average < 10;
                
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sa.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sa.count} note(s)</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ 
                        fontWeight: 800, 
                        fontSize: '1.1rem', 
                        color: isGood ? '#34d399' : isLow ? '#f87171' : '#fbbf24' 
                      }}>
                        {sa.average}
                      </span>
                      <span className={`badge ${isGood ? 'badge-success' : isLow ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                        {isGood ? 'Satisfaisant' : isLow ? 'À soutenir' : 'Moyen'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed grades history */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Historique des Évaluations</h3>
          
          {student.grades.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Aucune note enregistrée.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[...student.grades].sort((a,b) => new Date(b.date) - new Date(a.date)).map(g => (
                <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{g.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', marginTop: '0.15rem' }}>
                      <span>{g.subject}</span>
                      <span>•</span>
                      <span>Coeff. {g.coeff}</span>
                      <span>•</span>
                      <span>{g.date}</span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: g.grade >= 12 ? 'var(--success)' : g.grade < 10 ? 'var(--danger)' : 'var(--warning)' }}>
                      {g.grade.toFixed(1)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/20</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
