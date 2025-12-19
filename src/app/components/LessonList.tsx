import React, { useState } from 'react';
import { StudentProgress, Lesson } from '../../types';
import { LESSONS } from '../../config/lessons';
import { getLessonStatus } from '../../utils/lessonUtils';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LessonDetail } from './LessonDetail';
import { Lock, Play, CheckCircle2, Clock } from 'lucide-react';

interface LessonListProps {
  studentData: StudentProgress;
  onUpdate: () => void;
}

export const LessonList: React.FC<LessonListProps> = ({ studentData, onUpdate }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      case 'available':
        return <Play className="h-5 w-5 text-primary" />;
      case 'inProgress':
        return <Clock className="h-5 w-5 text-accent" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'locked':
        return <Badge variant="secondary">Закрыто</Badge>;
      case 'available':
        return <Badge className="bg-primary text-primary-foreground">Доступно</Badge>;
      case 'inProgress':
        return <Badge className="bg-accent text-accent-foreground">В процессе</Badge>;
      case 'completed':
        return <Badge className="bg-green-600 text-white">Готово</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Уроки курса</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {LESSONS.map((lesson) => {
          const status = getLessonStatus(lesson, studentData);
          const isLocked = status === 'locked';
          
          return (
            <Card 
              key={lesson.id} 
              className={`p-6 transition-all hover:shadow-lg ${
                isLocked ? 'opacity-60' : 'hover:border-primary/50 cursor-pointer'
              }`}
              onClick={() => !isLocked && setSelectedLesson(lesson)}
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {lesson.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    {getStatusBadge(status)}
                    
                    <Badge variant="outline" className="gap-1">
                      🍬 {lesson.totalReward} конфет
                    </Badge>
                    
                    <Badge variant="outline" className="gap-1">
                      📝 {lesson.tasks.length} задания
                    </Badge>
                  </div>
                  
                  {/* Условия открытия для закрытых уроков */}
                  {isLocked && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {lesson.unlockDate && (
                        <p>🗓️ Откроется: {new Date(lesson.unlockDate).toLocaleDateString('ru-RU')}</p>
                      )}
                      {lesson.requiredLessons && lesson.requiredLessons.length > 0 && (
                        <p>🔒 Требуется: завершить урок {lesson.requiredLessons.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {!isLocked && (
                  <Button 
                    size="lg"
                    className={status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {status === 'completed' ? 'Повторить' : 'Начать'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Диалог урока */}
      {selectedLesson && (
        <LessonDetail
          lesson={selectedLesson}
          studentData={studentData}
          onClose={() => setSelectedLesson(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};
