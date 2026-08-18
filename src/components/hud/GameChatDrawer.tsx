import React, { useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';

export const GameChatDrawer: React.FC = () => {
  const { room, sendChatMessage } = useGame();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMsg, setInputMsg] = useState('');

  if (!room) return null;

  const quickPhrases = [
    'صفقة ممتازة! 🤝',
    'حظ أوفر! 😂',
    'سأشتري كل شيء! 😈',
    'ادفع الإيجار 💸',
    'حماسية جداً! 🔥',
    'السجن ينتظرك 🔒'
  ];

  const handleSend = (textToSend?: string) => {
    const msg = (textToSend || inputMsg).trim();
    if (msg) {
      sendChatMessage(msg);
      if (!textToSend) setInputMsg('');
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex flex-col w-full text-xs transition-all select-none">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <span className="font-bold text-slate-300 flex items-center gap-1.5 text-xs">
          <MessageSquare size={13} className="text-sky-400" />
          المحادثة المباشرة {room.messages.length > 0 && `(${room.messages.length})`}
        </span>
        <button className="text-slate-400 hover:text-white p-0.5">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {/* Quick Reaction Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {quickPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(phrase)}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[10px] px-2 py-0.5 rounded-lg border border-slate-700/80 whitespace-nowrap shrink-0 transition-colors"
              >
                {phrase}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 text-[11px]">
            {room.messages.length === 0 ? (
              <div className="text-center py-2 text-slate-500">لا توجد رسائل بعد. قل مرحباً! 👋</div>
            ) : (
              room.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-1.5 rounded-xl text-[10.5px] ${
                    msg.isSystem
                      ? 'bg-amber-950/30 text-amber-300 text-center text-[10px] border border-amber-500/20'
                      : msg.senderId === user?.uid
                      ? 'bg-blue-600/20 text-blue-100 mr-2 border border-blue-500/30'
                      : 'bg-slate-950/80 text-slate-200 ml-2 border border-slate-800'
                  }`}
                >
                  {!msg.isSystem && (
                    <span className="font-bold text-[9px] text-amber-400 block mb-0.5">{msg.senderName}</span>
                  )}
                  <span>{msg.text}</span>
                </div>
              ))
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-1 pt-1.5 border-t border-slate-800"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="اكتب رسالة..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-white text-xs focus:outline-none focus:border-amber-400"
              maxLength={80}
            />
            <button type="submit" className="btn btn-gold btn-sm px-2.5 py-1 rounded-xl">
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
