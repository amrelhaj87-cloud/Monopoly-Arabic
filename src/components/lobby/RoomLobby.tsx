import React, { useState } from 'react';
import { Users, Bot, Crown, CheckCircle2, Circle, Trash2, Send, Copy, Check, Play, UserPlus, Link2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { GAME_TOKENS, PLAYER_DEFAULT_COLORS } from '../../constants/tokens';
import { PlayerTokenId } from '../../types/game';

export const RoomLobby: React.FC = () => {
  const { 
    room, 
    isHost, 
    toggleReady, 
    addBotToRoom, 
    removeMemberFromRoom, 
    updateCustomization, 
    updateRoomSettings,
    sendChatMessage, 
    startRoomGame 
  } = useGame();
  
  const { user } = useAuth();
  const [chatInput, setChatInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  if (!room || !user) return null;

  const myMember = room.members.find(m => m.id === user.uid);
  const isReady = myMember?.isReady ?? false;
  const canStart = isHost && room.members.length >= 2 && room.members.every(m => m.isReady);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/room/${room.id}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 gap-4">
      {/* Top Banner with Room Code & Share */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">ردهة انتظار المباراة</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
              {room.members.length} / {room.settings.maxPlayers} لاعبين
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            رصيد البداية: {room.settings.startingCash} ريال • مهلة الدور: {room.settings.turnTimeSeconds}ث • المزادات: {room.settings.enableAuctions ? 'مفعلة' : 'معطلة'}
          </p>
        </div>

        {/* Room Code & Invite Links */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-xl border border-amber-500/40 shadow-inner">
          <div className="ml-2">
            <span className="text-[10px] font-bold text-slate-400 block">كود الغرفة:</span>
            <span className="text-xl font-mono font-black text-amber-400 tracking-widest">{room.id}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="btn btn-outline btn-sm px-2.5 py-1.5 text-xs"
            title="نسخ الكود"
          >
            {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="btn btn-gold btn-sm px-3 py-1.5 text-xs"
            title="نسخ رابط الدعوة المباشر"
          >
            {copiedLink ? <Check size={14} /> : <Link2 size={14} />}
            <span>{copiedLink ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player Slots + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Players Slots (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Real & Bot Player Cards */}
            {room.members.map((member, idx) => {
              const tokenInfo = GAME_TOKENS.find(t => t.id === member.token);
              const isMe = member.id === user.uid;

              return (
                <div
                  key={member.id}
                  className={`glass-panel p-3.5 relative flex flex-col items-center text-center border-2 transition-all ${
                    member.isReady ? 'border-emerald-500/60 bg-emerald-950/10' : 'border-slate-700 bg-slate-900/50'
                  }`}
                >
                  {/* Host Badge */}
                  {member.isHost && (
                    <span className="absolute top-2 right-2 text-xs text-amber-400 flex items-center gap-1 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                      <Crown size={12} /> المضيف
                    </span>
                  )}

                  {/* Kick Button (Host Only) */}
                  {isHost && !member.isHost && (
                    <button
                      onClick={() => removeMemberFromRoom(member.id)}
                      className="absolute top-2 left-2 p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="طرد اللاعب"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  {/* Avatar & Token Icon */}
                  <div className="relative my-2">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2"
                      style={{ backgroundColor: `${member.color}20`, borderColor: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <span 
                      className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-base border-2 bg-slate-900 shadow"
                      style={{ borderColor: member.color }}
                    >
                      {tokenInfo?.emoji || '🏎️'}
                    </span>
                  </div>

                  {/* Name */}
                  <h4 className="text-sm font-bold text-white mt-1">
                    {member.name} {isMe && '(أنت)'}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {member.isBot ? `روبوت (${member.botDifficulty || 'متوسط'})` : tokenInfo?.name}
                  </span>

                  {/* Ready Status */}
                  <div className="mt-3 w-full pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5">
                    {member.isReady ? (
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> جاهز للعب
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                        <Circle size={14} /> ينتظر التجهيز
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, room.settings.maxPlayers - room.members.length) }).map((_, i) => (
              <div
                key={`empty_${i}`}
                className="glass-panel p-4 border-dashed border-2 border-slate-700/60 flex flex-col items-center justify-center text-center text-slate-500 min-h-[160px]"
              >
                <Users size={28} className="mb-1 text-slate-600" />
                <span className="text-xs font-bold">خانة شاغرة ({room.members.length + i + 1})</span>
                <span className="text-[10px] text-slate-600 mt-1">في انتظار انضمام لاعب أو روبوت</span>
              </div>
            ))}
          </div>

          {/* House Rules Settings Panel */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 bg-slate-900/60">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">قواعد وخيارات المباراة (House Rules)</h4>
                  <span className="text-[10px] text-slate-400">
                    {isHost ? 'بإمكانك كمضيف تخصيص شروط وقواعد اللعبة' : 'قواعد اللعبة المعتمدة من قِبل المضيف'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* 1. Starting Cash */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between gap-1.5">
                <span className="text-slate-400 font-bold text-[11px]">💰 رصيد البداية:</span>
                {isHost ? (
                  <select
                    value={room.settings.startingCash}
                    onChange={(e) => updateRoomSettings({ startingCash: Number(e.target.value) })}
                    className="bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value={1000}>1,000 ر.س (تحدي)</option>
                    <option value={1500}>1,500 ر.س (قياسي)</option>
                    <option value={2000}>2,000 ر.س (ثراء)</option>
                    <option value={2500}>2,500 ر.س (هامور)</option>
                  </select>
                ) : (
                  <span className="font-mono font-bold text-amber-300 text-sm">{room.settings.startingCash} ر.س</span>
                )}
              </div>

              {/* 2. Turn Timer */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between gap-1.5">
                <span className="text-slate-400 font-bold text-[11px]">⏱️ مؤقت الدور:</span>
                {isHost ? (
                  <select
                    value={room.settings.turnTimeSeconds}
                    onChange={(e) => updateRoomSettings({ turnTimeSeconds: Number(e.target.value) })}
                    className="bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value={30}>30 ثانية (سريع ⚡)</option>
                    <option value={45}>45 ثانية (متوازن ⚖️)</option>
                    <option value={60}>60 ثانية (هادئ ☕)</option>
                    <option value={0}>بدون مؤقت (مفتوح ♾️)</option>
                  </select>
                ) : (
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {room.settings.turnTimeSeconds > 0 ? `${room.settings.turnTimeSeconds} ثانية` : 'مفتوح ♾️'}
                  </span>
                )}
              </div>

              {/* 3. Double Cash on GO */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between gap-1.5">
                <span className="text-slate-400 font-bold text-[11px]">🚀 مضاعفة انطلق (400):</span>
                {isHost ? (
                  <button
                    onClick={() => updateRoomSettings({ doubleCashOnGoLanding: !room.settings.doubleCashOnGoLanding })}
                    className={`btn btn-xs py-1 font-bold ${
                      room.settings.doubleCashOnGoLanding ? 'btn-gold' : 'btn-outline opacity-60'
                    }`}
                  >
                    {room.settings.doubleCashOnGoLanding ? 'مفعلة (400 ر.س)' : 'معطلة (200 ر.س)'}
                  </button>
                ) : (
                  <span className="font-bold text-amber-300 text-xs">
                    {room.settings.doubleCashOnGoLanding ? 'مفعلة (400 ر.س)' : 'معطلة (200 ر.س)'}
                  </span>
                )}
              </div>

              {/* 4. Free Parking Jackpot */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between gap-1.5">
                <span className="text-slate-400 font-bold text-[11px]">🅿️ حوض الموقف (Jackpot):</span>
                {isHost ? (
                  <button
                    onClick={() => updateRoomSettings({ freeParkingJackpot: !room.settings.freeParkingJackpot })}
                    className={`btn btn-xs py-1 font-bold ${
                      room.settings.freeParkingJackpot ? 'btn-emerald' : 'btn-outline opacity-60'
                    }`}
                  >
                    {room.settings.freeParkingJackpot ? 'تجميع الغرامات 💰' : 'استراحة عادية 🅿️'}
                  </button>
                ) : (
                  <span className="font-bold text-emerald-300 text-xs">
                    {room.settings.freeParkingJackpot ? 'تجميع الغرامات 💰' : 'استراحة عادية 🅿️'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add Bot & Customization Controls */}
          <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3">
            {/* Add Bot Control (Host Only) */}
            {isHost && room.members.length < room.settings.maxPlayers && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="easy">روبوت سهل 🟢</option>
                  <option value="medium">روبوت متوسط 🟡</option>
                  <option value="hard">روبوت هامور 🔴</option>
                </select>
                <button
                  onClick={() => addBotToRoom(selectedDifficulty)}
                  className="btn btn-outline btn-sm flex items-center gap-1"
                >
                  <Bot size={14} className="text-amber-400" />
                  إضافة لاعب آلي (Bot)
                </button>
              </div>
            )}

            {/* Player Customization (Token & Color) */}
            {myMember && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">تخصيص قطعتك:</span>
                {/* Tokens */}
                <div className="flex gap-1">
                  {GAME_TOKENS.slice(0, 5).map((tk) => (
                    <button
                      key={tk.id}
                      onClick={() => updateCustomization(tk.id, myMember.color)}
                      className={`text-lg p-1 rounded border transition-all ${
                        myMember.token === tk.id ? 'bg-amber-500/30 border-amber-400 scale-110' : 'border-transparent'
                      }`}
                      title={tk.name}
                    >
                      {tk.emoji}
                    </button>
                  ))}
                </div>
                {/* Colors */}
                <div className="flex gap-1">
                  {PLAYER_DEFAULT_COLORS.map((col) => (
                    <button
                      key={col}
                      onClick={() => updateCustomization(myMember.token, col)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        myMember.color === col ? 'border-white scale-125' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Button: Ready / Start */}
          <div className="flex items-center justify-end gap-3 mt-auto">
            {!isHost ? (
              <button
                onClick={toggleReady}
                className={`btn btn-lg flex-1 ${isReady ? 'btn-ruby' : 'btn-emerald'}`}
              >
                {isReady ? 'إلغاء الجاهزية ✋' : 'أنا جاهز للعب! ✅'}
              </button>
            ) : (
              <button
                onClick={startRoomGame}
                disabled={!canStart}
                className={`btn btn-gold btn-lg flex-1 ${!canStart ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Play size={20} />
                بدء المباراة الآن ({room.members.length} لاعبين)
              </button>
            )}
          </div>
        </div>

        {/* In-Lobby Chat Drawer (1 col) */}
        <div className="glass-panel p-4 flex flex-col h-full min-h-[380px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>💬</span> المحادثة المباشرة في الغرفة
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs max-h-[320px]">
            {room.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-xl text-xs ${
                  msg.isSystem
                    ? 'bg-amber-950/30 border border-amber-500/20 text-amber-300 text-center'
                    : msg.senderId === user.uid
                    ? 'bg-blue-600/30 border border-blue-500/30 text-blue-100 mr-4'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-200 ml-4'
                }`}
              >
                {!msg.isSystem && (
                  <span className="font-bold text-[10px] text-amber-400 block mb-0.5">
                    {msg.senderName}
                  </span>
                )}
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800 mt-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="اكتب رسالة للجميع..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              maxLength={100}
            />
            <button type="submit" className="btn btn-gold btn-sm px-3">
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
