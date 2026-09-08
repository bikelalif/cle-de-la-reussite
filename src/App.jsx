import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminPortal from './components/AdminPortal';

// Student Portal Views
import StudentDashboard from './student/StudentDashboard';
import StudentHomework from './student/StudentHomework';
import StudentCourses from './student/StudentCourses';
import StudentGrades from './student/StudentGrades';
import StudentChat from './student/StudentChat';

// Teacher Portal Views
import TeacherDashboard from './teacher/TeacherDashboard';
import TeacherStudents from './teacher/TeacherStudents';
import TeacherHomework from './teacher/TeacherHomework';
import TeacherCourses from './teacher/TeacherCourses';
import TeacherAttendance from './teacher/TeacherAttendance';
import TeacherChat from './teacher/TeacherChat';

import CalendarView from './components/CalendarView';

// Hybrid Database Service API Wrapper
import {
  isSupabase,
  dbInitialize,
  dbGetTeachers, dbAddTeacher, dbDeleteTeacher,
  dbGetClasses, dbAddClass, dbDeleteClass,
  dbGetStudents, dbAddStudent, dbDeleteStudent, dbAssignStudentToClass, dbRemoveStudentFromClass, dbAddGrade, dbSaveAttendance,
  dbGetCourses, dbAddCourse, dbDeleteCourse,
  dbGetHomeworks, dbAddHomework, dbDeleteHomework, dbSubmitHomework, dbGradeSubmission,
  dbGetMessages, dbAddMessage, dbDeleteMessage,
  dbGetAdminSettings, dbUpdateAdminSettings,
  dbGetEvents, dbAddEvent, dbDeleteEvent
} from './dbService';

// Icons for Sidebar and Mobile Nav
import { 
  GraduationCap, 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Award, 
  MessageSquare, 
  Users, 
  UserCheck,
  Menu,
  X,
  Sun,
  Moon,
  Calendar
} from 'lucide-react';

export default function App() {
  // Navigation & User Session
  const [currentPage, setCurrentPage] = useState('landing'); // landing, login, student, teacher, admin
  const [user, setUser] = useState(null); // active user session details
  const [activeTab, setActiveTab] = useState('dashboard'); // active tab inside portal
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Theme State (Default to dark)
  const [theme, setTheme] = useState(() => {
    const local = localStorage.getItem('cle_theme');
    return local ? local : 'dark';
  });

  // Global Interactive State loaded asynchronously from Supabase/LocalStorage
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [adminCredentials, setAdminCredentials] = useState({ username: 'Bilal000', password: 'mpbK2326' });

  // Load database on mount
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await dbInitialize();
        const [t, c, s, co, h, m, a, ev] = await Promise.all([
          dbGetTeachers(),
          dbGetClasses(),
          dbGetStudents(),
          dbGetCourses(),
          dbGetHomeworks(),
          dbGetMessages(),
          dbGetAdminSettings(),
          dbGetEvents()
        ]);
        setTeachers(t);
        setClasses(c);
        setStudents(s);
        setCourses(co);
        setHomeworks(h);
        setMessages(m);
        setAdminCredentials(a);
        setEvents(ev || []);
      } catch (err) {
        console.error('Failed to initialize database connection:', err);
      } finally {
        setLoading(false);
      }
    };
    initDatabase();
  }, []);

  // Intercept Secret URL Subpath for Admin
  useEffect(() => {
    const checkAdminPath = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin123' || hash === '#/admin123') {
        setCurrentPage('admin');
      }
    };
    checkAdminPath();
    window.addEventListener('hashchange', checkAdminPath);
    return () => window.removeEventListener('hashchange', checkAdminPath);
  }, []);

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
    localStorage.setItem('cle_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Auth Callbacks
  const handleLogin = (profile) => {
    setUser(profile);
    setCurrentPage(profile.role);
    setActiveTab('dashboard');
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    setActiveTab('dashboard');
  };

  const handleExitAdmin = () => {
    window.location.hash = '';
    window.history.pushState('', '', '/');
    setCurrentPage('landing');
  };

  // State Mutators for Portals (Teacher actions)
  const handleAddGrade = async (studentId, newGrade) => {
    await dbAddGrade(studentId, newGrade);
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          grades: [...s.grades, newGrade]
        };
      }
      return s;
    }));
  };

  const handleSaveAttendance = async (studentId, attendanceRecord) => {
    await dbSaveAttendance(studentId, attendanceRecord);
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const filteredAttendance = s.attendance.filter(a => a.date !== attendanceRecord.date);
        return {
          ...s,
          attendance: [...filteredAttendance, attendanceRecord]
        };
      }
      return s;
    }));
  };

  const handleCreateHomework = async (newHw) => {
    await dbAddHomework(newHw);
    setHomeworks(prev => [newHw, ...prev]);
  };

  const handleGradeSubmission = async (hwId, studentId, grade, feedback) => {
    await dbGradeSubmission(hwId, studentId, grade, feedback);
    setHomeworks(prev => prev.map(hw => {
      if (hw.id === hwId) {
        return {
          ...hw,
          submissions: hw.submissions.map(sub => {
            if (sub.studentId === studentId) {
              return {
                ...sub,
                grade,
                feedback
              };
            }
            return sub;
          })
        };
      }
      return hw;
    }));

    // Inject grade record reactively into bulletin
    const targetHw = homeworks.find(h => h.id === hwId);
    if (targetHw) {
      const gradeRecord = {
        id: 'g_hw_' + Date.now(),
        subject: targetHw.subject,
        grade: grade,
        max: 20,
        coeff: 2,
        title: targetHw.title,
        date: new Date().toISOString().split('T')[0]
      };
      await handleAddGrade(studentId, gradeRecord);
    }
  };

  const handleCreateCourse = async (newCourse) => {
    await dbAddCourse(newCourse);
    setCourses(prev => [newCourse, ...prev]);
  };

  // State Mutators (Student actions)
  const handleSubmitHomework = async (hwId, submissionData) => {
    await dbSubmitHomework(hwId, submissionData);
    setHomeworks(prev => prev.map(hw => {
      if (hw.id === hwId) {
        const existingSubmissions = hw.submissions || [];
        const cleanSubmissions = existingSubmissions.filter(s => s.studentId !== submissionData.studentId);
        return {
          ...hw,
          submissions: [...cleanSubmissions, submissionData]
        };
      }
      return hw;
    }));
  };

  // Messages Actions
  const handleSendMessage = async (msgData) => {
    const newMsg = {
      id: 'msg_' + Date.now(),
      ...msgData,
      timestamp: new Date().toISOString()
    };
    await dbAddMessage(newMsg);
    setMessages(prev => [...prev, newMsg]);
  };

  // Admin Portal state actions
  const handleAddStudent = async (newS) => {
    await dbAddStudent(newS);
    setStudents(prev => [...prev, newS]);
  };

  const handleDeleteStudent = async (id) => {
    await dbDeleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleAddTeacher = async (newT) => {
    await dbAddTeacher(newT);
    setTeachers(prev => [...prev, newT]);
  };

  const handleDeleteTeacher = async (id) => {
    await dbDeleteTeacher(id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    setClasses(prev => prev.map(c => c.teacherId === id ? { ...c, teacherId: null } : c));
  };

  const handleAddClass = async (newC) => {
    await dbAddClass(newC);
    setClasses(prev => [...prev, newC]);
  };

  const handleDeleteClass = async (id) => {
    await dbDeleteClass(id);
    setClasses(prev => prev.filter(c => c.id !== id));
    setStudents(prev => prev.map(s => s.classId === id ? { ...s, classId: null } : s));
  };

  const handleAssignStudentToClass = async (studentId, classId) => {
    await dbAssignStudentToClass(studentId, classId);
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, classId } : s));
  };

  const handleRemoveStudentFromClass = async (studentId) => {
    await dbRemoveStudentFromClass(studentId);
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, classId: null } : s));
  };

  const handleDeleteCourse = async (id) => {
    await dbDeleteCourse(id);
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleDeleteHomework = async (id) => {
    await dbDeleteHomework(id);
    setHomeworks(prev => prev.filter(h => h.id !== id));
  };

  const handleDeleteMessage = async (id) => {
    await dbDeleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateAdminCredentials = async (username, password) => {
    await dbUpdateAdminSettings(username, password);
    setAdminCredentials({ username, password });
  };

  const handleAddEvent = async (newEvent) => {
    await dbAddEvent(newEvent);
    setEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteEvent = async (id) => {
    await dbDeleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Render Loader if establishing connection
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-primary)', gap: '1rem', color: 'var(--text-primary)' }}>
        <GraduationCap size={48} className="fade-in" style={{ color: 'var(--primary)', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
          {isSupabase ? 'Connexion au serveur Supabase...' : 'Chargement des données...'}
        </span>
      </div>
    );
  }

  // DYNAMIC STUDENT REFERENCE: Resolves active student reactively from list state & includes dynamic class-level mapping
  const activeStudent = user && user.role === 'student' 
    ? (() => {
        const std = students.find(s => s.id === user.id);
        if (!std) return null;
        const assignedClass = classes.find(c => c.id === std.classId);
        return {
          ...std,
          level: assignedClass ? assignedClass.level : 'Non assigné',
          className: assignedClass ? assignedClass.name : 'Aucune classe'
        };
      })()
    : null;

  // DYNAMIC TEACHER RELATION: Resolve students belonging to classes taught by this teacher
  const teacherClasses = user && user.role === 'teacher' ? classes.filter(c => c.teacherId === user.id) : [];
  const teacherClassIds = teacherClasses.map(c => c.id);
  const teacherStudents = user && user.role === 'teacher' ? students.filter(s => teacherClassIds.includes(s.classId)) : [];

  // Define sidebar menu configurations (In French)
  const studentMenu = [
    { id: 'dashboard', label: 'Mon Espace', icon: <LayoutDashboard size={20} /> },
    { id: 'homework', label: 'Travail à faire', icon: <CheckSquare size={20} /> },
    { id: 'courses', label: 'Cours & Fiches', icon: <BookOpen size={20} /> },
    { id: 'calendar', label: 'Calendrier', icon: <Calendar size={20} /> },
    { id: 'grades', label: 'Notes & Suivi', icon: <Award size={20} /> },
    { id: 'chat', label: 'Messagerie', icon: <MessageSquare size={20} /> }
  ];

  const teacherMenu = [
    { id: 'dashboard', label: 'Espace Prof', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'Gestion Élèves', icon: <Users size={20} /> },
    { id: 'homework', label: 'Devoirs & Copies', icon: <CheckSquare size={20} /> },
    { id: 'courses', label: 'Mes Cours', icon: <BookOpen size={20} /> },
    { id: 'calendar', label: 'Calendrier', icon: <Calendar size={20} /> },
    { id: 'attendance', label: 'Faire l\'appel', icon: <UserCheck size={20} /> },
    { id: 'chat', label: 'Messagerie', icon: <MessageSquare size={20} /> }
  ];

  const activeMenu = user?.role === 'teacher' ? teacherMenu : studentMenu;

  return (
    <div className="app-container">
      {/* Dynamic Navigation Header */}
      {currentPage !== 'student' && currentPage !== 'teacher' && currentPage !== 'admin' && (
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={setCurrentPage} 
          theme={theme} 
          onToggleTheme={toggleTheme} 
        />
      )}

      {/* Pages Switchboard */}
      <main className="main-content">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'login' && (
          <Login onLogin={handleLogin} onBack={() => setCurrentPage('landing')} students={students} teachers={teachers} />
        )}

        {currentPage === 'admin' && (
          <AdminPortal 
            students={students}
            teachers={teachers}
            classes={classes}
            courses={courses}
            homeworks={homeworks}
            messages={messages}
            events={events}
            adminCredentials={adminCredentials}
            onUpdateAdminCredentials={handleUpdateAdminCredentials}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddTeacher={handleAddTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onAddClass={handleAddClass}
            onDeleteClass={handleDeleteClass}
            onAssignStudentToClass={handleAssignStudentToClass}
            onRemoveStudentFromClass={handleRemoveStudentFromClass}
            onDeleteCourse={handleDeleteCourse}
            onDeleteHomework={handleDeleteHomework}
            onDeleteMessage={handleDeleteMessage}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onBack={handleExitAdmin}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}

        {(currentPage === 'student' || currentPage === 'teacher') && user && (
          <div className="portal-layout">
            
            {/* Mobile Drawer Overlay Backdrop */}
            <div 
              className={`portal-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
              onClick={() => setSidebarOpen(false)} 
            />

            {/* Sidebar for Desktop & Mobile Drawer */}
            <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  padding: '0.50rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GraduationCap size={20} color="#fff" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>Clé de Réussite</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem', flex: 1 }}>
                {activeMenu.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: activeTab === item.id ? 'var(--primary)' : 'transparent',
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
                  onClick={handleLogout}
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
                  <MessageSquare size={20} style={{ transform: 'rotate(180deg)' }} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </aside>

            {/* Main Portal Viewport */}
            <div className="portal-main">
              {/* Portal Header */}
              <div className="portal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    className="btn btn-secondary btn-icon hidden-desktop" 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ borderRadius: '8px' }}
                  >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                    {activeTab === 'dashboard' ? 'Tableau de bord' : activeTab}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Theme Switch Button inside Portal Header */}
                  <button 
                    onClick={toggleTheme} 
                    className="btn btn-secondary btn-icon" 
                    title={theme === 'dark' ? 'Passer au mode jour' : 'Passer au mode nuit'}
                    style={{ borderRadius: '50%', color: 'var(--text-primary)' }}
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>

                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }} className="hidden-mobile">
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {user.role === 'teacher' ? 'Enseignant' : `Élève • ${activeStudent?.className || 'Non assigné'}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic portal tab panels */}
              <div className="portal-body">
                {user.role === 'student' && activeStudent && (
                  <>
                    {activeTab === 'dashboard' && <StudentDashboard student={activeStudent} homeworks={homeworks} courses={courses} onTabChange={setActiveTab} />}
                    {activeTab === 'homework' && <StudentHomework student={activeStudent} homeworks={homeworks} onSubmitHomework={handleSubmitHomework} />}
                    {activeTab === 'courses' && <StudentCourses student={activeStudent} courses={courses} />}
                    {activeTab === 'calendar' && <CalendarView userRole="student" userLevel={activeStudent.level} homeworks={homeworks} courses={courses} events={events} />}
                    {activeTab === 'grades' && <StudentGrades student={activeStudent} />}
                    {activeTab === 'chat' && <StudentChat student={activeStudent} messages={messages} onSendMessage={handleSendMessage} />}
                  </>
                )}

                {user.role === 'teacher' && (
                  <>
                    {activeTab === 'dashboard' && <TeacherDashboard teacher={user} students={teacherStudents} homeworks={homeworks} onTabChange={setActiveTab} />}
                    {activeTab === 'students' && <TeacherStudents students={teacherStudents} onAddGrade={handleAddGrade} />}
                    {activeTab === 'homework' && <TeacherHomework homeworks={homeworks} students={teacherStudents} onCreateHomework={handleCreateHomework} onGradeSubmission={handleGradeSubmission} />}
                    {activeTab === 'courses' && <TeacherCourses courses={courses} onCreateCourse={handleCreateCourse} />}
                    {activeTab === 'calendar' && <CalendarView userRole="teacher" homeworks={homeworks} courses={courses} events={events} onAddEvent={handleAddEvent} onDeleteEvent={handleDeleteEvent} />}
                    {activeTab === 'attendance' && <TeacherAttendance students={teacherStudents} onSaveAttendance={handleSaveAttendance} />}
                    {activeTab === 'chat' && <TeacherChat students={teacherStudents} messages={messages} onSendMessage={handleSendMessage} />}
                  </>
                )}
              </div>

              {/* Mobile Bottom Tab Navigation */}
              <nav className="mobile-nav">
                {activeMenu.slice(0, 5).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .hidden-desktop {
          display: none !important;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }

        @media (max-width: 768px) {
          .hidden-desktop {
            display: inline-flex !important;
          }
          .hidden-mobile {
            display: none !important;
          }
          
          /* Sidebar overlay behavior on mobile */
          .portal-sidebar {
            display: flex !important;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 250px;
            z-index: 200;
            transform: translateX(-100%);
            transition: transform var(--transition-normal);
          }
          
          .portal-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
