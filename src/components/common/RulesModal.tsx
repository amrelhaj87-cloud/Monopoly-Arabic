import React from 'react';
import { X, ShieldCheck, Home, Coins, AlertCircle, Award } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-xl font-bold font-gold">
              دليل وقواعد أملاك <span className="text-amber-300 font-semibold text-lg">وعقارات</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Rules Body */}
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
          {/* Section 1 */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="text-amber-400 font-bold text-base mb-1 flex items-center gap-1.5">
              <Coins size={16} /> الهدف الأساسي من اللعبة
            </h3>
            <p>
              الهدف هو السيطرة على العقارات واحتكار المدن، وبناء المنازل والفنادق لتحصيل أعلى إيجارات ممكنة وإجبار المنافسين على إعلان إفلاسهم لتكون ملك العقار الوحيد!
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="text-emerald-400 font-bold text-base mb-1 flex items-center gap-1.5">
              <Home size={16} /> شراء العقارات واحتكار المجموعات
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>عند هبوطك على عقار غير مملوك، يمكنك شراؤه بالسعر المكتوب أو عرضه في مزاد علني.</li>
              <li>عند امتلاكك لجميع عقارات نفس المجموعة اللونية، يتضاعف الإيجار الأساسي وتتمكن من بناء المنازل.</li>
              <li>يمكن بناء حتى 4 منازل على كل عقار بالتساوي، ثم ترقيتها إلى فندق فاخر 🏨.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="text-sky-400 font-bold text-base mb-1 flex items-center gap-1.5">
              <ShieldCheck size={16} /> محطات القطار والخدمات العامة
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li><strong>محطات القطار:</strong> كلما امتلكت محطات أكثر (1، 2، 3، 4)، يرتفع الإيجار (25، 50، 100، 200).</li>
              <li><strong>الخدمات العامة (الكهرباء والمياه):</strong> الإيجار يساوي 4 أضعاف مجموع النرد، أو 10 أضعاف في حال امتلاك الشركتين معاً!</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="text-rose-400 font-bold text-base mb-1 flex items-center gap-1.5">
              <AlertCircle size={16} /> السجن وقواعد الإفلاس
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>تدخل السجن إذا: هبطت على خانة (اذهب للسجن)، أو سحبت بطاقة أمر بالسجن، أو رميت الدبل 3 مرات متتالية.</li>
              <li>للخروج من السجن: ارمِ دبل في النرد، أو ادفع كفالة 50، أو استخدم بطاقة (عفو ملكي).</li>
              <li>إذا لم تستطع سداد الديون حتى بعد رهن عقاراتك وبيع المنازل، تعلن إفلاسك وتخرج من اللعبة.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="text-amber-400 font-bold text-base mb-1 flex items-center gap-1.5">
              <Award size={16} /> التداول والمقايضة
            </h3>
            <p>
              يمكنك في أي وقت تقديم عروض مقايضة للاعبين الآخرين أو الروبوتات لتبادل الأموال والعقارات وإتمام مجموعاتك اللونية بذكاء!
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button onClick={onClose} className="btn btn-gold w-full">
            فهمت القواعد، فلنبدأ! 🎲
          </button>
        </div>
      </div>
    </div>
  );
};
