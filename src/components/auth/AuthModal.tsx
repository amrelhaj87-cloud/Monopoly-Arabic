import React, { useState } from 'react';
import { User, Mail, Sparkles, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GAME_TOKENS, AVATARS_LIST } from '../../constants/tokens';
import { PlayerTokenId } from '../../types/game';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginAsGuest, 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    isFirebaseCloudConfigured 
  } = useAuth();

  const [tab, setTab] = useState<'guest' | 'email' | 'register'>('guest');
  const [guestName, setGuestName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS_LIST[0].emoji);
  const [selectedToken, setSelectedToken] = useState<PlayerTokenId>('falcon');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('يرجى إدخال اسم اللاعب');
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
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        {/* Header Icon */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-3xl mb-2 shadow-inner">
            🎲
          </div>
          <h2 className="text-2xl font-black font-gold">مونوبولي العربية</h2>
          <p className="text-xs text-slate-400 mt-1">اختر طريقة الدخول وابدأ رحلة الاحتكار والثراء!</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl mb-4 border border-slate-700">
          <button
            onClick={() => { setTab('guest'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'guest' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            دخول كزائر 🏃‍♂️
          </button>
          <button
            onClick={() => { setTab('email'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'email' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            بريد إلكتروني ✉️
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/50 text-rose-200 rounded-xl text-xs mb-4 flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* --- Guest Mode Tab --- */}
        {tab === 'guest' && (
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">اسمك في اللعبة</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="مثال: التاجر الصغير، أبو فهد، سندباد..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                maxLength={20}
                required
              />
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">اختر شخصيتك (الأفاتار)</label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS_LIST.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.emoji)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      selectedAvatar === av.emoji
                        ? 'bg-amber-500/20 border-amber-400 shadow-md scale-105'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{av.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Token Pawn Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">اختر قطعتك المفضلة (Token)</label>
              <div className="grid grid-cols-4 gap-2">
                {GAME_TOKENS.map((tk) => (
                  <button
                    key={tk.id}
                    type="button"
                    onClick={() => setSelectedToken(tk.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      selectedToken === tk.id
                        ? 'bg-amber-500/20 border-amber-400 shadow-md scale-105'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="text-2xl">{tk.emoji}</span>
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{tk.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-gold w-full btn-lg mt-2">
              <Sparkles size={18} />
              ابدأ اللعب كزائر فوراً
            </button>
          </form>
        )}

        {/* --- Email / Password Mode Tab --- */}
        {(tab === 'email' || tab === 'register') && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="اسم اللاعب"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-gold w-full mt-3">
              {isLoading ? 'جاري المعالجة...' : tab === 'register' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </button>

            {/* Google Sign-in Alternative */}
            {isFirebaseCloudConfigured && (
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={isLoading}
                className="btn btn-outline w-full mt-2 flex items-center justify-center gap-2"
              >
                <span>🌐</span>
                <span>المتابعة باستخدام Google / Gmail</span>
              </button>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setTab(tab === 'email' ? 'register' : 'email');
                  setErrorMsg('');
                }}
                className="text-xs text-amber-400 hover:underline"
              >
                {tab === 'email' ? 'ليس لديك حساب؟ أنشئ حساباً الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
