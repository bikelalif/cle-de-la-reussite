import React, { useState } from 'react';
import { Plus, Search, BookOpen, Calendar, FileText, ArrowRight, Upload, Download, Eye, FileCheck, X, Globe, Lock } from 'lucide-react';

export default function TeacherCourses({ courses, onCreateCourse }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subject, setSubject] = useState('Mathématiques');
  const [level, setLevel] = useState('Terminale');
  const [visibility, setVisibility] = useState('public');
  const [content, setContent] = useState('');
  const [fileObject, setFileObject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Filter courses
  const filteredCourses = courses.filter(c => {
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (maximum 10 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileObject({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' Mo',
        type: file.type,
        data: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !desc || !content) return;

    onCreateCourse({
      id: 'crs_' + Date.now(),
      title,
      description: desc,
      subject,
      level,
      visibility,
      date: new Date().toISOString().split('T')[0],
      author: 'M. Dupont',
      files: fileObject ? [fileObject] : [],
      content
    });

    setSuccessMsg('Cours publié avec succès !');
    setTitle('');
    setDesc('');
    setContent('');
    setFileObject(null);
    setVisibility('public');
    
    setTimeout(() => {
      setSuccessMsg('');
      setShowForm(false);
    }, 2000);
  };

  const handleDownload = (file) => {
    if (typeof file === 'object' && file.data) {
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Téléchargement de ${typeof file === 'string' ? file : file.name}`);
    }
  };

  const handlePreview = (file) => {
    if (typeof file === 'object' && file.data) {
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${file.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    } else {
      alert(`Aperçu non disponible pour ${typeof file === 'string' ? file : file.name}`);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Gestion des cours</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Publiez des fiches de révisions, des exercices corrigés et téléversez des documents depuis votre ordinateur.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Masquer formulaire' : 'Publier un cours'}
        </button>
      </div>

      {/* Publish Course Form */}
      {showForm && (
        <div className="glass-card fade-in" style={{ padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>➕ Nouveau document de cours</h3>

          {successMsg && (
            <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.75rem', borderRadius: '6px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
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
                <span className="input-label">Niveau</span>
                <select className="input-field" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="Seconde">Seconde</option>
                  <option value="Première">Première</option>
                  <option value="Terminale">Terminale</option>
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Visibilité dans le Feed</span>
                <select className="input-field" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                  <option value="public">🌐 Public (Tous les élèves)</option>
                  <option value="private">🔒 Privé (Niveau {level} uniquement)</option>
                </select>
              </div>

              {/* Real File Upload Input */}
              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Document joint (Depuis votre PC)</span>
                <div style={{ position: 'relative' }}>
                  <input
                    type="file"
                    id="course-file-upload"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.ppt,.pptx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="course-file-upload"
                    className="input-field"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      background: 'var(--bg-tertiary)',
                      border: fileObject ? '1px solid var(--primary)' : '1px dashed var(--border-color)',
                      color: fileObject ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                  >
                    <Upload size={16} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fileObject ? `${fileObject.name} (${fileObject.size})` : 'Choisir un fichier (PDF, Word, Image...)'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {fileObject && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--primary-light)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--primary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FileCheck size={14} /> Fichier sélectionné : <strong>{fileObject.name}</strong> ({fileObject.size})
                </span>
                <button type="button" onClick={() => setFileObject(null)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="input-group" style={{ margin: 0 }}>
              <span className="input-label">Titre du cours</span>
              <input
                type="text"
                placeholder="ex: Fiche de révision : Dérivées et variations"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <span className="input-label">Description courte (S'affiche dans la grille)</span>
              <input
                type="text"
                placeholder="ex: Fiche récapitulative reprenant les formules clés et 3 exemples de rédactions pour le TVI."
                className="input-field"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <span className="input-label">Contenu explicatif / Résumé détaillé</span>
              <textarea
                rows={5}
                placeholder="Saisissez les explications principales ou le texte introductif..."
                className="input-field"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="btn btn-primary">Publier le cours</button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of courses */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedCourse ? '1.2fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Filters header */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Rechercher un cours..."
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

          <div style={{ display: 'grid', gridTemplateColumns: selectedCourse ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredCourses.map(c => {
              const isSelected = selectedCourse?.id === c.id;

              return (
                <div 
                  key={c.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '1.5rem',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                    borderLeft: isSelected ? '4px solid var(--primary)' : '1px solid var(--border-color)'
                  }}
                  onClick={() => setSelectedCourse(c)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-seconde" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>{c.subject}</span>
                      <span className={`badge ${c.level === 'Terminale' ? 'badge-terminale' : c.level === 'Première' ? 'badge-premiere' : 'badge-seconde'}`}>{c.level}</span>
                      <span className="badge" style={{ background: c.visibility === 'private' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: c.visibility === 'private' ? '#ef4444' : '#22c55e', fontSize: '0.7rem' }}>
                        {c.visibility === 'private' ? '🔒 Privé' : '🌐 Public'}
                      </span>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.date}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Auteur: {c.author}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Détails →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side detailed course reader */}
        {selectedCourse && (
          <div className="glass-card fade-in" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge badge-terminale">{selectedCourse.level} • {selectedCourse.subject}</span>
              <button onClick={() => setSelectedCourse(null)} style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>Fermer</button>
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{selectedCourse.title}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Publié par {selectedCourse.author} le {selectedCourse.date}
            </p>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Corps du cours</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {selectedCourse.content}
              </p>
            </div>

            {selectedCourse.files && selectedCourse.files.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Fichiers joints</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedCourse.files.map((file, i) => {
                    const isObj = typeof file === 'object';
                    const name = isObj ? file.name : file;
                    const size = isObj ? file.size : '';

                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden' }}>
                          <FileText size={16} color="var(--primary)" />
                          <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{name}</span>
                          {size && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({size})</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {isObj && file.data && (
                            <button className="btn btn-secondary btn-icon" onClick={() => handlePreview(file)} title="Aperçu dans un nouvel onglet" style={{ padding: '4px 8px' }}>
                              <Eye size={14} />
                            </button>
                          )}
                          <button className="btn btn-primary" onClick={() => handleDownload(file)} style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Download size={13} /> Télécharger
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: selectedCourse"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
