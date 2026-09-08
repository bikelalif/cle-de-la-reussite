import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Tag, BookOpen, CheckSquare, Users, AlertCircle, X, Trash2, Download, Eye, FileText, Link, Paperclip } from 'lucide-react';

export default function CalendarView({ userRole, userLevel, homeworks = [], courses = [], events = [], onAddEvent, onDeleteEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' (10h-20h) or 'month'
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [selectedDayDateStr, setSelectedDayDateStr] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState(userLevel && userLevel !== 'Non assigné' ? userLevel : 'Tous');

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [eventType, setEventType] = useState('Soutien');
  const [eventLevel, setEventLevel] = useState(userLevel && userLevel !== 'Non assigné' ? userLevel : 'Terminale');
  const [eventDesc, setEventDesc] = useState('');
  const [attachedCourseId, setAttachedCourseId] = useState('');
  const [attachedHomeworkId, setAttachedHomeworkId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNamesShort = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Hours list from 10h to 20h
  const hoursList = [
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const currentMonday = getMonday(currentDate);

  const weekDays = [0, 1, 2, 3, 4, 5, 6].map(offset => {
    const d = new Date(currentMonday);
    d.setDate(currentMonday.getDate() + offset);
    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      dateObj: d,
      dateStr: formatted,
      dayName: dayNamesShort[offset],
      dayNumber: d.getDate(),
      monthNumber: d.getMonth() + 1
    };
  });

  const prevWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const nextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Aggregate all items into a unified calendar events array
  // Note: General course feed publications do NOT pollute the planning unless explicitly attached
  const allCalendarItems = [
    // Custom Events
    ...events.map(ev => ({
      id: ev.id,
      title: ev.title,
      date: ev.date,
      startTime: ev.startTime || ev.time || '14:00',
      endTime: ev.endTime || '15:00',
      time: `${ev.startTime || ev.time || '14:00'}${ev.endTime ? ' - ' + ev.endTime : ''}`,
      type: ev.type || 'Soutien',
      level: ev.level || 'Tous',
      description: ev.description || '',
      attachedCourseId: ev.attachedCourseId || null,
      attachedHomeworkId: ev.attachedHomeworkId || null,
      isCustom: true
    })),
    // Homework Due Dates in top All-day section
    ...homeworks.map(hw => ({
      id: 'hw_' + hw.id,
      title: `Devoir à rendre : ${hw.title}`,
      date: hw.dueDate,
      startTime: 'Toute la journée',
      endTime: '',
      time: 'Toute la journée',
      type: 'Devoir',
      level: hw.level,
      description: `${hw.subject} • ${hw.description || 'À rendre sur le portail'}`,
      isCustom: false
    }))
  ];

  // Filter items by level
  const filteredItems = allCalendarItems.filter(item => {
    if (selectedLevelFilter === 'Tous') return true;
    return item.level === 'Tous' || item.level === selectedLevelFilter;
  });

  // Month View Grid
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let startingDay = firstDayOfMonth.getDay() - 1;
  if (startingDay === -1) startingDay = 6;

  const totalDaysMonth = lastDayOfMonth.getDate();
  const monthGrid = [];
  for (let i = 0; i < startingDay; i++) monthGrid.push(null);
  for (let d = 1; d <= totalDaysMonth; d++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayItems = filteredItems.filter(item => item.date === formattedDate);
    monthGrid.push({
      dayNumber: d,
      dateStr: formattedDate,
      items: dayItems
    });
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Devoir': return { bg: 'rgba(239, 68, 68, 0.18)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' };
      case 'Cours': return { bg: 'rgba(56, 189, 248, 0.18)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.4)' };
      case 'Examen': return { bg: 'rgba(245, 158, 11, 0.18)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)' };
      case 'Soutien': default: return { bg: 'rgba(168, 85, 247, 0.18)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.4)' };
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;

    if (onAddEvent) {
      onAddEvent({
        id: 'ev_' + Date.now(),
        title: eventTitle,
        date: eventDate,
        startTime,
        endTime,
        time: `${startTime} - ${endTime}`,
        type: eventType,
        level: eventLevel,
        description: eventDesc,
        attachedCourseId: attachedCourseId || null,
        attachedHomeworkId: attachedHomeworkId || null
      });
    }

    setSuccessMsg('Événement ajouté au planning !');
    setEventTitle('');
    setEventDesc('');
    setAttachedCourseId('');
    setAttachedHomeworkId('');

    setTimeout(() => {
      setSuccessMsg('');
      setShowAddModal(false);
    }, 1500);
  };

  const openAddModalWithSlot = (dateStr, hourStr = '14:00') => {
    if (userRole === 'teacher' || userRole === 'admin') {
      setEventDate(dateStr);
      setStartTime(hourStr);
      // Calculate end time +1 hour
      const hourNum = parseInt(hourStr.split(':')[0], 10);
      const nextHourNum = hourNum + 1 <= 20 ? hourNum + 1 : 20;
      setEndTime(`${String(nextHourNum).padStart(2, '0')}:00`);
      setShowAddModal(true);
    }
  };

  const handleDownloadFile = (file) => {
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

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CalendarIcon size={28} color="var(--primary)" /> Planning & Emploi du temps
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Planning hebdomadaire des séances de soutien et examens (créneaux de 10h00 à 20h00).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Level Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Tag size={16} color="var(--text-muted)" />
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
            >
              <option value="Tous">Tous les niveaux</option>
              <option value="Seconde">Seconde</option>
              <option value="Première">Première</option>
              <option value="Terminale">Terminale</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('week')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'week' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'week' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              Semaine (10h-20h)
            </button>
            <button
              onClick={() => setViewMode('month')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'month' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'month' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              Mois
            </button>
          </div>

          {(userRole === 'teacher' || userRole === 'admin') && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Planifier un créneau
            </button>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-icon" onClick={viewMode === 'week' ? prevWeek : prevMonth} title="Précédent">
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, minWidth: '220px', textAlign: 'center' }}>
            {viewMode === 'week' ? (
              `Semaine du ${weekDays[0].dayNumber}/${weekDays[0].monthNumber} au ${weekDays[6].dayNumber}/${weekDays[6].monthNumber} ${year}`
            ) : (
              `${monthNames[month]} ${year}`
            )}
          </h2>
          <button className="btn btn-secondary btn-icon" onClick={viewMode === 'week' ? nextWeek : nextMonth} title="Suivant">
            <ChevronRight size={20} />
          </button>
          <button className="btn btn-secondary" onClick={goToToday} style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem', marginLeft: '0.5rem' }}>
            Aujourd'hui
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7' }}></span> Soutien
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span> Examens
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span> Devoirs à rendre
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE SEMAINE (TIMETABLE 10H - 20H) */}
      {/* ========================================================================= */}
      {viewMode === 'week' && (
        <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <div style={{ minWidth: '850px' }}>
            {/* Week Header Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '6px', marginBottom: '8px' }}>
              <div style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Heure
              </div>
              {weekDays.map(d => {
                const isToday = d.dateStr === todayStr;
                return (
                  <div
                    key={d.dateStr}
                    style={{
                      background: isToday ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                      border: isToday ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.6rem 0.25rem',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isToday ? 'var(--primary)' : 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {d.dayName}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isToday ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {d.dayNumber}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Devoirs / All-Day Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '6px', marginBottom: '12px' }}>
              <div style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Échéances
              </div>
              {weekDays.map(d => {
                const dayAllDayItems = filteredItems.filter(item => item.date === d.dateStr && (item.startTime === 'Toute la journée' || !hoursList.includes(item.startTime)));
                return (
                  <div
                    key={`allday_${d.dateStr}`}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: '6px',
                      border: '1px dashed var(--border-color)',
                      padding: '0.35rem',
                      minHeight: '42px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}
                  >
                    {dayAllDayItems.map(item => {
                      const colors = getTypeColor(item.type);
                      return (
                        <div
                          key={item.id}
                          onClick={() => { setSelectedDayEvents([item]); setSelectedDayDateStr(d.dateStr); }}
                          style={{
                            background: colors.bg,
                            color: colors.text,
                            borderLeft: `3px solid ${colors.text}`,
                            fontSize: '0.7rem',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                          }}
                          title={item.title}
                        >
                          {item.title}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Hourly Timetable Rows (10h00 to 20h00) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {hoursList.map(hour => (
                <div key={hour} style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '6px', minHeight: '62px' }}>
                  {/* Hour Slot Label */}
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {hour}
                  </div>

                  {/* 7 Days Grid Cells for this hour */}
                  {weekDays.map(d => {
                    const slotHourVal = parseInt(hour.split(':')[0], 10);
                    // Match items where event start_hour <= slotHourVal AND end_hour > slotHourVal
                    const matchingItems = filteredItems.filter(item => {
                      if (item.date !== d.dateStr) return false;
                      if (!item.startTime || item.startTime === 'Toute la journée') return false;

                      const startVal = parseInt(item.startTime.split(':')[0], 10);
                      const endVal = item.endTime ? parseInt(item.endTime.split(':')[0], 10) : startVal + 1;

                      return slotHourVal >= startVal && slotHourVal < endVal;
                    });

                    return (
                      <div
                        key={`${d.dateStr}_${hour}`}
                        onClick={() => {
                          if (matchingItems.length > 0) {
                            setSelectedDayEvents(matchingItems);
                            setSelectedDayDateStr(d.dateStr);
                          } else {
                            openAddModalWithSlot(d.dateStr, hour);
                          }
                        }}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '0.35rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'background 0.15s, border-color 0.15s'
                        }}
                        className="calendar-slot-hover"
                      >
                        {matchingItems.map(item => {
                          const colors = getTypeColor(item.type);
                          return (
                            <div
                              key={item.id}
                              style={{
                                background: colors.bg,
                                color: colors.text,
                                borderLeft: `3px solid ${colors.text}`,
                                fontSize: '0.73rem',
                                padding: '4px 6px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                lineHeight: 1.3,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                              title={`${item.startTime} - ${item.endTime} : ${item.title}`}
                            >
                              <div style={{ fontSize: '0.68rem', opacity: 0.9, fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                                <span>⏰ {item.startTime} - {item.endTime}</span>
                                <span>{item.level}</span>
                              </div>
                              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                                {item.title}
                              </div>
                              {(item.attachedCourseId || item.attachedHomeworkId) && (
                                <div style={{ fontSize: '0.65rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '2px', opacity: 0.9 }}>
                                  <Paperclip size={10} /> Document rattaché
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE MOIS (MONTHLY GRID) */}
      {/* ========================================================================= */}
      {viewMode === 'month' && (
        <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', gap: '8px', marginBottom: '8px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div>Lundi</div>
            <div>Mardi</div>
            <div>Mercredi</div>
            <div>Jeudi</div>
            <div>Vendredi</div>
            <div>Samedi</div>
            <div>Dimanche</div>
          </div>

          {/* Grid Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', gap: '8px' }}>
            {monthGrid.map((cell, idx) => {
              if (!cell) {
                return (
                  <div key={`empty_${idx}`} style={{ minHeight: '110px', background: 'var(--bg-tertiary)', opacity: 0.3, borderRadius: '8px' }}></div>
                );
              }

              const isToday = cell.dateStr === todayStr;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => {
                    if (cell.items.length > 0) {
                      setSelectedDayEvents(cell.items);
                      setSelectedDayDateStr(cell.dateStr);
                    } else {
                      openAddModalWithSlot(cell.dateStr);
                    }
                  }}
                  style={{
                    minHeight: '110px',
                    background: isToday ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-secondary)',
                    border: isToday ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s'
                  }}
                  className="calendar-day-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontWeight: isToday ? 800 : 600,
                      fontSize: '0.85rem',
                      color: isToday ? 'var(--primary)' : 'var(--text-primary)',
                      background: isToday ? 'var(--primary-light)' : 'transparent',
                      padding: isToday ? '2px 6px' : '0',
                      borderRadius: '4px'
                    }}>
                      {cell.dayNumber}
                    </span>
                    {cell.items.length > 0 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {cell.items.length} {cell.items.length > 1 ? 'événements' : 'évt'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'hidden' }}>
                    {cell.items.slice(0, 3).map((item) => {
                      const colors = getTypeColor(item.type);
                      return (
                        <div
                          key={item.id}
                          style={{
                            background: colors.bg,
                            color: colors.text,
                            borderLeft: `3px solid ${colors.text}`,
                            fontSize: '0.72rem',
                            padding: '3px 5px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: 600
                          }}
                          title={`${item.startTime} - ${item.endTime} : ${item.title}`}
                        >
                          {item.title}
                        </div>
                      );
                    })}
                    {cell.items.length > 3 && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>
                        + {cell.items.length - 3} autres...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Details Day / Event */}
      {selectedDayEvents && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '540px', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => setSelectedDayEvents(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={20} color="var(--primary)" /> Événement du {selectedDayDateStr.split('-').reverse().join('/')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {selectedDayEvents.length} élément(s) programmé(s).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
              {selectedDayEvents.map(item => {
                const colors = getTypeColor(item.type);
                const attachedCourse = item.attachedCourseId ? courses.find(c => c.id === item.attachedCourseId) : null;
                const attachedHomework = item.attachedHomeworkId ? homeworks.find(h => h.id === item.attachedHomeworkId) : null;

                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ background: colors.bg, color: colors.text, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {item.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} /> {item.startTime} {item.endTime ? `à ${item.endTime}` : ''} • Niveau {item.level}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{item.title}</div>
                    {item.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    )}

                    {/* Attached Course Block */}
                    {attachedCourse && (
                      <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--primary-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                          <BookOpen size={14} /> Cours rattaché : {attachedCourse.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          Matière : {attachedCourse.subject} • Auteur : {attachedCourse.author}
                        </div>
                        {attachedCourse.files && attachedCourse.files.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {attachedCourse.files.map((file, fileIdx) => (
                              <button
                                key={fileIdx}
                                className="btn btn-primary"
                                onClick={() => handleDownloadFile(file)}
                                style={{ padding: '3px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              >
                                <Download size={12} /> Télécharger {typeof file === 'object' ? file.name : file}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Attached Homework Block */}
                    {attachedHomework && (
                      <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.25rem' }}>
                          <CheckSquare size={14} /> Devoir rattaché : {attachedHomework.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Matière : {attachedHomework.subject} • Rendu exigé : {attachedHomework.dueDate}
                        </div>
                      </div>
                    )}

                    {item.isCustom && (userRole === 'teacher' || userRole === 'admin') && onDeleteEvent && (
                      <button
                        onClick={() => {
                          onDeleteEvent(item.id);
                          setSelectedDayEvents(prev => prev.filter(ev => ev.id !== item.id));
                        }}
                        style={{
                          alignSelf: 'flex-end',
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          marginTop: '0.25rem'
                        }}
                      >
                        <Trash2 size={13} /> Supprimer l'événement
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Event */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ➕ Planifier un créneau au planning
            </h3>

            {successMsg && (
              <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.75rem', borderRadius: '6px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Titre du créneau</span>
                <input
                  type="text"
                  placeholder="ex: Séance de soutien Mathématiques - TVI"
                  className="input-field"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Date</span>
                  <input
                    type="date"
                    className="input-field"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Heure début</span>
                  <select className="input-field" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                    {hoursList.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Heure fin</span>
                  <select className="input-field" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                    {hoursList.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Type d'événement</span>
                  <select className="input-field" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value="Soutien">Séance de Soutien</option>
                    <option value="Examen">Examen / Contrôle</option>
                    <option value="Cours">Cours Spécial</option>
                    <option value="Devoir">Rappel Devoir</option>
                  </select>
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <span className="input-label">Niveau ciblé</span>
                  <select className="input-field" value={eventLevel} onChange={(e) => setEventLevel(e.target.value)}>
                    <option value="Tous">Tous les niveaux</option>
                    <option value="Seconde">Seconde</option>
                    <option value="Première">Première</option>
                    <option value="Terminale">Terminale</option>
                  </select>
                </div>
              </div>

              {/* Attach Course Option */}
              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Rattacher un cours existant (optionnel)</span>
                <select className="input-field" value={attachedCourseId} onChange={(e) => setAttachedCourseId(e.target.value)}>
                  <option value="">Aucun cours rattaché</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      📖 {c.title} ({c.subject} - {c.level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Attach Homework Option */}
              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Rattacher un devoir existant (optionnel)</span>
                <select className="input-field" value={attachedHomeworkId} onChange={(e) => setAttachedHomeworkId(e.target.value)}>
                  <option value="">Aucun devoir rattaché</option>
                  {homeworks.map(h => (
                    <option key={h.id} value={h.id}>
                      📝 {h.title} ({h.subject} - {h.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <span className="input-label">Description ou consignes (optionnel)</span>
                <textarea
                  className="input-field"
                  placeholder="ex: Merci d'avoir révisé le cours avant de venir à la séance."
                  rows={2}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer l'événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .calendar-slot-hover:hover {
          border-color: var(--primary) !important;
          background: var(--bg-tertiary) !important;
        }
        .calendar-day-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
