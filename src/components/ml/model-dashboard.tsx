import React, { useState, useEffect } from 'react';
import { ModelStatus } from './model-status';
import { TrainingControls } from './training-controls';
import { TrainingProgressChart } from './training-progress-chart';
import { ConfusionMatrix } from './confusion-matrix';
import { MetricsSummary } from './metrics-summary';
import { TrainingPipeline } from '@/lib/ml/training-pipeline';
import type { TrainingProgress } from '@/lib/ml/training-pipeline';
import type { ModelMetrics } from '@/lib/ml/metrics';

export function ModelDashboard() {
  const [isTraining, setIsTraining] = useState(false);
  const [modelMetadata, setModelMetadata] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [pipeline] = useState(() => new TrainingPipeline());

  useEffect(() => {
    // Load initial model state
    const metadata = pipeline.getModelInfo();
    setModelMetadata(metadata);
  }, []);

  const handleStartTraining = async (config: {
    epochs: number;
    validationSplit: number;
    batchSize: number;
  }) => {
    setIsTraining(true);
    setTrainingProgress([]);

    try {
      const result = await pipeline.trainModel(
        [], // We'll add match IDs for training
        config,
        (progress) => {
          setTrainingProgress(prev => [...prev, progress]);
        }
      );

      if (result.success && result.metrics) {
        setMetrics(result.metrics);
        setModelMetadata(pipeline.getModelInfo());
      }
    } catch (error) {
      console.error('Training error:', error);
      // We'll add error handling
    } finally {
      setIsTraining(false);
    }
  };

  const handleStopTraining = () => {
    // We'll implement this
    setIsTraining(false);
  };

  const handleClearModel = async () => {
    try {
      await pipeline.clearModel();
      setModelMetadata(null);
      setMetrics(null);
      setTrainingProgress([]);
    } catch (error) {
      console.error('Error clearing model:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModelStatus metadata={modelMetadata} />
        <TrainingControls
          onStartTraining={handleStartTraining}
          onStopTraining={handleStopTraining}
          onClearModel={handleClearModel}
          isTraining={isTraining}
        />
      </div>

      {trainingProgress.length > 0 && (
        <TrainingProgressChart data={trainingProgress} />
      )}

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricsSummary metrics={metrics} />
          <ConfusionMatrix
            matrix={metrics.confusionMatrix}
            labels={['HOME_WIN', 'DRAW', 'AWAY_WIN']}
          />
        </div>
      )}
    </div>
  );
}
