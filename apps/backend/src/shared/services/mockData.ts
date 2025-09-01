import { User, UserRole, EmployeeProfile, Feedback, AbsenceRequest, AbsenceStatus } from '../types/index.js';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'manager@newwork.com',
    role: UserRole.MANAGER,
    firstName: 'Sarah',
    lastName: 'Johnson'
  },
  {
    id: '2',
    email: 'employee@newwork.com',
    role: UserRole.EMPLOYEE,
    firstName: 'Michael',
    lastName: 'Chen'
  },
  {
    id: '3',
    email: 'coworker@newwork.com',
    role: UserRole.COWORKER,
    firstName: 'Emily',
    lastName: 'Davis'
  }
];

// Mock employee profiles
export const mockProfiles: EmployeeProfile[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    position: 'Senior HR Manager',
    department: 'Human Resources',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Experienced HR professional with 8+ years in talent management and employee development.',
    skills: ['Talent Management', 'Employee Relations', 'HR Strategy', 'Performance Management'],
    email: 'sarah.johnson@newwork.com',
    phone: '+1-555-0123',
    salary: 85000,
    startDate: '2020-03-15',
    employeeId: 'EMP001',
    address: '123 Business Ave, Tech City, TC 12345',
    emergencyContact: {
      name: 'David Johnson',
      phone: '+1-555-0124',
      relationship: 'Spouse'
    },
    feedback: [],
    absenceRequests: []
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    position: 'Software Engineer',
    department: 'Engineering',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Full-stack developer passionate about clean code and user experience.',
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
    email: 'michael.chen@newwork.com',
    phone: '+1-555-0125',
    salary: 75000,
    startDate: '2021-06-10',
    employeeId: 'EMP002',
    address: '456 Tech Street, Innovation City, IC 67890',
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '+1-555-0126',
      relationship: 'Sister'
    },
    feedback: [
      {
        id: '1',
        fromUserId: '3',
        fromUserName: 'Emily Davis',
        content: 'Great team player and always willing to help with debugging issues.',
        enhancedContent: 'Michael is an exceptional team player who consistently demonstrates a collaborative spirit and is always willing to assist with debugging complex technical issues.',
        isEnhanced: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ],
    absenceRequests: [
      {
        id: '1',
        startDate: '2024-02-15',
        endDate: '2024-02-16',
        reason: 'Personal day',
        status: AbsenceStatus.APPROVED,
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-21T14:30:00Z'
      }
    ]
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    position: 'Product Designer',
    department: 'Design',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Creative designer focused on user-centered design and accessibility.',
    skills: ['UI/UX Design', 'Figma', 'Prototyping', 'User Research', 'Accessibility'],
    email: 'emily.davis@newwork.com',
    phone: '+1-555-0127',
    salary: 70000,
    startDate: '2022-01-20',
    employeeId: 'EMP003',
    address: '789 Design Lane, Creative City, CC 11111',
    emergencyContact: {
      name: 'Robert Davis',
      phone: '+1-555-0128',
      relationship: 'Father'
    },
    feedback: [],
    absenceRequests: []
  }
];

// Mock sessions (simple in-memory storage)
export const mockSessions: Map<string, User> = new Map();

// Helper functions
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const findProfileById = (id: string): EmployeeProfile | undefined => {
  return mockProfiles.find(profile => profile.id === id);
};

export const createSession = (user: User): string => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  mockSessions.set(sessionId, user);
  return sessionId;
};

export const getSessionUser = (sessionId: string): User | undefined => {
  return mockSessions.get(sessionId);
};

export const removeSession = (sessionId: string): boolean => {
  return mockSessions.delete(sessionId);
};
