import React, { useState } from 'react';
import { User, Mail, Sparkles, Dices, ShieldAlert, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PLAYER_DEFAULT_COLORS } from '../../constants/tokens';
import { PlayerBlob } from '../common/PlayerBlob';
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
  const [selectedColor, setSelectedColor] = useState(PLAYER_DEFAULT_COLORS[0]);

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
    await loginAsGuest(guestName, selectedColor, selectedColor as PlayerTokenId);
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

        {/* --- Quick Google / Gmail 1-Click Sign-In --- */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSubmit}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all border border-slate-200 cursor-pointer active:scale-[0.98]"
          >
            {/* Google Colorful 'G' Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول السريع عبر Google / Gmail'}</span>
          </button>
        </div>

        {/* Separator / Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-xs text-slate-400 font-bold">أو اختر طريقة أخرى</span>
          <div className="h-px bg-slate-800 flex-1" />
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
            <span>البريد وكلمة المرور</span>
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

            {/* Color Selector & Live Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 mb-2">اختر لونك المفضل:</label>
                <div className="flex flex-wrap gap-2">
                  {PLAYER_DEFAULT_COLORS.map((c) => {
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected
                            ? 'border-white ring-4 ring-amber-400/80 scale-110 shadow-lg'
                            : 'border-slate-800 hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      >
                        {isSelected && <Check size={14} className="text-white drop-shadow" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mini Preview Box */}
              <div className="glass-panel p-3 border border-amber-500/40 flex flex-col items-center justify-center text-center gap-1.5 bg-slate-950/60 rounded-2xl">
                <span className="text-[10px] text-amber-400 font-bold">شخصيتك</span>
                <PlayerBlob color={selectedColor} size="lg" />
                <span className="text-xs font-bold text-white truncate max-w-[100px]">
                  {guestName || 'اللاعب'}
                </span>
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

        {/* --- 2. Email Mode --- */}
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
