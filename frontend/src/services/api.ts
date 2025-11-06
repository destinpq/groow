// Re-export the granular API services from the `services/api` folder so
// imports like `import { emailTemplatesAPI } from '@/services/api'` work
// across the codebase. This file preserves the old convenience import
// path (`@/services/api`) while delegating the actual implementations to
// the `src/services/api/index.ts` module.

export * from './api/index';
// Provide a default export that matches previous shape (API object)
export { API as default } from './api/index';
