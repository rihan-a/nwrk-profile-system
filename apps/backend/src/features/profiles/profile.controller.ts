import { Request, Response } from 'express';
import { findProfileById, mockProfiles } from '../../shared/services/mockData.js';
import { UserRole, EmployeeProfile } from '../../shared/types/index.js';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = findProfileById(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Filter data based on user role
    const user = req.user!;
    let filteredProfile: Partial<EmployeeProfile> = { ...profile };

    if (user.role === UserRole.COWORKER) {
      // Co-workers only see public data
      filteredProfile = {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        position: profile.position,
        department: profile.department,
        profileImage: profile.profileImage,
        bio: profile.bio,
        skills: profile.skills,
        feedback: profile.feedback,
        absenceRequests: profile.absenceRequests
      };
    } else if (user.role === UserRole.EMPLOYEE && user.id !== profile.id) {
      // Employees can only see their own full profile
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ profile: filteredProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // Basic implementation for now
    res.json({ message: 'Profile update endpoint - to be implemented in Phase 2' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const listProfiles = async (req: Request, res: Response) => {
  try {
    // Return basic profile list for managers
    const basicProfiles = mockProfiles.map(profile => ({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      position: profile.position,
      department: profile.department,
      email: profile.email,
      startDate: profile.startDate,
      employeeId: profile.employeeId
    }));

    res.json({ profiles: basicProfiles });
  } catch (error) {
    console.error('List profiles error:', error);
    res.status(500).json({ error: 'Failed to list profiles' });
  }
};
