export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  preferences?: UserPreferences;
  settings?: UserSettings;
}

export interface UserPreferences {
  defaultStake?: number;
  riskTolerance?: 'low' | 'medium' | 'high';
  preferredMarkets?: string[];
  notifications?: {
    email?: boolean;
    push?: boolean;
    odds?: boolean;
    predictions?: boolean;
  };
}

export interface UserSettings {
  timezone?: string;
  currency?: string;
  oddsFormat?: 'decimal' | 'fractional' | 'american';
  language?: string;
  theme?: 'light' | 'dark' | 'system';
}

export type UserRole = 'user' | 'premium' | 'admin';

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
  role: UserRole;
}
