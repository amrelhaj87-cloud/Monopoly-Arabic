import React, { useState } from 'react';
import { X, LogIn, KeyRound } from 'lucide-react';
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="text-sky-400" size={22} />
            <h2 className="text-lg font-bold text-white">الانضمام إلى غرفة أصدقاء</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">كود الغرفة (6 خانات):</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="مثال: A7B92K"
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-center text-xl font-mono font-black text-amber-400 tracking-widest uppercase focus:border-amber-400 focus:outline-none"
              maxLength={8}
              autoFocus
              required
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 text-rose-300 rounded-lg text-xs text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              إلغاء
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-gold flex-1">
              <LogIn size={16} />
              {isLoading ? 'جاري التحقق...' : 'انضمام'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
