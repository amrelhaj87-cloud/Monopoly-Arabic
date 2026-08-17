import React from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { GameEngine } from '../../services/gameEngine';
import { BOARD_TILES, GROUP_COLORS } from '../../constants/boardData';
import { Coins, Home, Lock, Crown } from 'lucide-react';

export const PlayerListHUD: React.FC = () => {
  const { gameState, currentPlayer, setSelectedTileDetail } = useGame();
  const { user } = useAuth();

  if (!gameState) return null;

  return (
    <div className="w-full lg:w-72 flex flex-col gap-2.5">
      <h3 className="text-xs font-bold text-slate-400 px-1 flex items-center justify-between">
        <span>قائمة المتنافسين ({gameState.players.filter(p => !p.isBankrupt).length} نشط)</span>
        <span className="text-[10px] text-amber-400">الترتيب حسب الثروة</span>
      </h3>

      <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
        {gameState.players.map((player, idx) => {
          const isCurrentTurn = currentPlayer?.id === player.id;
          const isMe = user?.uid === player.id;
          const netWorth = GameEngine.calculateNetWorth(player);

          return (
            <div
              key={player.id}
              className={`p-3 rounded-2xl border transition-all ${
                player.isBankrupt
                  ? 'bg-slate-950/40 border-slate-800 opacity-40 grayscale'
                  : isCurrentTurn
                  ? 'bg-slate-900/90 shadow-lg border-2 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
              style={{
                borderColor: isCurrentTurn ? player.color : undefined
              }}
            >
              {/* Top Row: Avatar, Name, Turn Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow border shrink-0"
                    style={{ backgroundColor: `${player.color}25`, borderColor: player.color }}
                  >
                    {player.avatar}
                  </div>

                  <div>
                    <span className="font-bold text-xs text-white block leading-tight">
                      {player.name} {isMe && '(أنت)'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {player.isBot ? '🤖 روبوت ذكي' : 'لاعب حقيقي'}
                    </span>
                  </div>
                </div>

                {isCurrentTurn && (
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white animate-pulse"
                    style={{ backgroundColor: player.color }}
                  >
                    الدور الآن
                  </span>
                )}
              </div>

              {/* Stats: Cash & Properties */}
              <div className="grid grid-cols-2 gap-1.5 py-1.5 px-2 bg-slate-950/60 rounded-xl mb-2 text-xs">
                <div className="flex items-center gap-1">
                  <Coins size={13} className="text-amber-400 shrink-0" />
                  <span className="font-mono font-bold text-amber-300">{player.cash}</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <Home size={13} className="text-emerald-400 shrink-0" />
                  <span className="text-slate-300 font-bold">{player.properties.length} عقار</span>
                </div>
              </div>

              {/* Status Badges (Jail, Bankruptcy) */}
              {player.inJail && !player.isBankrupt && (
                <div className="text-[10px] bg-rose-950/80 border border-rose-600/50 text-rose-300 px-2 py-0.5 rounded-lg flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1 font-bold">
                    <Lock size={10} /> مسجون
                  </span>
                  <span>(الدور {player.jailTurns + 1}/3)</span>
                </div>
              )}

              {player.isBankrupt && (
                <div className="text-[10px] bg-rose-950/90 text-rose-300 px-2 py-0.5 rounded-lg text-center font-bold">
                  💥 مفلس (خرج من اللعبة)
                </div>
              )}

              {/* Owned Properties Color Swatches */}
              {player.properties.length > 0 && !player.isBankrupt && (
                <div className="flex flex-wrap gap-1 mt-1 pt-1 border-t border-slate-800">
                  {player.properties.map((tileId) => {
                    const tile = BOARD_TILES.find((t) => t.id === tileId);
                    if (!tile) return null;
                    const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
                    const houses = player.houses[tile.id] || 0;

                    return (
                      <button
                        key={tile.id}
                        onClick={() => setSelectedTileDetail(tile)}
                        className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white shadow-sm flex items-center gap-0.5 hover:scale-105 transition-transform"
                        style={{ backgroundColor: groupStyle.main }}
                        title={`${tile.name} (انقر للتفاصيل)`}
                      >
                        <span>{tile.name}</span>
                        {houses > 0 && (
                          <span className="text-[8px]">{houses === 5 ? '🏨' : `🏠${houses}`}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
