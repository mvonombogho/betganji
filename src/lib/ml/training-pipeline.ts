import { PredictionModel } from './model';
import { DataManager } from './data-manager';
import { MetricsCalculator } from './metrics';
import { ModelPersistence } from './model-persistence';
import type { TrainingConfig } from './training-config';
import type { ModelMetrics } from './metrics';

export interface TrainingProgress {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
}

export interface TrainingResult {
  success: boolean;
  metrics?: ModelMetrics;
  error?: string;
  history?: TrainingProgress[];
}

export class TrainingPipeline {
  private model: PredictionModel;
  private dataManager: DataManager;
  private metricsCalculator: MetricsCalculator;

  constructor() {
    this.model = new PredictionModel();
    this.dataManager = new DataManager();
    this.metricsCalculator = new MetricsCalculator();
  }

  /**
   * Train model on historical match data
   */
  async trainModel(
    matchIds: string[],
    config?: Partial<TrainingConfig>,
    onProgress?: (progress: TrainingProgress) => void
  ): Promise<TrainingResult> {
    try {
      // Initialize model
      await this.model.initialize();

      // Prepare training data
      const { X, y } = await this.dataManager.prepareTrainingData(matchIds);

      // Training history
      const history: TrainingProgress[] = [];

      // Train model
      await this.model.train(X, y, config, {
        onEpochEnd: (epoch, logs) => {
          const progress: TrainingProgress = {
            epoch,
            loss: logs.loss,
            accuracy: logs.accuracy,
            valLoss: logs.val_loss,
            valAccuracy: logs.val_accuracy
          };
          history.push(progress);
          onProgress?.(progress);
        }
      });

      // Make predictions for evaluation
      const predictions = await Promise.all(
        X.map(features => this.model.predict(features))
      );

      // Calculate metrics
      const metrics = this.metricsCalculator.calculateMetrics(predictions, y);

      // Save model
      await ModelPersistence.saveModel(this.model, this.dataManager, {
        accuracy: metrics.accuracy,
        f1Score: metrics.f1Score
      });

      return {
        success: true,
        metrics,
        history
      };
    } catch (error) {
      console.error('Training error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Make prediction for a match
   */
  async predict(matchId: string) {
    try {
      // Load model if needed
      if (!(await ModelPersistence.modelExists())) {
        throw new Error('Model not trained');
      }

      // Load model and state
      await ModelPersistence.loadModel(this.model, this.dataManager);

      // Prepare features
      const features = await this.dataManager.preparePredictionFeatures(matchId);
      if (!features) {
        throw new Error('Could not prepare features for match');
      }

      // Make prediction
      const probabilities = await this.model.predict(features);
      return this.dataManager.decodePrediction(probabilities);
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  /**
   * Get model metadata
   */
  getModelInfo() {
    return ModelPersistence.getModelMetadata();
  }

  /**
   * Clear trained model
   */
  async clearModel() {
    await ModelPersistence.clearModel();
  }
}
