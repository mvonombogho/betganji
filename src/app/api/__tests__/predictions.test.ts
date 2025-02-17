import { NextRequest } from 'next/server';
import { POST } from '../predictions/route';
import { generatePrediction } from '@/lib/services/prediction-service';
import { getServerSession } from '@/lib/auth/verify';

// Mock dependencies
jest.mock('@/lib/services/prediction-service');
jest.mock('@/lib/auth/verify');

describe('Predictions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    // Mock no session
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/predictions', {
      method: 'POST',
      body: JSON.stringify({ matchId: '123' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('should return 400 if matchId is missing', async () => {
    // Mock authenticated session
    (getServerSession as jest.Mock).mockResolvedValue({ userId: 'user123' });

    const request = new NextRequest('http://localhost/api/predictions', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should generate and return a prediction', async () => {
    // Mock authenticated session
    (getServerSession as jest.Mock).mockResolvedValue({ userId: 'user123' });

    // Mock prediction service
    const mockPrediction = {
      id: 'pred123',
      prediction: 'WIN_HOME',
      confidence: 0.8,
      reasoning: 'Test reasoning',
    };
    (generatePrediction as jest.Mock).mockResolvedValue(mockPrediction);

    const request = new NextRequest('http://localhost/api/predictions', {
      method: 'POST',
      body: JSON.stringify({ matchId: 'match123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockPrediction);
    expect(generatePrediction).toHaveBeenCalledWith('match123', 'user123');
  });

  it('should handle prediction service errors', async () => {
    // Mock authenticated session
    (getServerSession as jest.Mock).mockResolvedValue({ userId: 'user123' });

    // Mock prediction service error
    (generatePrediction as jest.Mock).mockRejectedValue(
      new Error('Service error')
    );

    const request = new NextRequest('http://localhost/api/predictions', {
      method: 'POST',
      body: JSON.stringify({ matchId: 'match123' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
