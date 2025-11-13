// Defensive fix for Array.prototype.some to handle null/undefined arrays
import './arrayfix.js';

console.log('[APP.TSX] Loading app.tsx', new Date().toISOString());

export function rootContainer(container: any) {
  console.log('[APP.TSX] rootContainer called', { container });
  return container;
}

export function render(oldRender: any) {
  console.log('[APP.TSX] render called, calling oldRender');
  oldRender();
}
