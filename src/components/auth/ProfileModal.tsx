import React, { useState } from 'react';
import { X, Trophy, Coins, Award, LogOut, Check, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GAME_TOKENS, AVATARS_LIST } from '../../constants/tokens';
import { PlayerTokenId } from '../../types/game';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfileCustomization } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.photoURL || AVATARS_LIST[0].emoji);
  const [token, setToken] = useState<PlayerTokenId>(user?.selectedToken || 'falcon');

  if (!isOpen || !user) return null;

  const winRate = user.stats.gamesPlayed > 0 
    ? Math.round((user.stats.gamesWon / user.stats.gamesPlayed) * 100) 
    : 0;

  const handleSave = async () => {
    await updateProfileCustomization(name, avatar, token);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>👤</span> الملف الشخصي والإحصائيات
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 p-4 bg-slate-800/80 rounded-2xl border border-slate-700 mb-4">
          <div className="text-4xl w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-md">
            {avatar}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-amber-400 rounded-lg px-2.5 py-1 text-sm text-white font-bold"
              />
            ) : (
              <h3 className="text-base font-bold text-white">{user.displayName}</h3>
            )}
            <span className="text-xs text-amber-400 font-medium">
              {user.isGuest ? 'حساب زائر' : user.email || 'مستخدم مسجل'}
            </span>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="p-2 text-slate-300 hover:text-amber-400 bg-slate-700/60 rounded-xl"
            title={isEditing ? 'حفظ' : 'تعديل'}
          >
            {isEditing ? <Check size={18} className="text-emerald-400" /> : <Edit2 size={18} />}
          </button>
        </div>

        {/* Edit Customization if active */}
        {isEditing && (
          <div className="space-y-3 mb-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">اختر الأفاتار</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {AVATARS_LIST.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setAvatar(av.emoji)}
                    className={`text-2xl p-1.5 rounded-lg border shrink-0 ${
                      avatar === av.emoji ? 'bg-amber-500/30 border-amber-400' : 'border-transparent'
                    }`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">اختر الرمز المفضل</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {GAME_TOKENS.map((tk) => (
                  <button
                    key={tk.id}
                    onClick={() => setToken(tk.id)}
                    className={`text-2xl p-1.5 rounded-lg border shrink-0 ${
                      token === tk.id ? 'bg-amber-500/30 border-amber-400' : 'border-transparent'
                    }`}
                  >
                    {tk.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-center">
            <Trophy className="mx-auto text-amber-400 mb-1" size={20} />
            <span className="text-xl font-black text-white">{user.stats.gamesWon}</span>
            <span className="text-[11px] text-slate-400 block">مرات الفوز</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-center">
            <Coins className="mx-auto text-emerald-400 mb-1" size={20} />
            <span className="text-xl font-black text-white">{user.stats.highestNetWorth}</span>
            <span className="text-[11px] text-slate-400 block">أعلى ثروة مسجلة</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-center">
            <Award className="mx-auto text-sky-400 mb-1" size={20} />
            <span className="text-xl font-black text-white">{user.stats.gamesPlayed}</span>
            <span className="text-[11px] text-slate-400 block">المباريات الملعوبة</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-center">
            <span className="text-xl block mb-1">🎯</span>
            <span className="text-xl font-black text-white">{winRate}%</span>
            <span className="text-[11px] text-slate-400 block">نسبة الفوز</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button onClick={handleLogout} className="btn btn-ruby flex-1 btn-sm">
            <LogOut size={16} />
            تسجيل الخروج
          </button>
          <button onClick={onClose} className="btn btn-outline flex-1 btn-sm">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
