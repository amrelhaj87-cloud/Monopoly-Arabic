import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Home, Coins, RotateCcw, Crown, TrendingUp, ShieldCheck, Flame, Dice6 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameEngine } from '../../services/gameEngine';

export const WinnerModal: React.FC = () => {
  const { gameState, leaveRoom } = useGame();

  useEffect(() => {
    if (gameState?.phase === 'game_over') {
      // Trigger festive confetti cannons
      const end = Date.now() + 3.5 * 1000;
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#facc15'];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
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

  // Ranked players by final net worth
  const rankedPlayers = [...gameState.players].sort((a, b) => {
    const netA = GameEngine.calculateNetWorth(a);
    const netB = GameEngine.calculateNetWorth(b);
    return netB - netA;
  });

  // Calculate Awards
  const rentKing = [...gameState.players].sort((a, b) => b.stats.totalRentCollected - a.stats.totalRentCollected)[0];
  const propertyKing = [...gameState.players].sort((a, b) => b.properties.length - a.properties.length)[0];
  const doublesKing = [...gameState.players].sort((a, b) => b.stats.doublesRolled - a.stats.doublesRolled)[0];
  const generousPayer = [...gameState.players].sort((a, b) => b.stats.totalRentPaid - a.stats.totalRentPaid)[0];

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp text-center max-h-[92vh] overflow-y-auto" style={{ maxWidth: '520px' }}>
        {/* Main Winner Crown Header */}
        <div className="text-6xl mb-2 animate-bounce">🏆</div>

        <span className="text-xs uppercase tracking-widest font-black text-amber-400 block mb-0.5">
          تتويج بطل مونوبولي العربية
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
          تهانينا للفائز: <span className="font-gold">{winner.name}</span>!
        </h2>

        {/* Winner Hero Card */}
        <div 
          className="p-4 rounded-2xl border-2 shadow-2xl mb-4 bg-gradient-to-b from-amber-950/70 via-slate-900 to-slate-950 relative overflow-hidden"
          style={{ borderColor: winner.color || '#f59e0b', boxShadow: `0 10px 30px ${winner.color || '#f59e0b'}30` }}
        >
          <div className="text-5xl mb-1 filter drop-shadow">{winner.avatar}</div>
          <div className="text-base font-black text-white mb-2">{winner.name}</div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl">
              <Coins className="mx-auto text-emerald-400 mb-1" size={18} />
              <span className="font-bold text-white font-mono text-sm">{totalWealth} <span className="text-[10px] text-emerald-400 font-normal">ر.س</span></span>
              <span className="text-[10px] text-slate-400 block mt-0.5">صافي الثروة الإجمالية</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl">
              <Home className="mx-auto text-amber-400 mb-1" size={18} />
              <span className="font-bold text-white font-mono text-sm">{winner.properties.length} <span className="text-[10px] text-amber-400 font-normal">عقار</span></span>
              <span className="text-[10px] text-slate-400 block mt-0.5">العقارات المحتكرة</span>
            </div>
          </div>
        </div>

        {/* Match Awards & Highlights */}
        <div className="mb-4 text-right">
          <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5 px-1">
            <Award size={14} className="text-amber-400" />
            أوسمة وجوائز المباراة:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Rent King */}
            {rentKing && rentKing.stats.totalRentCollected > 0 && (
              <div className="bg-slate-900/90 border border-emerald-500/40 p-2 rounded-xl flex items-center gap-2">
                <span className="text-xl">💸</span>
                <div>
                  <span className="font-black text-emerald-300 block leading-tight">حوت الإيجارات</span>
                  <span className="text-[9.5px] text-slate-400">
                    {rentKing.name} (+{rentKing.stats.totalRentCollected} ر.س)
                  </span>
                </div>
              </div>
            )}

            {/* Property King */}
            {propertyKing && propertyKing.properties.length > 0 && (
              <div className="bg-slate-900/90 border border-amber-500/40 p-2 rounded-xl flex items-center gap-2">
                <span className="text-xl">🏰</span>
                <div>
                  <span className="font-black text-amber-300 block leading-tight">ملك العقارات</span>
                  <span className="text-[9.5px] text-slate-400">
                    {propertyKing.name} ({propertyKing.properties.length} عقارات)
                  </span>
                </div>
              </div>
            )}

            {/* Doubles Master */}
            {doublesKing && doublesKing.stats.doublesRolled > 0 && (
              <div className="bg-slate-900/90 border border-blue-500/40 p-2 rounded-xl flex items-center gap-2">
                <span className="text-xl">🎲</span>
                <div>
                  <span className="font-black text-blue-300 block leading-tight">عاشق الدبل</span>
                  <span className="text-[9.5px] text-slate-400">
                    {doublesKing.name} ({doublesKing.stats.doublesRolled} دبل)
                  </span>
                </div>
              </div>
            )}

            {/* Generous Payer */}
            {generousPayer && generousPayer.stats.totalRentPaid > 0 && (
              <div className="bg-slate-900/90 border border-purple-500/40 p-2 rounded-xl flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <div>
                  <span className="font-black text-purple-300 block leading-tight">الزبون الدائم</span>
                  <span className="text-[9.5px] text-slate-400">
                    {generousPayer.name} (دفع {generousPayer.stats.totalRentPaid} ر.س)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Final Wealth Leaderboard */}
        <div className="mb-4 text-right">
          <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5 px-1">
            <TrendingUp size={14} className="text-emerald-400" />
            الترتيب النهائي بالثروة:
          </h4>
          <div className="space-y-1.5">
            {rankedPlayers.map((player, idx) => {
              const net = GameEngine.calculateNetWorth(player);
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs ${
                    idx === 0
                      ? 'bg-amber-950/40 border-amber-500/60 font-bold text-amber-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm w-4">{idx + 1}.</span>
                    <span>{player.avatar}</span>
                    <span>{player.name}</span>
                    {player.isBankrupt && <span className="text-[9px] text-rose-400">(أفلس)</span>}
                  </div>
                  <span className="font-mono font-bold">
                    {player.isBankrupt ? '0' : net} ر.س
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action button: Return to Lobby */}
        <button onClick={leaveRoom} className="btn btn-gold btn-lg w-full font-black shadow-xl">
          <RotateCcw size={18} />
          العودة إلى القائمة الرئيسية
        </button>
      </div>
    </div>
  );
};
