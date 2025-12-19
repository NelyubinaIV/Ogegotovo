import React from 'react';
import { StudentProgress } from '../../types';
import { MISTAKES, MISTAKE_CATEGORIES, getMistakeById } from '../../config/mistakes';
import { LESSONS } from '../../config/lessons';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TeacherAnalyticsProps {
  students: StudentProgress[];
}

export const TeacherAnalytics: React.FC<TeacherAnalyticsProps> = ({ students }) => {
  // Анализ ошибок по всему классу
  const mistakeFrequency = new Map<string, number>();
  students.forEach(student => {
    student.results.forEach(result => {
      result.mistakes?.forEach(mistakeId => {
        mistakeFrequency.set(mistakeId, (mistakeFrequency.get(mistakeId) || 0) + 1);
      });
    });
  });
  
  const topMistakes = Array.from(mistakeFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({
      id,
      name: getMistakeById(id)?.name || id,
      count,
    }));
  
  // Анализ по категориям ошибок
  const categoryFrequency = new Map<string, number>();
  students.forEach(student => {
    student.results.forEach(result => {
      result.mistakes?.forEach(mistakeId => {
        const mistake = getMistakeById(mistakeId);
        if (mistake) {
          categoryFrequency.set(
            mistake.category,
            (categoryFrequency.get(mistake.category) || 0) + 1
          );
        }
      });
    });
  });
  
  const categoryData = Array.from(categoryFrequency.entries()).map(([category, count]) => ({
    name: MISTAKE_CATEGORIES[category as keyof typeof MISTAKE_CATEGORIES],
    value: count,
  }));
  
  const COLORS = ['#14b8a6', '#fbbf24', '#fb923c', '#8b5cf6', '#ec4899'];
  
  // Прогресс по урокам
  const lessonProgress = LESSONS.map(lesson => {
    const completed = students.filter(s => s.lessonsCompleted.includes(lesson.id)).length;
    const percentage = students.length > 0 ? Math.round((completed / students.length) * 100) : 0;
    
    return {
      lesson: `Урок ${lesson.id}`,
      completed,
      percentage,
    };
  });
  
  // Активность по дням
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  const activityData = last7Days.map(date => {
    const dayStart = new Date(date).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    
    const active = students.filter(s => 
      s.lastActive >= dayStart && s.lastActive < dayEnd
    ).length;
    
    return {
      date: new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      active,
    };
  });
  
  if (students.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          Нет данных для аналитики
        </p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Топ ошибок */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Топ-10 ошибок класса</h3>
        {topMistakes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Пока нет данных об ошибках
          </p>
        ) : (
          <div className="space-y-3">
            {topMistakes.map((mistake, index) => (
              <div key={mistake.id} className="flex items-center gap-3">
                <Badge variant="outline" className="w-8 text-center">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{mistake.name}</span>
                    <span className="text-sm text-muted-foreground">{mistake.count}x</span>
                  </div>
                  <Progress 
                    value={(mistake.count / topMistakes[0].count) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Ошибки по категориям */}
      {categoryData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Ошибки по категориям</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}
      
      {/* Прогресс по урокам */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Прогресс класса по урокам</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lessonProgress}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="lesson" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="completed" fill="#14b8a6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Активность за неделю */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Активность за последние 7 дней</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="active" fill="#fbbf24" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
