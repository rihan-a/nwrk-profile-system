import { Request, Response } from 'express';
import { absenceService } from './absence.service.js';
import { AbsenceStatus } from '../../shared/types/index.js';

export class AbsenceController {
  // Get absence requests for a specific employee
  async getEmployeeAbsenceRequests(req: Request, res: Response): Promise<void> {
    try {
      const { employeeId } = req.params;
      const requests = absenceService.getAbsenceRequestsByEmployeeId(employeeId);
      
      res.json({
        success: true,
        data: requests
      });
    } catch (error) {
      console.error('Error fetching employee absence requests:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch absence requests'
      });
    }
  }

  // Get all absence requests (for managers)
  async getAllAbsenceRequests(req: Request, res: Response): Promise<void> {
    try {
      const requests = absenceService.getAllAbsenceRequests();
      
      res.json({
        success: true,
        data: requests
      });
    } catch (error) {
      console.error('Error fetching all absence requests:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch absence requests'
      });
    }
  }

  // Create a new absence request
  async createAbsenceRequest(req: Request, res: Response): Promise<void> {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate, reason } = req.body;

      // Validate required fields
      if (!startDate || !endDate || !reason) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: startDate, endDate, reason'
        });
        return;
      }

      const newRequest = absenceService.createAbsenceRequest(employeeId, {
        startDate,
        endDate,
        reason: reason.trim()
      });

      res.status(201).json({
        success: true,
        data: newRequest,
        message: 'Absence request created successfully'
      });
    } catch (error) {
      console.error('Error creating absence request:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to create absence request'
        });
      }
    }
  }

  // Update absence request status (for managers)
  async updateAbsenceRequestStatus(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      const managerId = (req as Request & { user?: { id: string; role: string } }).user?.id;

      if (!managerId) {
        res.status(401).json({
          success: false,
          error: 'Manager authentication required'
        });
        return;
      }

      // Validate status
      if (!Object.values(AbsenceStatus).includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Invalid status. Must be pending, approved, or rejected'
        });
        return;
      }

      const updatedRequest = absenceService.updateAbsenceRequestStatus(
        requestId, 
        status, 
        managerId
      );

      res.json({
        success: true,
        data: updatedRequest,
        message: `Absence request ${status} successfully`
      });
    } catch (error) {
      console.error('Error updating absence request status:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to update absence request status'
        });
      }
    }
  }

  // Delete absence request
  async deleteAbsenceRequest(req: Request, res: Response): Promise<void> {
    try {
      const { requestId, employeeId } = req.params;
      const currentUserId = (req as Request & { user?: { id: string; role: string } }).user?.id;

      if (!currentUserId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Check if user is the owner or a manager
      const isOwner = currentUserId === employeeId;
      const isManager = (req as Request & { user?: { id: string; role: string } }).user?.role === 'manager';

      if (!isOwner && !isManager) {
        res.status(403).json({
          success: false,
          error: 'Not authorized to delete this absence request'
        });
        return;
      }

      const success = absenceService.deleteAbsenceRequest(requestId, employeeId);

      if (success) {
        res.json({
          success: true,
          message: 'Absence request deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete absence request'
        });
      }
    } catch (error) {
      console.error('Error deleting absence request:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete absence request'
        });
      }
    }
  }

  // Get absence statistics for an employee
  async getAbsenceStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { employeeId } = req.params;
      const stats = absenceService.getAbsenceStatistics(employeeId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching absence statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch absence statistics'
      });
    }
  }
}

export const absenceController = new AbsenceController();
