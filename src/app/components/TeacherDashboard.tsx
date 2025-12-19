import React, { useState } from 'react';
import { StudentProgress } from '../../types';
import { getAllStudents, exportToJSON, exportToCSV } from '../../utils/storage';
import { getCourseProgress } from '../../utils/lessonUtils';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { StudentCard } from './StudentCard';
import { TeacherAnalytics } from './TeacherAnalytics';
import { 
  Users, 
  Search, 
  Download, 
  TrendingUp, 
  Award,
  GraduationCap 
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [students] = useState<StudentProgress[]>(getAllStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  
  // Фильтрация студентов
  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.token.toLowerCase().includes(query) ||
      (student.nickname || '').toLowerCase().includes(query)
    );
  });
  
  // Статистика класса
  const totalStudents = students.length;
  const activeStudents = students.filter(s => 
    Date.now() - s.lastActive < 7 * 24 * 60 * 60 * 1000 // активные за неделю
  ).length;
  const avgProgress = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + getCourseProgress(s), 0) / students.length)
    : 0;
  const totalCandies = students.reduce((sum, s) => sum + s.candies, 0);
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Кабинет учителя
            </h1>
            <p className="text-muted-foreground">
              Управление учениками и аналитика курса
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={exportToJSON}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              JSON
            </Button>
          </div>
        </div>
        
        {/* Статистика класса */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Учеников</p>
                <p className="text-2xl font-bold text-blue-400">{totalStudents}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Активных</p>
                <p className="text-2xl font-bold text-green-400">{activeStudents}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <GraduationCap className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ср. прогресс</p>
                <p className="text-2xl font-bold text-purple-400">{avgProgress}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего конфет</p>
                <p className="text-2xl font-bold text-yellow-400">{totalCandies}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Вкладки */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="students">Ученики</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="space-y-4">
            {/* Поиск */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по токену или нику..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Список студентов */}
            {filteredStudents.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  {students.length === 0 
                    ? 'Пока нет зарегистрированных учеников'
                    : 'Ничего не найдено'
                  }
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredStudents.map((student) => {
                  const progress = getCourseProgress(student);
                  
                  return (
                    <Card 
                      key={student.token}
                      className="p-6 hover:border-primary/50 cursor-pointer transition-all"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-4xl">
                            {student.avatar || '😊'}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {student.nickname || 'Без имени'}
                              </h3>
                              <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {student.token}
                              </code>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="gap-1">
                                📊 {progress}%
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                🍬 {student.candies}
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                ✓ {student.lessonsCompleted.length} уроков
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                📝 {student.results.length} попыток
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Активность
                          </p>
                          <p className="text-sm">
                            {new Date(student.lastActive).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics">
            <TeacherAnalytics students={students} />
          </TabsContent>
        </Tabs>
        
        {/* Детальная карточка студента */}
        {selectedStudent && (
          <StudentCard
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </div>
    </div>
  );
};
