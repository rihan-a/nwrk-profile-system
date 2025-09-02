import { Request, Response } from 'express';
import { feedbackService } from './feedback.service.js';
import { UserRole } from '../../shared/types/index.js';

export class FeedbackController {
  // Get all feedback for a specific profile
  async getFeedbackByProfile(req: Request, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const currentUser = req.user!; // Get current user from authenticated request
      
      const feedback = await feedbackService.getFeedbackByProfileId(profileId, currentUser);
      
      res.json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch feedback'
      });
    }
  }

  // Get feedback received by the current user (for main feedback page)
  async getFeedbackReceived(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = req.user!; // Get current user from authenticated request

      const feedback = await feedbackService.getFeedbackReceivedByUser(currentUser);
      
      res.json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Error fetching received feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch received feedback'
      });
    }
  }

  // Create new feedback
  async createFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const { fromUserId, fromUserName, content, enhancedContent, isEnhanced } = req.body;

      // Validate required fields
      if (!fromUserId || !fromUserName || !content) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: fromUserId, fromUserName, content'
        });
        return;
      }

      const newFeedback = await feedbackService.createFeedback(profileId, {
        fromUserId,
        fromUserName,
        toUserId: profileId, // Set recipient to the profile being reviewed
        content,
        enhancedContent: enhancedContent || content,
        isEnhanced: isEnhanced || false
      });

      res.status(201).json({
        success: true,
        data: newFeedback
      });
    } catch (error) {
      console.error('Error creating feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create feedback'
      });
    }
  }

  // Enhance feedback text using AI
  async enhanceFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { text, employeeName } = req.body;

      if (!text) {
        res.status(400).json({
          success: false,
          error: 'Missing required field: text'
        });
        return;
      }

      // Rate limiting check (simple implementation)
      const enhancedText = await feedbackService.enhanceFeedback(text, employeeName);

      res.json({
        success: true,
        data: {
          originalText: text,
          enhancedText,
          isEnhanced: true
        }
      });
    } catch (error) {
      console.error('Error enhancing feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to enhance feedback. Please try again or submit without enhancement.',
        fallback: true
      });
    }
  }

  // Update feedback
  async updateFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { feedbackId } = req.params;
      const updates = req.body;

      const updatedFeedback = await feedbackService.updateFeedback(feedbackId, updates);

      if (!updatedFeedback) {
        res.status(404).json({
          success: false,
          error: 'Feedback not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedFeedback
      });
    } catch (error) {
      console.error('Error updating feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update feedback'
      });
    }
  }

  // Delete feedback
  async deleteFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { feedbackId } = req.params;
      const success = await feedbackService.deleteFeedback(feedbackId);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Feedback not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Feedback deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete feedback'
      });
    }
  }

  // Get feedback by ID
  async getFeedbackById(req: Request, res: Response): Promise<void> {
    try {
      const { feedbackId } = req.params;
      const feedback = await feedbackService.getFeedbackById(feedbackId);

      if (!feedback) {
        res.status(404).json({
          success: false,
          error: 'Feedback not found'
        });
        return;
      }

      res.json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch feedback'
      });
    }
  }
}

export const feedbackController = new FeedbackController();
