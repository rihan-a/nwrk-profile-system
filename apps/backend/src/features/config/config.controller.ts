import { Request, Response } from 'express';
import { APP_CONFIG } from '../../shared/constants.js';

/**
 * Get application configuration
 * This endpoint serves configuration constants to the frontend
 */
export const getConfig = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: APP_CONFIG
    });
  } catch (error) {
    console.error('Error fetching app config:', error);
    res.status(500).json({ 
      error: 'Failed to fetch application configuration' 
    });
  }
};
