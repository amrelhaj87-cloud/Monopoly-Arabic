import React from 'react';

/**
 * Adsterra Desktop Banner Component
 * 160x600 size
 * Placement ID: 30861165
 */
export const AdsterraDesktopBanner: React.FC = () => {
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
            'key' : 'f31a297fcbc2dfc18b704c32b90b84df',
            'format' : 'iframe',
            'height' : 600,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/f31a297fcbc2dfc18b704c32b90b84df/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div style={{ width: 160, height: 600, overflow: 'hidden' }}>
      <iframe
        title="Adsterra Desktop Ad"
        srcDoc={adHtml}
        width="160"
        height="600"
        frameBorder="0"
        scrolling="no"
        style={{ display: 'block', width: '160px', height: '600px' }}
      />
    </div>
  );
};
