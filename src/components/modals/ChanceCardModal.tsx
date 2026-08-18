import React, { useEffect } from 'react';
import { Check, Sparkles, AlertCircle, ArrowRight, DollarSign, ScrollText, Home } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BOARD_TILES } from '../../constants/boardData';
import confetti from 'canvas-confetti';

export const ChanceCardModal: React.FC = () => {
  const { gameState, isMyTurn, executeActiveCardAction, isMovingPawn } = useGame();

  if (!gameState || gameState.phase !== 'tile_action' || !gameState.activeCard || isMovingPawn) {
    return null;
  }

  const card = gameState.activeCard;
  const isChance = card.type === 'chance';
  const { action } = card;

  // Trigger celebration confetti for big reward cards or get out of jail cards
  useEffect(() => {
    if (
      (action.type === 'receive_cash' && (action.amount || 0) >= 150) || 
      action.type === 'get_out_of_jail' ||
      action.type === 'collect_from_all'
    ) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [card.id]);

  // Destination tile name if move_to
  const destinationTile = action.tileId !== undefined ? BOARD_TILES.find(t => t.id === action.tileId) : null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp select-none p-0 overflow-hidden" style={{ maxWidth: '420px' }}>
        {/* Card Body Container */}
        <div
          className={`p-6 rounded-2xl text-center border-2 shadow-2xl relative overflow-hidden ${
            isChance
              ? 'bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-950 border-amber-500/70'
              : 'bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-950 border-emerald-500/70'
          }`}
          style={{
            boxShadow: isChance 
              ? '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(245, 158, 11, 0.25)' 
              : '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(16, 185, 129, 0.25)'
          }}
        >
          {/* Header Type Badge */}
          <div className="flex justify-center mb-3">
            <span
              className={`text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border shadow-md inline-flex items-center gap-1.5 ${
                isChance
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}
            >
              <Sparkles size={12} />
              {isChance ? 'بطاقة الفرصة والحظ 🎴' : 'صندوق المجتمع والبركة 💼'}
            </span>
          </div>

          {/* Card Main Icon */}
          <div className="text-5xl my-2 filter drop-shadow-lg animate-bounce-gentle">
            {card.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-white mb-2 tracking-wide">
            {card.title}
          </h3>

          {/* Description Box */}
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 shadow-inner mb-3">
            {card.description}
          </p>

          {/* Action Impact Preview Pill */}
          <div className="flex justify-center mb-1">
            {action.type === 'receive_cash' && (
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <DollarSign size={13} />
                مكافأة نقدية: +{action.amount} ر.س
              </span>
            )}
            {action.type === 'pay_cash' && (
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <DollarSign size={13} />
                دفع غرامة: -{action.amount} ر.س
              </span>
            )}
            {action.type === 'move_to' && destinationTile && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <ArrowRight size={13} />
                الوجهة: {destinationTile.name} ({destinationTile.flag || destinationTile.icon})
              </span>
            )}
            {action.type === 'move_steps' && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                حركة: {action.steps && action.steps > 0 ? `+${action.steps} خطوات` : `${action.steps} خطوات للخلف`}
              </span>
            )}
            {action.type === 'get_out_of_jail' && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <ScrollText size={13} />
                عفو ملكي جاهز للاستخدام
              </span>
            )}
            {action.type === 'repair_properties' && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <Home size={12} />
                {action.houseCost} عن كل منزل • {action.hotelCost} عن كل فندق
              </span>
            )}
            {action.type === 'collect_from_all' && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                تحصيل {action.amount} ر.س من جميع اللاعبين
              </span>
            )}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-center">
          {isMyTurn ? (
            <button
              onClick={executeActiveCardAction}
              className={`btn w-full btn-md font-bold shadow-lg ${isChance ? 'btn-gold' : 'btn-emerald'}`}
            >
              <Check size={18} />
              تنفيذ الأمر ومتابعة اللعب
            </button>
          ) : (
            <div className="text-center py-1.5 text-xs text-amber-300/80 animate-pulse font-medium">
              في انتظار تنفيذ الأمر من اللاعب الحالي...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
