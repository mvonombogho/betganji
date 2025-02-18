import { PredictionModel } from './model';
import { ConfidenceCalibrator } from './confidence-calibration';
import type { ModelMetrics } from './metrics';

export class CalibratedModel extends PredictionModel {
  private calibrator: ConfidenceCalibrator;

  constructor() {
    super();
    this.calibrator = new ConfidenceCalibrator();
  }

  /**
   * Train model with confidence calibration
   */
  async trainWithCalibration(
    features: number[][],
    labels: number[][],
    validationSplit: number = 0.2
  ) {
    // First train the base model
    const trainSize = Math.floor(features.length * (1 - validationSplit));
    const trainFeatures = features.slice(0, trainSize);
    const trainLabels = labels.slice(0, trainSize);
    const valFeatures = features.slice(trainSize);
    const valLabels = labels.slice(trainSize);

    // Train base model
    await this.train(trainFeatures, trainLabels);

    // Get uncalibrated predictions on validation set
    const valPredictions = await Promise.all(
      valFeatures.map(f => this.predict(f))
    );

    // Calibrate confidence scores
    await this.calibrator.calibrate(valPredictions, valLabels);

    return {
      baseMetrics: await this.evaluateModel(valFeatures, valLabels),
      calibratedMetrics: await this.evaluateModel(valFeatures, valLabels, true)
    };
  }

  /**
   * Make calibrated prediction
   */
  async predictWithCalibration(features: number[]): Promise<number[]> {
    const rawPrediction = await this.predict(features);
    return this.calibrator.calibratePrediction(rawPrediction);
  }

  /**
   * Evaluate model performance
   */
  private async evaluateModel(
    features: number[][],
    labels: number[][],
    useCalibration: boolean = false
  ): Promise<{
    accuracy: number;
    calibrationError: number;
  }> {
    const predictions = await Promise.all(
      features.map(f => 
        useCalibration ? 
        this.predictWithCalibration(f) : 
        this.predict(f)
      )
    );

    let correct = 0;
    let calibrationError = 0;

    predictions.forEach((pred, i) => {
      const predictedClass = pred.indexOf(Math.max(...pred));
      const actualClass = labels[i].indexOf(1);

      if (predictedClass === actualClass) correct++;

      // Calculate calibration error (difference between confidence and accuracy)
      calibrationError += Math.abs(pred[predictedClass] - (predictedClass === actualClass ? 1 : 0));
    });

    return {
      accuracy: correct / predictions.length,
      calibrationError: calibrationError / predictions.length
    };
  }

  /**
   * Save model state including calibration
   */
  async save(path: string) {
    await super.save(path);
    localStorage.setItem(
      `${path}_calibration`,
      JSON.stringify(this.calibrator.getState())
    );
  }

  /**
   * Load model state including calibration
   */
  async load(path: string) {
    await super.load(path);
    const calibrationState = localStorage.getItem(`${path}_calibration`);
    if (calibrationState) {
      this.calibrator.setState(JSON.parse(calibrationState));
    }
  }
}
