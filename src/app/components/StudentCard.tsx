import React from 'react';
import { StudentProgress } from '../../types';
import { LESSONS } from '../../config/lessons';
import { getMistakeById } from '../../config/mistakes';
import { getCourseProgress } from '../../utils/lessonUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface StudentCardProps {
  student: StudentProgress;
  onClose: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClose }) => {
  const progress = getCourseProgress(student);
  
  // Анализ ошибок
  const mistakeFrequency = new Map<string, number>();
  student.results.forEach(result => {
    result.mistakes?.forEach(mistakeId => {
      mistakeFrequency.set(mistakeId, (mistakeFrequency.get(mistakeId) || 0) + 1);
    });
  });
  
  const topMistakes = Array.from(mistakeFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Анализ по урокам
  const lessonStats = LESSONS.map(lesson => {
    const lessonResults = student.results.filter(r => r.lessonId === lesson.id.toString());
    const completed = student.lessonsCompleted.includes(lesson.id);
    const totalAttempts = lessonResults.length;
    const passedAttempts = lessonResults.filter(r => r.passed).length;
    
    return {
      lesson,
      completed,
      totalAttempts,
      passedAttempts,
      avgScore: totalAttempts > 0
        ? Math.round(lessonResults.reduce((sum, r) => sum + (r.score / r.maxScore * 100), 0) / totalAttempts)
        : 0,
    };
  });
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{student.avatar || '😊'}</span>
            <div>
              <p>{student.nickname || 'Без имени'}</p>
              <code className="text-sm text-muted-foreground font-mono">
                {student.token}
              </code>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Общая статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Прогресс</p>
                <p className="text-2xl font-bold text-primary">{progress}%</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Конфеты</p>
                <p className="text-2xl font-bold text-yellow-400">{student.candies}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Уроков</p>
                <p className="text-2xl font-bold text-teal-400">
                  {student.lessonsCompleted.length}/{LESSONS.length}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Попыток</p>
                <p className="text-2xl font-bold text-purple-400">{student.results.length}</p>
              </Card>
            </div>
            
            {/* Вкладки */}
            <Tabs defaultValue="lessons" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lessons">Уроки</TabsTrigger>
                <TabsTrigger value="mistakes">Ошибки</TabsTrigger>
                <TabsTrigger value="results">История</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons" className="space-y-3">
                {lessonStats.map(({ lesson, completed, totalAttempts, passedAttempts, avgScore }) => (
                  <Card key={lesson.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm">{lesson.title}</h4>
                        {completed ? (
                          <Badge className="bg-green-600">Завершён</Badge>
                        ) : totalAttempts > 0 ? (
                          <Badge className="bg-yellow-600">В процессе</Badge>
                        ) : (
                          <Badge variant="outline">Не начат</Badge>
                        )}
                      </div>
                      
                      {totalAttempts > 0 && (
                        <>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Попыток: {totalAttempts}</span>
                            <span>Успешно: {passedAttempts}</span>
                            <span>Средний балл: {avgScore}%</span>
                          </div>
                          <Progress value={avgScore} className="h-2" />
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="mistakes" className="space-y-3">
                {topMistakes.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Пока нет отмеченных ошибок
                    </p>
                  </Card>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">
                      Топ-{topMistakes.length} частых ошибок:
                    </div>
                    {topMistakes.map(([mistakeId, count]) => {
                      const mistake = getMistakeById(mistakeId);
                      if (!mistake) return null;
                      
                      return (
                        <Card key={mistakeId} className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm">{mistake.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {mistake.category}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {mistake.description}
                              </p>
                            </div>
                            <Badge className="bg-destructive text-destructive-foreground">
                              {count}x
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="results" className="space-y-3">
                {student.results.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Пока нет результатов
                    </p>
                  </Card>
                ) : (
                  student.results
                    .slice()
                    .reverse()
                    .map((result, index) => {
                      const lesson = LESSONS.find(l => l.id === parseInt(result.lessonId));
                      const task = lesson?.tasks.find(t => t.id === result.taskId);
                      
                      return (
                        <Card key={index} className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm">
                                  {task?.name || 'Неизвестное задание'}
                                </h4>
                                {result.passed ? (
                                  <Badge className="bg-green-600">✓ Сдано</Badge>
                                ) : (
                                  <Badge className="bg-red-600">✗ Не сдано</Badge>
                                )}
                              </div>
                              
                              <p className="text-xs text-muted-foreground mt-1">
                                {lesson?.title} • Попытка {result.attempt}
                              </p>
                              
                              <div className="flex gap-3 mt-2 text-xs">
                                <span>Баллы: {result.score}/{result.maxScore}</span>
                                {result.mistakes && result.mistakes.length > 0 && (
                                  <span className="text-destructive">
                                    Ошибок: {result.mistakes.length}
                                  </span>
                                )}
                              </div>
                              
                              {result.notes && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                  "{result.notes}"
                                </p>
                              )}
                            </div>
                            
                            <div className="text-right text-xs text-muted-foreground">
                              {new Date(result.timestamp).toLocaleString('ru-RU')}
                            </div>
                          </div>
                        </Card>
                      );
                    })
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
