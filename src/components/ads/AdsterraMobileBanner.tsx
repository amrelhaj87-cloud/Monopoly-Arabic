import React from 'react';

/**
 * Adsterra Mobile Banner Component
 * 320x50 size
 * Placement ID: 30861164
 */
export const AdsterraMobileBanner: React.FC = () => {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body, html { margin: 0; padding: 0; overflow: hidden; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '98cfc8d8c2810931e9c8cb1a4bb66c2c',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/98cfc8d8c2810931e9c8cb1a4bb66c2c/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div style={{ width: 320, height: 50, margin: '0 auto', overflow: 'hidden' }}>
      <iframe
        title="Adsterra Mobile Ad"
        srcDoc={adHtml}
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        style={{ display: 'block', width: '320px', height: '50px' }}
      />
    </div>
  );
};
