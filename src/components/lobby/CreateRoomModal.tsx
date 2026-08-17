import React, { useState } from 'react';
import { X, PlusCircle, Users, Clock, Coins, Sparkles, ArrowRight } from 'lucide-react';
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
      <div className="modal-content animate-scaleUp" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <PlusCircle size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">إنشاء غرفة خاصة جديدة</h2>
              <span className="text-xs text-slate-400">خصص إعدادات المباراة ودعوة أصدقائك</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Max Players */}
          <div>
            <label className="block font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <Users size={15} className="text-amber-400" /> الحد الأقصى للاعبين:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxPlayers(num)}
                  className={`py-2.5 rounded-xl font-bold border-2 transition-all cursor-pointer ${
                    maxPlayers === num
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black scale-105'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {num} لاعبين
                </button>
              ))}
            </div>
          </div>

          {/* Starting Cash */}
          <div>
            <label className="block font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <Coins size={15} className="text-emerald-400" /> رصيد البداية المالي:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1500, 2000, 2500].map((cash) => (
                <button
                  key={cash}
                  type="button"
                  onClick={() => setStartingCash(cash)}
                  className={`py-2.5 rounded-xl font-bold border-2 transition-all cursor-pointer ${
                    startingCash === cash
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black scale-105'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {cash} ريال
                </button>
              ))}
            </div>
          </div>

          {/* Turn Timer */}
          <div>
            <label className="block font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <Clock size={15} className="text-sky-400" /> مهلة الدور:
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
                  className={`py-2 rounded-xl font-bold border-2 transition-all cursor-pointer ${
                    turnTimeSeconds === opt.val
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <span className="text-slate-200 font-bold block text-xs">تفعيل المزادات العلنية (Auctions)</span>
                <span className="text-[10px] text-slate-400">مزايدة تلقائية عند رفض شراء أي عقار.</span>
              </div>
              <input
                type="checkbox"
                checked={enableAuctions}
                onChange={(e) => setEnableAuctions(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <span className="text-slate-200 font-bold block text-xs">تفعيل التداول والمقايضة بين اللاعبين</span>
                <span className="text-[10px] text-slate-400">إمكانية تبادل العقارات والأموال بين اللاعبين.</span>
              </div>
              <input
                type="checkbox"
                checked={enableTrading}
                onChange={(e) => setEnableTrading(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <span className="text-slate-200 font-bold block text-xs">حوض ضرائب الموقف المجاني (Free Parking)</span>
                <span className="text-[10px] text-slate-400">تجميع أموال الضرائب ليفوز بها من يهبط هناك.</span>
              </div>
              <input
                type="checkbox"
                checked={freeParkingJackpot}
                onChange={(e) => setFreeParkingJackpot(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-700">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              إلغاء
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-emerald flex-1 shadow-lg">
              <span>{isLoading ? 'جاري الإنشاء...' : 'إنشاء الغرفة والدخول'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
