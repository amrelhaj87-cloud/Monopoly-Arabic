import React from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { GameEngine } from '../../services/gameEngine';
import { BOARD_TILES, GROUP_COLORS } from '../../constants/boardData';
import { Coins, Home, Lock, Crown, Users, TrendingUp } from 'lucide-react';

export const PlayerListHUD: React.FC = () => {
  const { gameState, currentPlayer, setSelectedTileDetail } = useGame();
  const { user } = useAuth();

  if (!gameState) return null;

  const activePlayers = gameState.players.filter(p => !p.isBankrupt);

  return (
    <div className="w-full lg:w-72 flex flex-col gap-2 select-none">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-2 py-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <Users size={13} className="text-amber-400" />
          المتنافسون ({activePlayers.length})
        </span>
        <span className="text-[10px] text-amber-300 font-medium flex items-center gap-1">
          <TrendingUp size={11} />
          الترتيب بالثروة
        </span>
      </div>

      {/* Players List */}
      <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
        {gameState.players.map((player) => {
          const isCurrentTurn = currentPlayer?.id === player.id;
          const isMe = user?.uid === player.id;
          const netWorth = GameEngine.calculateNetWorth(player);

          return (
            <div
              key={player.id}
              className={`relative rounded-2xl p-2.5 transition-all overflow-hidden border ${
                player.isBankrupt
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-40 grayscale'
                  : isCurrentTurn
                  ? 'bg-gradient-to-r from-slate-900/95 to-slate-950/95 border-amber-500/80 shadow-lg scale-[1.01]'
                  : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Left Color Accent Bar */}
              <div 
                className="absolute top-0 bottom-0 left-0 w-1.5"
                style={{ backgroundColor: player.color }}
              />

              {/* Player Info Row */}
              <div className="flex items-center justify-between gap-2 mb-2 pl-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Avatar Circle */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0 border-2 shadow-inner"
                    style={{ 
                      backgroundColor: `${player.color}25`, 
                      borderColor: player.color,
                      boxShadow: isCurrentTurn ? `0 0 10px ${player.color}60` : 'none'
                    }}
                  >
                    <span>{player.avatar}</span>
                  </div>

                  {/* Name & Type */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">
                        {player.name}
                      </span>
                      {isMe && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shrink-0">
                          أنت
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      {player.isBot ? '🤖 روبوت ذكي' : '👤 لاعب حقيقي'}
                    </span>
                  </div>
                </div>

                {/* Active Turn Pill */}
                {isCurrentTurn && !player.isBankrupt && (
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full text-slate-950 shadow animate-pulse shrink-0"
                    style={{ backgroundColor: player.color || '#f59e0b' }}
                  >
                    الدور الآن
                  </span>
                )}
              </div>

              {/* Cash & Assets Pill */}
              <div className="grid grid-cols-2 gap-1.5 py-1 px-2.5 bg-slate-950/80 rounded-xl mb-1.5 text-xs border border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Coins size={13} className="text-emerald-400 shrink-0" />
                  <span className="font-mono font-bold text-emerald-300">{player.cash} ر.س</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Home size={13} className="text-amber-400 shrink-0" />
                  <span className="text-slate-300 font-bold">{player.properties.length} عقار</span>
                </div>
              </div>

              {/* Status Warnings */}
              {player.inJail && !player.isBankrupt && (
                <div className="text-[10px] bg-rose-950/80 border border-rose-600/50 text-rose-300 px-2 py-0.5 rounded-lg flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1 font-bold">
                    <Lock size={10} /> في السجن
                  </span>
                  <span>(الدور {player.jailTurns + 1}/3)</span>
                </div>
              )}

              {player.isBankrupt && (
                <div className="text-[10px] bg-rose-950/90 text-rose-300 px-2 py-0.5 rounded-lg text-center font-bold">
                  💥 مفلس (خرج من اللعبة)
                </div>
              )}

              {/* Owned Properties Badges */}
              {player.properties.length > 0 && !player.isBankrupt && (
                <div className="flex flex-wrap gap-1 mt-1 pt-1 border-t border-slate-800/60">
                  {player.properties.map((tileId) => {
                    const tile = BOARD_TILES.find((t) => t.id === tileId);
                    if (!tile) return null;
                    const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
                    const houses = player.houses[tile.id] || 0;
                    const isMortgaged = player.mortgaged[tile.id] || false;

                    return (
                      <button
                        key={tile.id}
                        onClick={() => setSelectedTileDetail(tile)}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold text-white shadow-sm flex items-center gap-0.5 hover:scale-105 transition-transform ${
                          isMortgaged ? 'opacity-50 line-through' : ''
                        }`}
                        style={{ backgroundColor: groupStyle.main }}
                        title={`${tile.name} ${isMortgaged ? '(مرهون)' : ''} - انقر للتفاصيل`}
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
