import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowLeft, GraduationCap, LayoutDashboard, Users, UserPlus, BookOpen, CheckSquare, MessageSquare, Trash2, Plus, User, Sun, Moon, Landmark, UserMinus, Calendar } from 'lucide-react';
import CalendarView from './CalendarView';

export default function AdminPortal({ 
  students, 
  teachers, 
  classes = [],
  courses, 
  homeworks, 
  messages,
  events = [],
  adminCredentials = { username: 'Bilal000', password: 'mpbK2326' },
  onUpdateAdminCredentials,
  onAddStudent,
  onDeleteStudent,
  onAddTeacher,
  onDeleteTeacher,
  onAddClass,
  onDeleteClass,
  onAssignStudentToClass,
  onRemoveStudentFromClass,
  onDeleteCourse,
  onDeleteHomework,
  onDeleteMessage,
  onAddEvent,
  onDeleteEvent,
  onBack,
  theme,
  onToggleTheme
}) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Navigation active
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Formulaire Professeur
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPassword, setTPassword] = useState('password');
  const [tSubject, setTSubject] = useState('Mathématiques');
  const [tSuccess, setTSuccess] = useState('');

  // Formulaire Élève
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('password');
  const [sClassId, setSClassId] = useState('');
  const [sParentName, setSParentName] = useState('');
  const [sParentPhone, setSParentPhone] = useState('');
  const [sSuccess, setSSuccess] = useState('');

  // Formulaire Paramètres Admin
  const [adminUserField, setAdminUserField] = useState(adminCredentials.username);
  const [adminPassField, setAdminPassField] = useState(adminCredentials.password);
  const [adminSuccess, setAdminSuccess] = useState('');

  React.useEffect(() => {
    setAdminUserField(adminCredentials.username);
    setAdminPassField(adminCredentials.password);
  }, [adminCredentials]);


  // Formulaire Classe
  const [cName, setCName] = useState('');
  const [cLevel, setCLevel] = useState('Terminale');
  const [cTeacherId, setCTeacherId] = useState('');
  const [cSuccess, setCSuccess] = useState('');

  // Affectation d'élèves
  const [assignStudentId, setAssignStudentId] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === adminCredentials.username && adminPassword === adminCredentials.password) {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Identifiant ou mot de passe administrateur incorrect.');
    }
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!tName || !tEmail) return;

    onAddTeacher({
      id: 'tch_' + Date.now(),
      name: tName,
      email: tEmail,
      password: tPassword || 'password',
      subject: tSubject,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?w=150`
    });

    setTSuccess('Professeur ajouté avec succès !');
    setTName('');
    setTEmail('');
    setTPassword('password');
    setTimeout(() => setTSuccess(''), 2000);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!sName || !sEmail) return;

    onAddStudent({
      id: 'std_' + Date.now(),
      name: sName,
      email: sEmail,
      password: sPassword || 'password',
      classId: sClassId || null,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?w=150`,
      grades: [],
      attendance: []
    });

    setSSuccess('Élève créé avec succès !');
    setSName('');
    setSEmail('');
    setSPassword('password');
    setSClassId('');
    setTimeout(() => setSSuccess(''), 2000);
  };

  const handleUpdateAdminSettings = (e) => {
    e.preventDefault();
    if (!adminUserField || !adminPassField) return;
    onUpdateAdminCredentials(adminUserField, adminPassField);
    setAdminSuccess('Identifiants administrateur mis à jour avec succès !');
    setTimeout(() => setAdminSuccess(''), 2000);
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!cName) return;

    onAddClass({
      id: 'cls_' + Date.now(),
      name: cName,
      level: cLevel,
      teacherId: cTeacherId || null
    });

    setCSuccess('Classe créée avec succès !');
    setCName('');
    setCTeacherId('');
    setTimeout(() => setCSuccess(''), 2000);
  };

  const handleAssignStudent = (e) => {
    e.preventDefault();
    if (!assignStudentId || !selectedClassId) return;

    onAssignStudentToClass(assignStudentId, selectedClassId);
    setAssignStudentId('');
  };

  // Liste des élèves appartenant à la classe sélectionnée
  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = selectedClass ? students.filter(s => s.classId === selectedClassId) : [];
  
  // Liste des élèves non assignés à cette classe
  const availableStudents = students.filter(s => s.classId !== selectedClassId);

  // Si l'administrateur n'est pas connecté
  if (!isAdminLoggedIn) {
    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem 1rem', background: 'var(--bg-primary)' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', cursor: 'pointer' }}>
            <ArrowLeft size={16} /> Retour au site
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '0.75rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
            }}>
              <GraduationCap size={32} color="#fff" />
            </div>
            <h2 style={{ color: 'var(--text-primary)' }}>Espace Administration</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              La Clé de la Réussite • Zone Privée
            </p>
          </div>

          {loginError && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: '6px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="input-group">
              <span className="input-label">Identifiant Administrateur</span>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="admin"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
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
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
              <LogIn size={18} /> Connexion Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Mise en page du portail d'administration
  return (
    <div className="portal-layout fade-in">
      {/* Barre latérale */}
      <aside className="portal-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '0.50rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>Portail Admin</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem', flex: 1 }}>
          {[
            { id: 'dashboard', label: 'Vue Globale', icon: <LayoutDashboard size={20} /> },
            { id: 'classes', label: 'Classes', icon: <Landmark size={20} /> },
            { id: 'teachers', label: 'Professeurs', icon: <Users size={20} /> },
            { id: 'students', label: 'Élèves', icon: <GraduationCap size={20} /> },
            { id: 'courses', label: 'Gestion des Cours', icon: <BookOpen size={20} /> },
            { id: 'homeworks', label: 'Gestion des Devoirs', icon: <CheckSquare size={20} /> },
            { id: 'calendar', label: 'Calendrier', icon: <Calendar size={20} /> },
            { id: 'messages', label: 'Historique Messages', icon: <MessageSquare size={20} /> }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeTab === item.id ? '#10b981' : 'transparent',
                color: activeTab === item.id ? '#fff' : 'var(--text-secondary)',
                fontWeight: activeTab === item.id ? 600 : 500,
                transition: 'var(--transition-fast)',
                textAlign: 'left'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: 'auto' }}>
          <button 
            onClick={() => setIsAdminLoggedIn(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'var(--danger)',
              fontWeight: 600,
              width: '100%',
              textAlign: 'left'
            }}
          >
            <LogIn size={20} style={{ transform: 'rotate(180deg)' }} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <div className="portal-main">
        {/* En-tête */}
        <div className="portal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
            Administration • {activeTab === 'dashboard' ? 'Général' : activeTab}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={onToggleTheme} 
              className="btn btn-secondary btn-icon"
              style={{ borderRadius: '50%', color: 'var(--text-primary)' }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Admin ({adminCredentials.username})</span>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Super Utilisateur</span>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="portal-body">
          {/* Onglet 1: Tableau de bord */}
          {activeTab === 'dashboard' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                {[
                  { title: 'Classes créées', val: classes.length, color: 'var(--accent)' },
                  { title: 'Professeurs', val: teachers.length, color: 'var(--primary)' },
                  { title: 'Élèves inscrits', val: students.length, color: 'var(--secondary)' },
                  { title: 'Cours publiés', val: courses.length, color: 'var(--success)' },
                  { title: 'Devoirs créés', val: homeworks.length, color: 'var(--warning)' }
                ].map((stat, i) => (
                  <div key={i} className="glass-card" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: stat.color, marginBottom: '0.25rem', fontFamily: 'var(--font-title)' }}>{stat.val}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.title}</div>
                  </div>
                ))}
              </div>
              
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Console de Gestion Générale</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Bienvenue dans l'espace d'administration de **La Clé de la Réussite**. 
                  Ici, vous gérez les classes d'accompagnement scolaire, associez les professeurs à leurs classes, 
                  et inscrivez les élèves en les affiliant aux classes dédiées.
                </p>
              </div>

              {/* Paramètres admin */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>⚙️ Paramètres de connexion administrateur</h3>
                {adminSuccess && (
                  <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.5rem', borderRadius: '6px', color: '#34d399', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>
                    {adminSuccess}
                  </div>
                )}
                <form onSubmit={handleUpdateAdminSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Identifiant Administrateur</span>
                    <input type="text" className="input-field" value={adminUserField} onChange={(e) => setAdminUserField(e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Nouveau mot de passe</span>
                    <input type="password" className="input-field" placeholder="••••••••" value={adminPassField} onChange={(e) => setAdminPassField(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ background: '#10b981', padding: '0.85rem' }}>Mettre à jour</button>
                </form>
              </div>
            </div>
          )}

          {/* Onglet 2: Classes */}
          {activeTab === 'classes' && (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Liste des classes */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>Liste des Classes</h3>
                {classes.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aucune classe créée.</p>
                ) : (
                  classes.map(c => {
                    const teacher = teachers.find(t => t.id === c.teacherId);
                    const count = students.filter(s => s.classId === c.id).length;
                    const isSelected = selectedClassId === c.id;

                    return (
                      <div 
                        key={c.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          background: isSelected ? 'var(--primary-light)' : 'var(--bg-tertiary)', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '8px', 
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedClassId(c.id)}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name} <span style={{ fontSize: '0.75rem', fontWeight: 500 }} className={`badge ${c.level === 'Terminale' ? 'badge-terminale' : c.level === 'Première' ? 'badge-premiere' : 'badge-seconde'}`}>{c.level}</span></div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Enseignant : {teacher ? teacher.name : 'Aucun'} • {count} élève(s)
                          </div>
                        </div>
                        <button className="btn btn-secondary btn-icon" onClick={(e) => { e.stopPropagation(); onDeleteClass(c.id); if (selectedClassId === c.id) setSelectedClassId(null); }} style={{ color: 'var(--danger)', borderRadius: '6px' }} title="Supprimer la classe">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Formulaire de création & détails classe */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Add Class Form */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1.25rem' }}>➕ Créer une Classe</h3>
                  {cSuccess && (
                    <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.5rem', borderRadius: '6px', color: '#34d399', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>
                      {cSuccess}
                    </div>
                  )}
                  <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                      <span className="input-label">Nom de la classe</span>
                      <input type="text" className="input-field" placeholder="ex: Terminale A, Seconde 1" value={cName} onChange={(e) => setCName(e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ margin: 0 }}>
                      <span className="input-label">Niveau d'études</span>
                      <select className="input-field" value={cLevel} onChange={(e) => setCLevel(e.target.value)}>
                        <option value="Seconde">Seconde</option>
                        <option value="Première">Première</option>
                        <option value="Terminale">Terminale</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ margin: 0 }}>
                      <span className="input-label">Enseignant Responsable</span>
                      <select className="input-field" value={cTeacherId} onChange={(e) => setCTeacherId(e.target.value)}>
                        <option value="">-- Assigner un professeur --</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ background: '#10b981' }}>Créer la classe</button>
                  </form>
                </div>

                {/* Class Details & Student assignment */}
                {selectedClass && (
                  <div className="glass-card fade-in" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4>Membres de la classe : {selectedClass.name}</h4>
                      <button onClick={() => setSelectedClassId(null)} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fermer</button>
                    </div>

                    {/* Assign Student Form */}
                    <form onSubmit={handleAssignStudent} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <select 
                        className="input-field" 
                        value={assignStudentId} 
                        onChange={(e) => setAssignStudentId(e.target.value)}
                        style={{ margin: 0, padding: '0.5rem', fontSize: '0.85rem' }}
                        required
                      >
                        <option value="">-- Ajouter un élève --</option>
                        {availableStudents.map(s => {
                          const sClass = classes.find(c => c.id === s.classId);
                          return (
                            <option key={s.id} value={s.id}>
                              {s.name} {sClass ? `(Déjà dans ${sClass.name})` : '(Sans classe)'}
                            </option>
                          );
                        })}
                      </select>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: '#10b981', fontSize: '0.85rem' }}>
                        <Plus size={16} />
                      </button>
                    </form>

                    {/* Student List in selected class */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                      {classStudents.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>Aucun élève dans cette classe.</p>
                      ) : (
                        classStudents.map(s => (
                          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                            <span>{s.name}</span>
                            <button 
                              onClick={() => onRemoveStudentFromClass(s.id)}
                              style={{ color: 'var(--danger)', cursor: 'pointer' }}
                              title="Retirer de la classe"
                            >
                              <UserMinus size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet 3: Professeurs */}
          {activeTab === 'teachers' && (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Liste */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>Liste des Enseignants</h3>
                {teachers.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aucun enseignant créé.</p>
                ) : (
                  teachers.map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {t.email} • Spé: {t.subject}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                          Clé d'accès : {t.password}
                        </div>
                      </div>
                      <button className="btn btn-secondary btn-icon" onClick={() => onDeleteTeacher(t.id)} style={{ color: 'var(--danger)', borderRadius: '6px' }} title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Formulaire d'ajout */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>➕ Ajouter un Enseignant</h3>
                {tSuccess && (
                  <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.5rem', borderRadius: '6px', color: '#34d399', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>
                    {tSuccess}
                  </div>
                )}
                <form onSubmit={handleAddTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Nom Complet</span>
                    <input type="text" className="input-field" placeholder="Mme. Simon" value={tName} onChange={(e) => setTName(e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Adresse Email</span>
                    <input type="email" className="input-field" placeholder="simon@reussite.fr" value={tEmail} onChange={(e) => setTEmail(e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Mot de passe de connexion</span>
                    <input type="text" className="input-field" placeholder="password" value={tPassword} onChange={(e) => setTPassword(e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Matière / Discipline</span>
                    <select className="input-field" value={tSubject} onChange={(e) => setTSubject(e.target.value)}>
                      <option value="Mathématiques">Mathématiques</option>
                      <option value="Physique-Chimie">Physique-Chimie</option>
                      <option value="SVT">SVT</option>
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ background: '#10b981', marginTop: '0.5rem' }}>Ajouter l'enseignant</button>
                </form>
              </div>
            </div>
          )}

          {/* Onglet 4: Élèves */}
          {activeTab === 'students' && (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Liste */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>Liste des Élèves</h3>
                {students.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aucun élève créé.</p>
                ) : (
                  students.map(s => {
                    const sClass = classes.find(c => c.id === s.classId);
                    return (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {s.email} • Classe : {sClass ? `${sClass.name} (${sClass.level})` : 'Non assigné'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                            Clé d'accès : {s.password}
                          </div>
                        </div>
                        <button className="btn btn-secondary btn-icon" onClick={() => onDeleteStudent(s.id)} style={{ color: 'var(--danger)', borderRadius: '6px' }} title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Formulaire d'ajout */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>➕ Ajouter un Élève</h3>
                {sSuccess && (
                  <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.5rem', borderRadius: '6px', color: '#34d399', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>
                    {sSuccess}
                  </div>
                )}
                <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Nom Complet</span>
                    <input type="text" className="input-field" placeholder="Lucas Martin" value={sName} onChange={(e) => setSName(e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Adresse Email</span>
                    <input type="email" className="input-field" placeholder="lucas@example.com" value={sEmail} onChange={(e) => setSEmail(e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Mot de passe de connexion</span>
                    <input type="text" className="input-field" placeholder="password" value={sPassword} onChange={(e) => setSPassword(e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span className="input-label">Classe d'affectation</span>
                    <select className="input-field" value={sClassId} onChange={(e) => setSClassId(e.target.value)}>
                      <option value="">-- Choisir une classe (Optionnel) --</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ background: '#10b981', marginTop: '0.5rem' }}>Créer l'élève</button>
                </form>
              </div>
            </div>
          )}

          {/* Onglet 5: Gestion des cours */}
          {activeTab === 'courses' && (
            <div className="glass-card fade-in" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Cours en ligne</h3>
              {courses.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aucun document de cours partagé.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {courses.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.subject} ({c.level}) • Publié par {c.author}</div>
                      </div>
                      <button className="btn btn-secondary btn-icon" onClick={() => onDeleteCourse(c.id)} style={{ color: 'var(--danger)', borderRadius: '6px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onglet 6: Gestion des devoirs */}
          {activeTab === 'homeworks' && (
            <div className="glass-card fade-in" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Devoirs Programmés</h3>
              {homeworks.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aucun devoir créé.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {homeworks.map(hw => (
                    <div key={hw.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{hw.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{hw.subject} ({hw.level}) • Rendu: {hw.dueDate}</div>
                      </div>
                      <button className="btn btn-secondary btn-icon" onClick={() => onDeleteHomework(hw.id)} style={{ color: 'var(--danger)', borderRadius: '6px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onglet 7: Logs Messages */}
          {activeTab === 'messages' && (
            <div className="glass-card fade-in" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Historique de la messagerie</h3>
              {messages.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aucun échange enregistré.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ flex: 1, marginRight: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          Élève: <strong>{msg.studentName}</strong> ⟷ Enseignant: <strong>{msg.teacherName}</strong>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                          "{msg.content}"
                        </p>
                      </div>
                      <button className="btn btn-secondary btn-icon" onClick={() => onDeleteMessage(msg.id)} style={{ color: 'var(--danger)', borderRadius: '6px', flexShrink: 0 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
              userRole="admin"
              homeworks={homeworks}
              courses={courses}
              events={events}
              onAddEvent={onAddEvent}
              onDeleteEvent={onDeleteEvent}
            />
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .portal-layout {
            flex-direction: column !important;
          }
          .portal-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border-color) !important;
            height: auto !important;
          }
          div[style*="gridTemplateColumns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
