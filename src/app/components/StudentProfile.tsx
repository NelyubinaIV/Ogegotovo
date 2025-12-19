import React, { useState } from 'react';
import { StudentProgress } from '../../types';
import { updateStudentProfile } from '../../utils/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Copy, User } from 'lucide-react';

interface StudentProfileProps {
  studentData: StudentProgress;
  onClose: () => void;
  onUpdate: () => void;
}

const AVATARS = ['😊', '😎', '🤓', '🥳', '😺', '🦁', '🐼', '🦊', '🐨', '🦄', '🚀', '⭐', '🔥', '💎', '👑'];

export const StudentProfile: React.FC<StudentProfileProps> = ({ 
  studentData, 
  onClose, 
  onUpdate 
}) => {
  const [nickname, setNickname] = useState(studentData.nickname || '');
  const [selectedAvatar, setSelectedAvatar] = useState(studentData.avatar || '😊');
  
  const handleSave = () => {
    updateStudentProfile(nickname, selectedAvatar);
    toast.success('Профиль обновлён!');
    onUpdate();
    onClose();
  };
  
  const copyToken = () => {
    navigator.clipboard.writeText(studentData.token);
    toast.success('Токен скопирован в буфер обмена');
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Профиль ученика
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Токен */}
          <Card className="p-4 bg-muted/50">
            <Label className="text-sm text-muted-foreground">Личный токен</Label>
            <div className="flex items-center gap-2 mt-2">
              <code className="flex-1 bg-background px-3 py-2 rounded text-primary font-mono">
                {studentData.token}
              </code>
              <Button size="sm" variant="outline" onClick={copyToken}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Сохрани токен, чтобы входить с других устройств
            </p>
          </Card>
          
          {/* Никнейм */}
          <div className="space-y-2">
            <Label htmlFor="nickname">Никнейм</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Введи своё имя или ник..."
              maxLength={30}
            />
          </div>
          
          {/* Аватар */}
          <div className="space-y-3">
            <Label>Выбери аватар</Label>
            <div className="grid grid-cols-8 md:grid-cols-10 gap-2">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`text-3xl p-3 rounded-lg transition-all hover:scale-110 ${
                    selectedAvatar === emoji
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Статистика */}
          <div className="space-y-3">
            <Label>Статистика</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <p className="text-sm text-muted-foreground">Зарегистрирован</p>
                <p className="text-lg font-semibold">
                  {new Date(studentData.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </Card>
              <Card className="p-3">
                <p className="text-sm text-muted-foreground">Последняя активность</p>
                <p className="text-lg font-semibold">
                  {new Date(studentData.lastActive).toLocaleDateString('ru-RU')}
                </p>
              </Card>
              <Card className="p-3">
                <p className="text-sm text-muted-foreground">Попыток выполнения</p>
                <p className="text-lg font-semibold">{studentData.results.length}</p>
              </Card>
              <Card className="p-3">
                <p className="text-sm text-muted-foreground">Успешных попыток</p>
                <p className="text-lg font-semibold text-green-500">
                  {studentData.results.filter(r => r.passed).length}
                </p>
              </Card>
            </div>
          </div>
          
          {/* Кнопки */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
