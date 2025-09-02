import { Router } from 'express';
import { absenceController } from './absence.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all absence requests (managers only)
router.get('/', absenceController.getAllAbsenceRequests);

// Get absence requests for a specific employee
router.get('/employee/:employeeId', absenceController.getEmployeeAbsenceRequests);

// Get absence statistics for an employee
router.get('/employee/:employeeId/statistics', absenceController.getAbsenceStatistics);

// Create a new absence request for an employee
router.post('/employee/:employeeId', absenceController.createAbsenceRequest);

// Update absence request status (managers only)
router.put('/:requestId/status', absenceController.updateAbsenceRequestStatus);

// Delete absence request
router.delete('/:requestId/employee/:employeeId', absenceController.deleteAbsenceRequest);

export { router as absenceRoutes };
