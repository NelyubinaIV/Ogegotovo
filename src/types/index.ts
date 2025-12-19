// Типы данных для портала ОГЭ

export type MistakeCategory = 'ORTH' | 'PUNCT' | 'GRAM' | 'SPEECH' | 'TEXT';

export interface Mistake {
  id: string;
  category: MistakeCategory;
  name: string;
  description: string;
  tags: string[];
}

export interface TaskResult {
  taskId: string;
  lessonId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  attempt: number;
  timestamp: number;
  source?: string;
  mistakes?: string[]; // mistake IDs
  notes?: string;
  screenshot?: string;
}

export interface StudentProgress {
  token: string;
  nickname?: string;
  avatar?: string;
  candies: number;
  lessonsCompleted: number[];
  lessonsInProgress: number[];
  results: TaskResult[];
  achievements: string[];
  createdAt: number;
  lastActive: number;
}

export interface Task {
  id: string;
  name: string;
  type: 'external' | 'internal';
  url?: string;
  reward: number; // конфеты
  maxScore: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl?: string;
  materialUrl?: string;
  tasks: Task[];
  totalReward: number;
  unlockType: 'date' | 'progress' | 'both';
  unlockDate?: string;
  requiredLessons?: number[];
}

export type LessonStatus = 'locked' | 'available' | 'inProgress' | 'completed';

export interface TeacherData {
  key: string;
  students: StudentProgress[];
}
