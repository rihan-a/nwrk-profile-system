import { Request, Response } from 'express';
import { User, UserRole } from '../../shared/types/index.js';
import { findUserByEmail, createSession, removeSession } from '../../shared/services/mockData.js';

interface LoginRequest {
  email: string;
  role: UserRole;
}

interface AuthResponse {
  user: User;
  token?: string;
}

export const login = async (req: Request, res: Response) => {
  try {
    console.log('🔐 Backend login request received:', req.body);
    const { email, role }: LoginRequest = req.body;

    if (!email || !role) {
      console.log('❌ Missing email or role');
      return res.status(400).json({ 
        error: 'Email and role are required' 
      });
    }

    console.log('🔍 Looking for user with email:', email);
    const user = findUserByEmail(email);
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    console.log('✅ User found:', user);
    // For demo purposes, allow any role with the email
    // In production, this would validate against the user's actual role
    const sessionId = createSession(user);
    console.log('🔑 Session created:', sessionId);

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token: sessionId
    };

    console.log('📤 Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    
    if (sessionId) {
      removeSession(sessionId);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({ user: req.user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get current user' });
  }
};
