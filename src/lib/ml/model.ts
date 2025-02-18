import * as tf from '@tensorflow/tfjs';
import { TrainingConfig, DEFAULT_TRAINING_CONFIG, TrainingCallbacks } from './training-config';

export class PredictionModel {
  private model: tf.LayersModel | null = null;
  private isCompiled: boolean = false;
  private trainingHistory: tf.History | null = null;

  // Previous methods remain the same...

  /**
   * Train the model
   */
  async train(
    features: number[][],
    labels: number[][],
    config: Partial<TrainingConfig> = {},
    callbacks: TrainingCallbacks = {}
  ) {
    if (!this.model || !this.isCompiled) {
      throw new Error('Model not initialized');
    }

    // Merge with default config
    const finalConfig = { ...DEFAULT_TRAINING_CONFIG, ...config };

    // Convert to tensors
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    // Setup callbacks
    const tfCallbacks = [
      tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: finalConfig.earlyStoppingPatience
      })
    ];

    if (callbacks.onEpochEnd) {
      tfCallbacks.push({
        onEpochEnd: async (epoch, logs) => {
          callbacks.onEpochEnd!(epoch, logs);
        }
      });
    }

    // Train the model
    try {
      this.trainingHistory = await this.model.fit(xs, ys, {
        batchSize: finalConfig.batchSize,
        epochs: finalConfig.epochs,
        validationSplit: finalConfig.validationSplit,
        callbacks: tfCallbacks,
        shuffle: true
      });

      if (callbacks.onTrainingEnd) {
        callbacks.onTrainingEnd(this.trainingHistory);
      }

      return this.trainingHistory;
    } finally {
      // Clean up tensors
      xs.dispose();
      ys.dispose();
    }
  }

  /**
   * Make predictions
   */
  async predict(features: number[]): Promise<number[]> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    // Convert to tensor
    const xs = tf.tensor2d([features]);

    try {
      // Get predictions
      const predictions = await this.model.predict(xs) as tf.Tensor;
      
      // Convert to array
      const probabilities = await predictions.data();
      return Array.from(probabilities);
    } finally {
      // Clean up tensors
      xs.dispose();
    }
  }

  /**
   * Save model to browser storage
   */
  async saveModel(path: string) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    await this.model.save(`localstorage://${path}`);
  }

  /**
   * Load model from browser storage
   */
  async loadModel(path: string) {
    try {
      this.model = await tf.loadLayersModel(`localstorage://${path}`);
      this.isCompiled = true;
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load model');
    }
  }

  /**
   * Get training history
   */
  getTrainingHistory() {
    return this.trainingHistory;
  }
}
