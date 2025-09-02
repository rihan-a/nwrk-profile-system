import { Router } from 'express';
import { feedbackController } from './feedback.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Apply authentication to all feedback routes
router.use(authenticate);

// Get all feedback for a specific profile
router.get('/profiles/:profileId', feedbackController.getFeedbackByProfile.bind(feedbackController));

// Get feedback received by the current user (for main feedback page)
router.get('/received', feedbackController.getFeedbackReceived.bind(feedbackController));

// Create new feedback for a profile
router.post('/profiles/:profileId', feedbackController.createFeedback.bind(feedbackController));

// Enhance feedback text using AI
router.post('/enhance', feedbackController.enhanceFeedback.bind(feedbackController));

// Get specific feedback by ID
router.get('/:feedbackId', feedbackController.getFeedbackById.bind(feedbackController));

// Update feedback
router.put('/:feedbackId', feedbackController.updateFeedback.bind(feedbackController));

// Delete feedback
router.delete('/:feedbackId', feedbackController.deleteFeedback.bind(feedbackController));

export { router as feedbackRoutes };
