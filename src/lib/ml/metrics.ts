export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  classAccuracies: { [key: string]: number };
}

export class MetricsCalculator {
  private readonly CLASSES = ['HOME_WIN', 'DRAW', 'AWAY_WIN'];

  /**
   * Calculate all metrics for model evaluation
   */
  calculateMetrics(predictions: number[][], actualLabels: number[][]): ModelMetrics {
    const confusionMatrix = this.calculateConfusionMatrix(predictions, actualLabels);
    const accuracy = this.calculateAccuracy(predictions, actualLabels);
    const { precision, recall, f1Score } = this.calculatePRF1Scores(confusionMatrix);
    const classAccuracies = this.calculateClassAccuracies(confusionMatrix);

    return {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix,
      classAccuracies
    };
  }

  /**
   * Calculate confusion matrix
   */
  private calculateConfusionMatrix(predictions: number[][], actualLabels: number[][]): number[][] {
    const matrix = Array(3).fill(0).map(() => Array(3).fill(0));

    predictions.forEach((pred, i) => {
      const predictedClass = pred.indexOf(Math.max(...pred));
      const actualClass = actualLabels[i].indexOf(1);
      matrix[actualClass][predictedClass]++;
    });

    return matrix;
  }

  /**
   * Calculate overall accuracy
   */
  private calculateAccuracy(predictions: number[][], actualLabels: number[][]): number {
    let correct = 0;
    predictions.forEach((pred, i) => {
      const predictedClass = pred.indexOf(Math.max(...pred));
      const actualClass = actualLabels[i].indexOf(1);
      if (predictedClass === actualClass) correct++;
    });

    return correct / predictions.length;
  }

  /**
   * Calculate precision, recall, and F1 score
   */
  private calculatePRF1Scores(confusionMatrix: number[][]) {
    let totalPrecision = 0;
    let totalRecall = 0;
    let validClasses = 0;

    for (let i = 0; i < 3; i++) {
      const truePositive = confusionMatrix[i][i];
      const falsePositive = confusionMatrix.reduce((sum, row, j) => 
        sum + (j !== i ? row[i] : 0), 0);
      const falseNegative = confusionMatrix[i].reduce((sum, val, j) => 
        sum + (j !== i ? val : 0), 0);

      if (truePositive + falsePositive === 0 || truePositive + falseNegative === 0) {
        continue;
      }

      totalPrecision += truePositive / (truePositive + falsePositive);
      totalRecall += truePositive / (truePositive + falseNegative);
      validClasses++;
    }

    const precision = totalPrecision / validClasses;
    const recall = totalRecall / validClasses;
    const f1Score = 2 * (precision * recall) / (precision + recall);

    return { precision, recall, f1Score };
  }

  /**
   * Calculate per-class accuracies
   */
  private calculateClassAccuracies(confusionMatrix: number[][]): { [key: string]: number } {
    const accuracies: { [key: string]: number } = {};

    this.CLASSES.forEach((className, i) => {
      const truePositive = confusionMatrix[i][i];
      const totalPredictions = confusionMatrix[i].reduce((a, b) => a + b, 0);
      accuracies[className] = totalPredictions === 0 ? 0 : truePositive / totalPredictions;
    });

    return accuracies;
  }
}
