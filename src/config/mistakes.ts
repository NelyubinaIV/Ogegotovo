import { Mistake } from '../types';

// Встроенный словарь ошибок ОГЭ по русскому языку
export const MISTAKES: Mistake[] = [
  // ОРФОГРАФИЯ
  { id: 'ORTH_PRE_PRI', category: 'ORTH', name: 'ПРЕ-/ПРИ-', description: 'Правописание приставок ПРЕ- и ПРИ-', tags: ['приставки', 'орфография'] },
  { id: 'ORTH_Z_S', category: 'ORTH', name: 'З/С на конце приставок', description: 'Приставки на З-/С-', tags: ['приставки', 'орфография'] },
  { id: 'ORTH_N_NN', category: 'ORTH', name: 'Н/НН', description: 'Н и НН в суффиксах', tags: ['суффиксы', 'орфография'] },
  { id: 'ORTH_NE_NI', category: 'ORTH', name: 'НЕ/НИ с разными частями речи', description: 'Правописание НЕ и НИ', tags: ['частицы', 'орфография'] },
  { id: 'ORTH_CONT_SEP_HYPH', category: 'ORTH', name: 'Слитно/раздельно/через дефис', description: 'Слитное, раздельное и дефисное написание', tags: ['дефис', 'орфография'] },
  { id: 'ORTH_POL_POLU', category: 'ORTH', name: 'ПОЛ-/ПОЛУ-', description: 'Правописание ПОЛ- и ПОЛУ-', tags: ['приставки', 'орфография'] },
  { id: 'ORTH_SOFT_HARD_SIGN', category: 'ORTH', name: 'Ь/Ъ', description: 'Мягкий и твёрдый знак', tags: ['знаки', 'орфография'] },
  { id: 'ORTH_ROOT_VOWELS', category: 'ORTH', name: 'Корни с чередованием', description: 'Чередующиеся гласные в корне', tags: ['корень', 'орфография'] },
  { id: 'ORTH_UNSTRESSED', category: 'ORTH', name: 'Безударные гласные', description: 'Проверяемые и непроверяемые безударные гласные', tags: ['корень', 'орфография'] },
  { id: 'ORTH_SUFFIXES', category: 'ORTH', name: 'Суффиксы глаголов/прилагательных', description: 'Правописание суффиксов', tags: ['суффиксы', 'орфография'] },
  { id: 'ORTH_ENDINGS', category: 'ORTH', name: 'Окончания', description: 'Правописание падежных и личных окончаний', tags: ['окончания', 'орфография'] },

  // ПУНКТУАЦИЯ
  { id: 'PUNCT_HOMOGENEOUS', category: 'PUNCT', name: 'Однородные члены', description: 'Запятые при однородных членах', tags: ['запятая', 'пунктуация'] },
  { id: 'PUNCT_APPEAL', category: 'PUNCT', name: 'Обращение', description: 'Выделение обращений', tags: ['запятая', 'пунктуация'] },
  { id: 'PUNCT_INTRO', category: 'PUNCT', name: 'Вводные слова', description: 'Выделение вводных конструкций', tags: ['запятая', 'пунктуация'] },
  { id: 'PUNCT_PARTICIPLE', category: 'PUNCT', name: 'Причастный оборот', description: 'Обособление причастного оборота', tags: ['запятая', 'обособление', 'пунктуация'] },
  { id: 'PUNCT_GERUND', category: 'PUNCT', name: 'Деепричастный оборот', description: 'Обособление деепричастного оборота', tags: ['запятая', 'обособление', 'пунктуация'] },
  { id: 'PUNCT_SSP', category: 'PUNCT', name: 'ССП', description: 'Запятая в сложносочинённом предложении', tags: ['запятая', 'ССП', 'пунктуация'] },
  { id: 'PUNCT_SPP', category: 'PUNCT', name: 'СПП', description: 'Запятая в сложноподчинённом предложении', tags: ['запятая', 'СПП', 'пунктуация'] },
  { id: 'PUNCT_BSP', category: 'PUNCT', name: 'БСП', description: 'Знаки в бессоюзном сложном предложении', tags: ['двоеточие', 'тире', 'БСП', 'пунктуация'] },
  { id: 'PUNCT_DASH_COLON', category: 'PUNCT', name: 'Тире/двоеточие', description: 'Тире и двоеточие в простом предложении', tags: ['тире', 'двоеточие', 'пунктуация'] },
  { id: 'PUNCT_COMPARISON', category: 'PUNCT', name: 'Сравнительные обороты', description: 'Выделение сравнительных оборотов', tags: ['запятая', 'обособление', 'пунктуация'] },

  // ГРАММАТИКА
  { id: 'GRAM_FOUNDATION', category: 'GRAM', name: 'Грамматическая основа', description: 'Определение подлежащего и сказуемого', tags: ['синтаксис', 'грамматика'] },
  { id: 'GRAM_ONE_PART', category: 'GRAM', name: 'Односоставные предложения', description: 'Типы односоставных предложений', tags: ['синтаксис', 'грамматика'] },
  { id: 'GRAM_PHRASE_LINK', category: 'GRAM', name: 'Типы связи в словосочетании', description: 'Согласование, управление, примыкание', tags: ['словосочетание', 'грамматика'] },
  { id: 'GRAM_PARTICIPLE_FORMS', category: 'GRAM', name: 'Образование причастий', description: 'Формы действительных и страдательных причастий', tags: ['морфология', 'грамматика'] },
  { id: 'GRAM_GERUND_FORMS', category: 'GRAM', name: 'Образование деепричастий', description: 'Деепричастия совершенного и несовершенного вида', tags: ['морфология', 'грамматика'] },
  { id: 'GRAM_AGREEMENT', category: 'GRAM', name: 'Согласование', description: 'Нарушение согласования подлежащего и сказуемого', tags: ['синтаксис', 'грамматика'] },
  { id: 'GRAM_CONTROL', category: 'GRAM', name: 'Управление', description: 'Нарушение управления в словосочетаниях', tags: ['синтаксис', 'грамматика'] },

  // РЕЧЕВЫЕ НОРМЫ
  { id: 'SPEECH_PLEONASM', category: 'SPEECH', name: 'Плеоназм/тавтология', description: 'Речевая избыточность', tags: ['речь', 'стилистика'] },
  { id: 'SPEECH_PARONYM', category: 'SPEECH', name: 'Паронимы', description: 'Смешение паронимов', tags: ['речь', 'лексика'] },
  { id: 'SPEECH_STYLE', category: 'SPEECH', name: 'Стилистические ошибки', description: 'Нарушение стилистического единства', tags: ['речь', 'стилистика'] },
  { id: 'SPEECH_LEX_NORM', category: 'SPEECH', name: 'Лексические нормы', description: 'Неправильное употребление слов', tags: ['речь', 'лексика'] },
  { id: 'SPEECH_GRAM_NORM', category: 'SPEECH', name: 'Грамматические нормы', description: 'Нарушение грамматических норм', tags: ['речь', 'грамматика'] },

  // РАБОТА С ТЕКСТОМ
  { id: 'TEXT_THEME_MAIN', category: 'TEXT', name: 'Тема и главная мысль', description: 'Определение темы и главной мысли текста', tags: ['текст', 'анализ'] },
  { id: 'TEXT_MICROTHEMES', category: 'TEXT', name: 'Микротемы', description: 'Выделение микротем в изложении', tags: ['текст', 'изложение'] },
  { id: 'TEXT_LINKS', category: 'TEXT', name: 'Средства связи', description: 'Средства связи предложений в тексте', tags: ['текст', 'связь'] },
  { id: 'TEXT_ARGUMENT', category: 'TEXT', name: 'Аргументация', description: 'Подбор и формулировка аргументов', tags: ['сочинение', 'аргументация'] },
  { id: 'TEXT_LOGIC', category: 'TEXT', name: 'Логика текста', description: 'Логические ошибки в сочинении', tags: ['сочинение', 'логика'] },
  { id: 'TEXT_QUOTE', category: 'TEXT', name: 'Цитирование', description: 'Правила оформления цитат', tags: ['сочинение', 'цитирование'] },
];

export const getMistakeById = (id: string): Mistake | undefined => {
  return MISTAKES.find(m => m.id === id);
};

export const getMistakesByCategory = (category: MistakeCategory): Mistake[] => {
  return MISTAKES.filter(m => m.category === category);
};

export const MISTAKE_CATEGORIES = {
  ORTH: 'Орфография',
  PUNCT: 'Пунктуация',
  GRAM: 'Грамматика',
  SPEECH: 'Речевые нормы',
  TEXT: 'Работа с текстом',
};
