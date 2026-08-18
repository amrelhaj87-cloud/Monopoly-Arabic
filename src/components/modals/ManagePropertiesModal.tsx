import React from 'react';
import { Home, Plus, Minus, Lock, Unlock, X, Sparkles, Building2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BOARD_TILES, GROUP_COLORS, COLOR_GROUP_TILES } from '../../constants/boardData';
import { GameEngine } from '../../services/gameEngine';

interface ManagePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagePropertiesModal: React.FC<ManagePropertiesModalProps> = ({ isOpen, onClose }) => {
  const { 
    gameState, 
    myPlayer, 
    buildHouseOnTile, 
    sellHouseOnTile, 
    mortgageTile, 
    unmortgageTile 
  } = useGame();

  if (!isOpen || !gameState || !myPlayer) return null;

  const myProperties = myPlayer.properties.map((id) => BOARD_TILES.find((t) => t.id === id)!).filter(Boolean);

  // Group owned properties by color set
  const groupOrder = ['brown', 'lightblue', 'pink', 'orange', 'red', 'yellow', 'green', 'darkblue', 'railroad', 'utility'];
  const groupedProperties: Record<string, typeof myProperties> = {};

  myProperties.forEach((tile) => {
    if (!groupedProperties[tile.group]) {
      groupedProperties[tile.group] = [];
    }
    groupedProperties[tile.group].push(tile);
  });

  const sortedGroups = groupOrder.filter(g => groupedProperties[g] && groupedProperties[g].length > 0);

  // Total Real Estate Wealth Calculation
  const totalPropertyCost = myProperties.reduce((sum, t) => sum + (t.price || 0), 0);
  const totalHousesCost = myProperties.reduce((sum, t) => sum + ((myPlayer.houses[t.id] || 0) * (t.houseCost || 0)), 0);
  const totalMortgagePower = myProperties.reduce((sum, t) => !myPlayer.mortgaged[t.id] ? sum + (t.mortgageValue || 0) : sum, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="text-amber-400" size={24} />
            <div>
              <h2 className="text-lg font-bold text-white">إدارة العقارات، البناء والرهن</h2>
              <span className="text-[11px] text-slate-400">تحكم بمنازلك، فنادقك، ورهن أراضيك لزيادة السيولة</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Player Financial Summary Card */}
        <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-900/90 rounded-xl border border-slate-700 mb-3 text-xs text-center">
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">السيولة النقدية:</span>
            <span className="text-sm font-black font-mono text-emerald-400">{myPlayer.cash} ر.س</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">قيمة الأراضي والمباني:</span>
            <span className="text-sm font-black font-mono text-amber-300">{totalPropertyCost + totalHousesCost} ر.س</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">سيولة الرهن المتاحة:</span>
            <span className="text-sm font-black font-mono text-rose-300">+{totalMortgagePower} ر.س</span>
          </div>
        </div>

        {/* Properties Grouped by Color Set */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {sortedGroups.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <span className="text-2xl block mb-2">🏙️</span>
              أنت لا تملك أي عقارات حتى الآن. هبط على المدن واشترِ أراضيها لتنشئ إمبراطوريتك!
            </div>
          ) : (
            sortedGroups.map((groupKey) => {
              const groupStyle = GROUP_COLORS[groupKey] || GROUP_COLORS['special'];
              const allInGroup = COLOR_GROUP_TILES[groupKey] || [];
              const ownedInGroup = groupedProperties[groupKey];
              const ownsFullGroup = allInGroup.length > 0 && allInGroup.every(id => myPlayer.properties.includes(id));
              const groupHouses = allInGroup.map(id => myPlayer.houses[id] || 0);
              const minHousesInGroup = Math.min(...groupHouses);
              const maxHousesInGroup = Math.max(...groupHouses);

              return (
                <div key={groupKey} className="bg-slate-900/60 rounded-xl border border-slate-700/80 overflow-hidden shadow-sm">
                  {/* Group Header Banner */}
                  <div 
                    className="px-3 py-2 flex items-center justify-between"
                    style={{
                      background: `linear-gradient(90deg, ${groupStyle.main}30 0%, rgba(15, 23, 42, 0.95) 100%)`,
                      borderBottom: `1.5px solid ${groupStyle.border}`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: groupStyle.main }} 
                      />
                      <span className="font-bold text-white text-xs sm:text-sm">
                        {groupStyle.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({ownedInGroup.length}/{allInGroup.length})
                      </span>
                    </div>

                    {ownsFullGroup ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/50">
                        <Sparkles size={11} className="text-amber-400" />
                        احتكار كامل (إيجار مضاعف) 🌟
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        متبقي {allInGroup.length - ownedInGroup.length} للاحتكار
                      </span>
                    )}
                  </div>

                  {/* Properties in Group */}
                  <div className="p-2 space-y-2 divide-y divide-slate-800">
                    {ownedInGroup.map((tile) => {
                      const houses = myPlayer.houses[tile.id] || 0;
                      const isMortgaged = myPlayer.mortgaged[tile.id] || false;
                      const unmortgageCost = tile.mortgageValue ? Math.floor(tile.mortgageValue * 1.1) : 0;
                      
                      // Even building rule checks
                      const canBuild = ownsFullGroup && 
                        tile.houseCost && 
                        myPlayer.cash >= tile.houseCost && 
                        houses < 5 && 
                        !isMortgaged && 
                        houses <= minHousesInGroup &&
                        allInGroup.every(id => !myPlayer.mortgaged[id]);

                      const canSell = houses > 0 && 
                        tile.houseCost && 
                        houses >= maxHousesInGroup;

                      const currentRent = GameEngine.calculateRent(tile, myPlayer, 7, gameState.players);

                      return (
                        <div key={tile.id} className="pt-2 first:pt-0 flex flex-wrap items-center justify-between gap-2 text-xs">
                          {/* Property Details */}
                          <div className="flex items-center gap-2">
                            <span className="text-base">{tile.flag || tile.icon || '📍'}</span>
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                                <span>{tile.name}</span>
                                {isMortgaged && (
                                  <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-600 font-bold">
                                    مرهون 🔒
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {isMortgaged 
                                  ? 'لا يوجد إيجار (مرهون)' 
                                  : `الإيجار الحالي: ${currentRent} ر.س • ${houses === 5 ? 'فندق 🏨' : `${houses} منازل 🏠`}`
                                }
                              </span>
                            </div>
                          </div>

                          {/* Actions: Build/Sell & Mortgage */}
                          <div className="flex items-center gap-1.5">
                            {/* Build / Sell Buttons (Street properties only) */}
                            {tile.type === 'property' && ownsFullGroup && (
                              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-700">
                                <button
                                  onClick={() => sellHouseOnTile(tile.id)}
                                  disabled={!canSell}
                                  className="p-1 text-rose-400 hover:bg-slate-800 rounded disabled:opacity-20 transition-all"
                                  title={canSell ? `بيع منزل (+${Math.floor(tile.houseCost! / 2)} ر.س)` : 'لا يمكن البيع (قاعدة التساوي أو لا توجد مباني)'}
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="px-1.5 font-black font-mono text-white text-xs">
                                  {houses === 5 ? '🏨' : houses}
                                </span>
                                <button
                                  onClick={() => buildHouseOnTile(tile.id)}
                                  disabled={!canBuild}
                                  className="p-1 text-emerald-400 hover:bg-slate-800 rounded disabled:opacity-20 transition-all"
                                  title={canBuild ? `بناء منزل (${tile.houseCost} ر.س)` : 'لا يمكن البناء (غير متساوٍ، مرهون، أو لا توجد سيولة)'}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            )}

                            {/* Mortgage / Unmortgage Button */}
                            {isMortgaged ? (
                              <button
                                onClick={() => unmortgageTile(tile.id)}
                                disabled={myPlayer.cash < unmortgageCost}
                                className="btn btn-emerald btn-sm text-[10px] py-1 px-2.5"
                                title={`فك الرهن ودفع ${unmortgageCost} ر.س (شامل 10% فائدة)`}
                              >
                                <Unlock size={11} />
                                فك الرهن ({unmortgageCost} ر.س)
                              </button>
                            ) : (
                              <button
                                onClick={() => mortgageTile(tile.id)}
                                disabled={houses > 0}
                                className="btn btn-outline btn-sm text-[10px] py-1 px-2 text-rose-300 hover:border-rose-500 disabled:opacity-30"
                                title={houses > 0 ? 'يجب بيع جميع مباني المجموعة أولاً' : `رهن العقار (+${tile.mortgageValue} ر.س)`}
                              >
                                <Lock size={11} />
                                رهن (+{tile.mortgageValue} ر.س)
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end">
          <button onClick={onClose} className="btn btn-gold btn-sm px-6">
            تم، إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
