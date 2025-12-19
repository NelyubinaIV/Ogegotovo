import { Lesson, LessonStatus, StudentProgress } from '../types';
import { LESSONS } from '../config/lessons';

// Проверка, открыт ли урок
export const getLessonStatus = (lesson: Lesson, studentData: StudentProgress): LessonStatus => {
  // Проверяем, завершён ли урок
  if (studentData.lessonsCompleted.includes(lesson.id)) {
    return 'completed';
  }
  
  // Проверяем, в процессе ли урок
  if (studentData.lessonsInProgress.includes(lesson.id)) {
    return 'inProgress';
  }
  
  // Проверяем условия открытия
  const now = Date.now();
  let dateUnlocked = true;
  let progressUnlocked = true;
  
  // Проверка по дате
  if (lesson.unlockType === 'date' || lesson.unlockType === 'both') {
    if (lesson.unlockDate) {
      const unlockTime = new Date(lesson.unlockDate).getTime();
      dateUnlocked = now >= unlockTime;
    }
  }
  
  // Проверка по прогрессу
  if (lesson.unlockType === 'progress' || lesson.unlockType === 'both') {
    if (lesson.requiredLessons && lesson.requiredLessons.length > 0) {
      progressUnlocked = lesson.requiredLessons.every(reqId => 
        studentData.lessonsCompleted.includes(reqId)
      );
    }
  }
  
  // Определяем статус
  if (lesson.unlockType === 'both') {
    return (dateUnlocked && progressUnlocked) ? 'available' : 'locked';
  } else if (lesson.unlockType === 'date') {
    return dateUnlocked ? 'available' : 'locked';
  } else {
    return progressUnlocked ? 'available' : 'locked';
  }
};

// Получение прогресса курса (%)
export const getCourseProgress = (studentData: StudentProgress): number => {
  const total = LESSONS.length;
  const completed = studentData.lessonsCompleted.length;
  return Math.round((completed / total) * 100);
};

// Подсчёт заработанных конфет по уроку
export const getEarnedCandiesForLesson = (lessonId: string, studentData: StudentProgress): number => {
  const lessonResults = studentData.results.filter(r => r.lessonId === lessonId && r.passed);
  
  // Группируем по taskId и берём последний успешный результат
  const uniqueTasks = new Set(lessonResults.map(r => r.taskId));
  
  let total = 0;
  const lesson = LESSONS.find(l => l.id === parseInt(lessonId));
  if (!lesson) return 0;
  
  uniqueTasks.forEach(taskId => {
    const task = lesson.tasks.find(t => t.id === taskId);
    if (task) total += task.reward;
  });
  
  return total;
};

// Проверка, завершён ли урок полностью
export const isLessonFullyCompleted = (lessonId: number, studentData: StudentProgress): boolean => {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return false;
  
  // Проверяем, что все задания пройдены
  const completedTasks = new Set(
    studentData.results
      .filter(r => r.lessonId === lessonId.toString() && r.passed)
      .map(r => r.taskId)
  );
  
  return lesson.tasks.every(task => completedTasks.has(task.id));
};

// Получение следующего доступного урока
export const getNextAvailableLesson = (studentData: StudentProgress): Lesson | null => {
  for (const lesson of LESSONS) {
    const status = getLessonStatus(lesson, studentData);
    if (status === 'available') {
      return lesson;
    }
  }
  return null;
};

// Рекомендации для студента
export const getRecommendations = (studentData: StudentProgress): string[] => {
  const recommendations: string[] = [];
  
  const progress = getCourseProgress(studentData);
  
  if (progress === 0) {
    recommendations.push('Начни с первого урока! Это введение в структуру ОГЭ.');
  } else if (progress < 30) {
    recommendations.push('Отличное начало! Продолжай в том же духе.');
  } else if (progress < 70) {
    recommendations.push('Ты на полпути! Не забывай регулярно практиковаться.');
  } else if (progress < 100) {
    recommendations.push('Почти у цели! Осталось совсем немного.');
  } else {
    recommendations.push('Поздравляем! Ты завершил все уроки курса.');
  }
  
  // Рекомендация по ошибкам
  if (studentData.results.length > 0) {
    const totalAttempts = studentData.results.length;
    const failedAttempts = studentData.results.filter(r => !r.passed).length;
    const errorRate = (failedAttempts / totalAttempts) * 100;
    
    if (errorRate > 50) {
      recommendations.push('Не торопись! Внимательно изучай материалы перед тестами.');
    }
  }
  
  return recommendations;
};
