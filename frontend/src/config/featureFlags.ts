const normalizeBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (typeof value !== 'string') {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') {
    return true;
  }
  if (normalized === 'false') {
    return false;
  }
  return defaultValue;
};

const isDevEnvironment = process.env.NODE_ENV !== 'production';
// DISABLED: Always use real APIs, never mock data
const baseMockPreference = normalizeBoolean(process.env.REACT_APP_USE_MOCK_DATA, false);

const featureFlags = {
  useMockAuth: false, // ALWAYS use real auth API
  useMockAnalytics: false, // ALWAYS use real analytics API
  useMockVendorStats: false, // ALWAYS use real vendor stats API
};

export const shouldLogMockUsage = normalizeBoolean(
  process.env.REACT_APP_LOG_MOCK_USAGE,
  isDevEnvironment,
);

export const logMockUsage = (label: string, error?: unknown) => {
  if (!shouldLogMockUsage) {
    return;
  }

  if (error) {
    console.warn(`[MockData] ${label} – falling back to mock data.`, error);
  } else {
    console.info(`[MockData] ${label} – serving mock data.`);
  }
};

export default featureFlags;

