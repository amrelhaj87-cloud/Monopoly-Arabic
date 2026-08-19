import React, { useEffect, useState } from 'react';
import { Check, Sparkles, ArrowRight, DollarSign, ScrollText, Home, X, Clock, Play } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BOARD_TILES } from '../../constants/boardData';
import confetti from 'canvas-confetti';

export const ChanceCardModal: React.FC = () => {
  const { gameState, isMyTurn, currentPlayer, executeActiveCardAction, isMovingPawn } = useGame();
  const [timeLeft, setTimeLeft] = useState<number>(6);

  const isVisible = Boolean(
    gameState && gameState.phase === 'tile_action' && gameState.activeCard && !isMovingPawn
  );
  const card = isVisible ? gameState!.activeCard! : null;
  const action = card?.action;

  // ✅ HOOK 1: confetti effect — called unconditionally, guards internally
  useEffect(() => {
    if (!isVisible || !action) return;
    if (
      (action.type === 'receive_cash' && (action.amount || 0) >= 150) ||
      action.type === 'get_out_of_jail' ||
      action.type === 'collect_from_all'
    ) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  }, [card?.id, isVisible]);

  // ✅ HOOK 2: auto-countdown for bot turns — called unconditionally, guards internally
  useEffect(() => {
    if (!isVisible || !card) return;
    setTimeLeft(6);

    if (!isMyTurn) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            executeActiveCardAction();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [card?.id, isMyTurn, isVisible]);

  // ✅ Early return AFTER all hooks
  if (!isVisible || !card || !action) return null;

  const isChance = card.type === 'chance';
  const cardOwnerName = currentPlayer?.name || 'اللاعب';

  // Destination tile name if move_to
  const destinationTile = action.tileId !== undefined ? BOARD_TILES.find(t => t.id === action.tileId) : null;


  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp select-none p-0 overflow-hidden relative" style={{ maxWidth: '430px' }}>
        {/* Close / Skip (X) Button */}
        <button
          onClick={executeActiveCardAction}
          className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 shadow-md transition-colors cursor-pointer"
          title="إغلاق ومتابعة اللعب"
        >
          <X size={16} />
        </button>

        {/* Card Body Container */}
        <div
          className={`p-6 rounded-2xl text-center border-2 shadow-2xl relative overflow-hidden ${
            isChance
              ? 'bg-gradient-to-b from-amber-950/95 via-slate-900 to-slate-950 border-amber-500/70'
              : 'bg-gradient-to-b from-emerald-950/95 via-slate-900 to-slate-950 border-emerald-500/70'
          }`}
          style={{
            boxShadow: isChance 
              ? '0 20px 50px rgba(0,0,0,0.95), 0 0 35px rgba(245, 158, 11, 0.3)' 
              : '0 20px 50px rgba(0,0,0,0.95), 0 0 35px rgba(16, 185, 129, 0.3)'
          }}
        >
          {/* Header Type Badge */}
          <div className="flex justify-center mb-2.5">
            <span
              className={`text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border shadow-md inline-flex items-center gap-1.5 ${
                isChance
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}
            >
              <Sparkles size={13} />
              {isChance ? 'بطاقة الفرصة والحظ 🎴' : 'صندوق المجتمع والبركة 💼'}
            </span>
          </div>

          {/* Player Attribution */}
          <div className="text-[11px] text-slate-300 font-bold mb-1.5 flex items-center justify-center gap-1.5">
            <span>سحبها:</span>
            <span className="text-amber-300 font-black">{cardOwnerName}</span>
          </div>

          {/* Card Main Icon */}
          <div className="text-5xl my-2 filter drop-shadow-lg">
            {card.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-white mb-2 tracking-wide font-gold">
            {card.title}
          </h3>

          {/* Description Box */}
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 shadow-inner mb-3">
            {card.description}
          </p>

          {/* Action Impact Preview Pill */}
          <div className="flex justify-center mb-1">
            {action.type === 'receive_cash' && (
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow">
                <DollarSign size={13} />
                مكافأة نقدية: +{action.amount} د.ع
              </span>
            )}
            {action.type === 'pay_cash' && (
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/40 flex items-center gap-1 shadow">
                <DollarSign size={13} />
                دفع غرامة: -{action.amount} د.ع
              </span>
            )}
            {action.type === 'move_to' && destinationTile && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow">
                <ArrowRight size={13} />
                الوجهة: {destinationTile.name} ({destinationTile.flag || destinationTile.icon})
              </span>
            )}
            {action.type === 'move_steps' && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 shadow">
                حركة: {action.steps && action.steps > 0 ? `+${action.steps} خطوات` : `${action.steps} خطوات للخلف`}
              </span>
            )}
            {action.type === 'get_out_of_jail' && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow">
                <ScrollText size={13} />
                عفو ملكي جاهز للاستخدام
              </span>
            )}
            {action.type === 'repair_properties' && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/40 flex items-center gap-1 shadow">
                <Home size={12} />
                {action.houseCost} عن كل منزل • {action.hotelCost} عن كل فندق
              </span>
            )}
            {action.type === 'collect_from_all' && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow">
                تحصيل {action.amount} د.ع من جميع اللاعبين
              </span>
            )}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          {isMyTurn ? (
            <button
              onClick={executeActiveCardAction}
              className={`btn w-full btn-md font-black shadow-lg ${isChance ? 'btn-gold' : 'btn-emerald'}`}
            >
              <Check size={18} />
              تنفيذ الأمر ومتابعة اللعب
            </button>
          ) : (
            <div className="w-full flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock size={13} className="text-amber-400" />
                متابعة تلقائية خلال {timeLeft} ث
              </span>
              <button
                onClick={executeActiveCardAction}
                className="btn btn-gold btn-sm px-4 font-bold shadow flex items-center gap-1"
              >
                <Play size={13} />
                متابعة الآن
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
