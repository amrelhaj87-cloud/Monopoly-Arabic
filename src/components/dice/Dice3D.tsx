import React, { useState, useEffect } from 'react';

interface Dice3DProps {
  dice: [number, number];
  isRolling?: boolean;
  onRollClick?: () => void;
  canRoll?: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({ dice, isRolling = false, onRollClick, canRoll = false }) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isRolling) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 600);
      return () => clearTimeout(t);
    }
  }, [isRolling, dice]);

  const renderDiceFace = (value: number) => {
    switch (value) {
      case 1:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="dice-dot-red" />
          </div>
        );
      case 2:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px' }}>
            <div className="dice-dot-black" style={{ alignSelf: 'flex-start' }} />
            <div className="dice-dot-black" style={{ alignSelf: 'flex-end' }} />
          </div>
        );
      case 3:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px' }}>
            <div className="dice-dot-black" style={{ alignSelf: 'flex-start' }} />
            <div className="dice-dot-black" style={{ alignSelf: 'center' }} />
            <div className="dice-dot-black" style={{ alignSelf: 'flex-end' }} />
          </div>
        );
      case 4:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="dice-dot-red" style={{ width: '16px', height: '16px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
          </div>
        );
      case 6:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
          </div>
        );
      default:
        return <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>{value}</span>;
    }
  };

  const isDouble = dice[0] === dice[1];
  const total = (dice[0] || 1) + (dice[1] || 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '8px 0', userSelect: 'none' }}>
      {/* Dice Cubes Row */}
      <div
        onClick={canRoll ? onRollClick : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: canRoll ? 'pointer' : 'default',
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1.5px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        }}
        title={canRoll ? 'انقر لرمي النرد' : undefined}
      >
        {/* Die 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div className={`dice-cube-large ${animating ? 'dice-rolling' : ''}`}>
            {renderDiceFace(dice[0] || 1)}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 900, background: '#090d16', color: '#f59e0b', border: '1px solid #f59e0b', padding: '2px 10px', borderRadius: '9999px' }}>
            {dice[0] || 1}
          </span>
        </div>

        {/* Plus Symbol */}
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fcd34d' }}>+</span>

        {/* Die 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div className={`dice-cube-large ${animating ? 'dice-rolling' : ''}`} style={{ animationDelay: '0.08s' }}>
            {renderDiceFace(dice[1] || 1)}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 900, background: '#090d16', color: '#f59e0b', border: '1px solid #f59e0b', padding: '2px 10px', borderRadius: '9999px' }}>
            {dice[1] || 1}
          </span>
        </div>
      </div>

      {/* Dice Total Banner */}
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
          border: '1.5px solid #f59e0b',
          padding: '6px 16px',
          borderRadius: '9999px',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          fontWeight: 800
        }}>
          <span style={{ color: '#94a3b8' }}>المجموع:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fde047' }}>{total}</span>
          <span style={{ color: '#cbd5e1' }}>خطوات</span>
        </div>

        {isDouble && !animating && (
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 900,
            color: '#fef08a',
            background: 'rgba(180, 83, 9, 0.8)',
            border: '1.5px solid #f59e0b',
            padding: '6px 14px',
            borderRadius: '9999px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
          }}>
            🔥 دبل ({dice[0]} + {dice[1]})!
          </span>
        )}
      </div>
    </div>
  );
};
