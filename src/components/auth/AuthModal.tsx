import React, { useState } from 'react';
import { User, Mail, Sparkles, Dices, ShieldAlert, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GAME_TOKENS, AVATARS_LIST } from '../../constants/tokens';
import { PlayerTokenId } from '../../types/game';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const RANDOM_ARABIC_NAMES = [
  'الشيخ فهد',
  'سندباد الصفقات',
  'تاجر دبي',
  'الملك شهاب',
  'أميرة الشرق',
  'الهامور أبو طلال',
  'صقر الجزيرة',
  'ليلى المستثمرة',
  'سلطان العقارات',
  'فارس الرياض'
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginAsGuest, 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    isFirebaseCloudConfigured 
  } = useAuth();

  const [tab, setTab] = useState<'guest' | 'email' | 'register'>('guest');
  const [guestName, setGuestName] = useState('التاجر الصغير');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS_LIST[0].emoji);
  const [selectedToken, setSelectedToken] = useState<PlayerTokenId>('falcon');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRandomizeName = () => {
    const random = RANDOM_ARABIC_NAMES[Math.floor(Math.random() * RANDOM_ARABIC_NAMES.length)];
    setGuestName(random);
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('يرجى كتابة اسم اللاعب أو اختيار اسم عشوائي');
      return;
    }
    setErrorMsg('');
    await loginAsGuest(guestName, selectedAvatar, selectedToken);
    if (onClose) onClose();
  };

  const handleGoogleSubmit = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل تسجيل الدخول عبر Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('يرجى ملء جميع الحقول');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      if (tab === 'register') {
        if (!displayName) {
          setErrorMsg('يرجى إدخال الاسم المعروض');
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء المصادقة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-2 sm:p-4 animate-fadeIn">
      {/* Welcome Card Container */}
      <div className="glass-panel p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-4xl mb-3 shadow-inner">
            🎲
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-gold tracking-tight mb-1">
            مونوبولي العربية
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto font-medium">
            مرحباً بك! جهز شخصيتك وانطلق فوراً للمنافسة واحتكار المدن
          </p>
        </div>

        {/* Ergonomic Mode Tabs */}
        <div className="flex bg-slate-950/70 p-1.5 rounded-2xl mb-6 border border-slate-800 gap-1">
          <button
            type="button"
            onClick={() => { setTab('guest'); setErrorMsg(''); }}
            className={`tab-pill ${
              tab === 'guest'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>🏃‍♂️</span>
            <span>دخول سريع كزائر</span>
          </button>

          <button
            type="button"
            onClick={() => { setTab('email'); setErrorMsg(''); }}
            className={`tab-pill ${
              tab === 'email' || tab === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>✉️</span>
            <span>بريد إلكتروني / جوجل</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-950/70 border border-rose-500/50 text-rose-200 rounded-xl text-xs mb-5 flex items-center gap-2.5">
            <ShieldAlert size={18} className="text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* --- 1. Guest Mode Form --- */}
        {tab === 'guest' && (
          <form onSubmit={handleGuestSubmit} className="space-y-5">
            {/* Player Name with Quick Randomize */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">اسمك في اللعبة:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="اكتب اسمك..."
                  className="input-lux flex-1"
                  maxLength={20}
                  required
                />
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="btn btn-outline btn-sm px-3.5 shrink-0 flex items-center gap-1.5"
                  title="توليد اسم عشوائي"
                >
                  <Dices size={16} className="text-amber-400" />
                  <span>اسم عشوائي</span>
                </button>
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">اختر شخصيتك (الأفاتار):</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATARS_LIST.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.emoji)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedAvatar === av.emoji
                        ? 'bg-amber-500/25 border-amber-400 shadow-lg scale-110'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl">{av.emoji}</span>
                    <span className="text-[9px] font-bold text-slate-300 mt-1 line-clamp-1">{av.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Token Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">اختر قطعتك على الرقعة (Token):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GAME_TOKENS.map((tk) => (
                  <button
                    key={tk.id}
                    type="button"
                    onClick={() => setSelectedToken(tk.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedToken === tk.id
                        ? 'bg-amber-500/25 border-amber-400 shadow-md scale-[1.03]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{tk.emoji}</span>
                    <span className="text-xs font-bold text-slate-200">{tk.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-gold btn-lg w-full mt-3 shadow-xl">
              <Sparkles size={20} />
              <span>ابدأ اللعب الآن كزائر</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* --- 2. Email / Google Mode --- */}
        {(tab === 'email' || tab === 'register') && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">الاسم المعروض:</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="اسم اللاعب"
                  className="input-lux"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">البريد الإلكتروني:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="input-lux"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">كلمة المرور:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-lux"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-gold btn-lg w-full mt-2">
              {isLoading ? 'جاري المعالجة...' : tab === 'register' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </button>

            {/* Google Sign-in Alternative */}
            {isFirebaseCloudConfigured && (
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={isLoading}
                className="btn btn-outline w-full flex items-center justify-center gap-2.5 py-3"
              >
                <span className="text-xl">🌐</span>
                <span className="text-sm font-bold">المتابعة بحساب Google / Gmail</span>
              </button>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setTab(tab === 'email' ? 'register' : 'email');
                  setErrorMsg('');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
              >
                {tab === 'email' ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
