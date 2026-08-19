import React, { useState } from 'react';
import { ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PlayerBlob } from '../common/PlayerBlob';

export const GameLogDrawer: React.FC = () => {
  const { gameState } = useGame();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!gameState) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex flex-col w-full text-xs transition-all select-none">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <span className="font-bold text-slate-300 flex items-center gap-1.5 text-xs">
          <ScrollText size={13} className="text-amber-400" />
          سجل أحداث المباراة ({gameState.logs.length})
        </span>
        <button className="text-slate-400 hover:text-white p-0.5">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* Logs Stream */}
      {isExpanded && (
        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 mt-2 text-[11px]">
          {gameState.logs.length === 0 ? (
            <div className="text-center py-2 text-slate-500">لا توجد أحداث بعد.</div>
          ) : (
            gameState.logs.map((log) => {
              const player = log.playerId ? gameState.players.find((p) => p.id === log.playerId) : null;
              return (
                <div
                  key={log.id}
                  className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-1.5 leading-relaxed"
                >
                  {player && (
                    <div className="shrink-0 mt-0.5">
                      <PlayerBlob color={player.color} size="sm" />
                    </div>
                  )}
                  <span className="text-slate-300 font-medium text-[10.5px]">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
