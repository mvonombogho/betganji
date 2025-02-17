import { generatePrediction } from '../prediction-service';
import { prisma } from '@/lib/db';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    match: {
      findUnique: jest.fn(),
    },
    prediction: {
      create: jest.fn(),
    },
  },
}));

describe('Prediction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a prediction for a valid match', async () => {
    // Mock match data
    const mockMatch = {
      id: '1',
      homeTeam: { name: 'Team A' },
      awayTeam: { name: 'Team B' },
      odds: [{
        homeWin: 2.0,
        draw: 3.0,
        awayWin: 4.0,
      }],
    };

    // Mock Prisma responses
    (prisma.match.findUnique as jest.Mock).mockResolvedValue(mockMatch);
    (prisma.prediction.create as jest.Mock).mockResolvedValue({
      id: '1',
      prediction: 'WIN_HOME',
      confidence: 0.8,
      reasoning: 'Test reasoning',
    });

    // Generate prediction
    const result = await generatePrediction('1', 'user1');

    // Assertions
    expect(result).toBeDefined();
    expect(result.prediction).toBe('WIN_HOME');
    expect(result.confidence).toBe(0.8);
    expect(prisma.match.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: expect.any(Object),
    });
  });

  it('should throw an error if match is not found', async () => {
    // Mock match not found
    (prisma.match.findUnique as jest.Mock).mockResolvedValue(null);

    // Attempt to generate prediction
    await expect(generatePrediction('1', 'user1'))
      .rejects
      .toThrow('Match or odds data not found');
  });

  it('should throw an error if odds data is missing', async () => {
    // Mock match without odds
    const mockMatch = {
      id: '1',
      homeTeam: { name: 'Team A' },
      awayTeam: { name: 'Team B' },
      odds: [],
    };

    (prisma.match.findUnique as jest.Mock).mockResolvedValue(mockMatch);

    // Attempt to generate prediction
    await expect(generatePrediction('1', 'user1'))
      .rejects
      .toThrow('Match or odds data not found');
  });
});
