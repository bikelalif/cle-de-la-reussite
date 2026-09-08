import React from 'react';
import { GraduationCap, Users } from 'lucide-react';

export default function LandingPage({ onNavigate, onSelectMockUser }) {
  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.25rem', fontWeight: 800, marginBottom: '3rem', fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
          Portail Académique - La Clé de la Réussite
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Student Entrance */}
          <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '1.25rem',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GraduationCap size={40} />
            </div>
            
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Espace Élève</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Accédez à vos devoirs à faire, vos cours de soutien, vos relevés de notes et à la messagerie.
              </p>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => {
                onNavigate('login');
                // We'll let the App component know which portal to pre-select by state
                localStorage.setItem('cle_preselected_role', 'student');
              }}
              style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
            >
              Accéder au Portail Élève
            </button>
          </div>

          {/* Teacher Entrance */}
          <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(168, 85, 247, 0.15)',
              color: 'var(--secondary)',
              padding: '1.25rem',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={40} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Espace Professeur</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Gérez vos groupes de soutien, attribuez et corrigez les devoirs, et communiquez avec vos élèves.
              </p>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => {
                onNavigate('login');
                localStorage.setItem('cle_preselected_role', 'teacher');
              }}
              style={{ 
                width: '100%', 
                marginTop: '1rem', 
                padding: '0.85rem', 
                background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)' 
              }}
            >
              Accéder au Portail Professeur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
