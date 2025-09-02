import { Request, Response } from 'express';
import { findProfileById, mockProfiles, updateProfileById } from '../../shared/services/mockData.js';
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
      if (user.id === profile.id) {
        // Co-workers can see their own full profile
        filteredProfile = { ...profile };
      } else {
        // Co-workers only see public data for other profiles
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
      }
    } else if (user.role === UserRole.EMPLOYEE && user.id !== profile.id) {
      // Employees can see other profiles with limited public data (same as co-workers)
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
    }

    res.json({ profile: filteredProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const updateData = req.body;

    // Check if user can edit this profile
    if (user.role !== UserRole.MANAGER && user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedProfile = updateProfileById(id, updateData);
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: updatedProfile, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const listProfiles = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { search, department, role } = req.query;

    // Only managers can list all profiles
    if (user.role !== UserRole.MANAGER) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let filteredProfiles = mockProfiles;

    // Apply search filter
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.firstName.toLowerCase().includes(searchLower) ||
        profile.lastName.toLowerCase().includes(searchLower) ||
        profile.position.toLowerCase().includes(searchLower) ||
        profile.department.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (department && typeof department === 'string') {
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.department === department
      );
    }

    // Return comprehensive profile data for managers
    const profiles = filteredProfiles.map(profile => ({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      position: profile.position,
      department: profile.department,
      email: profile.email,
      phone: profile.phone,
      salary: profile.salary,
      startDate: profile.startDate,
      employeeId: profile.employeeId,
      performanceRating: profile.performanceRating,
      profileImage: profile.profileImage
    }));

    res.json({ profiles, total: profiles.length });
  } catch (error) {
    console.error('List profiles error:', error);
    res.status(500).json({ error: 'Failed to list profiles' });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = [...new Set(mockProfiles.map(profile => profile.department))];
    res.json({ departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to get departments' });
  }
};

export const browseProfiles = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { search, department } = req.query;

    // Co-workers and employees can browse profiles for feedback
    if (user.role === UserRole.MANAGER) {
      return res.status(400).json({ error: 'Use /list/all endpoint for managers' });
    }

    let filteredProfiles = mockProfiles;

    // Apply search filter
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.firstName.toLowerCase().includes(searchLower) ||
        profile.lastName.toLowerCase().includes(searchLower) ||
        profile.position.toLowerCase().includes(searchLower) ||
        profile.department.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (department && typeof department === 'string') {
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.department === department
      );
    }

    // Return only public data for co-workers and employees
    const profiles = filteredProfiles.map(profile => ({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      position: profile.position,
      department: profile.department,
      profileImage: profile.profileImage,
      bio: profile.bio,
      skills: profile.skills,
      // Include feedback count for context
      feedbackCount: profile.feedback.length,
      // Include current user indicator
      isCurrentUser: profile.id === user.id
    }));

    res.json({ profiles, total: profiles.length });
  } catch (error) {
    console.error('Browse profiles error:', error);
    res.status(500).json({ error: 'Failed to browse profiles' });
  }
};
