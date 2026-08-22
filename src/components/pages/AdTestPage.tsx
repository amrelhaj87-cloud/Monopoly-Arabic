import React from 'react';
import { AdsterraDesktopBanner } from '../ads/AdsterraDesktopBanner';
import { AdsterraMobileBanner } from '../ads/AdsterraMobileBanner';

export const AdTestPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 w-full">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col items-center max-w-2xl text-center w-full">
        <h1 className="text-3xl font-black font-gold mb-2 text-amber-300">صفحة اختبار الإعلانات</h1>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          هذه الصفحة مخصصة لاختبار ظهور الإعلانات بدون أي تأثير من تصميم اللعبة.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full mb-8">
          {/* Desktop Banner Test */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-400 mb-2">إعلان الديسكتوب (300x250)</h3>
            <div className="bg-slate-800 p-2 rounded-xl shadow-inner border border-slate-700">
              <AdsterraDesktopBanner />
            </div>
          </div>

          {/* Mobile Banner Test */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-400 mb-2">إعلان الموبايل (320x50)</h3>
            <div className="bg-slate-800 p-2 rounded-xl shadow-inner border border-slate-700">
              <AdsterraMobileBanner />
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};
