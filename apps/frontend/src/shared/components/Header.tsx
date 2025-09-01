import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../types/index';
import { LogOut, User, Shield, Briefcase, Users } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.MANAGER:
        return <Shield className="w-4 h-4 text-green-600" />;
      case UserRole.EMPLOYEE:
        return <User className="w-4 h-4 text-blue-600" />;
      case UserRole.COWORKER:
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <Briefcase className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.MANAGER:
        return 'Manager';
      case UserRole.EMPLOYEE:
        return 'Employee';
      case UserRole.COWORKER:
        return 'Co-worker';
      default:
        return 'Unknown';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.MANAGER:
        return 'bg-green-100 text-green-800 border-green-200';
      case UserRole.EMPLOYEE:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case UserRole.COWORKER:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">
              Employee Profile System
            </h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
              {getRoleIcon(user.role)}
              <span className="ml-1">{getRoleLabel(user.role)}</span>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              
              {/* User Avatar */}
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-700">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
