import React from 'react';
import { X, Building2, Home, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GROUP_COLORS } from '../../constants/boardData';
import { PlayerBlob } from '../common/PlayerBlob';

export const PropertyDetailModal: React.FC = () => {
  const { selectedTileDetail, setSelectedTileDetail, gameState, myPlayer } = useGame();

  if (!selectedTileDetail) return null;

  const tile = selectedTileDetail;
  const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
  const owner = gameState?.players.find((p) => p.properties.includes(tile.id));
  const isMine = myPlayer && owner?.id === myPlayer.id;
  const isMortgaged = owner?.mortgaged[tile.id] || false;
  const houseCount = owner?.houses[tile.id] || 0;

  return (
    <div className="modal-overlay" onClick={() => setSelectedTileDetail(null)}>
      <div
        className="modal-content animate-scaleUp select-none p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '430px',
          border: `2px solid ${groupStyle.border}`,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px ${groupStyle.main}40`
        }}
      >
        {/* =========================================================================
            HEADER DEED BANNER
           ========================================================================= */}
        <div
          className="p-4 text-center text-white relative flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(180deg, ${groupStyle.main} 0%, #0f172a 100%)`,
            borderBottom: `2px solid ${groupStyle.border}`
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedTileDetail(null)}
            className="absolute top-3 left-3 p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-all"
            title="إغلاق"
          >
            <X size={18} />
          </button>

          {/* Group / Country Tag */}
          <div className="flex items-center gap-2 mb-1">
            {tile.flag && <span className="text-xl">{tile.flag}</span>}
            <span
              className="text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-sm"
              style={{
                backgroundColor: `${groupStyle.main}60`,
                borderColor: groupStyle.border,
                color: '#ffffff'
              }}
            >
              {groupStyle.name}
            </span>
          </div>

          {/* Property Main Arabic Name */}
          <h2 className="text-2xl font-black tracking-wide text-white drop-shadow-md">
            {tile.name}
          </h2>

          {/* English Subtitle */}
          {tile.englishName && (
            <span className="text-[11px] text-slate-300 font-mono tracking-wider opacity-80 mt-0.5">
              {tile.englishName}
            </span>
          )}
        </div>

        {/* =========================================================================
            CARD BODY: RENT TIERS TABLE
           ========================================================================= */}
        <div className="p-4 space-y-3 bg-slate-950/90 text-slate-200">
          {/* Owner Status Pill */}
          {owner ? (
            <div
              className="flex items-center justify-between p-2.5 rounded-xl border"
              style={{
                backgroundColor: `${owner.color}18`,
                borderColor: owner.color
              }}
            >
              <div className="flex items-center gap-2.5">
                <PlayerBlob color={owner.color} size="sm" />
                <div>
                  <span className="text-[10px] text-slate-400 block">المالك الحالي:</span>
                  <span className="font-black text-sm text-white">
                    {owner.name} {isMine && '(أنت)'}
                  </span>
                </div>
              </div>

              {isMortgaged ? (
                <span className="bg-rose-900/90 text-rose-200 text-xs font-bold px-2 py-1 rounded border border-rose-500">
                  العقار مرهون 🔒
                </span>
              ) : houseCount > 0 ? (
                <span className="bg-emerald-950/80 text-emerald-300 text-xs font-bold px-2 py-1 rounded border border-emerald-500/50">
                  {houseCount === 5 ? 'فندق فاخر 🏨' : `${houseCount} منازل 🏠`}
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-bold">بدون مباني</span>
              )}
            </div>
          ) : tile.price ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400">حالة العقار:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={14} />
                متاح للشراء بالبنك
              </span>
            </div>
          ) : null}

          {/* Rent Breakdown Table for Street Properties */}
          {tile.type === 'property' && tile.rentTiers && (
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/80 text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 font-bold text-slate-400 text-[11px]">
                <span>الحالة (when)</span>
                <span>الإيجار المستحق (get)</span>
              </div>

              <div className="flex justify-between items-center px-3 py-1.5 text-slate-300">
                <span>الإيجار الأساسي</span>
                <span className="font-mono font-bold text-amber-300">{tile.rentTiers[0]} $</span>
              </div>

              <div className="flex justify-between items-center px-3 py-1.5 text-slate-300">
                <span className="flex items-center gap-1">مع منزل واحد 🏠</span>
                <span className="font-mono font-bold text-amber-300">{tile.rentTiers[1]} $</span>
              </div>

              <div className="flex justify-between items-center px-3 py-1.5 text-slate-300">
                <span className="flex items-center gap-1">مع منزلين 🏠🏠</span>
                <span className="font-mono font-bold text-amber-300">{tile.rentTiers[2]} $</span>
              </div>

              <div className="flex justify-between items-center px-3 py-1.5 text-slate-300">
                <span className="flex items-center gap-1">مع 3 منازل 🏠🏠🏠</span>
                <span className="font-mono font-bold text-amber-300">{tile.rentTiers[3]} $</span>
              </div>

              <div className="flex justify-between items-center px-3 py-1.5 text-slate-300">
                <span className="flex items-center gap-1">مع 4 منازل 🏠🏠🏠🏠</span>
                <span className="font-mono font-bold text-amber-300">{tile.rentTiers[4]} $</span>
              </div>

              <div className="flex justify-between items-center px-3 py-2 bg-emerald-950/30 text-emerald-300 font-bold">
                <span className="flex items-center gap-1">مع فندق فاخر 🏨</span>
                <span className="font-mono text-sm">{tile.rentTiers[5]} $</span>
              </div>
            </div>
          )}

          {/* Railroad Details */}
          {tile.type === 'railroad' && (
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/80 text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 font-bold text-slate-400 text-[11px]">
                <span>عدد المحطات المملوكة</span>
                <span>الإيجار المستحق</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 text-slate-300">
                <span>محطة واحدة</span>
                <span className="font-mono font-bold text-amber-300">25 $</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 text-slate-300">
                <span>محطتان</span>
                <span className="font-mono font-bold text-amber-300">50 $</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 text-slate-300">
                <span>3 محطات</span>
                <span className="font-mono font-bold text-amber-300">100 $</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-amber-950/30 text-amber-300 font-bold">
                <span>4 محطات (الكاملة)</span>
                <span className="font-mono text-sm">200 $</span>
              </div>
            </div>
          )}

          {/* Utility Details */}
          {tile.type === 'utility' && (
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>شركة واحدة مملوكة:</span>
                <span className="font-bold text-amber-300">4 × مجموع النرد 🎲</span>
              </div>
              <div className="flex justify-between items-center text-emerald-300 font-bold border-t border-slate-800 pt-1.5">
                <span>الشركتان معاً (مياه + كهرباء):</span>
                <span>10 × مجموع النرد 🎲</span>
              </div>
            </div>
          )}

          {/* Special Tile Description */}
          {tile.description && tile.type !== 'property' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center text-xs text-slate-300 leading-relaxed">
              <span className="text-xl block mb-1">{tile.icon}</span>
              {tile.description}
            </div>
          )}

          {/* =========================================================================
              BOTTOM FINANCIAL METRICS (Price, House Cost, Hotel, Mortgage)
             ========================================================================= */}
          {tile.price && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block">سعر الشراء</span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  {tile.price} $
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block">سعر المنزل 🏠</span>
                <span className="font-mono font-black text-slate-200 text-sm">
                  {tile.houseCost || '-'} {tile.houseCost ? '$' : ''}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block">سعر الفندق 🏨</span>
                <span className="font-mono font-black text-slate-200 text-sm">
                  {tile.houseCost || '-'} {tile.houseCost ? '$' : ''}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block">قيمة الرهن 🔒</span>
                <span className="font-mono font-black text-rose-300 text-sm">
                  {tile.mortgageValue || '-'} {tile.mortgageValue ? '$' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Dismiss button */}
          <button
            onClick={() => setSelectedTileDetail(null)}
            className="btn btn-gold w-full btn-sm mt-3"
          >
            إغلاق البطاقة ✖
          </button>
        </div>
      </div>
    </div>
  );
};
