import * as tf from '@tensorflow/tfjs';

export class PredictionModel {
  private model: tf.LayersModel | null = null;
  private isCompiled: boolean = false;

  /**
   * Build model architecture
   */
  private buildModel(): tf.LayersModel {
    const model = tf.sequential();

    // Input layer - matches our feature count
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [15], // Number of features we extract
      kernelInitializer: 'glorotNormal',
      kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
    }));

    // Add dropout to prevent overfitting
    model.add(tf.layers.dropout({ rate: 0.3 }));

    // Hidden layer 1
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      kernelInitializer: 'glorotNormal',
      kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
    }));

    // Add dropout
    model.add(tf.layers.dropout({ rate: 0.2 }));

    // Hidden layer 2
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
      kernelInitializer: 'glorotNormal',
      kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
    }));

    // Output layer - 3 classes (home win, draw, away win)
    model.add(tf.layers.dense({
      units: 3,
      activation: 'softmax',
      kernelInitializer: 'glorotNormal'
    }));

    return model;
  }

  /**
   * Initialize and compile the model
   */
  async initialize() {
    if (!this.model) {
      this.model = this.buildModel();
      
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      this.isCompiled = true;
    }
  }

  /**
   * Get model summary
   */
  getModelSummary(): string {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const summary: string[] = [];
    this.model.summary(undefined, undefined, (line) => summary.push(line));
    return summary.join('\n');
  }

  // Training and prediction methods will be added next
}
