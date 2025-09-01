import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../types/index.js';
import { getSessionUser } from '../services/mockData.js';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionId) {
      return res.status(401).json({ error: 'No session provided' });
    }

    const user = getSessionUser(sessionId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

export const requireManagerOrOwner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Managers have access to everything
  if (req.user.role === UserRole.MANAGER) {
    return next();
  }

  // Employees can only access their own profile
  const profileId = req.params.id || req.params.profileId;
  if (req.user.role === UserRole.EMPLOYEE && profileId === req.user.id) {
    return next();
  }

  res.status(403).json({ error: 'Access denied' });
};
