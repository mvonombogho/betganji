import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, StopCircle, RefreshCw, Trash2 } from 'lucide-react';

interface TrainingControlsProps {
  onStartTraining: (config: {
    epochs: number;
    validationSplit: number;
    batchSize: number;
  }) => void;
  onStopTraining: () => void;
  onClearModel: () => void;
  isTraining: boolean;
  className?: string;
}

export function TrainingControls({
  onStartTraining,
  onStopTraining,
  onClearModel,
  isTraining,
  className = ''
}: TrainingControlsProps) {
  const [epochs, setEpochs] = React.useState(100);
  const [validationSplit, setValidationSplit] = React.useState(0.2);
  const [batchSize, setBatchSize] = React.useState(32);

  const handleStartTraining = () => {
    onStartTraining({
      epochs,
      validationSplit,
      batchSize
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Training Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Number of Epochs</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[epochs]}
                onValueChange={([value]) => setEpochs(value)}
                min={10}
                max={200}
                step={10}
                className="flex-1"
              />
              <Input
                type="number"
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Validation Split</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[validationSplit * 100]}
                onValueChange={([value]) => setValidationSplit(value / 100)}
                min={10}
                max={30}
                step={5}
                className="flex-1"
              />
              <span className="w-20 text-center">
                {(validationSplit * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Batch Size</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[batchSize]}
                onValueChange={([value]) => setBatchSize(value)}
                min={16}
                max={128}
                step={16}
                className="flex-1"
              />
              <Input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            {!isTraining ? (
              <Button
                onClick={handleStartTraining}
                className="flex-1"
                variant="default"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Training
              </Button>
            ) : (
              <Button
                onClick={onStopTraining}
                className="flex-1"
                variant="destructive"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Stop Training
              </Button>
            )}

            <Button
              onClick={onClearModel}
              variant="outline"
              disabled={isTraining}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
