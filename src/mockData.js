// Production Initial Data for "La Clé de la Réussite"

export const initialTeachers = [
  {
    id: "tch_1",
    name: "M. Dupont",
    email: "prof@reussite.fr",
    subject: "Mathématiques",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  }
];

export const initialClasses = [
  {
    id: "cls_1",
    name: "Terminale A",
    level: "Terminale",
    teacherId: "tch_1"
  }
];

export const initialStudents = [
  {
    id: "std_1",
    name: "Alexandre Dubois",
    email: "eleve@reussite.fr",
    classId: "cls_1", // Assigned to Terminale A
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    parentName: "Marc Dubois",
    parentPhone: "06 12 34 56 78",
    grades: [],
    attendance: []
  }
];

export const initialCourses = [];

export const initialHomework = [];

export const initialMessages = [];

export const initialEvents = [];


