import React from 'react';

/**
 * Adsterra Desktop Banner Component
 * 160x600 size
 * Placement ID: 30861165
 */
export const AdsterraDesktopBanner: React.FC = () => {
  return (
    <div style={{ width: 160, height: 600, overflow: 'hidden' }}>
      <iframe
        title="Adsterra Desktop Ad"
        src="/ad-desktop.html"
        width="160"
        height="600"
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        style={{ display: 'block', width: '160px', height: '600px' }}
      />
    </div>
  );
};
