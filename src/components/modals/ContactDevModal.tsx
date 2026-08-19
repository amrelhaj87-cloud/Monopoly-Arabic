import React, { useState } from 'react';
import { X, Send, MessageSquarePlus, CheckCircle2, ShieldAlert, Sparkles, Lightbulb, Bug, HelpCircle, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { firebaseService } from '../../services/firebase';
import confetti from 'canvas-confetti';

interface ContactDevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MESSAGE_TYPES = [
  { id: 'اقتراح وتطوير', label: 'اقتراح وتطوير', icon: Lightbulb, color: 'text-amber-400' },
  { id: 'إبلاغ عن مشكلة', label: 'إبلاغ عن مشكلة', icon: Bug, color: 'text-rose-400' },
  { id: 'استفسار عام', label: 'استفسار عام', icon: HelpCircle, color: 'text-sky-400' },
  { id: 'شكر وتقدير', label: 'شكر وتقدير', icon: Heart, color: 'text-emerald-400' }
];

export const ContactDevModal: React.FC<ContactDevModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const [senderName, setSenderName] = useState(user?.displayName || '');
  const [senderEmail, setSenderEmail] = useState(user?.email || '');
  const [subjectType, setSubjectType] = useState('اقتراح وتطوير');
  const [message, setMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('يرجى كتابة نص الرسالة أو الاستفسار أولاً');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      await firebaseService.sendDeveloperMessage({
        name: senderName.trim() || 'لاعب زائر',
        email: senderEmail.trim() || undefined,
        subjectType,
        message: message.trim(),
        userId: user?.uid
      });

      setIsSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMsg('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setMessage('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div 
        className="modal-content animate-scaleUp max-w-[480px] w-full p-5 sm:p-7 bg-slate-950 border-2 border-amber-500/40 shadow-2xl rounded-3xl relative overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <MessageSquarePlus size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">تواصل مع المطور</h3>
              <span className="text-[10px] text-amber-300/80 font-medium">نرحب باقتراحاتك واستفساراتك دائماً</span>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
            title="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-black text-white font-gold">
              تم إرسال رسالتك بنجاح!
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              وصلت رسالتك مباشرة إلى المطور وسيتم مراجعتها والاهتمام بها فوراً. شكراً لمساهمتك في تطوير اللعبة!
            </p>
            <button
              onClick={handleResetAndClose}
              className="btn btn-gold btn-sm px-6 py-2.5 text-xs font-black shadow-lg mx-auto mt-3 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>حسناً، العودة للعبة</span>
            </button>
          </div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-400 shrink-0" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">اسمك:</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="اسم اللاعب أو المرسل"
                  className="input-lux text-xs py-2"
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  بريدك (اختياري للرد عليك):
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-lux text-xs py-2"
                />
              </div>
            </div>

            {/* Message Type Selector Pills */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">نوع الرسالة:</label>
              <div className="grid grid-cols-2 gap-2">
                {MESSAGE_TYPES.map((t) => {
                  const isSelected = subjectType === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSubjectType(t.id)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-400/50'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={14} className={t.color} />
                      <span className="text-[11px]">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                نص الرسالة أو الاستفسار: <span className="text-amber-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب هنا أي فكرة، مشكلة واجهتك، أو سؤال للمطور..."
                className="input-lux text-xs p-2.5 h-24 resize-none leading-relaxed font-medium"
                required
                maxLength={800}
              />
              <span className="text-[9px] text-slate-500 block text-left mt-0.5 font-mono">
                {message.length}/800 حرف
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-gold btn-lg w-full py-3 text-sm font-black shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>جاري إرسال الرسالة...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>إرسال الرسالة إلى المطور</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
