import { TileData } from '../types/game';

export const BOARD_TILES: TileData[] = [
  // 0: انطلق
  {
    id: 0,
    name: 'انطلق',
    englishName: 'GO',
    type: 'go',
    group: 'special',
    icon: '🚀',
    description: 'احصل على 200 عند المرور أو الهبوط هنا.'
  },
  // 1: صنعاء
  {
    id: 1,
    name: 'صنعاء',
    englishName: "Sana'a",
    type: 'property',
    group: 'brown',
    price: 60,
    baseRent: 2,
    rentTiers: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
    mortgageValue: 30,
    icon: '🏛️'
  },
  // 2: صندوق الحظ
  {
    id: 2,
    name: 'صندوق الحظ',
    englishName: 'Community Chest',
    type: 'community',
    group: 'special',
    icon: '🎁',
    description: 'اسحب بطاقة من صندوق الحظ.'
  },
  // 3: الخرطوم
  {
    id: 3,
    name: 'الخرطوم',
    englishName: 'Khartoum',
    type: 'property',
    group: 'brown',
    price: 60,
    baseRent: 4,
    rentTiers: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
    mortgageValue: 30,
    icon: '🌴'
  },
  // 4: ضريبة الدخل
  {
    id: 4,
    name: 'ضريبة الدخل',
    englishName: 'Income Tax',
    type: 'tax',
    group: 'special',
    taxAmount: 200,
    icon: '💰',
    description: 'ادفع ضريبة الدخل 200 للبنك.'
  },
  // 5: قطار الحرمين السريع
  {
    id: 5,
    name: 'قطار الحرمين',
    englishName: 'Haramain Train',
    type: 'railroad',
    group: 'railroad',
    price: 200,
    baseRent: 25,
    rentTiers: [25, 50, 100, 200, 200, 200],
    mortgageValue: 100,
    icon: '🚄'
  },
  // 6: بيروت
  {
    id: 6,
    name: 'بيروت',
    englishName: 'Beirut',
    type: 'property',
    group: 'light_blue',
    price: 100,
    baseRent: 6,
    rentTiers: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgageValue: 50,
    icon: '🌲'
  },
  // 7: فرصة
  {
    id: 7,
    name: 'فرصة',
    englishName: 'Chance',
    type: 'chance',
    group: 'special',
    icon: '❓',
    description: 'اسحب بطاقة فرصة.'
  },
  // 8: عمان
  {
    id: 8,
    name: 'عَمّان',
    englishName: 'Amman',
    type: 'property',
    group: 'light_blue',
    price: 100,
    baseRent: 6,
    rentTiers: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgageValue: 50,
    icon: '🏛️'
  },
  // 9: بغداد
  {
    id: 9,
    name: 'بغداد',
    englishName: 'Baghdad',
    type: 'property',
    group: 'light_blue',
    price: 120,
    baseRent: 8,
    rentTiers: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
    mortgageValue: 60,
    icon: '🕌'
  },
  // 10: السجن / زيارة عادية
  {
    id: 10,
    name: 'السجن / زيارة',
    englishName: 'Jail / Visiting',
    type: 'jail',
    group: 'special',
    icon: '🔒',
    description: 'إذا كنت في زيارة فلا بأس، وإلا فالزم السجن!'
  },
  // 11: الإسكندرية
  {
    id: 11,
    name: 'الإسكندرية',
    englishName: 'Alexandria',
    type: 'property',
    group: 'pink',
    price: 140,
    baseRent: 10,
    rentTiers: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70,
    icon: '🌊'
  },
  // 12: شركة الكهرباء
  {
    id: 12,
    name: 'شركة الكهرباء',
    englishName: 'Electric Company',
    type: 'utility',
    group: 'utility',
    price: 150,
    mortgageValue: 75,
    icon: '⚡',
    description: 'الإيجار: 4 أضعاف النرد (أو 10 أضعاف إذا ملكت الشركتين).'
  },
  // 13: الجيزة
  {
    id: 13,
    name: 'الجيزة',
    englishName: 'Giza',
    type: 'property',
    group: 'pink',
    price: 140,
    baseRent: 10,
    rentTiers: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70,
    icon: '🔺'
  },
  // 14: القاهرة
  {
    id: 14,
    name: 'القاهرة',
    englishName: 'Cairo',
    type: 'property',
    group: 'pink',
    price: 160,
    baseRent: 12,
    rentTiers: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
    mortgageValue: 80,
    icon: '🏰'
  },
  // 15: قطار المشاعر
  {
    id: 15,
    name: 'قطار المشاعر',
    englishName: 'Mashaer Train',
    type: 'railroad',
    group: 'railroad',
    price: 200,
    baseRent: 25,
    rentTiers: [25, 50, 100, 200, 200, 200],
    mortgageValue: 100,
    icon: '🚆'
  },
  // 16: تونس
  {
    id: 16,
    name: 'تونس',
    englishName: 'Tunis',
    type: 'property',
    group: 'orange',
    price: 180,
    baseRent: 14,
    rentTiers: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgageValue: 90,
    icon: '⛵'
  },
  // 17: صندوق الحظ
  {
    id: 17,
    name: 'صندوق الحظ',
    englishName: 'Community Chest',
    type: 'community',
    group: 'special',
    icon: '🎁',
    description: 'اسحب بطاقة من صندوق الحظ.'
  },
  // 18: الجزائر
  {
    id: 18,
    name: 'الجزائر',
    englishName: 'Algiers',
    type: 'property',
    group: 'orange',
    price: 180,
    baseRent: 14,
    rentTiers: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgageValue: 90,
    icon: '🕌'
  },
  // 19: الدار البيضاء
  {
    id: 19,
    name: 'الدار البيضاء',
    englishName: 'Casablanca',
    type: 'property',
    group: 'orange',
    price: 200,
    baseRent: 16,
    rentTiers: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
    mortgageValue: 100,
    icon: '🏬'
  },
  // 20: الموقف المجاني
  {
    id: 20,
    name: 'الموقف المجاني',
    englishName: 'Free Parking',
    type: 'free_parking',
    group: 'special',
    icon: '🅿️',
    description: 'استرح هنا مجاناً (أو اجمع حوض الضرائب المتراكم).'
  },
  // 21: مسقط
  {
    id: 21,
    name: 'مسقط',
    englishName: 'Muscat',
    type: 'property',
    group: 'red',
    price: 220,
    baseRent: 18,
    rentTiers: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgageValue: 110,
    icon: '🏰'
  },
  // 22: فرصة
  {
    id: 22,
    name: 'فرصة',
    englishName: 'Chance',
    type: 'chance',
    group: 'special',
    icon: '❓',
    description: 'اسحب بطاقة فرصة.'
  },
  // 23: المنامة
  {
    id: 23,
    name: 'المنامة',
    englishName: 'Manama',
    type: 'property',
    group: 'red',
    price: 220,
    baseRent: 18,
    rentTiers: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgageValue: 110,
    icon: '🏙️'
  },
  // 24: الكويت
  {
    id: 24,
    name: 'الكويت',
    englishName: 'Kuwait',
    type: 'property',
    group: 'red',
    price: 240,
    baseRent: 20,
    rentTiers: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
    mortgageValue: 120,
    icon: '🗼'
  },
  // 25: قطار الخليج
  {
    id: 25,
    name: 'قطار الخليج',
    englishName: 'Gulf Train',
    type: 'railroad',
    group: 'railroad',
    price: 200,
    baseRent: 25,
    rentTiers: [25, 50, 100, 200, 200, 200],
    mortgageValue: 100,
    icon: '🚆'
  },
  // 26: الدوحة
  {
    id: 26,
    name: 'الدوحة',
    englishName: 'Doha',
    type: 'property',
    group: 'yellow',
    price: 260,
    baseRent: 22,
    rentTiers: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgageValue: 130,
    icon: '🏆'
  },
  // 27: جدة
  {
    id: 27,
    name: 'جدة',
    englishName: 'Jeddah',
    type: 'property',
    group: 'yellow',
    price: 260,
    baseRent: 22,
    rentTiers: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgageValue: 130,
    icon: '🌊'
  },
  // 28: شركة تحلية المياه
  {
    id: 28,
    name: 'تحلية المياه',
    englishName: 'Water Works',
    type: 'utility',
    group: 'utility',
    price: 150,
    mortgageValue: 75,
    icon: '💧',
    description: 'الإيجار: 4 أضعاف النرد (أو 10 أضعاف إذا ملكت الشركتين).'
  },
  // 29: الرياض
  {
    id: 29,
    name: 'الرياض',
    englishName: 'Riyadh',
    type: 'property',
    group: 'yellow',
    price: 280,
    baseRent: 24,
    rentTiers: [24, 120, 360, 850, 1025, 1200],
    houseCost: 150,
    mortgageValue: 140,
    icon: '🌆'
  },
  // 30: اذهب إلى السجن
  {
    id: 30,
    name: 'اذهب للسجن!',
    englishName: 'Go to Jail',
    type: 'go_to_jail',
    group: 'special',
    icon: '👮‍♂️',
    description: 'اذهب مباشرة إلى السجن، ولا تمر على خانة انطلق ولا تجمع 200.'
  },
  // 31: القدس الشريف
  {
    id: 31,
    name: 'القدس الشريف',
    englishName: 'Jerusalem',
    type: 'property',
    group: 'green',
    price: 300,
    baseRent: 26,
    rentTiers: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150,
    icon: '🕌'
  },
  // 32: المدينة المنورة
  {
    id: 32,
    name: 'المدينة المنورة',
    englishName: 'Madinah',
    type: 'property',
    group: 'green',
    price: 300,
    baseRent: 26,
    rentTiers: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150,
    icon: '🌴'
  },
  // 33: صندوق الحظ
  {
    id: 33,
    name: 'صندوق الحظ',
    englishName: 'Community Chest',
    type: 'community',
    group: 'special',
    icon: '🎁',
    description: 'اسحب بطاقة من صندوق الحظ.'
  },
  // 34: مكة المكرمة
  {
    id: 34,
    name: 'مكة المكرمة',
    englishName: 'Makkah',
    type: 'property',
    group: 'green',
    price: 320,
    baseRent: 28,
    rentTiers: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    mortgageValue: 160,
    icon: '🕋'
  },
  // 35: قطار البراق السريع
  {
    id: 35,
    name: 'قطار البراق',
    englishName: 'Al Boraq Train',
    type: 'railroad',
    group: 'railroad',
    price: 200,
    baseRent: 25,
    rentTiers: [25, 50, 100, 200, 200, 200],
    mortgageValue: 100,
    icon: '🚅'
  },
  // 36: فرصة
  {
    id: 36,
    name: 'فرصة',
    englishName: 'Chance',
    type: 'chance',
    group: 'special',
    icon: '❓',
    description: 'اسحب بطاقة فرصة.'
  },
  // 37: أبوظبي
  {
    id: 37,
    name: 'أبوظبي',
    englishName: 'Abu Dhabi',
    type: 'property',
    group: 'dark_blue',
    price: 350,
    baseRent: 35,
    rentTiers: [35, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
    mortgageValue: 175,
    icon: '🏙️'
  },
  // 38: ضريبة الرفاهية
  {
    id: 38,
    name: 'ضريبة الرفاهية',
    englishName: 'Luxury Tax',
    type: 'tax',
    group: 'special',
    taxAmount: 100,
    icon: '💎',
    description: 'ادفع ضريبة الرفاهية 100 للبنك.'
  },
  // 39: دبي
  {
    id: 39,
    name: 'دبي',
    englishName: 'Dubai',
    type: 'property',
    group: 'dark_blue',
    price: 400,
    baseRent: 50,
    rentTiers: [50, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
    mortgageValue: 200,
    icon: '✨'
  }
];

export const GROUP_COLORS: Record<string, { main: string; light: string; border: string; name: string }> = {
  brown: { main: '#78350f', light: '#92400e', border: '#b45309', name: 'المجموعة البنية' },
  light_blue: { main: '#0284c7', light: '#38bdf8', border: '#7dd3fc', name: 'المجموعة السماوية' },
  pink: { main: '#db2777', light: '#f472b6', border: '#fbcfe8', name: 'المجموعة الوردية' },
  orange: { main: '#ea580c', light: '#fb923c', border: '#fed7aa', name: 'المجموعة البرتقالية' },
  red: { main: '#dc2626', light: '#f87171', border: '#fecaca', name: 'المجموعة الحمراء' },
  yellow: { main: '#eab308', light: '#fde047', border: '#fef08a', name: 'المجموعة الصفراء' },
  green: { main: '#16a34a', light: '#4ade80', border: '#bbf7d0', name: 'المجموعة الخضراء' },
  dark_blue: { main: '#1d4ed8', light: '#3b82f6', border: '#93c5fd', name: 'المجموعة الزرقاء الملكية' },
  railroad: { main: '#334155', light: '#64748b', border: '#94a3b8', name: 'محطات القطار' },
  utility: { main: '#ca8a04', light: '#facc15', border: '#fef08a', name: 'الخدمات العامة' },
  special: { main: '#0f172a', light: '#1e293b', border: '#334155', name: 'خانات خاصة' }
};

export const COLOR_GROUP_TILES: Record<string, number[]> = {
  brown: [1, 3],
  light_blue: [6, 8, 9],
  pink: [11, 13, 14],
  orange: [16, 18, 19],
  red: [21, 23, 24],
  yellow: [26, 27, 29],
  green: [31, 32, 34],
  dark_blue: [37, 39],
  railroad: [5, 15, 25, 35],
  utility: [12, 28]
};
