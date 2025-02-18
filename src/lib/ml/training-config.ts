export interface TrainingConfig {
  batchSize: number;
  epochs: number;
  validationSplit: number;
  earlyStoppingPatience: number;
  learningRate: number;
}

export const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  batchSize: 32,
  epochs: 100,
  validationSplit: 0.2,
  earlyStoppingPatience: 10,
  learningRate: 0.001
};

export interface TrainingCallbacks {
  onEpochEnd?: (epoch: number, logs: any) => void;
  onTrainingEnd?: (logs: any) => void;
}
