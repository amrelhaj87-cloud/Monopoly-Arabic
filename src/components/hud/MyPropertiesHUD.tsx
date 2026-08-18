import React from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { BOARD_TILES, GROUP_COLORS, COLOR_GROUP_TILES } from '../../constants/boardData';
import { Building2, Home, Lock, ChevronRight } from 'lucide-react';
import { TileData } from '../../types/game';

export const MyPropertiesHUD: React.FC = () => {
  const { gameState, myPlayer, setSelectedTileDetail } = useGame();
  const { user } = useAuth();

  if (!gameState || !myPlayer || myPlayer.isBankrupt) return null;

  const myPropertyIds = myPlayer.properties;
  const myProperties = myPropertyIds
    .map((id) => BOARD_TILES.find((t) => t.id === id))
    .filter((t): t is TileData => !!t);

  // Group properties by their color group
  const groupedProperties: Record<string, TileData[]> = {};
  myProperties.forEach((tile) => {
    if (!groupedProperties[tile.group]) {
      groupedProperties[tile.group] = [];
    }
    groupedProperties[tile.group].push(tile);
  });

  const totalValue = myProperties.reduce((sum, tile) => sum + (tile.price || 0), 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex flex-col w-full text-xs shadow-md select-none transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <Building2 size={14} className="text-amber-400" />
          <span>عقاراتي ({myProperties.length})</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold">
          قيمة: {totalValue} د.ع
        </span>
      </div>

      {/* Properties List / Empty State */}
      {myProperties.length === 0 ? (
        <div className="text-center py-3 text-slate-500 text-[11px] flex flex-col items-center gap-1">
          <span className="text-xl">🏜️</span>
          <span>لم تملك أي عقار بعد. ارمِ النرد وتملك الأراضي!</span>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
          {Object.entries(groupedProperties).map(([groupKey, tiles]) => {
            const groupInfo = GROUP_COLORS[groupKey] || GROUP_COLORS['special'];
            const allGroupTileIds = COLOR_GROUP_TILES[groupKey] || [];
            const ownsFullMonopoly =
              allGroupTileIds.length > 1 &&
              allGroupTileIds.every((id) => myPlayer.properties.includes(id));

            return (
              <div key={groupKey} className="space-y-1">
                {/* Group Set Header if has monopoly */}
                {ownsFullMonopoly && (
                  <div className="flex items-center justify-between text-[9.5px] px-1 text-amber-300 font-bold">
                    <span>✨ احتكار {groupInfo.name}</span>
                    <span>(إيجار مضاعف)</span>
                  </div>
                )}

                {tiles.map((tile) => {
                  const houses = myPlayer.houses[tile.id] || 0;
                  const isMortgaged = myPlayer.mortgaged[tile.id] || false;

                  return (
                    <div
                      key={tile.id}
                      onClick={() => setSelectedTileDetail(tile)}
                      className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900 cursor-pointer transition-all group"
                      style={{
                        borderRightWidth: '3px',
                        borderRightColor: groupInfo.main
                      }}
                      title="اضغط لعرض بطاقة العقار والإدارة"
                    >
                      {/* Right: Flag/Icon + Name */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs shrink-0">{tile.flag || tile.icon}</span>
                        <span className="text-slate-200 font-bold text-[11px] truncate group-hover:text-amber-300">
                          {tile.name}
                        </span>
                      </div>

                      {/* Left: Houses, Mortgage & Rent info */}
                      <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                        {isMortgaged ? (
                          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-600/50 font-bold flex items-center gap-0.5">
                            <Lock size={10} /> مرهون
                          </span>
                        ) : houses > 0 ? (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                            {houses === 5 ? '🏨 فندق' : `🏠 ${houses}`}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">
                            {tile.baseRent || 10} د.ع
                          </span>
                        )}
                        <ChevronRight size={12} className="text-slate-500 group-hover:text-slate-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
