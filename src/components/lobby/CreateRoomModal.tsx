import React, { useState } from 'react';
import { X, PlusCircle, Settings, Users, Clock, Coins, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameSettings } from '../../types/game';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const { createRoom } = useGame();

  const [startingCash, setStartingCash] = useState<number>(1500);
  const [maxPlayers, setMaxPlayers] = useState<number>(6);
  const [turnTimeSeconds, setTurnTimeSeconds] = useState<number>(45);
  const [enableAuctions, setEnableAuctions] = useState<boolean>(true);
  const [enableTrading, setEnableTrading] = useState<boolean>(true);
  const [freeParkingJackpot, setFreeParkingJackpot] = useState<boolean>(true);
  const [doubleCashOnGoLanding, setDoubleCashOnGoLanding] = useState<boolean>(false);
  const [quickMode, setQuickMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const settings: GameSettings = {
        startingCash,
        maxPlayers,
        turnTimeSeconds,
        enableAuctions,
        enableTrading,
        freeParkingJackpot,
        doubleCashOnGoLanding,
        quickMode
      };
      await createRoom(settings);
      onClose();
    } catch (err: any) {
      alert(err.message || 'فشل إنشاء الغرفة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="text-emerald-400" size={22} />
            <h2 className="text-lg font-bold text-white">إنشاء غرفة خاصة جديدة</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Max Players */}
          <div>
            <label className="block font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Users size={14} className="text-amber-400" /> الحد الأقصى للاعبين:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxPlayers(num)}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    maxPlayers === num
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {num} لاعبين
                </button>
              ))}
            </div>
          </div>

          {/* Starting Cash */}
          <div>
            <label className="block font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Coins size={14} className="text-emerald-400" /> رصيد البداية:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1500, 2000, 2500].map((cash) => (
                <button
                  key={cash}
                  type="button"
                  onClick={() => setStartingCash(cash)}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    startingCash === cash
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {cash} ريال
                </button>
              ))}
            </div>
          </div>

          {/* Turn Timer */}
          <div>
            <label className="block font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Clock size={14} className="text-sky-400" /> مهلة الدور:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '30 ثانية', val: 30 },
                { label: '45 ثانية', val: 45 },
                { label: '60 ثانية', val: 60 },
                { label: 'بدون وقت', val: 0 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setTurnTimeSeconds(opt.val)}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    turnTimeSeconds === opt.val
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer">
              <span className="text-slate-200 font-bold">تفعيل المزادات العلنية (Auctions)</span>
              <input
                type="checkbox"
                checked={enableAuctions}
                onChange={(e) => setEnableAuctions(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer">
              <span className="text-slate-200 font-bold">تفعيل التداول والمقايضة بين اللاعبين</span>
              <input
                type="checkbox"
                checked={enableTrading}
                onChange={(e) => setEnableTrading(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer">
              <span className="text-slate-200 font-bold">حوض ضرائب الموقف المجاني (Free Parking Jackpot)</span>
              <input
                type="checkbox"
                checked={freeParkingJackpot}
                onChange={(e) => setFreeParkingJackpot(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer">
              <span className="text-slate-200 font-bold">النمط السريع (عقاران عشوائيان لكل لاعب)</span>
              <input
                type="checkbox"
                checked={quickMode}
                onChange={(e) => setQuickMode(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-700">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              إلغاء
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-emerald flex-1">
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء الغرفة والدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
