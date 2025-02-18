import * as tf from '@tensorflow/tfjs';
import { DataManager } from './data-manager';
import { PredictionModel } from './model';

export interface ModelState {
  preprocessorState: {
    means: { [key: string]: number };
    stds: { [key: string]: number };
  };
  modelPath: string;
  metadata: {
    version: string;
    createdAt: string;
    lastUpdated: string;
    metrics?: {
      accuracy: number;
      f1Score: number;
    };
  };
}

export class ModelPersistence {
  private static readonly MODEL_STATE_KEY = 'betganji_model_state';
  private static readonly MODEL_PATH = 'betganji_model';

  /**
   * Save model and its state
   */
  static async saveModel(
    model: PredictionModel,
    dataManager: DataManager,
    metrics?: { accuracy: number; f1Score: number }
  ) {
    try {
      // Save model weights
      await model.saveModel(this.MODEL_PATH);

      // Save preprocessor state and metadata
      const modelState: ModelState = {
        preprocessorState: dataManager.getState(),
        modelPath: this.MODEL_PATH,
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          metrics
        }
      };

      localStorage.setItem(
        this.MODEL_STATE_KEY,
        JSON.stringify(modelState)
      );

      return true;
    } catch (error) {
      console.error('Error saving model:', error);
      return false;
    }
  }

  /**
   * Load model and its state
   */
  static async loadModel(
    model: PredictionModel,
    dataManager: DataManager
  ): Promise<boolean> {
    try {
      // Load model state
      const stateJson = localStorage.getItem(this.MODEL_STATE_KEY);
      if (!stateJson) return false;

      const state: ModelState = JSON.parse(stateJson);

      // Load model weights
      await model.loadModel(state.modelPath);

      // Load preprocessor state
      dataManager.setState(state.preprocessorState);

      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      return false;
    }
  }

  /**
   * Check if model exists
   */
  static async modelExists(): Promise<boolean> {
    const stateJson = localStorage.getItem(this.MODEL_STATE_KEY);
    if (!stateJson) return false;

    try {
      const state: ModelState = JSON.parse(stateJson);
      const models = await tf.io.listModels();
      return !!models[`localstorage://${state.modelPath}`];
    } catch {
      return false;
    }
  }

  /**
   * Get model metadata
   */
  static getModelMetadata(): ModelState['metadata'] | null {
    try {
      const stateJson = localStorage.getItem(this.MODEL_STATE_KEY);
      if (!stateJson) return null;

      const state: ModelState = JSON.parse(stateJson);
      return state.metadata;
    } catch {
      return null;
    }
  }

  /**
   * Clear model from storage
   */
  static async clearModel(): Promise<void> {
    try {
      const stateJson = localStorage.getItem(this.MODEL_STATE_KEY);
      if (stateJson) {
        const state: ModelState = JSON.parse(stateJson);
        await tf.io.removeModel(`localstorage://${state.modelPath}`);
      }
      localStorage.removeItem(this.MODEL_STATE_KEY);
    } catch (error) {
      console.error('Error clearing model:', error);
    }
  }
}
