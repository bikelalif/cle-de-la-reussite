// Service de base de données hybride (Supabase / LocalStorage)
// Ce module abstrait tous les appels pour fonctionner en local ou en production de manière transparente.

import { createClient } from '@supabase/supabase-js';
import { initialTeachers, initialClasses, initialStudents, initialCourses, initialHomework, initialMessages, initialEvents } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Détecte si les identifiants Supabase sont configurés et différents de l'exemple
export const isSupabase = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://votre-projet.supabase.co' &&
  supabaseAnonKey !== 'votre-cle-anonyme-public'
);

export const supabase = isSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Gestion du fallback automatique sur LocalStorage
export let useLocalFallback = false;

const checkFallback = (error) => {
  if (error) {
    console.warn("⚠️ [Supabase DB Info] Problème de connexion ou table absente. Utilisation du stockage local (localStorage). Détail :", error.message || error);
    useLocalFallback = true;
  }
};

export const dbInitialize = async () => {
  if (isSupabase) {
    try {
      const { data, error } = await supabase.from('admin_settings').select('*').eq('id', 1).maybeSingle();
      if (error || !data) {
        console.warn("⚠️ [Supabase] Base non initialisée ou bloquée par RLS. Passage en LocalStorage.");
        useLocalFallback = true;
      } else {
        console.log("✅ [Supabase] Connexion et tables actives.");
      }
    } catch (err) {
      console.warn("⚠️ [Supabase] Erreur de connexion. Passage en LocalStorage.");
      useLocalFallback = true;
    }
  }
};


// Exécuteurs avec fallback automatique
const runQuery = async (supabaseOp, localOp) => {
  if (isSupabase && !useLocalFallback) {
    try {
      const { data, error } = await supabaseOp();
      if (error) {
        checkFallback(error);
        return await localOp();
      }
      return data;
    } catch (err) {
      checkFallback(err);
      return await localOp();
    }
  } else {
    return await localOp();
  }
};

const runMutation = async (supabaseOp, localOp) => {
  if (isSupabase && !useLocalFallback) {
    try {
      const { error } = await supabaseOp();
      if (error) {
        checkFallback(error);
        await localOp();
      }
    } catch (err) {
      checkFallback(err);
      await localOp();
    }
  } else {
    await localOp();
  }
};

// Helpers pour LocalStorage
const getLocal = (key, fallback) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// -------------------------------------------------------------
// MAPPERS (Traduction camelCase JS <=> snake_case PostgreSQL)
// -------------------------------------------------------------
const mapClassFromDb = (c) => (!c ? null : {
  id: c.id,
  name: c.name,
  level: c.level,
  teacherId: c.teacher_id
});

const mapClassToDb = (c) => (!c ? null : {
  id: c.id,
  name: c.name,
  level: c.level,
  teacher_id: c.teacherId
});

const mapStudentFromDb = (s) => (!s ? null : {
  id: s.id,
  name: s.name,
  email: s.email,
  password: s.password,
  classId: s.class_id,
  avatar: s.avatar,
  parentName: s.parent_name,
  parentPhone: s.parent_phone,
  grades: s.grades || [],
  attendance: s.attendance || []
});

const mapStudentToDb = (s) => (!s ? null : {
  id: s.id,
  name: s.name,
  email: s.email,
  password: s.password,
  class_id: s.classId,
  avatar: s.avatar,
  parent_name: s.parentName,
  parent_phone: s.parentPhone,
  grades: s.grades,
  attendance: s.attendance
});

const mapHomeworkFromDb = (h) => (!h ? null : {
  id: h.id,
  title: h.title,
  subject: h.subject,
  level: h.level,
  description: h.description,
  dueDate: h.due_date,
  submissions: h.submissions || []
});

const mapHomeworkToDb = (h) => (!h ? null : {
  id: h.id,
  title: h.title,
  subject: h.subject,
  level: h.level,
  description: h.description,
  due_date: h.dueDate,
  submissions: h.submissions
});

// -------------------------------------------------------------
// API DES PROFESSEURS
// -------------------------------------------------------------
export const dbGetTeachers = () => runQuery(
  () => supabase.from('teachers').select('*'),
  () => getLocal('cle_teachers', initialTeachers)
);

export const dbAddTeacher = (teacher) => {
  // Trim automatique de l'email lors de la création
  if (teacher && teacher.email) {
    teacher.email = teacher.email.trim();
  }
  return runMutation(
    () => supabase.from('teachers').insert(teacher),
    () => {
      const list = getLocal('cle_teachers', initialTeachers);
      list.push(teacher);
      setLocal('cle_teachers', list);
    }
  );
};

export const dbDeleteTeacher = (id) => runMutation(
  async () => {
    await supabase.from('teachers').delete().eq('id', id);
    return await supabase.from('classes').update({ teacher_id: null }).eq('teacher_id', id);
  },
  () => {
    let list = getLocal('cle_teachers', initialTeachers);
    list = list.filter(t => t.id !== id);
    setLocal('cle_teachers', list);

    let cls = getLocal('cle_classes', initialClasses);
    cls = cls.map(c => c.teacherId === id ? { ...c, teacherId: null } : c);
    setLocal('cle_classes', cls);
  }
);

// -------------------------------------------------------------
// API DES CLASSES
// -------------------------------------------------------------
export const dbGetClasses = () => runQuery(
  () => supabase.from('classes').select('*'),
  async () => getLocal('cle_classes', initialClasses)
).then(data => (data || []).map(mapClassFromDb));

export const dbAddClass = (classObj) => runMutation(
  () => supabase.from('classes').insert(mapClassToDb(classObj)),
  () => {
    const list = getLocal('cle_classes', initialClasses);
    list.push(classObj);
    setLocal('cle_classes', list);
  }
);

export const dbDeleteClass = (id) => runMutation(
  async () => {
    await supabase.from('classes').delete().eq('id', id);
    return await supabase.from('students').update({ class_id: null }).eq('class_id', id);
  },
  () => {
    let list = getLocal('cle_classes', initialClasses);
    list = list.filter(c => c.id !== id);
    setLocal('cle_classes', list);

    let stds = getLocal('cle_students', initialStudents);
    stds = stds.map(s => s.classId === id ? { ...s, classId: null } : s);
    setLocal('cle_students', stds);
  }
);

// -------------------------------------------------------------
// API DES ÉLÈVES
// -------------------------------------------------------------
export const dbGetStudents = () => runQuery(
  () => supabase.from('students').select('*'),
  () => getLocal('cle_students', initialStudents)
).then(data => (data || []).map(mapStudentFromDb));

export const dbAddStudent = (student) => {
  // Trim automatique de l'email
  if (student && student.email) {
    student.email = student.email.trim();
  }
  return runMutation(
    () => supabase.from('students').insert(mapStudentToDb(student)),
    () => {
      const list = getLocal('cle_students', initialStudents);
      list.push(student);
      setLocal('cle_students', list);
    }
  );
};

export const dbDeleteStudent = (id) => runMutation(
  () => supabase.from('students').delete().eq('id', id),
  () => {
    let list = getLocal('cle_students', initialStudents);
    list = list.filter(s => s.id !== id);
    setLocal('cle_students', list);
  }
);

export const dbAssignStudentToClass = (studentId, classId) => runMutation(
  () => supabase.from('students').update({ class_id: classId }).eq('id', studentId),
  () => {
    const list = getLocal('cle_students', initialStudents);
    const updated = list.map(s => s.id === studentId ? { ...s, classId } : s);
    setLocal('cle_students', updated);
  }
);

export const dbRemoveStudentFromClass = (studentId) => runMutation(
  () => supabase.from('students').update({ class_id: null }).eq('id', studentId),
  () => {
    const list = getLocal('cle_students', initialStudents);
    const updated = list.map(s => s.id === studentId ? { ...s, classId: null } : s);
    setLocal('cle_students', updated);
  }
);

export const dbAddGrade = (studentId, newGrade) => runMutation(
  async () => {
    const { data, error } = await supabase.from('students').select('grades').eq('id', studentId).single();
    if (error) return { error };
    const grades = data?.grades || [];
    grades.push(newGrade);
    return await supabase.from('students').update({ grades }).eq('id', studentId);
  },
  () => {
    const list = getLocal('cle_students', initialStudents);
    const updated = list.map(s => s.id === studentId ? { ...s, grades: [...s.grades, newGrade] } : s);
    setLocal('cle_students', updated);
  }
);

export const dbSaveAttendance = (studentId, attendanceRecord) => runMutation(
  async () => {
    const { data, error } = await supabase.from('students').select('attendance').eq('id', studentId).single();
    if (error) return { error };
    let attendance = data?.attendance || [];
    attendance = attendance.filter(a => a.date !== attendanceRecord.date);
    attendance.push(attendanceRecord);
    return await supabase.from('students').update({ attendance }).eq('id', studentId);
  },
  () => {
    const list = getLocal('cle_students', initialStudents);
    const updated = list.map(s => {
      if (s.id === studentId) {
        const filtered = s.attendance.filter(a => a.date !== attendanceRecord.date);
        return { ...s, attendance: [...filtered, attendanceRecord] };
      }
      return s;
    });
    setLocal('cle_students', updated);
  }
);

// -------------------------------------------------------------
// API DES COURS
// -------------------------------------------------------------
export const dbGetCourses = () => runQuery(
  () => supabase.from('courses').select('*'),
  () => getLocal('cle_courses', initialCourses)
);

export const dbAddCourse = (course) => runMutation(
  () => supabase.from('courses').insert(course),
  () => {
    const list = getLocal('cle_courses', initialCourses);
    list.unshift(course);
    setLocal('cle_courses', list);
  }
);

export const dbDeleteCourse = (id) => runMutation(
  () => supabase.from('courses').delete().eq('id', id),
  () => {
    let list = getLocal('cle_courses', initialCourses);
    list = list.filter(c => c.id !== id);
    setLocal('cle_courses', list);
  }
);

// -------------------------------------------------------------
// API DES DEVOIRS
// -------------------------------------------------------------
export const dbGetHomeworks = () => runQuery(
  () => supabase.from('homeworks').select('*'),
  () => getLocal('cle_homeworks', initialHomework)
).then(data => (data || []).map(mapHomeworkFromDb));

export const dbAddHomework = (hw) => runMutation(
  () => supabase.from('homeworks').insert(mapHomeworkToDb(hw)),
  () => {
    const list = getLocal('cle_homeworks', initialHomework);
    list.unshift(hw);
    setLocal('cle_homeworks', list);
  }
);

export const dbDeleteHomework = (id) => runMutation(
  () => supabase.from('homeworks').delete().eq('id', id),
  () => {
    let list = getLocal('cle_homeworks', initialHomework);
    list = list.filter(h => h.id !== id);
    setLocal('cle_homeworks', list);
  }
);

export const dbSubmitHomework = (hwId, submission) => runMutation(
  async () => {
    const { data, error } = await supabase.from('homeworks').select('submissions').eq('id', hwId).single();
    if (error) return { error };
    let submissions = data?.submissions || [];
    submissions = submissions.filter(s => s.studentId !== submission.studentId);
    submissions.push(submission);
    return await supabase.from('homeworks').update({ submissions }).eq('id', hwId);
  },
  () => {
    const list = getLocal('cle_homeworks', initialHomework);
    const updated = list.map(hw => {
      if (hw.id === hwId) {
        const subs = hw.submissions || [];
        const clean = subs.filter(s => s.studentId !== submission.studentId);
        return { ...hw, submissions: [...clean, submission] };
      }
      return hw;
    });
    setLocal('cle_homeworks', updated);
  }
);

export const dbGradeSubmission = (hwId, studentId, grade, feedback) => runMutation(
  async () => {
    const { data, error } = await supabase.from('homeworks').select('submissions').eq('id', hwId).single();
    if (error) return { error };
    let submissions = data?.submissions || [];
    submissions = submissions.map(sub => 
      sub.studentId === studentId ? { ...sub, grade, feedback } : sub
    );
    return await supabase.from('homeworks').update({ submissions }).eq('id', hwId);
  },
  () => {
    const list = getLocal('cle_homeworks', initialHomework);
    const updated = list.map(hw => {
      if (hw.id === hwId) {
        return {
          ...hw,
          submissions: hw.submissions.map(sub => 
            sub.studentId === studentId ? { ...sub, grade, feedback } : sub
          )
        };
      }
      return hw;
    });
    setLocal('cle_homeworks', updated);
  }
);

// -------------------------------------------------------------
// API DES MESSAGES
// -------------------------------------------------------------
export const dbGetMessages = () => runQuery(
  () => supabase.from('messages').select('*'),
  () => getLocal('cle_messages', initialMessages)
);

export const dbAddMessage = (msg) => runMutation(
  () => supabase.from('messages').insert(msg),
  () => {
    const list = getLocal('cle_messages', initialMessages);
    list.push(msg);
    setLocal('cle_messages', list);
  }
);

export const dbDeleteMessage = (id) => runMutation(
  () => supabase.from('messages').delete().eq('id', id),
  () => {
    let list = getLocal('cle_messages', initialMessages);
    list = list.filter(m => m.id !== id);
    setLocal('cle_messages', list);
  }
);

// -------------------------------------------------------------
// API PARAMÈTRES ADMINISTRATEUR
// -------------------------------------------------------------
const defaultAdmin = { username: 'Bilal000', password: 'mpbK2326' };

export const dbGetAdminSettings = () => runQuery(
  () => supabase.from('admin_settings').select('*').eq('id', 1).single(),
  () => getLocal('cle_admin_creds', defaultAdmin)
).then(data => data ? { username: data.username, password: data.password } : defaultAdmin);

export const dbUpdateAdminSettings = (username, password) => runMutation(
  () => supabase.from('admin_settings').upsert({ id: 1, username, password }),
  () => {
    setLocal('cle_admin_creds', { username, password });
  }
);

// -------------------------------------------------------------
// API DES ÉVÉNEMENTS DU CALENDRIER
// -------------------------------------------------------------
export const dbGetEvents = () => runQuery(
  () => supabase.from('events').select('*'),
  () => getLocal('cle_events', initialEvents)
);

export const dbAddEvent = (event) => runMutation(
  () => supabase.from('events').insert(event),
  () => {
    const list = getLocal('cle_events', initialEvents);
    list.push(event);
    setLocal('cle_events', list);
  }
);

export const dbDeleteEvent = (id) => runMutation(
  () => supabase.from('events').delete().eq('id', id),
  () => {
    let list = getLocal('cle_events', initialEvents);
    list = list.filter(e => e.id !== id);
    setLocal('cle_events', list);
  }
);

