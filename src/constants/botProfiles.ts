import { PlayerTokenId } from '../types/game';

export interface BotProfile {
  id: string;
  name: string;
  avatar: string;
  token: PlayerTokenId;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  personality: 'aggressive' | 'cautious' | 'balanced' | 'trader' | 'tycoon';
  quote: string;
}

export const BOT_PROFILES: BotProfile[] = [
  {
    id: 'bot_1',
    name: 'أبو فهد (الهامور)',
    avatar: '👳‍♂️',
    token: 'falcon',
    color: '#3b82f6',
    difficulty: 'hard',
    personality: 'tycoon',
    quote: 'السوق لا يرحم المترددين، العقار هو الابن البار!'
  },
  {
    id: 'bot_2',
    name: 'شهاب التاجر',
    avatar: '🤵',
    token: 'car',
    color: '#ef4444',
    difficulty: 'medium',
    personality: 'aggressive',
    quote: 'سأشتري كل شبر حتى لا تجد مكاناً تقف فيه!'
  },
  {
    id: 'bot_3',
    name: 'ليلى المستثمرة',
    avatar: '👩‍💼',
    token: 'ring',
    color: '#10b981',
    difficulty: 'hard',
    personality: 'trader',
    quote: 'صفقة رابحة للطرفين أفضل من حرب أسعار خاسرة.'
  },
  {
    id: 'bot_4',
    name: 'طارق الحذر',
    avatar: '🕵️‍♂️',
    token: 'camel',
    color: '#f59e0b',
    difficulty: 'easy',
    personality: 'cautious',
    quote: 'الاحتفاظ بالسيولة النقدية في وقت الأزمات هو الأمان.'
  },
  {
    id: 'bot_5',
    name: 'سارة الدبلوماسية',
    avatar: '🧕',
    token: 'dallah',
    color: '#8b5cf6',
    difficulty: 'medium',
    personality: 'balanced',
    quote: 'فنجان قهوة وحسن إدارة هو سر التوفيق.'
  },
  {
    id: 'bot_6',
    name: 'سلطان القلعة',
    avatar: '🤴',
    token: 'crown',
    color: '#ec4899',
    difficulty: 'hard',
    personality: 'tycoon',
    quote: 'لا أرضى إلا بالفنادق الفاخرة على شوارع مكة ودبي!'
  }
];
