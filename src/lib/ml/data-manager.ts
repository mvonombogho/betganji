import { FeatureExtractor } from './feature-extractor';
import { DataPreprocessor } from './preprocessor';
import { LabelEncoder } from './label-encoder';
import type { MatchFeatures } from '@/types/ml';

export class DataManager {
  private preprocessor: DataPreprocessor;
  private labelEncoder: LabelEncoder;

  constructor() {
    this.preprocessor = new DataPreprocessor();
    this.labelEncoder = new LabelEncoder();
  }

  /**
   * Prepare training dataset
   */
  async prepareTrainingData(matchIds: string[]) {
    // Extract features
    const features = await FeatureExtractor.extractBatchFeatures(matchIds);
    
    // Fit preprocessor to features
    this.preprocessor.fit(features);
    
    // Transform features and labels
    const X = this.preprocessor.transform(features);
    const y = this.labelEncoder.encodeResults(
      features.map(f => f.result)
    );

    return { X, y };
  }

  /**
   * Prepare features for prediction
   */
  async preparePredictionFeatures(matchId: string) {
    const features = await FeatureExtractor.extractMatchFeatures(matchId);
    if (!features) return null;

    const X = this.preprocessor.transform([features]);
    return X[0]; // Return single feature vector
  }

  /**
   * Decode model output
   */
  decodePrediction(probabilities: number[]) {
    return this.labelEncoder.decodeResult(probabilities);
  }

  /**
   * Save preprocessor state
   */
  getState() {
    return this.preprocessor.getState();
  }

  /**
   * Load preprocessor state
   */
  setState(state: { means: { [key: string]: number }, stds: { [key: string]: number } }) {
    this.preprocessor.setState(state);
  }
}
