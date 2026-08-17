import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Home, Coins, RotateCcw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameEngine } from '../../services/gameEngine';

export const WinnerModal: React.FC = () => {
  const { gameState, leaveRoom } = useGame();

  useEffect(() => {
    if (gameState?.phase === 'game_over') {
      // Trigger festive confetti cannons
      const end = Date.now() + 3 * 1000;
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [gameState?.phase]);

  if (!gameState || gameState.phase !== 'game_over' || !gameState.winnerId) {
    return null;
  }

  const winner = gameState.players.find((p) => p.id === gameState.winnerId);
  if (!winner) return null;

  const totalWealth = GameEngine.calculateNetWorth(winner);

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp text-center" style={{ maxWidth: '460px' }}>
        <div className="text-6xl mb-3 animate-bounce">🏆</div>

        <span className="text-xs uppercase tracking-widest font-black text-amber-400 block mb-1">
          بطل مونوبولي العربية
        </span>
        <h2 className="text-2xl font-black text-white mb-3">
          تهانينا للفائز: <span className="font-gold">{winner.name}</span>!
        </h2>

        {/* Winner Card */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border-2 border-amber-500/50 shadow-xl mb-4">
          <div className="text-4xl mb-2">{winner.avatar}</div>
          <div className="text-sm font-bold text-white mb-3">{winner.name}</div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded-xl">
              <Coins className="mx-auto text-emerald-400 mb-0.5" size={16} />
              <span className="font-bold text-white font-mono">{totalWealth} ريال</span>
              <span className="text-[10px] text-slate-400 block">صافي الثروة الإجمالية</span>
            </div>

            <div className="bg-slate-800 p-2 rounded-xl">
              <Home className="mx-auto text-amber-400 mb-0.5" size={16} />
              <span className="font-bold text-white font-mono">{winner.properties.length} عقار</span>
              <span className="text-[10px] text-slate-400 block">العقارات المحتكرة</span>
            </div>
          </div>
        </div>

        {/* Action button: Return to Lobby */}
        <button onClick={leaveRoom} className="btn btn-gold btn-lg w-full">
          <RotateCcw size={18} />
          العودة إلى القائمة الرئيسية
        </button>
      </div>
    </div>
  );
};
