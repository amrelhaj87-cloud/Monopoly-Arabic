import React, { useState } from 'react';
import { Bot, Users, PlusCircle, LogIn, Sparkles, BookOpen, Crown, ChevronLeft } from 'lucide-react';
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
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
      {/* Hero Welcome Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3 shadow-inner">
          <Sparkles size={14} /> لعبة العقارات الكلاسيكية الأكثر متعة في العالم العربي
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-gold tracking-tight mb-2">
          مونوبولي العربية
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto">
          اشترِ العواصم والمدن العربية، ابنِ الفنادق، وتاجر بذكاء لتصبح ملك العقار الأوحد!
        </p>
      </div>

      {!showSoloConfig ? (
        /* Main Action Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {/* 1. Single Player vs Bots */}
          <div 
            onClick={() => setShowSoloConfig(true)}
            className="glass-panel p-6 flex flex-col items-center text-center cursor-pointer hover:border-amber-400 hover:scale-[1.02] transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3 className="text-lg font-bold text-white mb-2">لعب فردي (ضد الذكاء الاصطناعي)</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              العب فوراً ضد 1 إلى 5 روبوتات ذكية بشخصيات وأسماء عربية شهيرة ومستويات صعوبة متنوعة.
            </p>
            <button className="btn btn-gold btn-sm w-full mt-auto">
              <Bot size={16} />
              بدء مباراة فردية
            </button>
          </div>

          {/* 2. Create Private Room */}
          <div 
            onClick={onOpenCreateRoom}
            className="glass-panel p-6 flex flex-col items-center text-center cursor-pointer hover:border-emerald-400 hover:scale-[1.02] transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🏰
            </div>
            <h3 className="text-lg font-bold text-white mb-2">إنشاء غرفة خاصة</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              أنشئ غرفة ألعاب خاصة بك ودعوة ما يصل إلى 6 من أصدقائك للعب عبر كود الغرفة المباشر.
            </p>
            <button className="btn btn-emerald btn-sm w-full mt-auto">
              <PlusCircle size={16} />
              إنشاء غرفة الآن
            </button>
          </div>

          {/* 3. Join Room by Code */}
          <div 
            onClick={onOpenJoinRoom}
            className="glass-panel p-6 flex flex-col items-center text-center cursor-pointer hover:border-sky-400 hover:scale-[1.02] transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🔑
            </div>
            <h3 className="text-lg font-bold text-white mb-2">الانضمام إلى غرفة</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              أدخل كود الغرفة السداسي المكون من 6 خانات للدخول مباشرة إلى ردهة أصدقائك.
            </p>
            <button className="btn btn-outline btn-sm w-full mt-auto hover:border-sky-400">
              <LogIn size={16} />
              أدخل كود الغرفة
            </button>
          </div>
        </div>
      ) : (
        /* Solo Game Configuration View */
        <div className="glass-panel p-6 w-full max-w-lg animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="text-amber-400" size={20} /> إعدادات اللعب ضد الذكاء الاصطناعي
            </h3>
            <button
              onClick={() => setShowSoloConfig(false)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ChevronLeft size={16} /> العودة
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Number of Bots */}
            <div>
              <label className="block font-bold text-slate-200 mb-2">
                عدد الروبوتات المنافسة ({botCount} لاعبين آليين - إجمالي {botCount + 1} لاعبين):
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setBotCount(count)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      botCount === count
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block font-bold text-slate-200 mb-2">مستوى ذكاء الروبوتات:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBotDifficulty('easy')}
                  className={`py-2 rounded-xl font-bold border ${
                    botDifficulty === 'easy'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  سهل 🟢
                </button>
                <button
                  type="button"
                  onClick={() => setBotDifficulty('medium')}
                  className={`py-2 rounded-xl font-bold border ${
                    botDifficulty === 'medium'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  متوسط 🟡
                </button>
                <button
                  type="button"
                  onClick={() => setBotDifficulty('hard')}
                  className={`py-2 rounded-xl font-bold border ${
                    botDifficulty === 'hard'
                      ? 'bg-rose-500 text-slate-950 border-rose-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  محترف (الهامور) 🔴
                </button>
              </div>
            </div>

            {/* Starting Cash */}
            <div>
              <label className="block font-bold text-slate-200 mb-2">أموال البداية:</label>
              <div className="grid grid-cols-3 gap-2">
                {[1500, 2000, 2500].map((cash) => (
                  <button
                    key={cash}
                    type="button"
                    onClick={() => setStartingCash(cash)}
                    className={`py-2 rounded-xl font-bold border ${
                      startingCash === cash
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {cash} ريال
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Play Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <div>
                <span className="font-bold text-white block">النمط السريع (Quick Mode)</span>
                <span className="text-[11px] text-slate-400">توزيع عقارين عشوائيين لكل لاعب عند البداية لتسريع وتيرة اللعب.</span>
              </div>
              <input
                type="checkbox"
                checked={quickMode}
                onChange={(e) => setQuickMode(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Launch Button */}
            <button onClick={handleStartSolo} className="btn btn-gold btn-lg w-full mt-4">
              <Crown size={20} />
              بدء المباراة الآن
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-400">
        <button onClick={onOpenRules} className="hover:text-amber-400 underline flex items-center gap-1">
          <BookOpen size={14} /> شرح قواعد مونوبولي كاملة
        </button>
        <span>•</span>
        <span>يدعم من 1 إلى 6 لاعبين</span>
        <span>•</span>
        <span>مزامنة فورية باللغة العربية</span>
      </div>
    </div>
  );
};
