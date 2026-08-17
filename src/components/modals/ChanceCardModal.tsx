import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const ChanceCardModal: React.FC = () => {
  const { gameState, isMyTurn, executeActiveCardAction } = useGame();

  if (!gameState || gameState.phase !== 'tile_action' || !gameState.activeCard) {
    return null;
  }

  const card = gameState.activeCard;
  const isChance = card.type === 'chance';

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp" style={{ maxWidth: '400px' }}>
        {/* Card Graphic */}
        <div
          className={`p-6 rounded-2xl text-center border-2 shadow-2xl relative overflow-hidden ${
            isChance
              ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border-amber-500'
              : 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-500'
          }`}
        >
          {/* Header Label */}
          <span
            className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border mb-3 inline-block ${
              isChance
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isChance ? '❓ بطاقة فرصة' : '🎁 صندوق الحظ'}
          </span>

          {/* Card Icon */}
          <div className="text-5xl my-3">{card.icon}</div>

          {/* Title */}
          <h3 className="text-xl font-extrabold text-white mb-2">{card.title}</h3>

          {/* Description */}
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {card.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            onClick={executeActiveCardAction}
            className={`btn w-full btn-lg ${isChance ? 'btn-gold' : 'btn-emerald'}`}
          >
            <Check size={18} />
            تنفيذ الأمر ومتابعة اللعب
          </button>
        </div>
      </div>
    </div>
  );
};
