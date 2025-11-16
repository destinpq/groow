/**
 * Polyfills for modern JavaScript features
 * This file must be imported before any other code to ensure all features are available
 */

// Manual polyfill for Promise.withResolvers (ES2024)
// This is needed because some versions of core-js have issues loading this polyfill
if (typeof Promise.withResolvers === 'undefined') {
  (Promise as any).withResolvers = function <T>() {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
  };
}

// Import core-js stable features for broader browser support
import 'core-js/stable';

console.log('[POLYFILLS] Polyfills loaded successfully');

