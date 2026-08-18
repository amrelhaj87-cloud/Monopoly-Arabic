import React from 'react';
import { ShoppingCart, Gavel, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BOARD_TILES, GROUP_COLORS } from '../../constants/boardData';

export const PropertyBuyModal: React.FC = () => {
  const { gameState, isMyTurn, myPlayer, buyCurrentProperty, declineCurrentProperty } = useGame();

  if (!gameState || gameState.phase !== 'tile_action' || gameState.pendingBuyTileId === null) {
    return null;
  }

  const tile = BOARD_TILES.find((t) => t.id === gameState.pendingBuyTileId);
  if (!tile || !tile.price) return null;

  const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
  const canAfford = myPlayer && myPlayer.cash >= tile.price;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp" style={{ maxWidth: '420px' }}>
        {/* Title Deed Card */}
        <div className="rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl mb-4">
          {/* Header Banner */}
          <div
            className="p-3 text-center text-white"
            style={{ backgroundColor: groupStyle.main, borderBottom: `3px solid ${groupStyle.border}` }}
          >
            <span className="text-xs uppercase tracking-widest font-bold block text-white/80">عقد ملكية عقار</span>
            <h3 className="text-xl font-black">{tile.name}</h3>
            {tile.englishName && <span className="text-[10px] text-white/70 font-en">{tile.englishName}</span>}
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span>سعر الشراء:</span>
              <span className="font-bold font-mono text-amber-400 text-sm">{tile.price} د.ع</span>
            </div>

            {tile.rentTiers && (
              <>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>الإيجار الأساسي (أرض فضاء):</span>
                  <span className="font-mono text-white">{tile.rentTiers[0]} د.ع</span>
                </div>
                <div className="flex justify-between py-0.5 text-slate-400">
                  <span>مع منزل واحد 🏠:</span>
                  <span className="font-mono">{tile.rentTiers[1]} د.ع</span>
                </div>
                <div className="flex justify-between py-0.5 text-slate-400">
                  <span>مع منزلين 🏠🏠:</span>
                  <span className="font-mono">{tile.rentTiers[2]} د.ع</span>
                </div>
                <div className="flex justify-between py-0.5 text-slate-400">
                  <span>مع 3 منازل 🏠🏠🏠:</span>
                  <span className="font-mono">{tile.rentTiers[3]} د.ع</span>
                </div>
                <div className="flex justify-between py-0.5 text-slate-400">
                  <span>مع 4 منازل 🏠🏠🏠🏠:</span>
                  <span className="font-mono">{tile.rentTiers[4]} د.ع</span>
                </div>
                <div className="flex justify-between py-1 border-t border-slate-800 text-emerald-400 font-bold">
                  <span>مع فندق فاخر 🏨:</span>
                  <span className="font-mono">{tile.rentTiers[5]} د.ع</span>
                </div>
              </>
            )}

            {tile.houseCost && (
              <div className="flex justify-between py-1 border-t border-slate-800 text-slate-400">
                <span>تكلفة بناء كل منزل:</span>
                <span className="font-mono text-white">{tile.houseCost} د.ع</span>
              </div>
            )}

            {tile.mortgageValue && (
              <div className="flex justify-between py-1 text-slate-400">
                <span>قيمة الرهن العقاري:</span>
                <span className="font-mono text-white">{tile.mortgageValue} د.ع</span>
              </div>
            )}
          </div>
        </div>

        {/* Player Action Buttons */}
        {isMyTurn ? (
          <div className="flex gap-2">
            <button
              onClick={buyCurrentProperty}
              disabled={!canAfford}
              className={`btn btn-gold flex-1 ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ShoppingCart size={16} />
              شراء العقار ({tile.price} د.ع)
            </button>
            <button onClick={declineCurrentProperty} className="btn btn-outline flex-1">
              <Gavel size={16} className="text-amber-400" />
              عرض في المزاد
            </button>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-amber-300 animate-pulse">
            في انتظار قرار اللاعب الحالي...
          </div>
        )}
      </div>
    </div>
  );
};
