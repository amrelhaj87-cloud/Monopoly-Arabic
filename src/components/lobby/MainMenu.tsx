import React, { useState } from 'react';
import { Bot, Users, PlusCircle, LogIn, Sparkles, BookOpen, Crown, ChevronLeft, ArrowRight, Dices, Trophy, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { GameSettings } from '../../types/game';

interface MainMenuProps {
  onOpenCreateRoom: () => void;
  onOpenJoinRoom: () => void;
  onOpenRules: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onOpenCreateRoom,
  onOpenJoinRoom,
  onOpenRules
}) => {
  const { user } = useAuth();
  const { startSinglePlayerGame } = useGame();

  // Solo mode configuration state
  const [showSoloConfig, setShowSoloConfig] = useState(false);
  const [botCount, setBotCount] = useState<number>(3);
  const [botDifficulty, setBotDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [startingCash, setStartingCash] = useState<number>(1500);
  const [quickMode, setQuickMode] = useState<boolean>(false);

  const handleStartSolo = () => {
    const settings: GameSettings = {
      startingCash,
      maxPlayers: botCount + 1,
      turnTimeSeconds: 45,
      enableTrading: true,
      enableAuctions: true,
      doubleCashOnGoLanding: false,
      freeParkingJackpot: true,
      quickMode
    };
    startSinglePlayerGame(botCount, botDifficulty, settings);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-5xl mx-auto w-full animate-fadeIn">
      {/* Player Header Greeting Pill */}
      {user && (
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700/80 shadow-md mb-6">
          <span className="text-2xl">{user.photoURL || '👳‍♂️'}</span>
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            أهلاً بك، <strong className="text-amber-400 font-black">{user.displayName}</strong>!
          </span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {user.stats.gamesWon} انتصارات 🏆
          </span>
        </div>
      )}

      {/* Hero Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-gold tracking-tight mb-2">
          مونوبولي العربية
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto font-medium">
          اختر نمط اللعب المفضل وابدأ المزايدات واحتكار أشهر المدن والعواصم العربية!
        </p>
      </div>

      {!showSoloConfig ? (
        /* 3 Main Game Mode Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {/* 1. Single Player vs Bots */}
          <div
            onClick={() => setShowSoloConfig(true)}
            className="glass-panel p-6 sm:p-7 flex flex-col items-center text-center cursor-pointer border-2 border-slate-700/80 hover:border-amber-400 hover:scale-[1.02] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 left-0 h-1 bg-amber-400 group-hover:h-1.5 transition-all" />
            <div className="w-18 h-18 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              🤖
            </div>
            <h3 className="text-xl font-black text-white mb-2">اللعب ضد الذكاء الاصطناعي</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              مباراة فورية ضد 1 إلى 5 روبوتات ذكية بشخصيات وأسماء عربية شهيرة ومستويات صعوبة متنوعة.
            </p>
            <button className="btn btn-gold w-full mt-auto">
              <Bot size={18} />
              <span>بدء مباراة فردية</span>
            </button>
          </div>

          {/* 2. Create Private Room */}
          <div
            onClick={onOpenCreateRoom}
            className="glass-panel p-6 sm:p-7 flex flex-col items-center text-center cursor-pointer border-2 border-slate-700/80 hover:border-emerald-400 hover:scale-[1.02] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 left-0 h-1 bg-emerald-400 group-hover:h-1.5 transition-all" />
            <div className="w-18 h-18 rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              🏰
            </div>
            <h3 className="text-xl font-black text-white mb-2">إنشاء غرفة خاصة</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              أنشئ غرفة خاصة وشارك كود الغرفة السداسي المباشر مع أصدقائك لتلعبوا معاً أونلاين.
            </p>
            <button className="btn btn-emerald w-full mt-auto">
              <PlusCircle size={18} />
              <span>إنشاء غرفة أصدقاء</span>
            </button>
          </div>

          {/* 3. Join Room by Code */}
          <div
            onClick={onOpenJoinRoom}
            className="glass-panel p-6 sm:p-7 flex flex-col items-center text-center cursor-pointer border-2 border-slate-700/80 hover:border-sky-400 hover:scale-[1.02] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 left-0 h-1 bg-sky-400 group-hover:h-1.5 transition-all" />
            <div className="w-18 h-18 rounded-3xl bg-sky-500/15 border-2 border-sky-500/40 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              🔑
            </div>
            <h3 className="text-xl font-black text-white mb-2">الانضمام إلى غرفة</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              لديك كود من صديقك؟ أدخل الكود المباشر المكون من 6 خانات وادخل إلى ردهة الانتظار فوراً.
            </p>
            <button className="btn btn-outline w-full mt-auto hover:border-sky-400">
              <LogIn size={18} />
              <span>أدخل كود الغرفة</span>
            </button>
          </div>
        </div>
      ) : (
        /* Solo Game Configuration View */
        <div className="glass-panel p-6 sm:p-8 w-full max-w-xl animate-fadeIn border-2 border-amber-500/40 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-5">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Bot className="text-amber-400" size={22} /> إعدادات اللعب ضد الذكاء الاصطناعي
            </h3>
            <button
              onClick={() => setShowSoloConfig(false)}
              className="btn btn-outline btn-sm py-1 px-3 text-xs flex items-center gap-1"
            >
              <ChevronLeft size={16} /> العودة للقائمة
            </button>
          </div>

          <div className="space-y-5 text-xs">
            {/* Number of Bots */}
            <div>
              <label className="block font-bold text-slate-200 mb-2">
                عدد الروبوتات المنافسة ({botCount} روبوتات - إجمالي {botCount + 1} لاعبين):
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setBotCount(count)}
                    className={`py-3 rounded-2xl font-black text-sm border-2 transition-all cursor-pointer ${
                      botCount === count
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-105'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block font-bold text-slate-200 mb-2">مستوى صعوبة وذكاء الروبوتات:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBotDifficulty('easy')}
                  className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                    botDifficulty === 'easy'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  سهل 🟢
                </button>
                <button
                  type="button"
                  onClick={() => setBotDifficulty('medium')}
                  className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                    botDifficulty === 'medium'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  متوسط 🟡
                </button>
                <button
                  type="button"
                  onClick={() => setBotDifficulty('hard')}
                  className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                    botDifficulty === 'hard'
                      ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  محترف (الهامور) 🔴
                </button>
              </div>
            </div>

            {/* Starting Cash */}
            <div>
              <label className="block font-bold text-slate-200 mb-2">الرصيد المالي في البداية:</label>
              <div className="grid grid-cols-3 gap-2">
                {[1500, 2000, 2500].map((cash) => (
                  <button
                    key={cash}
                    type="button"
                    onClick={() => setStartingCash(cash)}
                    className={`py-3 rounded-2xl font-bold text-xs border-2 transition-all ${
                      startingCash === cash
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {cash} ريال
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Play Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-white text-sm block">النمط السريع (Quick Mode)</span>
                <span className="text-[11px] text-slate-400">توزيع عقارين عشوائيين لكل لاعب لتسريع اللعب.</span>
              </div>
              <input
                type="checkbox"
                checked={quickMode}
                onChange={(e) => setQuickMode(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Launch Button */}
            <button onClick={handleStartSolo} className="btn btn-gold btn-lg w-full mt-4 shadow-2xl">
              <Crown size={22} />
              <span>بدء المباراة الآن</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Footer Info Quick Links */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <button onClick={onOpenRules} className="hover:text-amber-400 underline flex items-center gap-1.5 font-bold">
          <BookOpen size={15} /> شرح قواعد مونوبولي كاملة
        </button>
        <span>•</span>
        <span>من 1 إلى 6 لاعبين</span>
        <span>•</span>
        <span>دعم كامل للغة العربية</span>
      </div>
    </div>
  );
};
