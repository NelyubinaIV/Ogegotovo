import React, { useState } from 'react';
import { StudentProgress } from '../../types';
import { getCourseProgress, getRecommendations } from '../../utils/lessonUtils';
import { LESSONS } from '../../config/lessons';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { LessonList } from './LessonList';
import { StudentProfile } from './StudentProfile';
import { Candy, Trophy, BookOpen, TrendingUp } from 'lucide-react';

interface StudentDashboardProps {
  studentData: StudentProgress;
  onUpdate: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentData, onUpdate }) => {
  const [showProfile, setShowProfile] = useState(false);
  const progress = getCourseProgress(studentData);
  const recommendations = getRecommendations(studentData);
  
  const totalLessons = LESSONS.length;
  const completedLessons = studentData.lessonsCompleted.length;
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок и профиль */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Подготовка к ОГЭ
            </h1>
            <p className="text-muted-foreground">
              Привет, {studentData.nickname || 'ученик'}! 👋
            </p>
          </div>
          
          <Button 
            onClick={() => setShowProfile(true)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {studentData.avatar || '😊'} Профиль
          </Button>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <Candy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Конфетки</p>
                <p className="text-2xl font-bold text-yellow-400">{studentData.candies}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-teal-500/20 to-teal-600/10 border-teal-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-teal-500/20">
                <BookOpen className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Уроков</p>
                <p className="text-2xl font-bold text-teal-400">{completedLessons}/{totalLessons}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/20">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Прогресс</p>
                <p className="text-2xl font-bold text-orange-400">{progress}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Достижения</p>
                <p className="text-2xl font-bold text-purple-400">{studentData.achievements.length}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Прогресс-бар курса */}
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Прогресс курса</h3>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {progress}%
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Завершено {completedLessons} из {totalLessons} уроков
            </p>
          </div>
        </Card>
        
        {/* Рекомендации */}
        {recommendations.length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Рекомендации
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        
        {/* Список уроков */}
        <LessonList studentData={studentData} onUpdate={onUpdate} />
        
        {/* Диалог профиля */}
        {showProfile && (
          <StudentProfile
            studentData={studentData}
            onClose={() => setShowProfile(false)}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
};
