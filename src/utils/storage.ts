import { StudentProgress, TaskResult, TeacherData } from '../types';

const STORAGE_KEYS = {
  STUDENT_TOKEN: 'oge_student_token',
  STUDENT_DATA: 'oge_student_data',
  TEACHER_KEY: 'oge_teacher_key',
  ALL_STUDENTS: 'oge_all_students',
};

// Генерация случайного токена
export const generateToken = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part1}-${part2}`;
};

// Извлечение токена из URL
export const getTokenFromURL = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  
  if (urlToken) return urlToken;
  
  // Проверка hash-роутинга /#/u/TOKEN
  const hash = window.location.hash;
  const match = hash.match(/\/#\/u\/([A-Z0-9-]+)/);
  if (match) return match[1];
  
  return null;
};

// Сохранение токена студента
export const saveStudentToken = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.STUDENT_TOKEN, token);
};

// Получение токена студента
export const getStudentToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.STUDENT_TOKEN);
};

// Инициализация данных студента
export const initStudentData = (token: string): StudentProgress => {
  const newStudent: StudentProgress = {
    token,
    candies: 0,
    lessonsCompleted: [],
    lessonsInProgress: [],
    results: [],
    achievements: [],
    createdAt: Date.now(),
    lastActive: Date.now(),
  };
  
  saveStudentData(newStudent);
  addStudentToGlobalList(newStudent);
  
  return newStudent;
};

// Сохранение данных студента
export const saveStudentData = (data: StudentProgress) => {
  data.lastActive = Date.now();
  localStorage.setItem(STORAGE_KEYS.STUDENT_DATA, JSON.stringify(data));
  
  // Обновляем в глобальном списке
  updateStudentInGlobalList(data);
};

// Получение данных студента
export const getStudentData = (): StudentProgress | null => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENT_DATA);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Добавление результата
export const addTaskResult = (result: TaskResult) => {
  const studentData = getStudentData();
  if (!studentData) return;
  
  studentData.results.push(result);
  
  // Обновляем конфетки
  if (result.passed) {
    const lesson = studentData.lessonsInProgress.includes(parseInt(result.lessonId));
    if (!lesson) {
      studentData.lessonsInProgress.push(parseInt(result.lessonId));
    }
  }
  
  saveStudentData(studentData);
};

// Обновление профиля студента
export const updateStudentProfile = (nickname?: string, avatar?: string) => {
  const studentData = getStudentData();
  if (!studentData) return;
  
  if (nickname !== undefined) studentData.nickname = nickname;
  if (avatar !== undefined) studentData.avatar = avatar;
  
  saveStudentData(studentData);
};

// Добавление конфеток
export const addCandies = (amount: number) => {
  const studentData = getStudentData();
  if (!studentData) return;
  
  studentData.candies += amount;
  saveStudentData(studentData);
};

// Отметка урока как завершённого
export const markLessonCompleted = (lessonId: number) => {
  const studentData = getStudentData();
  if (!studentData) return;
  
  if (!studentData.lessonsCompleted.includes(lessonId)) {
    studentData.lessonsCompleted.push(lessonId);
  }
  
  // Убираем из "в процессе"
  studentData.lessonsInProgress = studentData.lessonsInProgress.filter(id => id !== lessonId);
  
  saveStudentData(studentData);
};

// === УЧИТЕЛЬ ===

// Сохранение ключа учителя
export const saveTeacherKey = (key: string) => {
  localStorage.setItem(STORAGE_KEYS.TEACHER_KEY, key);
};

// Получение ключа учителя
export const getTeacherKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TEACHER_KEY);
};

// Получение списка всех студентов
export const getAllStudents = (): StudentProgress[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ALL_STUDENTS);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Добавление студента в глобальный список
const addStudentToGlobalList = (student: StudentProgress) => {
  const students = getAllStudents();
  
  // Проверяем, не существует ли уже
  const exists = students.find(s => s.token === student.token);
  if (!exists) {
    students.push(student);
    localStorage.setItem(STORAGE_KEYS.ALL_STUDENTS, JSON.stringify(students));
  }
};

// Обновление студента в глобальном списке
const updateStudentInGlobalList = (student: StudentProgress) => {
  const students = getAllStudents();
  const index = students.findIndex(s => s.token === student.token);
  
  if (index !== -1) {
    students[index] = student;
    localStorage.setItem(STORAGE_KEYS.ALL_STUDENTS, JSON.stringify(students));
  } else {
    addStudentToGlobalList(student);
  }
};

// Получить конкретного студента по токену
export const getStudentByToken = (token: string): StudentProgress | null => {
  const students = getAllStudents();
  return students.find(s => s.token === token) || null;
};

// Экспорт данных
export const exportToJSON = () => {
  const students = getAllStudents();
  const dataStr = JSON.stringify(students, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `oge-students-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const exportToCSV = () => {
  const students = getAllStudents();
  
  let csv = 'Токен,Ник,Конфеты,Уроков завершено,Последняя активность\n';
  
  students.forEach(student => {
    csv += `${student.token},`;
    csv += `${student.nickname || 'Не указан'},`;
    csv += `${student.candies},`;
    csv += `${student.lessonsCompleted.length},`;
    csv += `${new Date(student.lastActive).toLocaleString('ru-RU')}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `oge-students-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
