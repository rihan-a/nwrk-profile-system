import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../../shared/types/index';
import { 
  Shield, 
  User, 
  Users, 
  MessageSquare, 
  Calendar, 
  Settings,
  ArrowRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleInfo = () => {
    switch (user.role) {
      case UserRole.MANAGER:
        return {
          title: 'Manager Dashboard',
          description: 'You have full access to all system features and employee data.',
          icon: <Shield className="w-8 h-8 text-green-600" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case UserRole.EMPLOYEE:
        return {
          title: 'Employee Dashboard',
          description: 'Manage your profile and submit absence requests.',
          icon: <User className="w-8 h-8 text-blue-600" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case UserRole.COWORKER:
        return {
          title: 'Co-worker Dashboard',
          description: 'View public profiles and leave feedback for colleagues.',
          icon: <Users className="w-8 h-8 text-purple-600" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to the Employee Profile System.',
          icon: <User className="w-8 h-8 text-gray-600" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getQuickActions = () => {
    switch (user.role) {
      case UserRole.MANAGER:
        return [
          { name: 'View All Profiles', href: '/profiles', icon: <Users className="w-5 h-5" /> },
          { name: 'Manage Absence Requests', href: '/absence', icon: <Calendar className="w-5 h-5" /> },
          { name: 'System Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> }
        ];
      case UserRole.EMPLOYEE:
        return [
          { name: 'Edit My Profile', href: `/profile/${user.id}`, icon: <User className="w-5 h-5" /> },
          { name: 'Submit Absence Request', href: '/absence', icon: <Calendar className="w-5 h-5" /> },
          { name: 'View Feedback', href: '/feedback', icon: <MessageSquare className="w-5 h-5" /> }
        ];
      case UserRole.COWORKER:
        return [
          { name: 'Browse Profiles', href: '/profiles', icon: <Users className="w-5 h-5" /> },
          { name: 'Leave Feedback', href: '/feedback', icon: <MessageSquare className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };

  const roleInfo = getRoleInfo();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`${roleInfo.bgColor} ${roleInfo.borderColor} border rounded-lg p-6`}>
        <div className="flex items-center space-x-4">
          {roleInfo.icon}
          <div>
            <h1 className={`text-2xl font-bold ${roleInfo.color}`}>
              {roleInfo.title}
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user.firstName}! {roleInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
                                className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600 group-hover:text-blue-700">
                    {action.icon}
                  </div>
                                      <span className="font-medium text-gray-900 group-hover:text-blue-700">
                    {action.name}
                  </span>
                </div>
                                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Role Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Role & Permissions</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${roleInfo.bgColor} ${roleInfo.borderColor} border`}></div>
            <span className="text-gray-700">
              <strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${roleInfo.bgColor} ${roleInfo.borderColor} border`}></div>
            <span className="text-gray-700">
              <strong>Email:</strong> {user.email}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${roleInfo.bgColor} ${roleInfo.borderColor} border`}></div>
            <span className="text-gray-700">
              <strong>Access Level:</strong> {roleInfo.description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
