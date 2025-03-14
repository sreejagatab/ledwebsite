import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
    $connect: jest.fn(),
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

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve(null)),
}));

// Import the handler after mocking dependencies
import authHandler from '@/app/api/auth/[...nextauth]/route';

describe('Auth API', () => {
  let mockPrismaClient: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaClient = new PrismaClient();
  });
  
  describe('Credentials Provider', () => {
    it('should authenticate a user with valid credentials', async () => {
      // Mock user in database
      const mockUser = {
        id: 1,
        email: 'admin@luminatechled.com',
        password: 'hashedPassword123',
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Setup mocks
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      
      // Create mock request for credentials authentication
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        url: '/api/auth/callback/credentials',
        body: {
          email: 'admin@luminatechled.com',
          password: 'admin123',
        },
      });
      
      // Call the handler
      await authHandler(req, res);
      
      // Verify database was queried with correct email
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@luminatechled.com' },
      });
      
      // Verify password was compared
      expect(bcrypt.compare).toHaveBeenCalledWith('admin123', 'hashedPassword123');
      
      // Verify successful response
      expect(res._getStatusCode()).toBe(200);
    });
    
    it('should reject authentication with invalid email', async () => {
      // Mock no user found
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);
      
      // Create mock request
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        url: '/api/auth/callback/credentials',
        body: {
          email: 'nonexistent@example.com',
          password: 'anypassword',
        },
      });
      
      // Call the handler
      await authHandler(req, res);
      
      // Verify database was queried
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      
      // Verify password was not compared (user not found)
      expect(bcrypt.compare).not.toHaveBeenCalled();
      
      // Verify error response
      expect(res._getStatusCode()).toBe(401);
    });
    
    it('should reject authentication with invalid password', async () => {
      // Mock user in database
      const mockUser = {
        id: 1,
        email: 'admin@luminatechled.com',
        password: 'hashedPassword123',
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Setup mocks
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false); // Password doesn't match
      
      // Create mock request
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        url: '/api/auth/callback/credentials',
        body: {
          email: 'admin@luminatechled.com',
          password: 'wrongpassword',
        },
      });
      
      // Call the handler
      await authHandler(req, res);
      
      // Verify database was queried
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@luminatechled.com' },
      });
      
      // Verify password was compared
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword123');
      
      // Verify error response
      expect(res._getStatusCode()).toBe(401);
    });
  });
}); 