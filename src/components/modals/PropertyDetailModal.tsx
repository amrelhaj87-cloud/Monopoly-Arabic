import React from 'react';
import { X, Building2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GROUP_COLORS } from '../../constants/boardData';

export const PropertyDetailModal: React.FC = () => {
  const { selectedTileDetail, setSelectedTileDetail, gameState } = useGame();

  if (!selectedTileDetail) return null;

  const tile = selectedTileDetail;
  const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
  const owner = gameState?.players.find((p) => p.properties.includes(tile.id));

  return (
    <div className="modal-overlay" onClick={() => setSelectedTileDetail(null)}>
      <div className="modal-content animate-scaleUp" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        {/* Title Deed Card */}
        <div className="rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl mb-4">
          {/* Header Banner */}
          <div
            className="p-3 text-center text-white relative"
            style={{ backgroundColor: groupStyle.main, borderBottom: `3px solid ${groupStyle.border}` }}
          >
            <button
              onClick={() => setSelectedTileDetail(null)}
              className="absolute top-2 left-2 p-1 text-white/80 hover:text-white"
            >
              <X size={18} />
            </button>
            <span className="text-[10px] uppercase tracking-widest font-bold block text-white/80">عقد ملكية عقار</span>
            <h3 className="text-xl font-black">{tile.name}</h3>
            {tile.englishName && <span className="text-[10px] text-white/70 font-en">{tile.englishName}</span>}
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-2 text-xs text-slate-300">
            {owner && (
              <div className="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700 mb-2">
                <span className="text-[11px] text-slate-400">المالك الحالي:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span>{owner.avatar}</span>
                  <span>{owner.name}</span>
                </span>
              </div>
            )}

            {tile.price && (
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>سعر الشراء:</span>
                <span className="font-bold font-mono text-amber-400 text-sm">{tile.price} ريال</span>
              </div>
            )}

            {tile.rentTiers && (
              <>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>الإيجار الأساسي:</span>
                  <span className="font-mono text-white">{tile.rentTiers[0]} ريال</span>
                </div>
                <div className="flex justify-between py-0.5 text-slate-400">
                  <span>مع منزل واحد 🏠:</span>
                  <span className="font-mono">{tile.rentTiers[1]} ريال</span>
                </div>
                <div className="flex justify-between py-0.5 text-slate-400">
                  <span>مع منزلين 🏠🏠:</span>
                  <span className="font-mono">{tile.rentTiers[2]} ريال</span>
                </div>
                <div className="flex justify-between py-0.5 text-slate-400">
                  <span>مع 3 منازل 🏠🏠🏠:</span>
                  <span className="font-mono">{tile.rentTiers[3]} ريال</span>
                </div>
                <div className="flex justify-between py-0.5 text-slate-400">
                  <span>مع 4 منازل 🏠🏠🏠🏠:</span>
                  <span className="font-mono">{tile.rentTiers[4]} ريال</span>
                </div>
                <div className="flex justify-between py-1 border-t border-slate-800 text-emerald-400 font-bold">
                  <span>مع فندق فاخر 🏨:</span>
                  <span className="font-mono">{tile.rentTiers[5]} ريال</span>
                </div>
              </>
            )}

            {tile.description && (
              <p className="p-2 bg-slate-800/60 rounded-lg text-slate-300 text-center italic">
                {tile.description}
              </p>
            )}

            {tile.houseCost && (
              <div className="flex justify-between py-1 border-t border-slate-800 text-slate-400">
                <span>تكلفة بناء كل منزل:</span>
                <span className="font-mono text-white">{tile.houseCost} ريال</span>
              </div>
            )}

            {tile.mortgageValue && (
              <div className="flex justify-between py-1 text-slate-400">
                <span>قيمة الرهن:</span>
                <span className="font-mono text-white">{tile.mortgageValue} ريال</span>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => setSelectedTileDetail(null)} className="btn btn-gold w-full btn-sm">
          إغلاق
        </button>
      </div>
    </div>
  );
};
