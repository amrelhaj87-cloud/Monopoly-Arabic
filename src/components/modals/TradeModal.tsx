import React, { useState } from 'react';
import { Handshake, X, ArrowLeftRight, Check, Ban } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { BOARD_TILES, GROUP_COLORS } from '../../constants/boardData';
import { TradeOffer } from '../../types/game';
import { AIService } from '../../services/aiService';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose }) => {
  const { gameState, myPlayer, proposeTrade, respondToTrade } = useGame();
  const { user } = useAuth();

  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [offeredCash, setOfferedCash] = useState<number>(0);
  const [offeredProps, setOfferedProps] = useState<number[]>([]);
  const [requestedCash, setRequestedCash] = useState<number>(0);
  const [requestedProps, setRequestedProps] = useState<number[]>([]);

  if (!gameState || !myPlayer) return null;

  // Check if there is an active incoming trade targeting me
  const activeTrade = gameState.activeTrade;
  const isIncomingForMe = activeTrade && activeTrade.toPlayerId === myPlayer.id;

  // Auto AI evaluate if trade is targeting a bot
  if (activeTrade) {
    const targetBot = gameState.players.find(p => p.id === activeTrade.toPlayerId && p.isBot);
    if (targetBot) {
      setTimeout(() => {
        const accept = AIService.evaluateTradeOffer(targetBot, activeTrade, gameState);
        respondToTrade(activeTrade.id, accept);
      }, 1500);
    }
  }

  if (!isOpen && !isIncomingForMe) return null;

  const otherPlayers = gameState.players.filter((p) => p.id !== myPlayer.id && !p.isBankrupt);
  const targetPlayer = gameState.players.find((p) => p.id === (selectedTargetId || otherPlayers[0]?.id));

  const toggleOfferedProp = (id: number) => {
    setOfferedProps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleRequestedProp = (id: number) => {
    setRequestedProps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSendOffer = () => {
    if (!targetPlayer) return;
    const offer: TradeOffer = {
      id: `trade_${Date.now()}`,
      fromPlayerId: myPlayer.id,
      toPlayerId: targetPlayer.id,
      offeredCash,
      offeredProperties: offeredProps,
      requestedCash,
      requestedProperties: requestedProps,
      status: 'pending'
    };
    proposeTrade(offer);
    onClose();
  };

  // --- Incoming Trade Receiver View ---
  if (isIncomingForMe && activeTrade) {
    const proposer = gameState.players.find(p => p.id === activeTrade.fromPlayerId);
    return (
      <div className="modal-overlay">
        <div className="modal-content animate-scaleUp" style={{ maxWidth: '480px' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700 mb-3">
            <Handshake className="text-amber-400" size={22} />
            <h3 className="text-lg font-bold text-white">عرض صفقة ومقايضة جديد!</h3>
          </div>

          <p className="text-xs text-slate-300 mb-4">
            يقدم لك <strong className="text-amber-400">{proposer?.name}</strong> عرض مقايضة بالعقارات والأموال التالية:
          </p>

          {/* Offer / Request Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            {/* Offered by him */}
            <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-xl">
              <span className="text-[11px] font-bold text-emerald-300 block mb-1.5">ما ستحصل عليه:</span>
              <div className="font-mono text-white font-bold mb-2">+{activeTrade.offeredCash} ريال</div>
              <div className="space-y-1">
                {activeTrade.offeredProperties.map(id => {
                  const t = BOARD_TILES.find(x => x.id === id);
                  return (
                    <div key={id} className="bg-slate-800 p-1.5 rounded text-[11px] text-slate-200">
                      {t?.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Requested from me */}
            <div className="bg-rose-950/30 border border-rose-500/40 p-3 rounded-xl">
              <span className="text-[11px] font-bold text-rose-300 block mb-1.5">ما ستقدمه بالمقابل:</span>
              <div className="font-mono text-white font-bold mb-2">-{activeTrade.requestedCash} ريال</div>
              <div className="space-y-1">
                {activeTrade.requestedProperties.map(id => {
                  const t = BOARD_TILES.find(x => x.id === id);
                  return (
                    <div key={id} className="bg-slate-800 p-1.5 rounded text-[11px] text-slate-200">
                      {t?.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => respondToTrade(activeTrade.id, true)}
              className="btn btn-emerald flex-1"
            >
              <Check size={16} /> قبول الصفقة
            </button>
            <button
              onClick={() => respondToTrade(activeTrade.id, false)}
              className="btn btn-ruby flex-1"
            >
              <Ban size={16} /> رفض الصفقة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Proposer View ---
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
          <div className="flex items-center gap-2">
            <Handshake className="text-emerald-400" size={22} />
            <h3 className="text-lg font-bold text-white">تقديم عرض مقايضة</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Target Player Selector */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 block mb-1.5">اختر اللاعب المستهدف للتفاوض:</label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {otherPlayers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedTargetId(p.id)}
                className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs transition-all shrink-0 ${
                  (selectedTargetId || otherPlayers[0]?.id) === p.id
                    ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <span>{p.avatar}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trade Columns: Give vs Receive */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          {/* Left: What I Offer */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1.5">ما ستقدمه (عروضك):</span>
            
            {/* Cash input */}
            <div className="mb-2">
              <label className="text-[10px] text-slate-400 block mb-1">أموال إضافية (رصيدك: {myPlayer.cash}):</label>
              <input
                type="number"
                min={0}
                max={myPlayer.cash}
                value={offeredCash}
                onChange={(e) => setOfferedCash(Math.max(0, Math.min(myPlayer.cash, Number(e.target.value))))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono"
              />
            </div>

            {/* My Properties */}
            <label className="text-[10px] text-slate-400 block mb-1">عقاراتك المعروضة:</label>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {myPlayer.properties.length === 0 ? (
                <span className="text-[10px] text-slate-500">لا تملك أي عقارات حالياً</span>
              ) : (
                myPlayer.properties.map((id) => {
                  const tile = BOARD_TILES.find((t) => t.id === id);
                  const isChecked = offeredProps.includes(id);
                  const groupStyle = GROUP_COLORS[tile?.group || 'special'];
                  return (
                    <div
                      key={id}
                      onClick={() => toggleOfferedProp(id)}
                      className={`p-1.5 rounded-lg border text-[11px] flex items-center justify-between cursor-pointer ${
                        isChecked ? 'bg-amber-500/20 border-amber-400 text-white' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-bold">{tile?.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupStyle.main }} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: What I Request */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-emerald-400 block mb-1.5">ما تطلبه بالمقابل:</span>

            {/* Cash input */}
            <div className="mb-2">
              <label className="text-[10px] text-slate-400 block mb-1">أموال تطلبها (رصيده: {targetPlayer?.cash || 0}):</label>
              <input
                type="number"
                min={0}
                max={targetPlayer?.cash || 0}
                value={requestedCash}
                onChange={(e) => setRequestedCash(Math.max(0, Math.min(targetPlayer?.cash || 0, Number(e.target.value))))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono"
              />
            </div>

            {/* Target Properties */}
            <label className="text-[10px] text-slate-400 block mb-1">عقارات اللاعب المطلوب:</label>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {!targetPlayer || targetPlayer.properties.length === 0 ? (
                <span className="text-[10px] text-slate-500">اللاعب لا يملك عقارات</span>
              ) : (
                targetPlayer.properties.map((id) => {
                  const tile = BOARD_TILES.find((t) => t.id === id);
                  const isChecked = requestedProps.includes(id);
                  const groupStyle = GROUP_COLORS[tile?.group || 'special'];
                  return (
                    <div
                      key={id}
                      onClick={() => toggleRequestedProp(id)}
                      className={`p-1.5 rounded-lg border text-[11px] flex items-center justify-between cursor-pointer ${
                        isChecked ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-bold">{tile?.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupStyle.main }} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="btn btn-outline flex-1">
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSendOffer}
            disabled={!targetPlayer || (offeredProps.length === 0 && offeredCash === 0 && requestedProps.length === 0 && requestedCash === 0)}
            className="btn btn-gold flex-1"
          >
            <ArrowLeftRight size={16} />
            إرسال عرض المقايضة
          </button>
        </div>
      </div>
    </div>
  );
};
