import React from 'react';
import { TileData, Player } from '../../types/game';
import { GROUP_COLORS, COLOR_GROUP_TILES } from '../../constants/boardData';
import { Coins, Home, User, ShieldAlert, Sparkles } from 'lucide-react';

interface TileTooltipProps {
  tile: TileData;
  owner?: Player;
  allPlayers: Player[];
  side: 'bottom' | 'top' | 'left' | 'right' | 'corner';
}

export const TileTooltip: React.FC<TileTooltipProps> = ({ tile, owner, allPlayers, side }) => {
  const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
  const houseCount = owner?.houses[tile.id] || 0;
  const isMortgaged = owner?.mortgaged[tile.id] || false;

  // Calculate current active rent for this tile if property/railroad/utility
  const calculateCurrentRent = (): number | null => {
    if (!tile.price || !owner || isMortgaged) return null;

    if (tile.type === 'property' && tile.rentTiers) {
      if (houseCount > 0) {
        return tile.rentTiers[houseCount];
      }
      // Check full color group monopoly (double rent)
      const base = tile.baseRent || 0;
      const groupTiles = COLOR_GROUP_TILES[tile.group] || [];
      const ownsAll = groupTiles.length > 0 && groupTiles.every(tId => owner.properties.includes(tId));
      return ownsAll ? base * 2 : base;
    }

    if (tile.type === 'railroad' && tile.rentTiers) {
      const ownedRailroads = (COLOR_GROUP_TILES['railroad'] || []).filter(tId => owner.properties.includes(tId)).length;
      return tile.rentTiers[Math.max(0, ownedRailroads - 1)] ?? tile.baseRent ?? 25;
    }

    if (tile.type === 'utility') {
      const ownedUtils = (COLOR_GROUP_TILES['utility'] || []).filter(tId => owner.properties.includes(tId)).length;
      return ownedUtils === 2 ? 70 : 28; // estimated rent based on average dice roll of 7
    }

    return null;
  };

  const currentRent = calculateCurrentRent();

  // Determine positioning class based on tile grid side
  const getPositionClass = () => {
    switch (side) {
      case 'bottom':
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
      case 'top':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'corner':
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div 
      className={`absolute ${getPositionClass()} z-50 pointer-events-none w-52 bg-slate-950/95 border-2 rounded-xl shadow-2xl backdrop-blur-md p-2.5 text-right select-none animate-fadeIn`}
      style={{
        borderColor: owner ? owner.color : groupStyle.main || '#f59e0b',
        boxShadow: `0 12px 30px rgba(0, 0, 0, 0.9), 0 0 15px ${owner ? owner.color : groupStyle.main}40`
      }}
    >
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{tile.flag || tile.icon}</span>
          <div>
            <h4 className="font-black text-white text-xs leading-tight">{tile.name}</h4>
            {tile.englishName && (
              <span className="text-[8.5px] text-slate-400 block font-mono leading-none">{tile.englishName}</span>
            )}
          </div>
        </div>
        <span 
          className="text-[8px] font-black px-1.5 py-0.5 rounded text-white shadow-sm"
          style={{ backgroundColor: groupStyle.main }}
        >
          {groupStyle.name}
        </span>
      </div>

      {/* Ownership & Rent Details */}
      <div className="space-y-1 text-[10px]">
        {/* Ownership Status */}
        {owner ? (
          <div className="flex items-center justify-between bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <User size={11} className="text-amber-400" />
              المالك:
            </span>
            <span className="font-bold flex items-center gap-1" style={{ color: owner.color }}>
              <span>{owner.avatar}</span>
              <span>{owner.name}</span>
            </span>
          </div>
        ) : tile.price ? (
          <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.8 rounded-lg text-emerald-300">
            <span className="flex items-center gap-1 font-bold">
              <Sparkles size={11} /> غير مملوك
            </span>
            <span className="font-mono font-black">{tile.price} $</span>
          </div>
        ) : (
          <div className="text-[9px] text-slate-400 italic">
            {tile.description || 'خانة خاصة'}
          </div>
        )}

        {/* Current Active Rent */}
        {currentRent !== null && (
          <div className="flex items-center justify-between bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <Coins size={11} className="text-emerald-400" />
              الإيجار الحالي:
            </span>
            <span className="font-mono font-black text-emerald-300 text-[11px]">
              {currentRent} $
            </span>
          </div>
        )}

        {/* Houses / Buildings Status */}
        {houseCount > 0 && (
          <div className="flex items-center justify-between bg-slate-900/90 px-2 py-0.8 rounded-lg border border-slate-800 text-[9.5px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Home size={11} className="text-amber-400" />
              المباني:
            </span>
            <span className="font-bold text-amber-300">
              {houseCount === 5 ? '🏨 فندق سياحي' : `🏠 ${houseCount} ${houseCount === 1 ? 'منزل' : houseCount === 2 ? 'منزلان' : 'منازل'}`}
            </span>
          </div>
        )}

        {/* Mortgaged Warning */}
        {isMortgaged && (
          <div className="flex items-center justify-center gap-1 bg-rose-950/80 border border-rose-500/50 text-rose-300 px-2 py-0.8 rounded-lg text-[9px] font-bold">
            <ShieldAlert size={11} />
            العقار مرهون (لا يدفع إيجار)
          </div>
        )}
      </div>
    </div>
  );
};
