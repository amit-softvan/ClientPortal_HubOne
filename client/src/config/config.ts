// Application Configuration
export const config = {
  // API Configuration
  API_BASE_URL: 'http://localhost:3000/api', // Dummy URL for now
  
  // Application Settings
  APP_NAME: 'mySage RCM Portal',
  DEFAULT_PAGE_SIZE: 10,
  
  // UI Settings
  LOADING_DELAY: 3000, // 3 seconds for simulated API calls
  
  // Feature Flags
  FEATURES: {
    PA_TRACKER: false, // Temporarily hidden
    EV_TRACKER: false, // Temporarily hidden
    REPORTS: false,    // Temporarily hidden
  }
};

export default config;