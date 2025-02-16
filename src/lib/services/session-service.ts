import { Session, User } from '@/types/user';
import { verify, decode } from 'jsonwebtoken';

class SessionService {
  private static instance: SessionService;
  private currentSession: Session | null = null;

  private constructor() {}

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  async validateSession(token: string): Promise<boolean> {
    try {
      // Verify token
      verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Decode token to get expiry
      const decoded = decode(token) as { exp?: number } | null;
      if (!decoded?.exp) return false;

      // Check if token is expired
      const isExpired = Date.now() >= decoded.exp * 1000;
      return !isExpired;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  async refreshSession(): Promise<Session | null> {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        this.clearSession();
        return null;
      }

      const user: User = await response.json();
      const session: Session = {
        user,
        token: '', // Token is handled by HttpOnly cookie
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        role: user.role || 'user'
      };

      this.currentSession = session;
      return session;
    } catch (error) {
      console.error('Session refresh error:', error);
      this.clearSession();
      return null;
    }
  }

  getSession(): Session | null {
    return this.currentSession;
  }

  clearSession(): void {
    this.currentSession = null;
  }

  isAuthenticated(): boolean {
    return !!this.currentSession;
  }

  async checkPermission(requiredRole: string): Promise<boolean> {
    if (!this.currentSession) return false;

    const roleHierarchy: Record<string, number> = {
      'user': 1,
      'premium': 2,
      'admin': 3
    };

    const userRoleLevel = roleHierarchy[this.currentSession.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
  }
}

export const sessionService = SessionService.getInstance();
