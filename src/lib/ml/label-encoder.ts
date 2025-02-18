export class LabelEncoder {
  private readonly MATCH_RESULTS = ['HOME_WIN', 'DRAW', 'AWAY_WIN'];

  /**
   * Convert result string to one-hot encoded array
   */
  encodeResult(result: string): number[] {
    const index = this.MATCH_RESULTS.indexOf(result);
    if (index === -1) {
      throw new Error(`Invalid result: ${result}`);
    }

    // Create one-hot encoded array
    return this.MATCH_RESULTS.map((_, i) => i === index ? 1 : 0);
  }

  /**
   * Convert multiple results to encoded arrays
   */
  encodeResults(results: string[]): number[][] {
    return results.map(result => this.encodeResult(result));
  }

  /**
   * Convert model output probabilities to result string
   */
  decodeResult(probabilities: number[]): {
    result: string;
    confidence: number;
    probabilities: { [key: string]: number };
  } {
    // Find index with highest probability
    const maxIndex = probabilities.indexOf(Math.max(...probabilities));
    const result = this.MATCH_RESULTS[maxIndex];

    // Create probability mapping
    const probabilityMap = this.MATCH_RESULTS.reduce((map, label, index) => {
      map[label] = probabilities[index];
      return map;
    }, {} as { [key: string]: number });

    return {
      result,
      confidence: probabilities[maxIndex] * 100,
      probabilities: probabilityMap
    };
  }

  /**
   * Get list of possible results
   */
  getClasses(): string[] {
    return [...this.MATCH_RESULTS];
  }
}
