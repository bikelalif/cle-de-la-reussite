import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, ArrowLeft, GraduationCap } from 'lucide-react';

export default function Login({ onLogin, onBack, students, teachers = [] }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle pre-selected role from Landing Page redirection
  useEffect(() => {
    const preselected = localStorage.getItem('cle_preselected_role');
    if (preselected === 'teacher' || preselected === 'student') {
      setRole(preselected);
      localStorage.removeItem('cle_preselected_role');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez renseigner tous les champs.');
      return;
    }

    if (role === 'teacher') {
      const teacher = teachers.find(t => t.email.trim().toLowerCase() === email.trim().toLowerCase());
      if (teacher) {
        if (teacher.password === password) {
          onLogin({
            ...teacher,
            role: 'teacher'
          });
        } else {
          setError('Mot de passe incorrect.');
        }
      } else {
        setError('Adresse email enseignant inconnue.');
      }
    } else {
      const student = students.find(s => s.email.trim().toLowerCase() === email.trim().toLowerCase());
      if (student) {
        if (student.password === password) {
          onLogin({
            ...student,
            role: 'student'
          });
        } else {
          setError('Mot de passe incorrect.');
        }
      } else {
        setError('Adresse email élève inconnue.');
      }
    }
  };


  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Retour à l'accueil
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '0.75rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <GraduationCap size={32} color="#fff" />
          </div>
          <h2 style={{ color: 'var(--text-primary)' }}>Connexion au Portail</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            La Clé de la Réussite
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { setRole('student'); setEmail(''); setPassword(''); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: role === 'student' ? 'var(--primary)' : 'transparent',
              color: role === 'student' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            Portail Élève
          </button>
          <button
            type="button"
            onClick={() => { setRole('teacher'); setEmail(''); setPassword(''); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: role === 'teacher' ? 'var(--primary)' : 'transparent',
              color: role === 'teacher' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            Portail Enseignant
          </button>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: '6px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-label">Adresse Email</span>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="input-field"
                placeholder={role === 'teacher' ? 'prof@reussite.fr' : 'eleve@reussite.fr'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <span className="input-label">Mot de passe</span>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="input-field"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}>
            <LogIn size={18} /> Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
