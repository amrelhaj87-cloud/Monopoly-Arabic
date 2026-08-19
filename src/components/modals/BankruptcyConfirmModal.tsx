import React from 'react';
import { AlertTriangle, X, Skull } from 'lucide-react';

interface BankruptcyConfirmModalProps {
  isOpen: boolean;
  playerName?: string;
  playerCash?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation dialog before declaring bankruptcy — an irreversible action.
 * Shown to the human player when they click "declare bankruptcy".
 */
export const BankruptcyConfirmModal: React.FC<BankruptcyConfirmModalProps> = ({
  isOpen,
  playerName,
  playerCash,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div
        className="modal-content animate-scaleUp text-center"
        style={{ maxWidth: '360px', borderColor: '#ef4444', boxShadow: '0 0 40px rgba(239,68,68,0.35)' }}
      >
        {/* Warning icon */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-14 h-14 rounded-full bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center shadow-lg">
            <Skull size={28} className="text-rose-400" />
          </div>
          <h3 className="text-lg font-black text-rose-300">إعلان الإفلاس!</h3>
        </div>

        {/* Warning box */}
        <div className="bg-rose-950/50 border border-rose-600/50 rounded-xl px-4 py-3 mb-4 text-right text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertTriangle size={16} className="shrink-0" />
            <span>هذا الإجراء لا يمكن التراجع عنه</span>
          </div>
          <p>
            إذا أعلنت الإفلاس، ستخرج من المباراة فوراً وستخسر جميع عقاراتك
            {playerCash !== undefined && playerCash > 0 && ` وأموالك (${playerCash} $)`}.
          </p>
          <p className="text-slate-400">
            قبل الاستسلام، فكّر في رهن عقاراتك أو بيع المنازل لتوفير السيولة.
          </p>
        </div>

        {/* Player name display */}
        {playerName && (
          <p className="text-[11px] text-slate-400 mb-4">
            اللاعب: <strong className="text-white">{playerName}</strong>
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="btn btn-outline flex-1 text-sm"
            autoFocus
          >
            <X size={15} />
            تراجع
          </button>
          <button
            onClick={onConfirm}
            className="btn flex-1 text-sm font-black"
            style={{ backgroundColor: '#dc2626', color: 'white', border: '1px solid #ef4444' }}
          >
            <Skull size={15} />
            أعلن الإفلاس
          </button>
        </div>
      </div>
    </div>
  );
};
