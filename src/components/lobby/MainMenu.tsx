import React, { useState } from 'react';
import { Bot, PlusCircle, LogIn, BookOpen, Crown, ChevronLeft, ArrowRight, Dices } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { GameSettings } from '../../types/game';
import { Dice3D } from '../dice/Dice3D';
import { audioService } from '../../services/audioService';

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

  // Home preview dice
  const [previewDice, setPreviewDice] = useState<[number, number]>([5, 6]);
  const [isRollingPreview, setIsRollingPreview] = useState(false);

  const handleRollPreview = () => {
    setIsRollingPreview(true);
    audioService.playDiceRoll();
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setPreviewDice([d1, d2]);
      setIsRollingPreview(false);
    }, 600);
  };

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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
      
      {/* 1. Player Header Greeting Pill (التاجر الصغير) */}
      {user && (
        <div className="user-greeting-pill">
          <span className="user-greeting-avatar">{user.photoURL || '👳‍♂️'}</span>
          <span className="user-greeting-name">
            أهلاً بك يا <strong style={{ color: '#f59e0b', fontWeight: 900 }}>{user.displayName}</strong>!
          </span>
          <span className="user-greeting-badge">
            {user.stats?.gamesWon || 0} انتصارات 🏆
          </span>
        </div>
      )}

      {/* Hero Title */}
      {!showSoloConfig && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 className="font-gold" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 900, marginBottom: '8px', lineHeight: 1.15 }}>
            مونوبولي العربية
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', fontWeight: 600 }}>
            اشترِ العواصم والمدن العربية، ابنِ الفنادق، وتاجر بذكاء لتصبح ملك العقار الأوحد!
          </p>
        </div>
      )}

      {!showSoloConfig ? (
        <>
          {/* 3 Main Game Mode Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%', marginBottom: '28px' }}>
            {/* 1. Single Player vs Bots */}
            <div
              onClick={() => setShowSoloConfig(true)}
              className="glass-panel"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid rgba(245, 158, 11, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'rgba(245, 158, 11, 0.18)', border: '2px solid rgba(245, 158, 11, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', marginBottom: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
                🤖
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
                اللعب ضد الذكاء الاصطناعي
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                مباراة فردية فورية ضد 1 إلى 5 روبوتات ذكية بشخصيات وأسماء عربية شهيرة (أبو فهد، شهاب، ليلى...).
              </p>
              <button className="btn btn-gold" style={{ width: '100%' }}>
                <Bot size={20} />
                <span>بدء مباراة فردية</span>
              </button>
            </div>

            {/* 2. Create Private Room */}
            <div
              onClick={onOpenCreateRoom}
              className="glass-panel"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'rgba(16, 185, 129, 0.18)', border: '2px solid rgba(16, 185, 129, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', marginBottom: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
                🏰
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
                إنشاء غرفة خاصة
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                أنشئ غرفة خاصة وشارك كود الغرفة السداسي المباشر مع أصدقائك لتلعبوا معاً أونلاين.
              </p>
              <button className="btn btn-emerald" style={{ width: '100%' }}>
                <PlusCircle size={20} />
                <span>إنشاء غرفة أصدقاء</span>
              </button>
            </div>

            {/* 3. Join Room by Code */}
            <div
              onClick={onOpenJoinRoom}
              className="glass-panel"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid rgba(14, 165, 233, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'rgba(14, 165, 233, 0.18)', border: '2px solid rgba(14, 165, 233, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', marginBottom: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
                🔑
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
                الانضمام إلى غرفة
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                لديك كود من صديقك؟ أدخل الكود المباشر المكون من 6 خانات وادخل إلى ردهة الانتظار فوراً.
              </p>
              <button className="btn btn-outline" style={{ width: '100%' }}>
                <LogIn size={20} />
                <span>أدخل كود الغرفة</span>
              </button>
            </div>
          </div>


        </>
      ) : (
        /* Solo Game Configuration View */
        <div className="solo-config-card animate-fadeIn">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1.5px solid rgba(255,255,255,0.12)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot className="text-amber-400" size={24} /> إعدادات اللعب ضد الذكاء الاصطناعي
            </h3>
            <button
              onClick={() => setShowSoloConfig(false)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.85rem' }}
            >
              <ChevronLeft size={16} /> العودة للقائمة
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Number of Bots */}
            <div>
              <label style={{ display: 'block', fontWeight: 900, color: '#f8fafc', marginBottom: '6px', fontSize: '0.95rem' }}>
                عدد الروبوتات المنافسة ({botCount} روبوتات - إجمالي {botCount + 1} لاعبين):
              </label>
              <div className="selector-grid selector-grid-5">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setBotCount(count)}
                    className={`selector-btn ${botCount === count ? 'selector-btn-active-gold' : ''}`}
                  >
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label style={{ display: 'block', fontWeight: 900, color: '#f8fafc', marginBottom: '6px', fontSize: '0.95rem' }}>
                مستوى ذكاء وخبرة الروبوتات:
              </label>
              <div className="selector-grid selector-grid-3">
                <button
                  type="button"
                  onClick={() => setBotDifficulty('easy')}
                  className={`selector-btn ${botDifficulty === 'easy' ? 'selector-btn-active-emerald' : ''}`}
                >
                  <span>سهل</span>
                  <span>🟢</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBotDifficulty('medium')}
                  className={`selector-btn ${botDifficulty === 'medium' ? 'selector-btn-active-gold' : ''}`}
                >
                  <span>متوسط</span>
                  <span>🟡</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBotDifficulty('hard')}
                  className={`selector-btn ${botDifficulty === 'hard' ? 'selector-btn-active-ruby' : ''}`}
                >
                  <span>الهامور</span>
                  <span>🔴</span>
                </button>
              </div>
            </div>

            {/* Starting Cash */}
            <div>
              <label style={{ display: 'block', fontWeight: 900, color: '#f8fafc', marginBottom: '6px', fontSize: '0.95rem' }}>
                الرصيد المالي في البداية:
              </label>
              <div className="selector-grid selector-grid-3">
                {[1500, 2000, 2500].map((cash) => (
                  <button
                    key={cash}
                    type="button"
                    onClick={() => setStartingCash(cash)}
                    className={`selector-btn ${startingCash === cash ? 'selector-btn-active-gold' : ''}`}
                  >
                    <span>{cash} $</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Play Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: '#090d16',
              borderRadius: '16px',
              border: '1.5px solid rgba(255,255,255,0.1)'
            }}>
              <div>
                <span style={{ fontWeight: 900, color: '#ffffff', fontSize: '0.95rem', display: 'block' }}>النمط السريع (Quick Mode)</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>توزيع عقارين عشوائيين لكل لاعب لتسريع وتيرة المباراة.</span>
              </div>
              <input
                type="checkbox"
                checked={quickMode}
                onChange={(e) => setQuickMode(e.target.checked)}
                style={{ width: '24px', height: '24px', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>

            {/* Launch Button */}
            <button onClick={handleStartSolo} className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '8px' }}>
              <Crown size={24} />
              <span style={{ fontSize: '1.25rem' }}>بدء المباراة الآن</span>
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      )}


    </div>
  );
};
