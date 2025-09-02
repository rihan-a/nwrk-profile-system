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
  },
  {
    id: '4',
    email: 'john.smith@newwork.com',
    role: UserRole.MANAGER,
    firstName: 'John',
    lastName: 'Smith'
  },
  {
    id: '5',
    email: 'lisa.rodriguez@newwork.com',
    role: UserRole.MANAGER,
    firstName: 'Lisa',
    lastName: 'Rodriguez'
  },
  {
    id: '6',
    email: 'david.kim@newwork.com',
    role: UserRole.EMPLOYEE,
    firstName: 'David',
    lastName: 'Kim'
  },
  {
    id: '7',
    email: 'emma.thompson@newwork.com',
    role: UserRole.EMPLOYEE,
    firstName: 'Emma',
    lastName: 'Thompson'
  },
  {
    id: '8',
    email: 'alex.patel@newwork.com',
    role: UserRole.EMPLOYEE,
    firstName: 'Alex',
    lastName: 'Patel'
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
    // profileImage: 'https://avatar.iran.liara.run/username?username=Sarah+Johnson', // Removed for performance
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
    // profileImage: 'https://avatar.iran.liara.run/username?username=Michael+Chen', // Removed for performance
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
        toUserId: '2', // Recipient is Michael (id: '2')
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
      },
      {
        id: '2',
        startDate: '2024-03-10',
        endDate: '2024-03-12',
        reason: 'Vacation - Family trip',
        status: AbsenceStatus.PENDING,
        createdAt: '2024-02-15T10:30:00Z',
        updatedAt: '2024-02-15T10:30:00Z'
      }
    ]
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    position: 'Product Designer',
    department: 'Design',
    // profileImage: 'https://avatar.iran.liara.run/username?username=Emily+Davis', // Removed for performance
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
    absenceRequests: [
      {
        id: '3',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        reason: 'Sick leave',
        status: AbsenceStatus.APPROVED,
        createdAt: '2024-02-19T08:00:00Z',
        updatedAt: '2024-02-19T09:15:00Z'
      }
    ]
  },
  {
    id: '4',
    firstName: 'John',
    lastName: 'Smith',
    position: 'Engineering Manager',
    department: 'Engineering',
    // profileImage: 'https://avatar.iran.liara.run/username?username=John+Smith', // Removed for performance
    bio: 'Experienced engineering leader with 10+ years managing high-performing development teams.',
    skills: ['Team Leadership', 'Agile Management', 'System Architecture', 'Python', 'AWS'],
    email: 'john.smith@newwork.com',
    phone: '+1-555-0101',
    salary: 120000,
    startDate: '2019-01-15',
    employeeId: 'EMP004',
    address: '123 Tech Drive, Silicon Valley, CA 94025',
    emergencyContact: {
      name: 'Jennifer Smith',
      phone: '+1-555-0102',
      relationship: 'Spouse'
    },
    performanceRating: 4.8,
    certifications: ['AWS Solutions Architect', 'PMP', 'CSM'],
    workHistory: [
      { company: 'Google', position: 'Senior Engineer', duration: '2015-2018' },
      { company: 'Microsoft', position: 'Software Engineer', duration: '2012-2015' }
    ],
    feedback: [],
    absenceRequests: []
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Rodriguez',
    position: 'HR Manager',
    department: 'Human Resources',
    // profileImage: 'https://avatar.iran.liara.run/username?username=Lisa+Rodriguez', // Removed for performance
    bio: 'Strategic HR leader with expertise in talent acquisition and employee development.',
    skills: ['Talent Management', 'Employee Relations', 'HR Strategy', 'Performance Management'],
    email: 'lisa.rodriguez@newwork.com',
    phone: '+1-555-0107',
    salary: 110000,
    startDate: '2018-09-01',
    employeeId: 'EMP005',
    address: '321 HR Avenue, Business District, CA 90212',
    emergencyContact: {
      name: 'Carlos Rodriguez',
      phone: '+1-555-0108',
      relationship: 'Spouse'
    },
    performanceRating: 4.7,
    certifications: ['SHRM-CP', 'PHR'],
    workHistory: [
      { company: 'Salesforce', position: 'HR Specialist', duration: '2016-2018' }
    ],
    feedback: [],
    absenceRequests: [
      {
        id: '4',
        startDate: '2024-04-01',
        endDate: '2024-04-05',
        reason: 'Vacation - Spring break',
        status: AbsenceStatus.PENDING,
        createdAt: '2024-02-01T11:00:00Z',
        updatedAt: '2024-02-01T11:00:00Z'
      }
    ]
  },
  {
    id: '6',
    firstName: 'David',
    lastName: 'Kim',
    position: 'Sales Representative',
    department: 'Sales',
    // profileImage: 'https://avatar.iran.liara.run/username?username=David+Kim', // Removed for performance
    bio: 'Results-driven sales professional with a track record of exceeding targets.',
    skills: ['B2B Sales', 'CRM Systems', 'Negotiation', 'Client Relations', 'Sales Strategy'],
    email: 'david.kim@newwork.com',
    phone: '+1-555-0109',
    salary: 75000,
    startDate: '2022-01-15',
    employeeId: 'EMP006',
    address: '654 Sales Street, Commerce City, CA 90213',
    emergencyContact: {
      name: 'Grace Kim',
      phone: '+1-555-0110',
      relationship: 'Spouse'
    },
    performanceRating: 4.3,
    certifications: ['Salesforce Sales', 'HubSpot Sales'],
    workHistory: [
      { company: 'Oracle', position: 'Account Executive', duration: '2020-2022' }
    ],
    feedback: [],
    absenceRequests: [
      {
        id: '5',
        startDate: '2024-05-15',
        endDate: '2024-05-17',
        reason: 'Vacation - Long weekend trip',
        status: AbsenceStatus.PENDING,
        createdAt: '2024-03-01T14:20:00Z',
        updatedAt: '2024-03-01T14:20:00Z'
      }
    ]
  },
  {
    id: '7',
    firstName: 'Emma',
    lastName: 'Thompson',
    position: 'Marketing Specialist',
    department: 'Marketing',
    // profileImage: 'https://avatar.iran.liara.run/username?username=Emma+Thompson', // Removed for performance
    bio: 'Creative marketer with expertise in digital campaigns and brand development.',
    skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics', 'Brand Strategy'],
    email: 'emma.thompson@newwork.com',
    phone: '+1-555-0111',
    salary: 70000,
    startDate: '2022-03-01',
    employeeId: 'EMP007',
    address: '987 Marketing Blvd, Creative District, CA 90214',
    emergencyContact: {
      name: 'James Thompson',
      phone: '+1-555-0112',
      relationship: 'Spouse'
    },
    performanceRating: 4.2,
    certifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot Marketing'],
    workHistory: [
      { company: 'Meta', position: 'Marketing Coordinator', duration: '2020-2022' }
    ],
    feedback: [],
    absenceRequests: [
      {
        id: '6',
        startDate: '2024-04-20',
        endDate: '2024-04-20',
        reason: 'Sick leave - Doctor appointment',
        status: AbsenceStatus.APPROVED,
        createdAt: '2024-04-19T08:30:00Z',
        updatedAt: '2024-04-19T10:15:00Z'
      },
      {
        id: '7',
        startDate: '2024-06-10',
        endDate: '2024-06-14',
        reason: 'Vacation - Summer break',
        status: AbsenceStatus.PENDING,
        createdAt: '2024-02-28T16:45:00Z',
        updatedAt: '2024-02-28T16:45:00Z'
      }
    ]
  },
  {
    id: '8',
    firstName: 'Alex',
    lastName: 'Patel',
    position: 'Junior Developer',
    department: 'Engineering',
    // profileImage: 'https://avatar.iran.liara.run/username?username=Alex+Patel', // Removed for performance
    bio: 'Eager junior developer with strong foundation in modern web technologies.',
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Git', 'REST APIs'],
    email: 'alex.patel@newwork.com',
    phone: '+1-555-0113',
    salary: 65000,
    startDate: '2023-06-01',
    employeeId: 'EMP008',
    address: '147 Dev Lane, Tech Hub, CA 90215',
    emergencyContact: {
      name: 'Priya Patel',
      phone: '+1-555-0114',
      relationship: 'Sister'
    },
    performanceRating: 4.0,
    certifications: ['React Developer', 'JavaScript Fundamentals'],
    workHistory: [    ],
    feedback: [],
    absenceRequests: [
      {
        id: '8',
        startDate: '2024-03-25',
        endDate: '2024-03-29',
        reason: 'Vacation - Spring break',
        status: AbsenceStatus.REJECTED,
        createdAt: '2024-02-15T11:00:00Z',
        updatedAt: '2024-02-16T09:30:00Z'
      }
    ]
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

export const updateProfileById = (id: string, updateData: Partial<EmployeeProfile>): EmployeeProfile | undefined => {
  const profileIndex = mockProfiles.findIndex(profile => profile.id === id);
  if (profileIndex === -1) return undefined;
  
  mockProfiles[profileIndex] = { ...mockProfiles[profileIndex], ...updateData };
  return mockProfiles[profileIndex];
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
