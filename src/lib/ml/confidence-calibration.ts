import * as tf from '@tensorflow/tfjs';

export class ConfidenceCalibrator {
  private temperatures: { [key: string]: number } = {};
  private readonly DEFAULT_TEMP = 1.0;

  /**
   * Calibrate confidence scores using temperature scaling
   */
  async calibrate(predictions: number[][], actualLabels: number[][]) {
    const outcomes = ['HOME_WIN', 'DRAW', 'AWAY_WIN'];

    // Calculate temperature for each outcome
    for (let i = 0; i < outcomes.length; i++) {
      const temp = await this.findOptimalTemperature(
        predictions.map(p => p[i]),
        actualLabels.map(l => l[i])
      );
      this.temperatures[outcomes[i]] = temp;
    }
  }

  /**
   * Find optimal temperature parameter
   */
  private async findOptimalTemperature(
    predictions: number[],
    labels: number[],
    maxIter: number = 100
  ): Promise<number> {
    let temperature = this.DEFAULT_TEMP;
    const learningRate = 0.01;

    const predTensor = tf.tensor1d(predictions);
    const labelTensor = tf.tensor1d(labels);

    try {
      for (let i = 0; i < maxIter; i++) {
        const calibratedPreds = tf.div(predTensor, temperature);
        const softmaxPreds = tf.softmax(calibratedPreds);

        // Calculate cross-entropy loss
        const loss = tf.losses.logLoss(labelTensor, softmaxPreds);
        const lossValue = await loss.array();

        // Update temperature using gradient descent
        const gradients = tf.grad(t => tf.losses.logLoss(labelTensor, tf.softmax(tf.div(predTensor, t))));
        const tempGrad = await gradients(temperature).array();

        temperature -= learningRate * tempGrad;

        // Early stopping if loss is small enough
        if (lossValue < 0.01) break;
      }

      return temperature;
    } finally {
      // Cleanup tensors
      predTensor.dispose();
      labelTensor.dispose();
    }
  }

  /**
   * Calibrate a single prediction
   */
  calibratePrediction(probabilities: number[]): number[] {
    return probabilities.map((prob, index) => {
      const outcome = ['HOME_WIN', 'DRAW', 'AWAY_WIN'][index];
      const temp = this.temperatures[outcome] || this.DEFAULT_TEMP;
      return this.applyTemperatureScaling(prob, temp);
    });
  }

  private applyTemperatureScaling(probability: number, temperature: number): number {
    return 1 / (1 + Math.exp(-Math.log(probability) / temperature));
  }

  /**
   * Get calibrator state for saving
   */
  getState() {
    return {
      temperatures: this.temperatures
    };
  }

  /**
   * Load calibrator state
   */
  setState(state: { temperatures: { [key: string]: number } }) {
    this.temperatures = state.temperatures;
  }
}
