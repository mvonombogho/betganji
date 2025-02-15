import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LeaguePredictionModel } from '@/types/league';
import { Badge } from '@/components/ui/badge';

interface LeagueModelConfigProps {
  model: LeaguePredictionModel;
  onUpdateModel: (model: LeaguePredictionModel) => Promise<void>;
}

const LeagueModelConfig: React.FC<LeagueModelConfigProps> = ({
  model,
  onUpdateModel,
}) => {
  const [weights, setWeights] = useState(model.weights);
  const [features, setFeatures] = useState(model.modelFeatures);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => {
      const newWeights = { ...prev, [key]: value };
      const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
      
      // Normalize weights to sum to 1
      return Object.fromEntries(
        Object.entries(newWeights).map(([k, v]) => [k, v / total])
      );
    });
  };

  const handleFeatureToggle = (key: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onUpdateModel({
        ...model,
        weights,
        modelFeatures: features,
      });
    } catch (error) {
      setSaveError('Failed to update model configuration');
      console.error('Failed to update model:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>League Prediction Model Configuration</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure prediction model settings for {model.leagueId}
          </p>
        </div>
        <Badge variant={model.accuracy >= 70 ? "success" : "warning"}>
          {model.accuracy.toFixed(1)}% Accuracy
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Model Features</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(features).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                <span className="text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => handleFeatureToggle(key as keyof typeof features)}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Feature Weights</h3>
          <div className="space-y-6">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm capitalize">
                    {key.replace(/Weight/, '').replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[value * 100]}
                  onValueChange={([newValue]) => handleWeightChange(key as keyof typeof weights, newValue / 100)}
                  max={100}
                  step={1}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Model Statistics</h3>
              <p className="text-sm text-muted-foreground">
                Based on {model.totalPredictions} predictions
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                Successful Predictions: {model.successfulPredictions}
              </p>
              <p className="text-sm text-muted-foreground">
                ({((model.successfulPredictions / model.totalPredictions) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>

          {saveError && (
            <Alert variant="destructive">
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          <Button 
            className="w-full" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? 'Saving Changes...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueModelConfig;