import { AbsenceRequest, AbsenceStatus, EmployeeProfile } from '../../shared/types/index.js';
import { mockProfiles, updateProfileById, findProfileById } from '../../shared/services/mockData.js';

export class AbsenceService {
  // Get all absence requests for a specific employee
  getAbsenceRequestsByEmployeeId(employeeId: string): AbsenceRequest[] {
    const profile = findProfileById(employeeId);
    return profile?.absenceRequests || [];
  }

  // Get all absence requests (for managers)
  getAllAbsenceRequests(): AbsenceRequest[] {
    const allRequests: AbsenceRequest[] = [];
    mockProfiles.forEach(profile => {
      allRequests.push(...profile.absenceRequests);
    });
    return allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Create a new absence request
  createAbsenceRequest(employeeId: string, requestData: {
    startDate: string;
    endDate: string;
    reason: string;
  }): AbsenceRequest {
    const profile = findProfileById(employeeId);
    if (!profile) {
      throw new Error('Employee profile not found');
    }

    // Validate dates
    this.validateAbsenceRequest(requestData);

    const newRequest: AbsenceRequest = {
      id: `absence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      reason: requestData.reason,
      status: AbsenceStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to profile
    const updatedProfile = updateProfileById(employeeId, {
      absenceRequests: [...profile.absenceRequests, newRequest]
    });

    if (!updatedProfile) {
      throw new Error('Failed to create absence request');
    }

    return newRequest;
  }

  // Update absence request status (for managers)
  updateAbsenceRequestStatus(requestId: string, status: AbsenceStatus, managerId: string): AbsenceRequest {
    // Find the request across all profiles
    let foundRequest: AbsenceRequest | null = null;
    let foundProfile: EmployeeProfile | null = null;

    for (const profile of mockProfiles) {
      const request = profile.absenceRequests.find(req => req.id === requestId);
      if (request) {
        foundRequest = request;
        foundProfile = profile;
        break;
      }
    }

    if (!foundRequest || !foundProfile) {
      throw new Error('Absence request not found');
    }

    // Update the request
    const updatedRequest: AbsenceRequest = {
      ...foundRequest,
      status,
      updatedAt: new Date().toISOString()
    };

    // Update the profile
    const updatedRequests = foundProfile.absenceRequests.map(req => 
      req.id === requestId ? updatedRequest : req
    );

    const updatedProfile = updateProfileById(foundProfile.id, {
      absenceRequests: updatedRequests
    });

    if (!updatedProfile) {
      throw new Error('Failed to update absence request');
    }

    return updatedRequest;
  }

  // Delete absence request (only if pending and by owner)
  deleteAbsenceRequest(requestId: string, employeeId: string): boolean {
    const profile = findProfileById(employeeId);
    if (!profile) {
      throw new Error('Employee profile not found');
    }

    const request = profile.absenceRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error('Absence request not found');
    }

    // Only allow deletion of pending requests
    if (request.status !== AbsenceStatus.PENDING) {
      throw new Error('Can only delete pending absence requests');
    }

    // Remove the request
    const updatedRequests = profile.absenceRequests.filter(req => req.id !== requestId);
    const updatedProfile = updateProfileById(employeeId, {
      absenceRequests: updatedRequests
    });

    return !!updatedProfile;
  }

  // Validate absence request data
  private validateAbsenceRequest(requestData: {
    startDate: string;
    endDate: string;
    reason: string;
  }): void {
    const startDate = new Date(requestData.startDate);
    const endDate = new Date(requestData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format');
    }

    // Check if start date is not in the past
    if (startDate < today) {
      throw new Error('Start date cannot be in the past');
    }

    // Check if end date is not before start date
    if (endDate < startDate) {
      throw new Error('End date cannot be before start date');
    }

    // Check if reason is provided
    if (!requestData.reason || requestData.reason.trim().length === 0) {
      throw new Error('Reason is required');
    }

    // Check if reason is not too long
    if (requestData.reason.length > 500) {
      throw new Error('Reason cannot exceed 500 characters');
    }

    // Check if request is not too far in the future (1 year limit)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (startDate > oneYearFromNow) {
      throw new Error('Cannot request absence more than 1 year in advance');
    }
  }

  // Get absence statistics for an employee
  getAbsenceStatistics(employeeId: string): {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    totalDaysRequested: number;
  } {
    const requests = this.getAbsenceRequestsByEmployeeId(employeeId);
    
    const stats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === AbsenceStatus.PENDING).length,
      approvedRequests: requests.filter(r => r.status === AbsenceStatus.APPROVED).length,
      rejectedRequests: requests.filter(r => r.status === AbsenceStatus.REJECTED).length,
      totalDaysRequested: 0
    };

    // Calculate total days for approved requests
    stats.totalDaysRequested = requests
      .filter(r => r.status === AbsenceStatus.APPROVED)
      .reduce((total, request) => {
        const start = new Date(request.startDate);
        const end = new Date(request.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);

    return stats;
  }
}

export const absenceService = new AbsenceService();
