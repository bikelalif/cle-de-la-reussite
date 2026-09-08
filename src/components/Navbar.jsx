import React from 'react';
import { GraduationCap, LogOut, User, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, onLogout, onNavigate, theme, onToggleTheme }) {
  return (
    <header className="portal-header" style={{ position: 'static', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 0 }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
          }}>
            <GraduationCap size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
            La Clé de la Réussite
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle Button */}
          <button 
            onClick={onToggleTheme} 
            className="btn btn-secondary btn-icon" 
            title={theme === 'dark' ? 'Passer au mode jour' : 'Passer au mode nuit'}
            style={{ borderRadius: '50%', color: 'var(--text-primary)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={user.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }} className="hidden-mobile">
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {user.role === 'teacher' ? 'Enseignant' : `Élève • ${user.level}`}
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={onLogout} title="Déconnexion" style={{ borderRadius: '50%' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => onNavigate('login')}>
              <User size={18} />
              Connexion
            </button>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 576px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
