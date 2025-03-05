// Create IDs for mock data
const createId = () => Math.random().toString(36).substring(2, 15);

export interface MockUser {
  id: string;
  email: string;
  name: string;
  password: string; // In a real app, this would be hashed
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: createId(),
    email: 'john.doe@example.com',
    name: 'John Doe',
    password: 'password123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    password: 'password123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    email: 'alex.johnson@example.com',
    name: 'Alex Johnson',
    password: 'password123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    email: 'sarah.williams@example.com',
    name: 'Sarah Williams',
    password: 'password123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    email: 'user@example.com',
    name: 'Demo User',
    password: 'demo1234',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Utility functions
export const getUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const authenticateUser = (email: string, password: string): MockUser | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};
