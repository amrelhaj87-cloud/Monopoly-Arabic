import React from 'react';

/**
 * Adsterra Mobile Banner Component
 * 320x50 size
 * Placement ID: 30861164
 */
export const AdsterraMobileBanner: React.FC = () => {
  return (
    <div style={{ width: 320, height: 50, margin: '0 auto', overflow: 'hidden' }}>
      <iframe
        title="Adsterra Mobile Ad"
        src="/ad-mobile.html"
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        style={{ display: 'block', width: '320px', height: '50px' }}
      />
    </div>
  );
};
