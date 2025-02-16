import { User } from '@/types/user';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

class AuthService {
  private static instance: AuthService;
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
  };
  private listeners: Set<(state: AuthState) => void> = new Set();

  private constructor() {
    // Initialize auth state
    this.checkAuthState();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const user = await response.json();
      this.setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const user = await response.json();
      this.setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async checkAuthState(): Promise<void> {
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const user = await response.json();
        this.setState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        this.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    // Immediately call listener with current state
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setState(newState: AuthState): void {
    this.state = newState;
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): AuthState {
    return this.state;
  }
}

export const authService = AuthService.getInstance();
