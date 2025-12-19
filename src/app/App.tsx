import React, { useEffect, useState } from 'react';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { MistakeDictionary } from './components/MistakeDictionary';
import { StudentProgress } from '../types';
import {
  getTokenFromURL,
  saveStudentToken,
  getStudentToken,
  getStudentData,
  initStudentData,
  getTeacherKey,
  saveTeacherKey,
} from '../utils/storage';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Toaster } from './components/ui/sonner';
import { GraduationCap, LogIn, BookOpen, User, UserCog } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';

type ViewMode = 'home' | 'student' | 'teacher';

const TEACHER_SECRET_KEY = 'TEACHER-OGE-2025'; // Ключ учителя (можно изменить)

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [studentData, setStudentData] = useState<StudentProgress | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [teacherKeyInput, setTeacherKeyInput] = useState('');
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);
  
  useEffect(() => {
    // Проверяем URL на токен студента
    const urlToken = getTokenFromURL();
    if (urlToken) {
      saveStudentToken(urlToken);
      loadStudentData(urlToken);
      setViewMode('student');
      // Очищаем URL
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    
    // Проверяем URL на ключ учителя
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get('key');
    if (urlKey && urlKey === TEACHER_SECRET_KEY) {
      saveTeacherKey(urlKey);
      setViewMode('teacher');
      window.history.replaceState({}, '', '/teacher');
      return;
    }
    
    // Проверяем сохранённый токен студента
    const savedToken = getStudentToken();
    if (savedToken && window.location.pathname === '/student') {
      loadStudentData(savedToken);
      setViewMode('student');
      return;
    }
    
    // Проверяем сохранённый ключ учителя
    const savedKey = getTeacherKey();
    if (savedKey && savedKey === TEACHER_SECRET_KEY && window.location.pathname === '/teacher') {
      setViewMode('teacher');
      return;
    }
    
    setViewMode('home');
  }, []);
  
  const loadStudentData = (token: string) => {
    let data = getStudentData();
    if (!data || data.token !== token) {
      data = initStudentData(token);
    }
    setStudentData(data);
  };
  
  const handleStudentLogin = () => {
    if (!tokenInput.trim()) return;
    
    saveStudentToken(tokenInput);
    loadStudentData(tokenInput);
    setViewMode('student');
    setShowStudentLogin(false);
    window.history.pushState({}, '', '/student');
  };
  
  const handleTeacherLogin = () => {
    if (teacherKeyInput !== TEACHER_SECRET_KEY) {
      alert('Неверный ключ доступа');
      return;
    }
    
    saveTeacherKey(teacherKeyInput);
    setViewMode('teacher');
    setShowTeacherLogin(false);
    window.history.pushState({}, '', '/teacher');
  };
  
  const handleUpdate = () => {
    if (studentData) {
      const updated = getStudentData();
      if (updated) {
        setStudentData(updated);
      }
    }
    setUpdateTrigger(prev => prev + 1);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    setViewMode('home');
    setStudentData(null);
    window.history.pushState({}, '', '/');
  };
  
  const handleNavigateHome = () => {
    setViewMode('home');
    window.history.pushState({}, '', '/');
  };
  
  const handleNavigateStudent = () => {
    const savedToken = getStudentToken();
    if (savedToken) {
      loadStudentData(savedToken);
      setViewMode('student');
      window.history.pushState({}, '', '/student');
    } else {
      setShowStudentLogin(true);
    }
  };
  
  const handleNavigateTeacher = () => {
    const savedKey = getTeacherKey();
    if (savedKey && savedKey === TEACHER_SECRET_KEY) {
      setViewMode('teacher');
      window.history.pushState({}, '', '/teacher');
    } else {
      setShowTeacherLogin(true);
    }
  };

  // Навигационная шапка
  const renderHeader = () => (
    <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Портал ОГЭ</h1>
              <p className="text-xs text-muted-foreground">Русский язык • 2025</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={handleNavigateHome}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Словарь ошибок
            </Button>
            
            <Button
              variant={viewMode === 'student' ? 'default' : 'ghost'}
              size="sm"
              onClick={handleNavigateStudent}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Кабинет ученика
            </Button>
            
            <Button
              variant={viewMode === 'teacher' ? 'default' : 'ghost'}
              size="sm"
              onClick={handleNavigateTeacher}
              className="gap-2"
            >
              <UserCog className="h-4 w-4" />
              Кабинет учителя
            </Button>
            
            {(viewMode === 'student' || viewMode === 'teacher') && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Выход
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  if (viewMode === 'student' && studentData) {
    return (
      <>
        {renderHeader()}
        <StudentDashboard studentData={studentData} onUpdate={handleUpdate} />
        <Toaster />
      </>
    );
  }
  
  if (viewMode === 'teacher') {
    return (
      <>
        {renderHeader()}
        <TeacherDashboard />
        <Toaster />
      </>
    );
  }
  
  // Главная страница со словарём ошибок
  return (
    <>
      {renderHeader()}
      <MistakeDictionary />
      <Toaster />
      
      {/* Диалог входа ученика */}
      <Dialog open={showStudentLogin} onOpenChange={setShowStudentLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вход для ученика</DialogTitle>
            <DialogDescription>
              Введи токен, который дал учитель, или используй персональную ссылку
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Введи токен (например, ABCD-1234)"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleStudentLogin()}
            />
            <Button 
              onClick={handleStudentLogin}
              className="w-full gap-2"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              Войти как ученик
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Диалог входа учителя */}
      <Dialog open={showTeacherLogin} onOpenChange={setShowTeacherLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вход для учителя</DialogTitle>
            <DialogDescription>
              Введи ключ доступа к кабинету учителя
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="Ключ доступа"
              value={teacherKeyInput}
              onChange={(e) => setTeacherKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTeacherLogin()}
            />
            <Button 
              onClick={handleTeacherLogin}
              className="w-full gap-2"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              Войти как учитель
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;