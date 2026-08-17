import React, { useState } from 'react';
import { ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const GameLogDrawer: React.FC = () => {
  const { gameState } = useGame();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!gameState) return null;

  return (
    <div className="glass-panel p-3 flex flex-col w-full text-xs transition-all">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none pb-1"
      >
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <ScrollText size={14} className="text-amber-400" />
          سجل أحداث المباراة ({gameState.logs.length})
        </span>
        <button className="text-slate-400 hover:text-white">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Logs Stream */}
      {isExpanded && (
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 mt-2 text-[11px]">
          {gameState.logs.map((log) => {
            const player = log.playerId ? gameState.players.find((p) => p.id === log.playerId) : null;
            return (
              <div
                key={log.id}
                className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-start gap-2 leading-relaxed"
              >
                {player && (
                  <span className="text-sm shrink-0 mt-0.5">{player.avatar}</span>
                )}
                <span className="text-slate-300">{log.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
