/**
 * Feature Flag Service
 * Provides utilities to check and manage feature flags
 */

import { FeatureFlags, featureFlags } from '../config/featureFlags';

class FeatureFlagService {
  private flags: FeatureFlags;

  constructor(initialFlags: FeatureFlags) {
    this.flags = { ...initialFlags };
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(featureName: keyof FeatureFlags): boolean {
    return this.flags[featureName] as boolean;
  }

  /**
   * Enable a feature
   */
  enable(featureName: keyof FeatureFlags): void {
    this.flags[featureName] = true;
  }

  /**
   * Disable a feature
   */
  disable(featureName: keyof FeatureFlags): void {
    this.flags[featureName] = false;
  }

  /**
   * Toggle a feature
   */
  toggle(featureName: keyof FeatureFlags): void {
    this.flags[featureName] = !this.flags[featureName];
  }

  /**
   * Get all feature flags
   */
  getAll(): FeatureFlags {
    return { ...this.flags };
  }

  /**
   * Update multiple feature flags at once
   */
  setFlags(updates: Partial<FeatureFlags>): void {
    this.flags = { ...this.flags, ...updates };
  }
}

// Export singleton instance
export const featureFlagService = new FeatureFlagService(featureFlags);
