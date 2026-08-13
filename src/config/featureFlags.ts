/**
 * Feature flags configuration
 * Control feature availability across the application
 */

export interface FeatureFlags {
  showSkillProgress: boolean;
  showSkillPercentage: boolean;
}

// Default feature flag configuration
export const defaultFeatureFlags: FeatureFlags = {
  showSkillProgress: false,
  showSkillPercentage: false,
};

// Environment-specific overrides
const getEnvironmentFeatureFlags = (): Partial<FeatureFlags> => {
  // Override flags based on environment variables if needed
  return {
    // Example: showSkillProgress: import.meta.env.VITE_SHOW_SKILL_PROGRESS === 'true',
  };
};

export const featureFlags: FeatureFlags = {
  ...defaultFeatureFlags,
  ...getEnvironmentFeatureFlags(),
};
