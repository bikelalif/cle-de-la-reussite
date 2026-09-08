-- Script d'initialisation de la base de données PostgreSQL pour Supabase
-- Copiez et collez ce script dans l'éditeur SQL de votre console Supabase (SQL Editor > New Query) puis cliquez sur RUN.

-- 1. Table des professeurs
CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    subject TEXT NOT NULL,
    avatar TEXT
);

-- 2. Table des classes
CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL
);

-- 3. Table des élèves
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    class_id TEXT REFERENCES classes(id) ON DELETE SET NULL,
    avatar TEXT,
    parent_name TEXT,
    parent_phone TEXT,
    grades JSONB DEFAULT '[]'::jsonb,
    attendance JSONB DEFAULT '[]'::jsonb
);

-- 4. Table des documents de cours
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT,
    content TEXT,
    author TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    date TEXT
);

-- 5. Table des devoirs à faire
CREATE TABLE IF NOT EXISTS homeworks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    submissions JSONB DEFAULT '[]'::jsonb
);

-- 6. Table des messages de messagerie
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL
);

-- 7. Table des paramètres administrateur (identifiant et mot de passe admin)
CREATE TABLE IF NOT EXISTS admin_settings (
    id INT PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

-- 8. Table des événements du calendrier
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    time TEXT,
    type TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT,
    attached_course_id TEXT,
    attached_homework_id TEXT
);

-- 9. Données par défaut pour les tests et la démo
INSERT INTO teachers (id, name, email, password, subject, avatar)
VALUES ('tch_1', 'M. Dupont', 'prof@reussite.fr', 'password', 'Mathématiques', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150')
ON CONFLICT (email) DO NOTHING;

INSERT INTO classes (id, name, level, teacher_id)
VALUES ('cls_1', 'Terminale A', 'Terminale', 'tch_1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO students (id, name, email, password, class_id, avatar, parent_name, parent_phone)
VALUES ('std_1', 'Élève Test', 'eleve@reussite.fr', 'password', 'cls_1', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Parent Test', '06 12 34 56 78')
ON CONFLICT (email) DO NOTHING;

INSERT INTO admin_settings (id, username, password)
VALUES (1, 'Bilal000', 'mpbK2326')
ON CONFLICT (id) DO NOTHING;

-- 10. Désactivation de la sécurité Row Level Security (RLS) pour permettre les requêtes depuis l'application
ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE homeworks DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;


