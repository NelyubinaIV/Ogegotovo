import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MISTAKES, MISTAKE_CATEGORIES } from '../../config/mistakes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, BookOpen } from 'lucide-react';
import { Mistake, MistakeCategory } from '../../types';

export function MistakeDictionary() {
  const [searchQuery, setSearchQuery] = useState('');

  const filterMistakes = (mistakes: Mistake[]) => {
    if (!searchQuery.trim()) return mistakes;
    
    const query = searchQuery.toLowerCase();
    return mistakes.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  };

  const getCategoryColor = (category: MistakeCategory) => {
    switch (category) {
      case 'ORTH':
        return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30';
      case 'PUNCT':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'GRAM':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'SPEECH':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'TEXT':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderMistakesByCategory = (category: MistakeCategory) => {
    const categoryMistakes = MISTAKES.filter((m) => m.category === category);
    const filteredMistakes = filterMistakes(categoryMistakes);

    if (filteredMistakes.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Ничего не найдено по запросу "{searchQuery}"
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {filteredMistakes.map((mistake) => (
          <Card key={mistake.id} className="p-4 hover:border-primary/50 transition-colors">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg">{mistake.name}</h3>
                <Badge className={getCategoryColor(mistake.category)} variant="outline">
                  {MISTAKE_CATEGORIES[mistake.category]}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">{mistake.description}</p>
              
              <div className="flex flex-wrap gap-1.5">
                {mistake.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Словарь типовых ошибок ОГЭ</h1>
              <p className="text-muted-foreground">
                Полный справочник по русскому языку • 40+ типов ошибок
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, описанию или тегам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 h-auto bg-muted/50 p-2">
            <TabsTrigger value="all" className="flex-1 min-w-[120px]">
              Все ({MISTAKES.length})
            </TabsTrigger>
            {Object.entries(MISTAKE_CATEGORIES).map(([key, label]) => {
              const count = MISTAKES.filter((m) => m.category === key).length;
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex-1 min-w-[120px]"
                >
                  {label} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {Object.entries(MISTAKE_CATEGORIES).map(([category, label]) => {
              const categoryMistakes = MISTAKES.filter(
                (m) => m.category === category
              );
              const filteredMistakes = filterMistakes(categoryMistakes);

              if (filteredMistakes.length === 0) return null;

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{label}</h2>
                    <Badge variant="outline" className={getCategoryColor(category as MistakeCategory)}>
                      {filteredMistakes.length}
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredMistakes.map((mistake) => (
                      <Card
                        key={mistake.id}
                        className="p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg">{mistake.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {mistake.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {mistake.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {Object.keys(MISTAKE_CATEGORIES).map((category) => (
            <TabsContent key={category} value={category}>
              {renderMistakesByCategory(category as MistakeCategory)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
