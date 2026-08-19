import React from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { Coins, Home, Lock, Crown, Users, Bot, User } from 'lucide-react';

export const PlayerListHUD: React.FC = () => {
  const { gameState, currentPlayer, room } = useGame();
  const { user } = useAuth();

  if (!gameState) return null;

  const activePlayers = gameState.players.filter((p) => !p.isBankrupt);

  return (
    <div className="w-full flex flex-col gap-1.5 select-none">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <Users size={13} className="text-amber-400" />
          المتنافسون ({activePlayers.length})
        </span>
        <span className="text-[10px] text-amber-300 font-bold">
          أرصدة اللاعبين
        </span>
      </div>

      {/* Players List */}
      <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-0.5">
        {gameState.players.map((player) => {
          const isCurrentTurn = currentPlayer?.id === player.id;
          const isMe = user?.uid === player.id;
          const isHost = room?.hostId === player.id;

          return (
            <div
              key={player.id}
              style={{
                borderRightWidth: '3.5px',
                borderRightColor: player.color || '#f59e0b',
                boxShadow: isCurrentTurn ? `0 0 18px ${player.color || '#f59e0b'}55, 0 0 6px ${player.color || '#f59e0b'}30` : 'none'
              }}
              className={`rounded-xl px-2.5 py-1.5 transition-all flex items-center justify-between gap-2 border ${
                player.isBankrupt
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-40 grayscale line-through'
                  : isCurrentTurn
                  ? 'bg-slate-900/95 border-amber-500/90 shadow-md ring-2 ring-amber-500/50 ring-offset-1 ring-offset-slate-950'
                  : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Right Side: Avatar + Name + Badges */}
              <div className="flex items-center gap-2 min-w-0">
                {/* Avatar with Turn Ring */}
                <div className="relative shrink-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm border relative"
                    style={{
                      backgroundColor: `${player.color}25`,
                      borderColor: player.color || '#f59e0b',
                      boxShadow: isCurrentTurn ? `0 0 10px ${player.color || '#f59e0b'}80` : 'none'
                    }}
                  >
                    <span>{player.avatar}</span>
                    {isHost && (
                      <Crown size={10} className="text-amber-400 absolute -top-1 -right-1 drop-shadow" />
                    )}
                  </div>
                  {/* Pulsing outer ring for active player */}
                  {isCurrentTurn && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-40 pointer-events-none"
                      style={{ backgroundColor: player.color || '#f59e0b' }}
                    />
                  )}
                </div>

                {/* Name & Mini Badge */}
                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                  <span className={`font-bold text-xs truncate ${isCurrentTurn ? 'text-amber-300' : 'text-slate-200'}`}>
                    {player.name}
                  </span>

                  {/* Player Type Mini Icon Badge */}
                  {player.isBot ? (
                    <span title="ذكاء اصطناعي" className="flex items-center">
                      <Bot size={11} className="text-slate-400 shrink-0" />
                    </span>
                  ) : (
                    <span title="لاعب حقيقي" className="flex items-center">
                      <User size={11} className="text-slate-400 shrink-0" />
                    </span>
                  )}

                  {isMe && (
                    <span className="text-[8.5px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shrink-0">
                      أنت
                    </span>
                  )}

                  {/* Active turn badge */}
                  {isCurrentTurn && (
                    <span className="text-[8px] px-1 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shrink-0 animate-pulse">
                      ▶ دوره
                    </span>
                  )}
                </div>
              </div>

              {/* Left Side: Status / Balance + Properties */}
              <div className="flex items-center gap-2 shrink-0">
                {player.inJail && !player.isBankrupt && (
                  <span className="text-[9.5px] bg-rose-950/90 text-rose-300 border border-rose-600/50 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5" title="في السجن">
                    <Lock size={10} /> سجن
                  </span>
                )}

                {player.isBankrupt ? (
                  <span className="text-[9.5px] text-rose-400 font-bold">مفلس</span>
                ) : (
                  <>
                    {/* Properties Count */}
                    <div className="flex items-center gap-0.5 text-slate-300 text-[11px] font-bold" title="عدد العقارات المملوكة">
                      <Home size={12} className="text-amber-400" />
                      <span>{player.properties.length}</span>
                    </div>

                    {/* Cash Balance */}
                    <div className="flex items-center gap-1 font-mono font-black text-emerald-400 text-xs">
                      <Coins size={12} className="text-emerald-400" />
                      <span>{player.cash}</span>
                      <span className="text-[9px] text-emerald-400/70 font-normal">$</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
