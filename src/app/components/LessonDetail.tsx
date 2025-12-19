import React, { useState } from 'react';
import { Lesson, StudentProgress, Task } from '../../types';
import { getLessonStatus } from '../../utils/lessonUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ResultForm } from './ResultForm';
import { ExternalLink, Video, FileText, CheckCircle2 } from 'lucide-react';

interface LessonDetailProps {
  lesson: Lesson;
  studentData: StudentProgress;
  onClose: () => void;
  onUpdate: () => void;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({ 
  lesson, 
  studentData, 
  onClose, 
  onUpdate 
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const status = getLessonStatus(lesson, studentData);
  
  // Проверяем, какие задания пройдены
  const isTaskCompleted = (taskId: string) => {
    return studentData.results.some(r => 
      r.taskId === taskId && 
      r.lessonId === lesson.id.toString() && 
      r.passed
    );
  };
  
  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{lesson.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Описание */}
            <div>
              <p className="text-muted-foreground">{lesson.description}</p>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-secondary text-secondary-foreground">
                  🍬 {lesson.totalReward} конфет
                </Badge>
                <Badge variant="outline">
                  {lesson.tasks.length} заданий
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            {/* Видео и материалы */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Материалы урока</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lesson.videoUrl && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/20">
                        <Video className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Видеоурок</p>
                        <p className="text-xs text-muted-foreground">Смотреть материал</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(lesson.videoUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )}
                
                {lesson.materialUrl && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Конспект</p>
                        <p className="text-xs text-muted-foreground">Изучить материал</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(lesson.materialUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Задания */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Задания</h3>
              
              <div className="space-y-3">
                {lesson.tasks.map((task) => {
                  const completed = isTaskCompleted(task.id);
                  
                  return (
                    <Card 
                      key={task.id}
                      className={`p-4 transition-all ${
                        completed ? 'bg-green-500/10 border-green-500/30' : 'hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          {completed && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{task.name}</p>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                🍬 {task.reward}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Макс. {task.maxScore} баллов
                              </Badge>
                              {completed && (
                                <Badge className="text-xs bg-green-600">
                                  ✓ Выполнено
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          {task.url && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(task.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Открыть
                            </Button>
                          )}
                          
                          <Button 
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                            className="bg-accent hover:bg-accent/90"
                          >
                            🍬 Забрать
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Форма отправки результата */}
      {selectedTask && (
        <ResultForm
          task={selectedTask}
          lesson={lesson}
          studentData={studentData}
          onClose={() => setSelectedTask(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};
