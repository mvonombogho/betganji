'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MatchAnalysis() {
  const [matchInfo, setMatchInfo] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!matchInfo.trim()) {
      setError('Please enter match information');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchInfo })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze match');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Match Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter match information (teams, recent form, injuries, etc.)"
            value={matchInfo}
            onChange={(e) => setMatchInfo(e.target.value)}
            className="min-h-[150px] mb-4"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Analyzing...' : 'Analyze Match'}
          </Button>

          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}

          {analysis && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {analysis}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
