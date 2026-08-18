import { TileData } from '../types/game';

export const BOARD_TILES: TileData[] = [
  // 0: انطلق (Corner)
  {
    id: 0,
    name: 'انطلق',
    englishName: 'GO',
    type: 'go',
    group: 'special',
    icon: '🚀',
    description: 'احصل على 200 ريال عند المرور أو الهبوط هنا.'
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
    flag: '🇾🇪',
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
    flag: '🇸🇩',
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
    description: 'ادفع ضريبة الدخل 200 ريال للبنك.'
  },
  // 5: قطار الحرمين
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
    flag: '🚄',
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
    flag: '🇱🇧',
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
  // 8: عمّان
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
    flag: '🇯🇴',
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
    flag: '🇮🇶',
    icon: '🕌'
  },
  // 10: الإسكندرية
  {
    id: 10,
    name: 'الإسكندرية',
    englishName: 'Alexandria',
    type: 'property',
    group: 'pink',
    price: 140,
    baseRent: 10,
    rentTiers: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70,
    flag: '🇪🇬',
    icon: '🌊'
  },
  // 11: شركة الكهرباء
  {
    id: 11,
    name: 'شركة الكهرباء',
    englishName: 'Electric Company',
    type: 'utility',
    group: 'utility',
    price: 150,
    mortgageValue: 75,
    flag: '⚡',
    icon: '⚡',
    description: 'الإيجار: 4 أضعاف النرد (أو 10 أضعاف إذا ملكت الشركتين).'
  },
  // 12: الجيزة
  {
    id: 12,
    name: 'الجيزة',
    englishName: 'Giza',
    type: 'property',
    group: 'pink',
    price: 140,
    baseRent: 10,
    rentTiers: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70,
    flag: '🇪🇬',
    icon: '🔺'
  },
  // 13: القاهرة
  {
    id: 13,
    name: 'القاهرة',
    englishName: 'Cairo',
    type: 'property',
    group: 'pink',
    price: 160,
    baseRent: 12,
    rentTiers: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
    mortgageValue: 80,
    flag: '🇪🇬',
    icon: '🏰'
  },
  // 14: السجن / زيارة (Corner)
  {
    id: 14,
    name: 'السجن / زيارة',
    englishName: 'Jail / Visiting',
    type: 'jail',
    group: 'special',
    icon: '🔒',
    description: 'إذا كنت في زيارة فلا بأس، وإلا فالزم السجن!'
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
    flag: '🚆',
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
    flag: '🇹🇳',
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
    flag: '🇩🇿',
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
    flag: '🇲🇦',
    icon: '🏙️'
  },
  // 20: موقف مجاني (Corner)
  {
    id: 20,
    name: 'الموقف المجاني',
    englishName: 'Free Parking',
    type: 'free_parking',
    group: 'special',
    icon: '🅿️',
    description: 'استرح هنا مجاناً واجمع حوض الغرامات إن وجد!'
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
    flag: '🇴🇲',
    icon: '⛵'
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
    flag: '🇧🇭',
    icon: '🏰'
  },
  // 24: الكويت
  {
    id: 24,
    name: 'الكويت',
    englishName: 'Kuwait City',
    type: 'property',
    group: 'red',
    price: 240,
    baseRent: 20,
    rentTiers: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
    mortgageValue: 120,
    flag: '🇰🇼',
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
    flag: '🚅',
    icon: '🚅'
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
    flag: '🇶🇦',
    icon: '🏟️'
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
    flag: '🇸🇦',
    icon: '🌊'
  },
  // 28: تحلية المياه
  {
    id: 28,
    name: 'تحلية المياه',
    englishName: 'Water Works',
    type: 'utility',
    group: 'utility',
    price: 150,
    mortgageValue: 75,
    flag: '💧',
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
    flag: '🇸🇦',
    icon: '🌴'
  },
  // 30: القدس
  {
    id: 30,
    name: 'القدس',
    englishName: 'Jerusalem',
    type: 'property',
    group: 'green',
    price: 300,
    baseRent: 26,
    rentTiers: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150,
    flag: '🇵🇸',
    icon: '🕌'
  },
  // 31: صندوق الحظ
  {
    id: 31,
    name: 'صندوق الحظ',
    englishName: 'Community Chest',
    type: 'community',
    group: 'special',
    icon: '🎁',
    description: 'اسحب بطاقة من صندوق الحظ.'
  },
  // 32: المدينة المنورة
  {
    id: 32,
    name: 'المدينة المنورة',
    englishName: 'Medina',
    type: 'property',
    group: 'green',
    price: 300,
    baseRent: 26,
    rentTiers: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150,
    flag: '🇸🇦',
    icon: '🕌'
  },
  // 33: مكة المكرمة
  {
    id: 33,
    name: 'مكة المكرمة',
    englishName: 'Mecca',
    type: 'property',
    group: 'green',
    price: 320,
    baseRent: 28,
    rentTiers: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    mortgageValue: 160,
    flag: '🇸🇦',
    icon: '🕋'
  },
  // 34: اذهب إلى السجن (Corner)
  {
    id: 34,
    name: 'اذهب إلى السجن',
    englishName: 'Go to Jail',
    type: 'go_to_jail',
    group: 'special',
    icon: '👮‍♂️',
    description: 'توجه مباشرة إلى السجن! لا تمر على انطلق ولا تأخذ 200.'
  },
  // 35: قطار البراق
  {
    id: 35,
    name: 'قطار البراق',
    englishName: 'Buraq Train',
    type: 'railroad',
    group: 'railroad',
    price: 200,
    baseRent: 25,
    rentTiers: [25, 50, 100, 200, 200, 200],
    mortgageValue: 100,
    flag: '🚅',
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
    flag: '🇦🇪',
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
    description: 'ادفع ضريبة الرفاهية 100 ريال للبنك.'
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
    flag: '🇦🇪',
    icon: '✨'
  }
];

export const GROUP_COLORS: Record<string, { main: string; light: string; border: string; name: string }> = {
  brown: { main: '#854d0e', light: '#a16207', border: '#ca8a04', name: 'المجموعة البنية' },
  light_blue: { main: '#0284c7', light: '#38bdf8', border: '#7dd3fc', name: 'المجموعة السماوية' },
  pink: { main: '#db2777', light: '#f472b6', border: '#fbcfe8', name: 'المجموعة الوردية' },
  orange: { main: '#ea580c', light: '#fb923c', border: '#fed7aa', name: 'المجموعة البرتقالية' },
  red: { main: '#dc2626', light: '#f87171', border: '#fecaca', name: 'المجموعة الحمراء' },
  yellow: { main: '#ca8a04', light: '#facc15', border: '#fef08a', name: 'المجموعة الصفراء' },
  green: { main: '#16a34a', light: '#4ade80', border: '#bbf7d0', name: 'المجموعة الخضراء' },
  dark_blue: { main: '#1d4ed8', light: '#3b82f6', border: '#93c5fd', name: 'المجموعة الزرقاء الملكية' },
  railroad: { main: '#475569', light: '#64748b', border: '#94a3b8', name: 'محطات القطار' },
  utility: { main: '#b45309', light: '#f59e0b', border: '#fde047', name: 'الخدمات العامة' },
  special: { main: '#0f172a', light: '#1e293b', border: '#334155', name: 'خانات خاصة' }
};

export const COLOR_GROUP_TILES: Record<string, number[]> = {
  brown: [1, 3],
  light_blue: [6, 8, 9],
  pink: [10, 12, 13],
  orange: [16, 18, 19],
  red: [21, 23, 24],
  yellow: [26, 27, 29],
  green: [30, 32, 33],
  dark_blue: [37, 39],
  railroad: [5, 15, 25, 35],
  utility: [11, 28]
};
