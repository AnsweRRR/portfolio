export interface FeatureFlags {
  showSkillProgress: boolean;
  showSkillPercentage: boolean;
  showBlog: boolean;
}

export const defaultFeatureFlags: FeatureFlags = {
  showSkillProgress: false,
  showSkillPercentage: false,
  showBlog: false,
};

const getEnvironmentFeatureFlags = (): Partial<FeatureFlags> => {
  return {
    showBlog: import.meta.env.VITE_SHOW_BLOG === 'true',
  };
};

export const featureFlags: FeatureFlags = {
  ...defaultFeatureFlags,
  ...getEnvironmentFeatureFlags(),
};
