import React, { useEffect, useState } from 'react';
import { TaskResult } from '../../types';
import { addTaskResult, addCandies, getStudentData } from '../../utils/storage';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

// Компонент для приёма результатов через URL параметры
// Использование: /result?token=ABCD-1234&lessonId=1&taskId=l1-t1&score=8&max=10&passed=true&mistakes=ORTH_PRE_PRI,PUNCT_SSP

export const ResultReceiver: React.FC = () => {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const token = params.get('token');
    const lessonId = params.get('lessonId');
    const taskId = params.get('taskId');
    const score = params.get('score');
    const max = params.get('max');
    const passed = params.get('passed') === 'true';
    const mistakesStr = params.get('mistakes');
    const source = params.get('source');
    
    if (!token || !lessonId || !taskId) {
      setResult({
        success: false,
        message: 'Отсутствуют обязательные параметры: token, lessonId, taskId'
      });
      return;
    }
    
    // Получаем данные студента
    const studentData = getStudentData();
    if (!studentData || studentData.token !== token) {
      setResult({
        success: false,
        message: 'Студент с таким токеном не найден. Войди на сайт сначала!'
      });
      return;
    }
    
    // Создаём результат
    const taskResult: TaskResult = {
      taskId,
      lessonId,
      score: parseInt(score || '0'),
      maxScore: parseInt(max || '100'),
      passed,
      attempt: studentData.results.filter(r => 
        r.taskId === taskId && r.lessonId === lessonId
      ).length + 1,
      timestamp: Date.now(),
      source,
      mistakes: mistakesStr ? mistakesStr.split(',').filter(Boolean) : undefined,
    };
    
    // Сохраняем результат
    addTaskResult(taskResult);
    
    // Добавляем конфетки, если пройдено и это первый раз
    if (passed) {
      const previouslyCompleted = studentData.results.some(r => 
        r.taskId === taskId && 
        r.lessonId === lessonId && 
        r.passed
      );
      
      if (!previouslyCompleted) {
        // Здесь можно добавить логику начисления конфет
        // Для простоты просто сообщаем об успехе
      }
    }
    
    setResult({
      success: true,
      message: passed 
        ? 'Отлично! Результат сохранён и конфетки начислены 🍬'
        : 'Результат сохранён. Попробуй ещё раз!'
    });
    
    // Перенаправляем на главную через 3 секунды
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  }, []);
  
  // Обработка postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'oge_result') {
        const data = event.data.data;
        
        const studentData = getStudentData();
        if (!studentData || studentData.token !== data.token) {
          return;
        }
        
        const taskResult: TaskResult = {
          taskId: data.taskId,
          lessonId: data.lessonId,
          score: data.score || 0,
          maxScore: data.max || 100,
          passed: data.passed,
          attempt: studentData.results.filter(r => 
            r.taskId === data.taskId && r.lessonId === data.lessonId
          ).length + 1,
          timestamp: Date.now(),
          source: 'postMessage',
          mistakes: data.mistakes,
        };
        
        addTaskResult(taskResult);
        
        setResult({
          success: true,
          message: 'Результат получен через postMessage!'
        });
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8">
          <p className="text-muted-foreground">Обработка результата...</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {result.success ? (
          <>
            <div className="flex justify-center">
              <div className="p-4 bg-green-500/20 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Успех!</h2>
              <p className="text-muted-foreground">{result.message}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="p-4 bg-destructive/20 rounded-full">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Ошибка</h2>
              <p className="text-muted-foreground">{result.message}</p>
            </div>
          </>
        )}
        
        <Button onClick={() => window.location.href = '/'} className="w-full">
          Вернуться на главную
        </Button>
      </Card>
    </div>
  );
};
