import React from 'react';
import { Home, Plus, Minus, Lock, Unlock, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BOARD_TILES, GROUP_COLORS, COLOR_GROUP_TILES } from '../../constants/boardData';

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

  const myProperties = myPlayer.properties.map((id) => BOARD_TILES.find((t) => t.id === id)!);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <Home className="text-amber-400" size={22} />
            <h2 className="text-lg font-bold text-white">إدارة العقارات والبناء والرهن</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Player Cash Header */}
        <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-xl border border-slate-700 mb-4 text-xs">
          <span className="text-slate-300">السيولة النقدية المتاحة لديك:</span>
          <span className="text-base font-black font-mono text-amber-400">{myPlayer.cash} ريال</span>
        </div>

        {/* Properties List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {myProperties.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              أنت لا تملك أي عقارات حتى الآن. هبط على المدن واشترِ أراضيها لتبدأ البناء!
            </div>
          ) : (
            myProperties.map((tile) => {
              const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
              const groupTiles = COLOR_GROUP_TILES[tile.group] || [];
              const ownsFullGroup = groupTiles.length > 1 && groupTiles.every(id => myPlayer.properties.includes(id));
              const houses = myPlayer.houses[tile.id] || 0;
              const isMortgaged = myPlayer.mortgaged[tile.id] || false;
              const unmortgageCost = tile.mortgageValue ? Math.floor(tile.mortgageValue * 1.1) : 0;
              const canBuild = ownsFullGroup && tile.houseCost && myPlayer.cash >= tile.houseCost && houses < 5 && !isMortgaged;
              const canSell = houses > 0 && tile.houseCost;

              return (
                <div
                  key={tile.id}
                  className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  {/* Left: Tile Details & Banner */}
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-10 rounded-sm shrink-0"
                      style={{ backgroundColor: groupStyle.main }}
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        {tile.name}
                        {isMortgaged && (
                          <span className="text-[9px] bg-rose-900/80 text-rose-200 px-1 rounded border border-rose-600">
                            مرهون 🔒
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {tile.type === 'property' 
                          ? `${houses === 5 ? 'فندق فاخر 🏨' : `${houses} منازل 🏠`} • تكلفة المنزل: ${tile.houseCost} ر.س`
                          : tile.name
                        }
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    {/* Build / Sell Houses (Property Only) */}
                    {tile.type === 'property' && ownsFullGroup && (
                      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700">
                        <button
                          onClick={() => sellHouseOnTile(tile.id)}
                          disabled={!canSell}
                          className="p-1 text-rose-400 hover:bg-slate-800 rounded disabled:opacity-30"
                          title="بيع منزل"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-1.5 font-bold font-mono text-white text-xs">{houses}</span>
                        <button
                          onClick={() => buildHouseOnTile(tile.id)}
                          disabled={!canBuild}
                          className="p-1 text-emerald-400 hover:bg-slate-800 rounded disabled:opacity-30"
                          title={`بناء منزل (${tile.houseCost} ر.س)`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}

                    {/* Mortgage / Unmortgage */}
                    {isMortgaged ? (
                      <button
                        onClick={() => unmortgageTile(tile.id)}
                        disabled={myPlayer.cash < unmortgageCost}
                        className="btn btn-emerald btn-sm text-[10px] py-1"
                        title={`فك الرهن (${unmortgageCost} ر.س)`}
                      >
                        <Unlock size={12} />
                        فك الرهن ({unmortgageCost} ر.س)
                      </button>
                    ) : (
                      <button
                        onClick={() => mortgageTile(tile.id)}
                        disabled={houses > 0}
                        className="btn btn-outline btn-sm text-[10px] py-1 text-rose-300 hover:border-rose-500"
                        title={`رهن العقار (+${tile.mortgageValue} ر.س)`}
                      >
                        <Lock size={12} />
                        رهن (+{tile.mortgageValue} ر.س)
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end">
          <button onClick={onClose} className="btn btn-gold btn-sm">
            تم، إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
