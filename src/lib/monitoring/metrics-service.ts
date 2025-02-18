import { Gauge, Counter, register } from 'prom-client';

class MetricsService {
  private static instance: MetricsService;
  
  // System metrics
  private activeUsers: Gauge;
  private apiLatency: Gauge;
  private memoryUsage: Gauge;
  
  // Business metrics
  private predictionsTotal: Counter;
  private predictionAccuracy: Gauge;
  private matchesProcessed: Counter;
  
  private constructor() {
    // Initialize system metrics
    this.activeUsers = new Gauge({
      name: 'betganji_active_users',
      help: 'Current number of active users',
    });
    
    this.apiLatency = new Gauge({
      name: 'betganji_api_latency',
      help: 'API endpoint latency in milliseconds',
      labelNames: ['endpoint'],
    });
    
    this.memoryUsage = new Gauge({
      name: 'betganji_memory_usage',
      help: 'Memory usage in bytes',
    });
    
    // Initialize business metrics
    this.predictionsTotal = new Counter({
      name: 'betganji_predictions_total',
      help: 'Total number of predictions made',
    });
    
    this.predictionAccuracy = new Gauge({
      name: 'betganji_prediction_accuracy',
      help: 'Average prediction accuracy percentage',
    });
    
    this.matchesProcessed = new Counter({
      name: 'betganji_matches_processed',
      help: 'Total number of matches processed',
    });
  }
  
  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }
  
  // System metric methods
  public recordActiveUsers(count: number) {
    this.activeUsers.set(count);
  }
  
  public recordApiLatency(endpoint: string, latencyMs: number) {
    this.apiLatency.set({ endpoint }, latencyMs);
  }
  
  public updateMemoryUsage() {
    const usage = process.memoryUsage();
    this.memoryUsage.set(usage.heapUsed);
  }
  
  // Business metric methods
  public incrementPredictions() {
    this.predictionsTotal.inc();
  }
  
  public updatePredictionAccuracy(accuracy: number) {
    this.predictionAccuracy.set(accuracy);
  }
  
  public incrementMatchesProcessed() {
    this.matchesProcessed.inc();
  }
  
  // Get metrics for dashboard
  public async getMetrics() {
    return await register.metrics();
  }
  
  // Clear all metrics
  public clearMetrics() {
    register.clear();
  }
}

export const metricsService = MetricsService.getInstance();
