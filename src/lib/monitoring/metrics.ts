import { Gauge, Counter, register } from 'prom-client';

// Initialize metrics
const activeUsers = new Gauge({
  name: 'betganji_active_users',
  help: 'Number of active users',
});

const predictionCounter = new Counter({
  name: 'betganji_predictions_total',
  help: 'Total number of predictions made',
});

const predictionAccuracy = new Gauge({
  name: 'betganji_prediction_accuracy',
  help: 'Prediction accuracy percentage',
});

const apiLatency = new Gauge({
  name: 'betganji_api_latency',
  help: 'API endpoint latency in milliseconds',
  labelNames: ['endpoint'],
});

export const metrics = {
  activeUsers,
  predictionCounter,
  predictionAccuracy,
  apiLatency,
  register,
};
