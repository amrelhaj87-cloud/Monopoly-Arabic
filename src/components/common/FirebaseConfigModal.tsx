import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { firebaseService } from '../../services/firebase';
import { FirebaseConfigOptions } from '../../types/auth';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({ isOpen, onClose }) => {
  const { isFirebaseCloudConfigured, saveCustomFirebaseConfig } = useAuth();
  const saved = firebaseService.getSavedConfig();

  const [apiKey, setApiKey] = useState(saved?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(saved?.authDomain || '');
  const [projectId, setProjectId] = useState(saved?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(saved?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(saved?.messagingSenderId || '');
  const [appId, setAppId] = useState(saved?.appId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
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
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <Database className="text-amber-400" size={22} />
            <h2 className="text-lg font-bold text-white">إعدادات الاتصال بـ Firebase</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Status banner */}
        <div className={`p-3 rounded-xl mb-4 flex items-start gap-3 border ${
          isFirebaseCloudConfigured 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        }`}>
          {isFirebaseCloudConfigured ? (
            <>
              <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-400" size={18} />
              <div className="text-xs">
                <p className="font-bold text-emerald-200">الاتصال السحابي بـ Firebase نشط ومفعل!</p>
                <p className="mt-0.5 text-emerald-400/80">المصادقة وحفظ الغرف تتم عبر قواعد بيانات Firestore السحابية.</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="shrink-0 mt-0.5 text-amber-400" size={18} />
              <div className="text-xs">
                <p className="font-bold text-amber-200">الوضع المحلي / الفوري نشط (Local & Broadcast Sync)</p>
                <p className="mt-0.5 text-amber-400/80">
                  اللعبة تعمل بكامل مميزاتها أوفلاين أو عبر مشاركة التبويبات. يمكنك إدخال مفاتيح مشروع Firebase الخاص بك بالأسفل لتفعيل الحفظ والمزامنة السحابية العالمية.
                </p>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Project ID</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="my-monopoly-app"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Auth Domain</label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="my-monopoly-app.firebaseapp.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:123456:web:abcd"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Storage Bucket</label>
              <input
                type="text"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                placeholder="my-app.appspot.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-2 bg-emerald-900/50 border border-emerald-500 text-emerald-300 rounded text-center text-xs">
              تم حفظ الإعدادات وإعادة التهيئة بنجاح!
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              إلغاء
            </button>
            <button type="submit" className="btn btn-gold btn-sm flex items-center gap-1">
              <Save size={14} />
              حفظ الإعدادات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
