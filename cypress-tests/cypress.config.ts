import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://groow-api.destinpq.com/api/v1',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    watchForFileChanges: false,
    chromeWebSecurity: false,
    videoUploadOnPasses: true,
    env: {
      API_BASE_URL: 'https://groow-api.destinpq.com/api/v1',
      ADMIN_EMAIL: 'admin@groow.com',
      ADMIN_PASSWORD: 'Admin@123456',
      VENDOR_EMAIL: 'vendor1@groow.com',
      VENDOR_PASSWORD: 'Vendor@123456',
      CUSTOMER_EMAIL: 'customer1@groow.com',
      CUSTOMER_PASSWORD: 'Customer@123456'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

