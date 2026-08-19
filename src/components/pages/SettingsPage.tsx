import React, { useState } from 'react';
import { 
  User, 
  Volume2, 
  VolumeX, 
  Layers, 
  Database, 
  BookOpen, 
  Trophy, 
  Coins, 
  Award, 
  Save, 
  LogOut, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Home, 
  Play, 
  Dices,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { audioService } from '../../services/audioService';
import { firebaseService } from '../../services/firebase';
import { GAME_TOKENS, AVATARS_LIST } from '../../constants/tokens';
import { PlayerTokenId } from '../../types/game';
import { FirebaseConfigOptions } from '../../types/auth';

interface SettingsPageProps {
  is3D: boolean;
  setIs3D: (val: boolean) => void;
  onNavigateHome: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ is3D, setIs3D, onNavigateHome }) => {
  const { user, logout, updateProfileCustomization, saveCustomFirebaseConfig, isFirebaseCloudConfigured } = useAuth();
  const { gameState } = useGame();

  const [activeTab, setActiveTab] = useState<'profile' | 'audio_display' | 'cloud' | 'rules'>('profile');

  // Profile Form States
  const [name, setName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.photoURL || AVATARS_LIST[0].emoji);
  const [token, setToken] = useState<PlayerTokenId>(user?.selectedToken || 'falcon');
  const [profileSaved, setProfileSaved] = useState(false);

  // Audio / Sound States
  const [isMuted, setIsMuted] = useState(audioService.getMuted());

  // Cloud / Firebase States
  const savedConfig = firebaseService.getSavedConfig();
  const [apiKey, setApiKey] = useState(savedConfig?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(savedConfig?.authDomain || '');
  const [projectId, setProjectId] = useState(savedConfig?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(savedConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(savedConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(savedConfig?.appId || '');
  const [cloudSaved, setCloudSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await updateProfileCustomization(name.trim(), avatar, token);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleToggleSound = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const handleTestSound = (type: 'cash' | 'dice' | 'property' | 'house') => {
    if (type === 'cash') audioService.playCash();
    if (type === 'dice') audioService.playDiceRoll();
    if (type === 'property') audioService.playPropertyBuy();
    if (type === 'house') audioService.playBuildHouse();
  };

  const handleSaveCloud = (e: React.FormEvent) => {
    e.preventDefault();
    const config: FirebaseConfigOptions = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    };
    saveCustomFirebaseConfig(config);
    setCloudSaved(true);
    setTimeout(() => setCloudSaved(false), 2000);
  };

  const winRate = user && user.stats.gamesPlayed > 0 
    ? Math.round((user.stats.gamesWon / user.stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full p-2 sm:p-4 animate-fadeIn">
      <div className="w-full flex flex-col gap-4">
      {/* Page Header Banner */}
      <div className="glass-panel p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-2 border-amber-500/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-gold mb-1 flex items-center gap-2.5">
            <span>⚙️</span> صفحة الإعدادات والملف الشخصي
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            تخصيص ملفك الشخصي، الصوتيات، المنظور ثلاثي الأبعاد، الاتصال بالسحابة وقواعد اللعبة
          </p>
        </div>

        <button onClick={onNavigateHome} className="btn btn-gold btn-sm px-4">
          <RotateCcw size={16} />
          العودة للرئيسية
        </button>
      </div>

      {/* Navigation Tabs (Horizontal) */}
      <div className="flex flex-row justify-center flex-wrap gap-2.5 overflow-x-auto glass-panel p-2 sm:p-3 border-2 border-slate-700/50">
        <button
          onClick={() => setActiveTab('profile')}
          className={`tab-pill text-right flex-1 min-w-[140px] justify-center ${activeTab === 'profile' ? 'tab-pill-active' : ''}`}
        >
          <User size={18} />
          <span>الملف والإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('audio_display')}
          className={`tab-pill text-right flex-1 min-w-[140px] justify-center ${activeTab === 'audio_display' ? 'tab-pill-active' : ''}`}
        >
          <Volume2 size={18} />
          <span>الصوتيات والعرض</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`tab-pill text-right flex-1 min-w-[140px] justify-center ${activeTab === 'cloud' ? 'tab-pill-active' : ''}`}
        >
          <Database size={18} />
          <span>السحابة و Firebase</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`tab-pill text-right flex-1 min-w-[140px] justify-center ${activeTab === 'rules' ? 'tab-pill-active' : ''}`}
        >
          <BookOpen size={18} />
          <span>دليل القواعد</span>
        </button>
      </div>

      {/* Content Panel */}
      <div className="glass-panel p-6 sm:p-8 border-2 border-slate-700/80 min-h-[480px]">
        {/* TAB 1: Profile & Stats */}
        {activeTab === 'profile' && user && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <User className="text-amber-400" size={20} /> الملف الشخصي وتخصيص اللاعب
                </h3>
                <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  {user.isGuest ? 'حساب زائر' : user.email}
                </span>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <Trophy className="mx-auto text-amber-400 mb-1" size={20} />
                  <span className="text-xl font-black text-white font-mono">{user.stats.gamesWon}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">مرات الفوز</span>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <Coins className="mx-auto text-emerald-400 mb-1" size={20} />
                  <span className="text-xl font-black text-white font-mono">{user.stats.highestNetWorth}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">أعلى ثروة</span>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <Award className="mx-auto text-sky-400 mb-1" size={20} />
                  <span className="text-xl font-black text-white font-mono">{user.stats.gamesPlayed}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">المباريات الملعوبة</span>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xl block mb-1">🎯</span>
                  <span className="text-xl font-black text-white font-mono">{winRate}%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">نسبة الفوز</span>
                </div>
              </div>

                {/* Edit Profile Form */}
                <form onSubmit={handleSaveProfile} className="space-y-5 pt-2">
                  <div>
                    <label className="block text-sm font-black text-amber-400 mb-2">اسم اللاعب:</label>
                    <div className="relative max-w-sm">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-lux pl-4 pr-10"
                        maxLength={20}
                        placeholder="أدخل اسمك هنا..."
                        required
                      />
                    </div>
                  </div>

                  {/* Removed Avatar and Token selections since we use unified PlayerBlob now. Colors are selected in the Game Lobby. */}

                  {profileSaved && (
                    <div className="p-3 bg-emerald-950/70 border border-emerald-500 text-emerald-300 rounded-xl text-center text-xs font-bold mt-4">
                      ✅ تم حفظ وتحديث الملف الشخصي بنجاح!
                    </div>
                  )}

                  <div className="flex gap-4 pt-6 mt-6 border-t border-slate-800/60">
                    <button type="submit" className="btn btn-gold flex-1 shadow-lg">
                      <Save size={18} />
                      حفظ التغييرات
                    </button>
                    <button type="button" onClick={logout} className="btn btn-ruby px-6">
                      <LogOut size={18} />
                      تسجيل الخروج
                    </button>
                  </div>
                </form>
            </div>
          )}

          {/* TAB 2: Audio & Display */}
          {activeTab === 'audio_display' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Volume2 className="text-amber-400" size={20} /> إعدادات الصوتيات والعرض
                </h3>
              </div>

              {/* Mute / Unmute */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">المؤثرات الصوتية للعبة (Web Audio Synth)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">أصوات النرد، النقود، البناء، السجن، ونغمات الفوز</p>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`btn btn-sm ${isMuted ? 'btn-ruby' : 'btn-emerald'}`}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span>{isMuted ? 'الصوت معطل' : 'الصوت مفعل'}</span>
                </button>
              </div>

              {/* Sound Test Panel */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">اختبار أصوات اللعبة:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button onClick={() => handleTestSound('dice')} className="btn btn-outline btn-sm">
                    🎲 صوت النرد
                  </button>
                  <button onClick={() => handleTestSound('cash')} className="btn btn-outline btn-sm">
                    💰 صوت النقود
                  </button>
                  <button onClick={() => handleTestSound('property')} className="btn btn-outline btn-sm">
                    🏰 شراء عقار
                  </button>
                  <button onClick={() => handleTestSound('house')} className="btn btn-outline btn-sm">
                    🔨 بناء فندق
                  </button>
                </div>
              </div>

              {/* 3D Perspective Mode */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">المنظور ثلاثي الأبعاد للرقعة (3D Board Tilt)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">إمالة الرقعة بزاوية ثلاثية الأبعاد تفاعلية أثناء اللعب</p>
                </div>
                <button
                  onClick={() => setIs3D(!is3D)}
                  className={`btn btn-sm ${is3D ? 'btn-gold' : 'btn-outline'}`}
                >
                  <Layers size={16} />
                  <span>{is3D ? 'منظور 3D مائل' : 'منظور 2D مسطح'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Cloud & Firebase */}
          {activeTab === 'cloud' && (
            <div className="space-y-5 animate-fadeIn text-xs">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Database className="text-amber-400" size={20} /> إعدادات الربط السحابي و Firebase
                </h3>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
                isFirebaseCloudConfigured
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}>
                {isFirebaseCloudConfigured ? (
                  <>
                    <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-400" size={20} />
                    <div>
                      <p className="font-black text-emerald-200 text-sm">الاتصال السحابي بـ Firebase نشط!</p>
                      <p className="mt-1 text-emerald-400/80">المصادقة ومزامنة الغرف تتم عبر خوادم Firestore السحابية.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="shrink-0 mt-0.5 text-amber-400" size={20} />
                    <div>
                      <p className="font-black text-amber-200 text-sm">الوضع المحلي الفوري (Local Broadcast Sync)</p>
                      <p className="mt-1 text-amber-400/80">
                        اللعبة تعمل فورياً عبر المتصفح والشبكة المحلية. يمكنك إدخال مفاتيح Firebase السحابية لتفعيل الحفظ العالمي.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <form onSubmit={handleSaveCloud} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">API Key</label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="input-lux font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Project ID</label>
                    <input
                      type="text"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder="my-monopoly-project"
                      className="input-lux font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Auth Domain</label>
                    <input
                      type="text"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      placeholder="my-monopoly.firebaseapp.com"
                      className="input-lux font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">App ID</label>
                    <input
                      type="text"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      placeholder="1:123456:web:abcdef"
                      className="input-lux font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Storage Bucket</label>
                    <input
                      type="text"
                      value={storageBucket}
                      onChange={(e) => setStorageBucket(e.target.value)}
                      placeholder="my-monopoly.appspot.com"
                      className="input-lux font-mono"
                    />
                  </div>
                </div>

                {cloudSaved && (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-500 text-emerald-300 rounded-xl text-center font-bold">
                    تم حفظ إعدادات Firebase وإعادة تهيئة الاتصال بنجاح!
                  </div>
                )}

                <button type="submit" className="btn btn-gold btn-lg w-full">
                  <Save size={18} />
                  حفظ إعدادات السحابة
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Rules Guide */}
          {activeTab === 'rules' && (
            <div className="space-y-4 animate-fadeIn text-xs text-slate-300 leading-relaxed">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <BookOpen className="text-amber-400" size={20} /> دليل وقواعد مونوبولي العربية
                </h3>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                  <Coins size={16} /> 1. الهدف والشراء
                </h4>
                <p>
                  الهدف هو احتكار المدن والعواصم وبناء الفنادق لإفلاس المنافسين. عند الهبوط على أي عقار غير مملوك يمكنك شراؤه بسعره أو طرحه في مزاد علني فوري.
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <Home size={16} /> 2. بناء المنازل والفنادق 🏨
                </h4>
                <p>
                  عند امتلاكك لجميع مدن نفس المجموعة اللونية، يتضاعف الإيجار وتتمكن من بناء حتى 4 منازل ثم ترقيتها إلى فندق فاخر لمضاعفة الإيجارات حتى 50 ضعفاً!
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-sky-400 font-bold text-sm flex items-center gap-1.5">
                  <ShieldCheck size={16} /> 3. محطات القطار والخدمات العامة
                </h4>
                <p>
                  محطات القطار (الحرمين، المشاعر، الخليج، البراق) تزيد إيجاراتها كلما امتلكت محطات أكثر (25، 50، 100، 200). شركات الكهرباء والمياه تعتمد على مجموع رمية النرد (4 أو 10 أضعاف).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
