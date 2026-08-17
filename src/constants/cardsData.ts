import { Card } from '../types/game';

export const CHANCE_CARDS: Card[] = [
  {
    id: 'ch_1',
    type: 'chance',
    title: 'رحلة إلى دبي',
    description: 'انطلق فوراً إلى دبي! إذا مررت بخانة البداية (انطلق) فاجمع 200.',
    icon: '✨',
    action: { type: 'move_to', tileId: 39 }
  },
  {
    id: 'ch_2',
    type: 'chance',
    title: 'تقدم إلى خانة انطلق',
    description: 'تقدم مباشرة إلى خانة (انطلق) واجمع 200.',
    icon: '🚀',
    action: { type: 'move_to', tileId: 0 }
  },
  {
    id: 'ch_3',
    type: 'chance',
    title: 'اذهب إلى السجن!',
    description: 'اذهب مباشرة إلى السجن! لا تمر على انطلق ولا تجمع 200.',
    icon: '👮‍♂️',
    action: { type: 'go_to_jail' }
  },
  {
    id: 'ch_4',
    type: 'chance',
    title: 'وثيقة عفو ملكي',
    description: 'بطاقة خروج من السجن مجاناً. احتفظ بها حتى تحتاجها أو بِعها للاعب آخر.',
    icon: '📜',
    action: { type: 'get_out_of_jail' }
  },
  {
    id: 'ch_5',
    type: 'chance',
    title: 'زيارة مكة المكرمة',
    description: 'توجه إلى مكة المكرمة لأداء العمرة. إذا مررت بخانة انطلق فاجمع 200.',
    icon: '🕋',
    action: { type: 'move_to', tileId: 34 }
  },
  {
    id: 'ch_6',
    type: 'chance',
    title: 'رحلة قطار سريعة',
    description: 'تقدم إلى أقرب محطة قطار. إذا كانت ملكاً للاعب آخر فادفع له ضعف الإيجار المعتاد.',
    icon: '🚄',
    action: { type: 'advance_to_nearest_railroad' }
  },
  {
    id: 'ch_7',
    type: 'chance',
    title: 'أرباح الأسهم والمضاربة',
    description: 'حققت محفظتك الاستثمارية عوائد قياسية في سوق الأسهم! البنك يدفع لك 150.',
    icon: '📈',
    action: { type: 'receive_cash', amount: 150 }
  },
  {
    id: 'ch_8',
    type: 'chance',
    title: 'مخالفة تجاوز السرعة',
    description: 'رصدتك كاميرا ساهر لتجاوز السرعة المحددة. ادفع غرامة 50 للبنك.',
    icon: '📸',
    action: { type: 'pay_cash', amount: 50 }
  },
  {
    id: 'ch_9',
    type: 'chance',
    title: 'صيانة وتجديد العقارات',
    description: 'قم بأعمال الصيانة الدورية الشاملة لعقاراتك: ادفع 25 عن كل منزل و 100 عن كل فندق تملكه.',
    icon: '🛠️',
    action: { type: 'repair_properties', houseCost: 25, hotelCost: 100 }
  },
  {
    id: 'ch_10',
    type: 'chance',
    title: 'تقدم إلى القاهرة',
    description: 'سافر في رحلة عمل إلى القاهرة. إذا مررت بخانة انطلق فاجمع 200.',
    icon: '🏰',
    action: { type: 'move_to', tileId: 14 }
  },
  {
    id: 'ch_11',
    type: 'chance',
    title: 'تراجع 3 خطوات',
    description: 'نسيت حقيبتك في المطار! تراجع 3 خطوات إلى الوراء.',
    icon: '🔙',
    action: { type: 'move_steps', steps: -3 }
  },
  {
    id: 'ch_12',
    type: 'chance',
    title: 'انتُخبت رئيساً لمجلس الإدارة',
    description: 'تهانينا! ادفع 50 لكل لاعب في اللعبة تقديراً لدعمهم لك.',
    icon: '👔',
    action: { type: 'pay_to_all', amount: 50 }
  },
  {
    id: 'ch_13',
    type: 'chance',
    title: 'فحص الخدمات العامة',
    description: 'تقدم إلى أقرب شركة خدمات عامة (الكهرباء أو المياه). إذا كانت مملوكة فارمِ النرد وادفع 10 أضعاف القيمة.',
    icon: '⚡',
    action: { type: 'advance_to_nearest_utility' }
  },
  {
    id: 'ch_14',
    type: 'chance',
    title: 'استرداد ضريبي',
    description: 'قام ديوان الضرائب بإرجاع مستحقات مالية فائضة لك. اجمع 100 من البنك.',
    icon: '💵',
    action: { type: 'receive_cash', amount: 100 }
  },
  {
    id: 'ch_15',
    type: 'chance',
    title: 'رحلة إلى بيروت',
    description: 'قضاء عطلة نهاية الأسبوع في بيروت. إذا مررت بخانة انطلق فاجمع 200.',
    icon: '🌲',
    action: { type: 'move_to', tileId: 6 }
  },
  {
    id: 'ch_16',
    type: 'chance',
    title: 'جائزة مسابقة الابتكار',
    description: 'فاز مشروعك التقني بالمركز الأول في مؤتمر التكنولوجيا العربي! اجمع 100 من البنك.',
    icon: '💡',
    action: { type: 'receive_cash', amount: 100 }
  }
];

export const COMMUNITY_CARDS: Card[] = [
  {
    id: 'cc_1',
    type: 'community',
    title: 'جائزة مزاين الإبل',
    description: 'فازت ناقتك بالمركز الأول في مهرجان الإبل والجمال! اجمع 200 من البنك.',
    icon: '🐪',
    action: { type: 'receive_cash', amount: 200 }
  },
  {
    id: 'cc_2',
    type: 'community',
    title: 'تقدم إلى خانة انطلق',
    description: 'تقدم مباشرة إلى خانة (انطلق) واجمع 200.',
    icon: '🚀',
    action: { type: 'move_to', tileId: 0 }
  },
  {
    id: 'cc_3',
    type: 'community',
    title: 'خطأ مصرفي في مصلحتك',
    description: 'حدث خطأ في النظام البنكي وتم إيداع مبلغ لحسابك. اجمع 100 من البنك.',
    icon: '🏦',
    action: { type: 'receive_cash', amount: 100 }
  },
  {
    id: 'cc_4',
    type: 'community',
    title: 'اذهب إلى السجن!',
    description: 'اذهب مباشرة إلى السجن! لا تمر على انطلق ولا تجمع 200.',
    icon: '🔒',
    action: { type: 'go_to_jail' }
  },
  {
    id: 'cc_5',
    type: 'community',
    title: 'وثيقة عفو رسمي',
    description: 'بطاقة خروج من السجن مجاناً. احتفظ بها حتى تحتاجها أو بِعها للاعب آخر.',
    icon: '📜',
    action: { type: 'get_out_of_jail' }
  },
  {
    id: 'cc_6',
    type: 'community',
    title: 'يوم ميلادك السعيد!',
    description: 'كل عام وأنت بخير! استلم عيدية وقدرها 10 من كل لاعب على الطاولة.',
    icon: '🎂',
    action: { type: 'collect_from_all', amount: 10 }
  },
  {
    id: 'cc_7',
    type: 'community',
    title: 'فواتير المستشفى الخاص',
    description: 'قمت بإجراء فحص طبي شامل في مستشفى تخصصي. ادفع 50 للبنك.',
    icon: '🏥',
    action: { type: 'pay_cash', amount: 50 }
  },
  {
    id: 'cc_8',
    type: 'community',
    title: 'أرباح تأجير العقارات',
    description: 'استلمت إيجاراتك الموسمية من الاستثمارات السياحية. اجمع 100 من البنك.',
    icon: '🏢',
    action: { type: 'receive_cash', amount: 100 }
  },
  {
    id: 'cc_9',
    type: 'community',
    title: 'أقساط المدارس والجامعة',
    description: 'سداد الرسوم الدراسية السنوية للأبناء. ادفع 50 للبنك.',
    icon: '🎓',
    action: { type: 'pay_cash', amount: 50 }
  },
  {
    id: 'cc_10',
    type: 'community',
    title: 'استشارة قانونية وهندسية',
    description: 'أتعاب الاستشارات وتوثيق العقود العقارية. ادفع 25 للبنك.',
    icon: '⚖️',
    action: { type: 'pay_cash', amount: 25 }
  },
  {
    id: 'cc_11',
    type: 'community',
    title: 'ترميم وإصلاحات الشوارع',
    description: 'مساهمة إلزامية في تحسين الواجهات المعمارية: ادفع 40 عن كل منزل و 115 عن كل فندق.',
    icon: '🏗️',
    action: { type: 'repair_properties', houseCost: 40, hotelCost: 115 }
  },
  {
    id: 'cc_12',
    type: 'community',
    title: 'المركز الثاني في مسابقة الشعر',
    description: 'فازت قصيدتك بالمركز الثاني في مسابقة أمير الشعراء! اجمع 50 من البنك.',
    icon: '🪶',
    action: { type: 'receive_cash', amount: 50 }
  },
  {
    id: 'cc_13',
    type: 'community',
    title: 'عوائد الصكوك الإسلامية',
    description: 'استحقاق دوري لصكوك التنمية الاستثمارية. اجمع 25 من البنك.',
    icon: '💰',
    action: { type: 'receive_cash', amount: 25 }
  },
  {
    id: 'cc_14',
    type: 'community',
    title: 'بيع محصول التمور الفاخر',
    description: 'حققت مزرعتك أفضل مبيعات في موسم حصاد تمور السكري والمجدول. اجمع 45 من البنك.',
    icon: '🌴',
    action: { type: 'receive_cash', amount: 45 }
  },
  {
    id: 'cc_15',
    type: 'community',
    title: 'تأمين السيارة السنوي',
    description: 'تجديد بوليصة التأمين الشامل للمركبة. ادفع 50 للبنك.',
    icon: '🚗',
    action: { type: 'pay_cash', amount: 50 }
  },
  {
    id: 'cc_16',
    type: 'community',
    title: 'ميراث عائلي غير متوقع',
    description: 'تم توزيع تركة عقارية واستلمت حصتك القانونية. اجمع 100 من البنك.',
    icon: '🗝️',
    action: { type: 'receive_cash', amount: 100 }
  }
];
