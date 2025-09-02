import express from 'express';
import { getProfile, updateProfile, listProfiles, getDepartments, browseProfiles } from './profile.controller.js';
import { authenticate, requireRole } from '../../shared/middleware/auth.middleware.js';
import { UserRole } from '../../shared/types/index.js';

const router = express.Router();

// Apply authentication to all profile routes
router.use(authenticate);

// Get departments for filtering (managers only) - must come before /:id route
router.get('/departments/list', requireRole([UserRole.MANAGER]), getDepartments);

// List all profiles (managers only) - must come before /:id route
router.get('/list/all', requireRole([UserRole.MANAGER]), listProfiles);

// Browse profiles for co-workers and employees (public data only)
router.get('/browse', browseProfiles);

// Get single profile
router.get('/:id', getProfile);

// Update profile (managers and profile owners only)
router.put('/:id', updateProfile);

export default router;
