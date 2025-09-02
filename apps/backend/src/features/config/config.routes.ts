import { Router } from 'express';
import { getConfig } from './config.controller.js';

const router = Router();

// Get application configuration
router.get('/', getConfig);

export default router;
