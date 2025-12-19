import React, { useState } from 'react';
import { Task, Lesson, StudentProgress, TaskResult } from '../../types';
import { MISTAKES, MISTAKE_CATEGORIES, getMistakesByCategory } from '../../config/mistakes';
import { addTaskResult, addCandies, markLessonCompleted, saveStudentData } from '../../utils/storage';
import { isLessonFullyCompleted } from '../../utils/lessonUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner';
import { Candy, Upload } from 'lucide-react';

interface ResultFormProps {
  task: Task;
  lesson: Lesson;
  studentData: StudentProgress;
  onClose: () => void;
  onUpdate: () => void;
}

export const ResultForm: React.FC<ResultFormProps> = ({ 
  task, 
  lesson, 
  studentData, 
  onClose, 
  onUpdate 
}) => {
  const [score, setScore] = useState<string>('');
  const [passed, setPassed] = useState(true);
  const [notes, setNotes] = useState('');
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>([]);
  const [screenshot, setScreenshot] = useState('');
  
  const handleMistakeToggle = (mistakeId: string) => {
    setSelectedMistakes(prev => 
      prev.includes(mistakeId)
        ? prev.filter(id => id !== mistakeId)
        : [...prev, mistakeId]
    );
  };
  
  const handleSubmit = () => {
    const scoreNum = parseInt(score) || 0;
    
    // Создаём результат
    const result: TaskResult = {
      taskId: task.id,
      lessonId: lesson.id.toString(),
      score: scoreNum,
      maxScore: task.maxScore,
      passed,
      attempt: studentData.results.filter(r => 
        r.taskId === task.id && r.lessonId === lesson.id.toString()
      ).length + 1,
      timestamp: Date.now(),
      mistakes: selectedMistakes,
      notes: notes || undefined,
      screenshot: screenshot || undefined,
    };
    
    // Сохраняем результат
    addTaskResult(result);
    
    // Добавляем конфетки, если пройдено
    if (passed) {
      // Проверяем, не получали ли конфетки за это задание ранее
      const previouslyCompleted = studentData.results.some(r => 
        r.taskId === task.id && 
        r.lessonId === lesson.id.toString() && 
        r.passed
      );
      
      if (!previouslyCompleted) {
        addCandies(task.reward);
        toast.success(`🍬 +${task.reward} конфеток!`, {
          description: `Отличная работа! Задание "${task.name}" выполнено.`
        });
      } else {
        toast.success('Задание обновлено!', {
          description: 'Результат сохранён, но конфетки уже были получены.'
        });
      }
      
      // Проверяем, завершён ли весь урок
      const updatedStudent = studentData;
      if (isLessonFullyCompleted(lesson.id, updatedStudent)) {
        markLessonCompleted(lesson.id);
        toast.success(`🎉 Урок завершён!`, {
          description: `Поздравляем! "${lesson.title}" полностью пройден.`
        });
      }
    } else {
      toast.info('Результат сохранён', {
        description: 'Попробуй ещё раз и повтори материал!'
      });
    }
    
    onUpdate();
    onClose();
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Candy className="h-6 w-6 text-secondary" />
            Я прошёл(а) задание: {task.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Баллы */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Баллы</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max={task.maxScore}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder={`0-${task.maxScore}`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passed">Статус</Label>
              <div className="flex items-center gap-4 h-10">
                <button
                  onClick={() => setPassed(true)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    passed 
                      ? 'bg-green-600 text-white' 
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  ✓ Пройдено
                </button>
                <button
                  onClick={() => setPassed(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    !passed 
                      ? 'bg-destructive text-destructive-foreground' 
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  ✗ Не сдано
                </button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Чек-лист ошибок */}
          <div className="space-y-3">
            <Label>Отметь допущенные ошибки</Label>
            <Card className="p-4 bg-muted/30">
              <Accordion type="multiple" className="w-full">
                {Object.entries(MISTAKE_CATEGORIES).map(([category, name]) => {
                  const categoryMistakes = getMistakesByCategory(category as any);
                  const selectedInCategory = categoryMistakes.filter(m => 
                    selectedMistakes.includes(m.id)
                  ).length;
                  
                  return (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <span>{name}</span>
                          {selectedInCategory > 0 && (
                            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                              {selectedInCategory}
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {categoryMistakes.map((mistake) => (
                            <div key={mistake.id} className="flex items-start gap-2">
                              <Checkbox
                                id={mistake.id}
                                checked={selectedMistakes.includes(mistake.id)}
                                onCheckedChange={() => handleMistakeToggle(mistake.id)}
                              />
                              <label
                                htmlFor={mistake.id}
                                className="text-sm cursor-pointer flex-1"
                              >
                                <span className="font-medium">{mistake.name}</span>
                                <span className="text-muted-foreground block text-xs">
                                  {mistake.description}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Card>
            
            {selectedMistakes.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Выбрано ошибок: {selectedMistakes.length}
              </p>
            )}
          </div>
          
          <Separator />
          
          {/* Заметки */}
          <div className="space-y-2">
            <Label htmlFor="notes">Что было сложно? (опционально)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Опиши, что вызвало затруднения..."
              rows={3}
            />
          </div>
          
          {/* Скриншот (опционально) */}
          <div className="space-y-2">
            <Label htmlFor="screenshot">Ссылка на скриншот (опционально)</Label>
            <Input
              id="screenshot"
              type="url"
              value={screenshot}
              onChange={(e) => setScreenshot(e.target.value)}
              placeholder="https://..."
            />
          </div>
          
          {/* Кнопки */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit}
              className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <Candy className="h-4 w-4" />
              Сохранить и получить конфетку
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
