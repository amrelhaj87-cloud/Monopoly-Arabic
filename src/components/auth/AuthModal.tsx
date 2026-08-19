import React, { useState } from 'react';
import { Mail, Sparkles, Dices, ShieldAlert, Check, ArrowRight, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PLAYER_DEFAULT_COLORS } from '../../constants/tokens';
import { PlayerBlob } from '../common/PlayerBlob';
import { PlayerTokenId } from '../../types/game';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

type AuthMode = 'select' | 'guest_customizer' | 'email_login' | 'email_register';

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
    registerWithEmail 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('select');
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
      if (mode === 'email_register') {
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
    <div className="w-full max-w-lg mx-auto p-3 sm:p-4 animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden bg-slate-950/95">
        {/* Glow Header Accent */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 text-4xl mb-3 shadow-inner">
            🎲
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-gold tracking-tight mb-1">
            مونوبولي العربية
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto font-medium">
            لعبة التجارة والاستثمار العقاري الأولى
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl text-xs mb-5 flex items-center gap-2.5 shadow-lg">
            <ShieldAlert size={18} className="text-rose-400 shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
        )}

        {/* =========================================================================
            SCREEN 1: THE 3 MAIN CHOICES
            1. Google / Gmail
            2. Email & Password
            3. Guest Mode (Last)
           ========================================================================= */}
        {mode === 'select' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="text-center mb-4">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                اختر طريقة الدخول للبدء
              </span>
            </div>

            {/* BUTTON 1: GOOGLE / GMAIL */}
            <button
              type="button"
              onClick={handleGoogleSubmit}
              disabled={isLoading}
              className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center gap-3.5 shadow-xl hover:shadow-2xl transition-all border-2 border-white cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLoading ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول عبر Google / Gmail'}</span>
            </button>

            {/* BUTTON 2: EMAIL / PASSWORD */}
            <button
              type="button"
              onClick={() => { setMode('email_login'); setErrorMsg(''); }}
              className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base flex items-center justify-between border-2 border-slate-700 hover:border-amber-500/60 shadow-lg transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Mail size={18} />
                </div>
                <span>تسجيل الدخول بالبريد وكلمة المرور</span>
              </div>
              <ArrowLeft size={18} className="text-slate-400" />
            </button>

            {/* BUTTON 3: GUEST MODE (LAST) */}
            <button
              type="button"
              onClick={() => { setMode('guest_customizer'); setErrorMsg(''); }}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base flex items-center justify-between shadow-xl transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center text-xl">
                  🏃‍♂️
                </div>
                <span>الدخول السريع كزائر</span>
              </div>
              <ArrowLeft size={20} className="text-slate-950" />
            </button>
          </div>
        )}

        {/* =========================================================================
            SCREEN 2: GUEST CUSTOMIZER (Spacious & Clean)
           ========================================================================= */}
        {mode === 'guest_customizer' && (
          <form onSubmit={handleGuestSubmit} className="space-y-5 animate-fadeIn">
            {/* Sub-Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-base font-black text-amber-400 flex items-center gap-2">
                <span className="text-xl">🏃‍♂️</span> إعداد شخصية الزائر
              </span>
              <button
                type="button"
                onClick={() => setMode('select')}
                className="btn btn-outline btn-sm px-3 py-1 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>رجوع</span>
                <ArrowLeft size={14} />
              </button>
            </div>

            {/* Player Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">اسمك في اللعبة:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="اكتب اسمك..."
                  className="input-lux flex-1 text-base font-bold"
                  maxLength={20}
                  required
                />
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="btn btn-outline btn-sm px-3 shrink-0 flex items-center gap-1.5 bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-slate-800"
                  title="توليد اسم عشوائي"
                >
                  <Dices size={16} className="text-amber-400" />
                  <span className="text-xs font-bold">اسم عشوائي</span>
                </button>
              </div>
            </div>

            {/* Color Selector & Preview */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-5 justify-between">
              {/* Palette */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-bold text-slate-300 mb-2 text-center sm:text-right">
                  اختر لون شخصيتك:
                </label>
                <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                  {PLAYER_DEFAULT_COLORS.map((c) => {
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'border-white ring-4 ring-amber-400/80 scale-110 shadow-lg'
                            : 'border-slate-800 hover:scale-105 opacity-75 hover:opacity-100'
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

              {/* Preview Avatar Box */}
              <div className="glass-panel p-3.5 border-2 border-amber-500/40 flex flex-col items-center justify-center text-center gap-1.5 bg-slate-950 rounded-2xl min-w-[110px] shrink-0 shadow-inner">
                <span className="text-[10px] text-amber-400 font-bold">معاينة شخصيتك</span>
                <PlayerBlob color={selectedColor} size="lg" />
                <span className="text-xs font-black text-white truncate max-w-[100px] mt-0.5">
                  {guestName || 'اللاعب'}
                </span>
              </div>
            </div>

            {/* Start Game Button */}
            <button type="submit" className="btn btn-gold btn-lg w-full mt-2 shadow-2xl py-3.5 text-base font-black">
              <Sparkles size={20} />
              <span>ابدأ اللعب الآن كزائر</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* =========================================================================
            SCREEN 3: EMAIL & PASSWORD LOGIN / REGISTER
           ========================================================================= */}
        {(mode === 'email_login' || mode === 'email_register') && (
          <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fadeIn">
            {/* Sub-Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-base font-black text-amber-400 flex items-center gap-2">
                <Mail size={18} />
                <span>{mode === 'email_register' ? 'إنشاء حساب جديد بالبريد' : 'تسجيل الدخول بالبريد'}</span>
              </span>
              <button
                type="button"
                onClick={() => setMode('select')}
                className="btn btn-outline btn-sm px-3 py-1 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>رجوع</span>
                <ArrowLeft size={14} />
              </button>
            </div>

            {mode === 'email_register' && (
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">الاسم المعروض:</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="اسمك في اللعبة..."
                  className="input-lux font-bold"
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
                className="input-lux font-bold"
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
                className="input-lux font-bold"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-gold btn-lg w-full mt-2 shadow-xl font-black">
              {isLoading ? 'جاري المعالجة...' : mode === 'email_register' ? 'إنشاء الحساب والبدء' : 'تسجيل الدخول والبدء'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'email_login' ? 'email_register' : 'email_login');
                  setErrorMsg('');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
              >
                {mode === 'email_login' ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
