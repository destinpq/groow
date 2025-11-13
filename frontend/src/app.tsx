// Defensive fix for Array.prototype.some to handle null/undefined arrays
import './arrayfix.js';

export function rootContainer(container: any) {
  return container;
}

export function render(oldRender: any) {
  oldRender();
}
