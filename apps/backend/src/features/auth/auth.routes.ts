import { Router } from 'express';
import { login, logout, getCurrentUser } from './auth.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export { router as authRoutes };
