import { PlayerTokenId } from '../types/game';

export interface TokenItem {
  id: PlayerTokenId;
  name: string;
  emoji: string;
  color: string;
  description: string;
  svgIcon?: string;
}

export const GAME_TOKENS: TokenItem[] = [
  {
    id: 'car',
    name: 'سيارة فاخرة',
    emoji: '🏎️',
    color: '#e11d48', // Ruby Red
    description: 'السرعة والأناقة في مسار الرقعة'
  },
  {
    id: 'falcon',
    name: 'صقر جارح',
    emoji: '🦅',
    color: '#0284c7', // Sky Blue
    description: 'رؤية ثاقبة واستثمار دقيق'
  },
  {
    id: 'camel',
    name: 'جمل الصحراء',
    emoji: '🐪',
    color: '#d97706', // Amber / Gold
    description: 'الصبر والقدرة على الصمود المالي'
  },
  {
    id: 'dallah',
    name: 'دلة قهوة',
    emoji: '☕',
    color: '#84cc16', // Lime Emerald
    description: 'رمز الكرم والضيافة والتفاوض'
  },
  {
    id: 'dhow',
    name: 'سفينة شراعية',
    emoji: '⛵',
    color: '#8b5cf6', // Violet
    description: 'التجارة البحرية واكتشاف الفرص'
  },
  {
    id: 'ring',
    name: 'خاتم زمرد',
    emoji: '💍',
    color: '#10b981', // Emerald Green
    description: 'الفخامة والثراء والصفقات المربحة'
  },
  {
    id: 'castle',
    name: 'قلعة أثرية',
    emoji: '🏰',
    color: '#f97316', // Orange
    description: 'الحصانة والقوة العقارية الراسخة'
  },
  {
    id: 'crown',
    name: 'تاج ذهبي',
    emoji: '👑',
    color: '#eab308', // Pure Gold
    description: 'ملك الاحتكار والسيطرة على السوق'
  }
];

export const PLAYER_DEFAULT_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#64748b', // Slate
];

export const AVATARS_LIST = [
  { id: 'av_1', emoji: '👳‍♂️', name: 'الشيخ' },
  { id: 'av_2', emoji: '🧕', name: 'الأميرة' },
  { id: 'av_3', emoji: '🤵', name: 'رجل الأعمال' },
  { id: 'av_4', emoji: '👩‍💼', name: 'سيدة الأعمال' },
  { id: 'av_5', emoji: '🧑‍🚀', name: 'المغامر' },
  { id: 'av_6', emoji: '🕵️‍♂️', name: 'المستثمر الذكي' },
  { id: 'av_7', emoji: '🤴', name: 'الملك' },
  { id: 'av_8', emoji: '👑', name: 'الملكة' },
];
