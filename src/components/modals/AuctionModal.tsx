import React from 'react';
import { Gavel, Clock, ArrowUp, Hand } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { BOARD_TILES, GROUP_COLORS } from '../../constants/boardData';

export const AuctionModal: React.FC = () => {
  const { gameState, myPlayer, placeBid, passBid } = useGame();
  const { user } = useAuth();

  if (!gameState || gameState.phase !== 'auction' || !gameState.activeAuction) {
    return null;
  }

  const auction = gameState.activeAuction;
  const tile = BOARD_TILES.find((t) => t.id === auction.tileId);
  if (!tile) return null;

  const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
  const highestBidder = auction.highestBidderId
    ? gameState.players.find((p) => p.id === auction.highestBidderId)
    : null;

  const isParticipating = user && auction.activePlayerIds.includes(user.uid);
  const currentBid = auction.currentBid;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
          <div className="flex items-center gap-2">
            <Gavel className="text-amber-400 animate-bounce" size={22} />
            <h3 className="text-lg font-bold text-white">مزاد علني مباشر</h3>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold transition-all ${
              auction.timeLeftSeconds <= 5
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse scale-105 shadow-md shadow-rose-950/50'
                : 'bg-slate-800 border-slate-700 text-amber-300'
            }`}
          >
            <Clock size={14} className={auction.timeLeftSeconds <= 5 ? 'text-rose-400 animate-spin' : ''} />
            <span>{auction.timeLeftSeconds}ث</span>
          </div>
        </div>

        {/* Tile Snippet */}
        <div
          className="p-3 rounded-xl border flex items-center justify-between mb-4 shadow-inner"
          style={{ backgroundColor: `${groupStyle.main}25`, borderColor: groupStyle.border }}
        >
          <div>
            <span className="text-[10px] text-slate-400 block">العقار المعروض للمزايدة:</span>
            <h4 className="text-base font-black text-white">{tile.name}</h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">السعر الأصلي:</span>
            <span className="text-xs font-mono text-slate-200">{tile.price} د.ع</span>
          </div>
        </div>

        {/* Current Bid Display */}
        <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl text-center mb-4 shadow-lg">
          <span className="text-xs text-slate-400 font-bold block mb-1">أعلى مزايدة حالية</span>
          <div className="text-3xl font-black font-mono font-gold">{currentBid} د.ع</div>

          {highestBidder ? (
            <div className="mt-2 inline-flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              <span className="text-lg">{highestBidder.avatar}</span>
              <span className="text-xs font-bold text-slate-200">{highestBidder.name}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500 block mt-2">في انتظار المزايدة الأولى...</span>
          )}
        </div>

        {/* Active Bidders Badges */}
        <div className="mb-4">
          <span className="text-[11px] font-bold text-slate-400 block mb-1.5">المزايدون النشطون في الجلسة:</span>
          <div className="flex flex-wrap gap-1.5">
            {gameState.players
              .filter((p) => !p.isBankrupt)
              .map((p) => {
                const isActive = auction.activePlayerIds.includes(p.id);
                return (
                  <span
                    key={p.id}
                    className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                      isActive
                        ? 'bg-slate-800 border-slate-600 text-white'
                        : 'bg-slate-950/40 border-transparent text-slate-600 line-through'
                    }`}
                  >
                    <span>{p.avatar}</span>
                    <span>{p.name}</span>
                  </span>
                );
              })}
          </div>
        </div>

        {/* User Bidding Controls */}
        {isParticipating && myPlayer ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => placeBid(currentBid + 10)}
                disabled={myPlayer.cash < currentBid + 10}
                className="btn btn-gold btn-sm py-2"
              >
                <ArrowUp size={14} /> +10 د.ع
              </button>
              <button
                onClick={() => placeBid(currentBid + 50)}
                disabled={myPlayer.cash < currentBid + 50}
                className="btn btn-gold btn-sm py-2"
              >
                <ArrowUp size={14} /> +50 د.ع
              </button>
              <button
                onClick={() => placeBid(currentBid + 100)}
                disabled={myPlayer.cash < currentBid + 100}
                className="btn btn-gold btn-sm py-2"
              >
                <ArrowUp size={14} /> +100 د.ع
              </button>
            </div>

            <button onClick={passBid} className="btn btn-ruby w-full btn-sm">
              <Hand size={14} />
              انسحاب من المزاد
            </button>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400">
            أنت خارج هذا المزاد، في انتظار انتهاء المزايدة...
          </div>
        )}
      </div>
    </div>
  );
};
