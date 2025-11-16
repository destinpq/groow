// Import polyfills first - this must be the very first import
import './polyfills';

// Defensive fix for Array.prototype.some to handle null/undefined arrays
import './arrayfix.js';

import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';

console.log('[APP.TSX] Loading app.tsx', new Date().toISOString());

export function rootContainer(container: any) {
  console.log('[APP.TSX] rootContainer called', { container });
  // Wrap the entire app with English locale
  return (
    <ConfigProvider locale={enUS}>
      {container}
    </ConfigProvider>
  );
}

export function render(oldRender: any) {
  console.log('[APP.TSX] render called, calling oldRender');
  oldRender();
}
