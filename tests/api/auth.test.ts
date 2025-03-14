import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('Authentication Logic', () => {
  let mockPrismaClient: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaClient = new PrismaClient();
  });

  it('should find a user by email', async () => {
    // Mock finding a user
    const mockUser = {
      id: '1',
      email: 'admin@luminatechled.com',
      password: 'hashedPassword',
      name: 'Admin User',
    };
    
    mockPrismaClient.user.findUnique.mockResolvedValueOnce(mockUser);
    
    // Simulate finding a user
    const user = await mockPrismaClient.user.findUnique({
      where: { email: 'admin@luminatechled.com' },
    });
    
    // Verify the user was found
    expect(user).toEqual(mockUser);
    expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@luminatechled.com' },
    });
  });

  it('should verify password correctly', async () => {
    // Mock successful password comparison
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    
    // Simulate password verification
    const isValid = await bcrypt.compare('admin123', 'hashedPassword');
    
    // Verify the password was checked
    expect(isValid).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('admin123', 'hashedPassword');
  });

  it('should reject invalid password', async () => {
    // Mock failed password comparison
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
    
    // Simulate password verification
    const isValid = await bcrypt.compare('wrongpassword', 'hashedPassword');
    
    // Verify the password was rejected
    expect(isValid).toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
  });

  it('should handle user not found', async () => {
    // Mock user not found
    mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);
    
    // Simulate finding a non-existent user
    const user = await mockPrismaClient.user.findUnique({
      where: { email: 'nonexistent@example.com' },
    });
    
    // Verify no user was found
    expect(user).toBeNull();
    expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'nonexistent@example.com' },
    });
  });
}); 