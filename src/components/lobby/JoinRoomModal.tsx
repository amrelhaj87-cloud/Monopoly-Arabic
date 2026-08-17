import React, { useState } from 'react';
import { X, LogIn, KeyRound, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {
  const { joinRoom } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setErrorMsg('يرجى إدخال رمز الغرفة');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    try {
      await joinRoom(roomCode.trim());
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل الانضمام إلى الغرفة. تأكد من صحة الكود.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scaleUp" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <KeyRound size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">الانضمام إلى غرفة أصدقاء</h2>
              <span className="text-xs text-slate-400">أدخل كود الغرفة السداسي</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-2">كود الغرفة (6 خانات):</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="مثال: A7B92K"
              className="w-full bg-slate-950 border-2 border-slate-700 rounded-2xl px-4 py-3.5 text-center text-2xl font-mono font-black text-amber-400 tracking-widest uppercase focus:border-amber-400 focus:outline-none shadow-inner"
              maxLength={8}
              autoFocus
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/70 border border-rose-500/50 text-rose-300 rounded-xl text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              إلغاء
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-gold flex-1 shadow-lg">
              <LogIn size={18} />
              <span>{isLoading ? 'جاري التحقق...' : 'انضمام الآن'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
