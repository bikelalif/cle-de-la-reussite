import React, { useState } from 'react';
import { BookOpen, Calendar, FileText, Search, ExternalLink, Download, Eye } from 'lucide-react';

export default function StudentCourses({ student, courses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Filter courses for student level & search query
  const filteredCourses = courses.filter(c => {
    // A course is visible if it is public OR if it matches the student's level
    const isVisible = c.visibility === 'public' || !c.visibility || c.level === student.level;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isVisible && matchesSearch;
  });

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Cours et Ressources</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Accède aux fiches de synthèse, exercices corrigés et télécharge les documents joints par tes professeurs.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCourse ? '1.2fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Course Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedCourse ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1/-1', padding: '2rem' }}>
              Aucun cours correspondant trouvé.
            </p>
          ) : (
            filteredCourses.map(c => (
              <div 
                key={c.id} 
                className="glass-card" 
                style={{ 
                  padding: '1.5rem',
                  cursor: 'pointer',
                  background: selectedCourse?.id === c.id ? 'var(--bg-tertiary)' : 'var(--bg-card)'
                }}
                onClick={() => setSelectedCourse(c)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-seconde" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                    {c.subject}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.date}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{c.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Par : {c.author}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {c.files?.length || 0} document(s)
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detailed Course Reader Panel */}
        {selectedCourse && (
          <div className="glass-card fade-in" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge badge-seconde" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                {selectedCourse.subject}
              </span>
              <button onClick={() => setSelectedCourse(null)} style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>Fermer</button>
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{selectedCourse.title}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Publié par {selectedCourse.author} le {selectedCourse.date}
            </p>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Introduction / Résumé</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {selectedCourse.content}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Fichiers et annexes</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedCourse.files && selectedCourse.files.length > 0 ? (
                  selectedCourse.files.map((file, idx) => {
                    const isObj = typeof file === 'object';
                    const name = isObj ? file.name : file;
                    const size = isObj ? file.size : '';

                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          background: 'var(--bg-secondary)', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '6px', 
                          border: '1px solid var(--border-color)' 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', overflow: 'hidden' }}>
                          <FileText size={16} color="var(--primary)" />
                          <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{name}</span>
                          {size && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({size})</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {isObj && file.data && (
                            <button className="btn btn-secondary btn-icon" onClick={() => handlePreview(file)} title="Aperçu" style={{ padding: '4px 8px' }}>
                              <Eye size={14} />
                            </button>
                          )}
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleDownload(file)}
                            style={{ padding: '4px 8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <Download size={13} /> Télécharger
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aucun document joint à ce cours.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
