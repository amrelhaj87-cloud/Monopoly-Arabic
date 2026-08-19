import React, { useRef, useEffect } from 'react';
import { Dice3D } from '../dice/Dice3D';
import { useGame } from '../../context/GameContext';
import { Dices, ArrowRight, Home, Handshake, ScrollText, Skull } from 'lucide-react';

interface BoardCenterProps {
  onOpenManage: () => void;
  onOpenTrade: () => void;
  onDeclareBankruptcy?: () => void;
}

export const BoardCenter: React.FC<BoardCenterProps> = ({ onOpenManage, onOpenTrade, onDeclareBankruptcy }) => {
  const { 
    gameState, 
    currentPlayer, 
    myPlayer, 
    isMyTurn, 
    isMovingPawn,
    rollDice, 
    endCurrentTurn,
    payJailBail,
    useJailCard
  } = useGame();

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [gameState?.logs?.length]);

  if (!gameState || !currentPlayer) return null;

  const canRoll = isMyTurn && !gameState.hasRolled && !isMovingPawn && (gameState.phase === 'roll_dice' || gameState.phase === 'jail_decision');
  const canEndTurn = isMyTurn && gameState.hasRolled && !isMovingPawn && gameState.phase === 'idle';

  // Last 5 events for the live center feed
  const recentLogs = gameState.logs.slice(0, 5);

  return (
    <div className="board-center-stage select-none flex flex-col items-center justify-between p-2 sm:p-2.5 text-center w-full h-full">
      {/* 1. TOP HEADER ROW: Brand, Turn Info & Jackpot */}
      <div className="flex items-center justify-between w-full max-w-[540px] px-1 sm:px-2">
        {/* Brand */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-sm sm:text-base">🎲</span>
          <span className="font-gold font-black text-xs sm:text-sm">مونوبولي العربية</span>
        </div>

        {/* Current Turn Badge */}
        <div 
          className="px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 border shadow-md bg-slate-900/90 backdrop-blur-sm"
          style={{
            borderColor: currentPlayer.color || '#f59e0b',
            boxShadow: `0 0 10px ${currentPlayer.color || '#f59e0b'}30`
          }}
        >
          <div 
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs border shrink-0"
            style={{ backgroundColor: `${currentPlayer.color}30`, borderColor: currentPlayer.color }}
          >
            <span>{currentPlayer.avatar}</span>
          </div>
          <span className="text-[10.5px] sm:text-xs font-bold text-white leading-none">
            {currentPlayer.name} {myPlayer?.id === currentPlayer.id && '(أنت)'}
          </span>
          {gameState.settings.turnTimeSeconds > 0 && (
            <span className="text-[9px] font-mono font-bold text-amber-300 bg-slate-950 px-1.5 py-0.2 rounded-full border border-slate-700 ml-0.5">
              {gameState.remainingTurnTime}ث
            </span>
          )}
        </div>

        {/* Jackpot / Parking Pool */}
        {gameState.settings.freeParkingJackpot ? (
          <div className="bg-amber-950/90 border border-amber-500/50 px-2 py-0.5 rounded-full text-right shadow-sm shrink-0">
            <span className="text-[8px] text-amber-300 ml-1">الموقف:</span>
            <span className="text-[10px] font-mono font-bold text-amber-400">{gameState.freeParkingPool} $</span>
          </div>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* 2. MIDDLE AREA: 3D Dice + Live Activity Feed (Side-by-side on wide screens) */}
      <div className="w-full max-w-[540px] flex flex-col md:flex-row items-center justify-center gap-2 my-0.5 px-1">
        {/* Left/Main: 3D Dice & Action Button */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="transform scale-85 sm:scale-95">
            <Dice3D 
              dice={gameState.dice} 
              isRolling={isMovingPawn} 
              onRollClick={canRoll ? rollDice : undefined}
              canRoll={canRoll}
            />
          </div>

          {/* In-Jail Warning & Options for Active Player */}
          {currentPlayer.inJail && isMyTurn && !isMovingPawn && (
            <div className="bg-rose-950/90 border border-rose-500/60 px-2.5 py-1 rounded-xl text-center mt-1 text-xs shadow-lg flex items-center gap-1.5">
              <span className="text-rose-200 font-bold text-[9.5px]">
                🔒 في السجن ({currentPlayer.jailTurns + 1}/3)
              </span>
              <div className="flex gap-1">
                {myPlayer && myPlayer.cash >= 50 && (
                  <button onClick={payJailBail} className="btn btn-ruby btn-xs py-0.2 px-1.5 text-[9px]">
                    كفالة (50)
                  </button>
                )}
                {myPlayer && myPlayer.getOutOfJailCards > 0 && (
                  <button onClick={useJailCard} className="btn btn-gold btn-xs py-0.2 px-1.5 text-[9px]">
                    عفو ملكي
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Primary Action Button directly under dice */}
          <div className="mt-1 w-full min-w-[130px] max-w-[170px]">
            {canRoll && (
              <button onClick={rollDice} className="btn btn-gold btn-sm w-full shadow-lg py-1 text-xs font-black animate-bounce-gentle">
                <Dices size={14} />
                ارمِ النرد! 🎲
              </button>
            )}

            {canEndTurn && (
              <button onClick={endCurrentTurn} className="btn btn-emerald btn-sm w-full shadow-lg py-1 text-xs font-black">
                <ArrowRight size={14} />
                إنهاء الدور 👉
              </button>
            )}

            {isMovingPawn && (
              <div className="text-center py-1 px-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold animate-pulse">
                🏃‍♂️ جاري التقدم...
              </div>
            )}

            {!isMyTurn && !isMovingPawn && !canRoll && !canEndTurn && (
              <div className="text-center py-1 text-[9.5px] text-slate-300 font-medium bg-slate-950/80 rounded-xl border border-slate-800">
                {currentPlayer?.isBot ? (
                  <span className="flex items-center justify-center gap-1.5 text-violet-300">
                    <span className="inline-flex gap-0.5">
                      <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="font-bold">{currentPlayer.name} بيفكر...</span>
                    <span>🤖</span>
                  </span>
                ) : (
                  <span>⏳ دور {currentPlayer?.name}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Real-Time Activity Log Feed (Next to Dice!) */}
        <div className="flex-1 w-full max-w-[310px] bg-slate-950/85 border border-slate-800/90 rounded-xl p-2 text-right shadow-inner flex flex-col justify-between min-h-[95px] max-h-[115px]">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80 text-[10px] text-slate-400 font-bold">
            <span className="flex items-center gap-1">
              <ScrollText size={11} className="text-amber-400" />
              سجل الأحداث المباشر
            </span>
            <span className="text-[8.5px] text-slate-500 font-mono">لحظة بلحظة</span>
          </div>

          <div ref={logContainerRef} className="space-y-1 overflow-y-auto pr-0.5 flex-1 my-0.5">
            {recentLogs.length === 0 ? (
              <div className="text-[10px] text-slate-500 text-center py-2">بدأت المباراة، بانتظار الرمية الأولى...</div>
            ) : (
              recentLogs.map((log, idx) => {
                const isLatest = idx === 0;
                return (
                  <div
                    key={log.id}
                    className={`text-[9.5px] sm:text-[10px] leading-tight p-1 rounded-lg transition-all flex items-start gap-1 ${
                      isLatest
                        ? 'bg-slate-900 border border-amber-500/40 text-amber-200 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="shrink-0">{isLatest ? '👉' : '•'}</span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW CONTROLS: Property Management, Trade & Bankruptcy */}
      <div className="w-full max-w-[540px] flex items-center justify-center gap-2 px-1">
        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && (
          <button
            onClick={onOpenManage}
            className="btn btn-outline btn-xs sm:btn-sm px-2.5 py-1 text-[10.5px] sm:text-xs bg-slate-900/90 hover:bg-slate-800 flex items-center gap-1 border border-slate-700 shadow-md"
            title="بناء ورهن وتطوير العقارات"
          >
            <Home size={13} className="text-emerald-400" />
            <span className="font-bold">إدارة وبناء العقارات</span>
          </button>
        )}

        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && (
          <button
            onClick={onOpenTrade}
            className="btn btn-outline btn-xs sm:btn-sm px-2.5 py-1 text-[10.5px] sm:text-xs bg-slate-900/90 hover:bg-slate-800 flex items-center gap-1 border border-slate-700 shadow-md"
            title="تقديم عرض مقايضة أو صفقة"
          >
            <Handshake size={13} className="text-amber-400" />
            <span className="font-bold">عرض صفقة ومقايضة</span>
          </button>
        )}

        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && onDeclareBankruptcy && (
          <button
            onClick={onDeclareBankruptcy}
            className="btn btn-outline btn-xs sm:btn-sm px-2.5 py-1 text-[10.5px] sm:text-xs bg-slate-900/90 hover:bg-rose-950 flex items-center gap-1 border border-rose-800/60 hover:border-rose-500 text-rose-400 shadow-md transition-colors"
            title="إعلان الإفلاس (لا رجعة فيه)"
          >
            <Skull size={13} />
            <span className="font-bold">إفلاس</span>
          </button>
        )}
      </div>
    </div>
  );
};
