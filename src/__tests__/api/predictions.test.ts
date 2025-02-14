import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/predictions/route';
import prisma from '@/lib/db';

jest.mock('@/lib/db', () => ({
  prediction: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn()
  }
}));

describe('/api/predictions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('returns predictions successfully', async () => {
      const mockPredictions = [
        {
          id: '1',
          result: 'HOME_WIN',
          confidence: 85,
          createdAt: new Date()
        }
      ];

      (prisma.prediction.findMany as jest.Mock).mockResolvedValue(mockPredictions);

      const { req, res } = createMocks({
        method: 'GET'
      });

      await GET(req);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockPredictions);
    });

    it('handles errors appropriately', async () => {
      (prisma.prediction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'GET'
      });

      await GET(req);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to fetch predictions'
      });
    });
  });

  describe('POST', () => {
    it('creates a prediction successfully', async () => {
      const mockPrediction = {
        matchId: '123',
        result: 'HOME_WIN',
        confidence: 85
      };

      const mockCreatedPrediction = {
        ...mockPrediction,
        id: '1',
        createdAt: new Date()
      };

      (prisma.prediction.create as jest.Mock).mockResolvedValue(mockCreatedPrediction);

      const { req, res } = createMocks({
        method: 'POST',
        body: mockPrediction
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockCreatedPrediction);
      expect(prisma.prediction.create).toHaveBeenCalledWith({
        data: mockPrediction
      });
    });

    it('validates required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {}
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Missing required fields'
      });
    });

    it('handles creation errors', async () => {
      const mockPrediction = {
        matchId: '123',
        result: 'HOME_WIN',
        confidence: 85
      };

      (prisma.prediction.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'POST',
        body: mockPrediction
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to create prediction'
      });
    });
  });
});