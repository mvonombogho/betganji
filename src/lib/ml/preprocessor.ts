import type { MatchFeatures } from '@/types/ml';

export class DataPreprocessor {
  private featureMeans: { [key: string]: number } = {};
  private featureStds: { [key: string]: number } = {};

  // Features to normalize
  private readonly NUMERIC_FEATURES = [
    'homeFormWins', 'homeFormDraws', 'homeFormLosses',
    'homeFormGoalsScored', 'homeFormGoalsConceded',
    'awayFormWins', 'awayFormDraws', 'awayFormLosses',
    'awayFormGoalsScored', 'awayFormGoalsConceded',
    'h2hHomeWins', 'h2hAwayWins', 'h2hDraws',
    'h2hHomeGoals', 'h2hAwayGoals'
  ];

  /**
   * Fit preprocessor to training data
   */
  fit(data: MatchFeatures[]) {
    // Calculate mean and standard deviation for each feature
    this.NUMERIC_FEATURES.forEach(feature => {
      const values = data.map(d => d[feature as keyof MatchFeatures] as number);
      this.featureMeans[feature] = this.calculateMean(values);
      this.featureStds[feature] = this.calculateStd(values, this.featureMeans[feature]);
    });
  }

  /**
   * Transform features using calculated statistics
   */
  transform(features: MatchFeatures[]): number[][] {
    return features.map(feature => {
      return this.NUMERIC_FEATURES.map(featureName => {
        const value = feature[featureName as keyof MatchFeatures] as number;
        return this.standardize(value, featureName);
      });
    });
  }

  /**
   * Standardize a single value
   */
  private standardize(value: number, featureName: string): number {
    const mean = this.featureMeans[featureName];
    const std = this.featureStds[featureName];
    return std === 0 ? 0 : (value - mean) / std;
  }

  private calculateMean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateStd(values: number[], mean: number): number {
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Get preprocessor state for saving
   */
  getState() {
    return {
      means: this.featureMeans,
      stds: this.featureStds
    };
  }

  /**
   * Load preprocessor state
   */
  setState(state: { means: { [key: string]: number }, stds: { [key: string]: number } }) {
    this.featureMeans = state.means;
    this.featureStds = state.stds;
  }
}
