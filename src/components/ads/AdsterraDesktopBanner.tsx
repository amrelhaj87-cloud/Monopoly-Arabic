import React from 'react';

/**
 * Adsterra Desktop Banner Component
 * 300x250 size
 * Placement ID: 30868406
 */
export const AdsterraDesktopBanner: React.FC = () => {
  return (
    <div style={{ width: 300, height: 250, overflow: 'hidden' }}>
      <iframe
        title="Adsterra Desktop Ad"
        src="/ad-desktop.html"
        width="300"
        height="250"
        frameBorder="0"
        scrolling="no"
        style={{ display: 'block', width: '300px', height: '250px' }}
      />
    </div>
  );
};
