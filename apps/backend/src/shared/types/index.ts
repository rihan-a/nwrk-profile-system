export enum UserRole {
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  COWORKER = 'coworker'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface EmployeeProfile {
  id: string;
  // Public data (visible to co-workers)
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  profileImage?: string;
  bio?: string;
  skills: string[];
  
  // Sensitive data (manager/owner only)
  email: string;
  phone: string;
  salary: number;
  startDate: string;
  employeeId: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Feedback & requests
  feedback: Feedback[];
  absenceRequests: AbsenceRequest[];
}

export interface Feedback {
  id: string;
  fromUserId: string;
  fromUserName: string;
  content: string;
  enhancedContent?: string;
  isEnhanced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AbsenceRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: AbsenceStatus;
  createdAt: string;
  updatedAt: string;
}

export enum AbsenceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
