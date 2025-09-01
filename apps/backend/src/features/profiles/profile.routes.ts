import { Router } from 'express';
import { getProfile, updateProfile, listProfiles } from './profile.controller.js';
import { authenticate, requireRole, requireManagerOrOwner } from '../../shared/middleware/auth.middleware.js';
import { UserRole } from '../../shared/types/index.js';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Get profile by ID (role-filtered)
router.get('/:id', getProfile);

// Update profile (managers or profile owner)
router.put('/:id', requireManagerOrOwner, updateProfile);

// List all profiles (managers only)
router.get('/', requireRole([UserRole.MANAGER]), listProfiles);

export { router as profileRoutes };
