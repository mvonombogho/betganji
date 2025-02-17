import { verifyAuth } from '../verify';
import { NextRequest } from 'next/server';

describe('Auth Verification', () => {
  it('returns false for missing token', async () => {
    const request = new NextRequest('http://localhost');
    const result = await verifyAuth(request);
    expect(result.success).toBe(false);
  });

  it('returns false for invalid token', async () => {
    const request = new NextRequest('http://localhost', {
      headers: {
        cookie: 'auth-token=invalid-token',
      },
    });

    const result = await verifyAuth(request);
    expect(result.success).toBe(false);
  });

  it('returns success and userId for valid token', async () => {
    // Create a valid token first
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ sub: 'user123' }, process.env.JWT_SECRET || 'test-secret');

    const request = new NextRequest('http://localhost', {
      headers: {
        cookie: `auth-token=${token}`,
      },
    });

    const result = await verifyAuth(request);
    expect(result.success).toBe(true);
    expect(result.userId).toBe('user123');
  });
});
