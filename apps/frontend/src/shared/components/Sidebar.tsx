import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../types/index';
import { 
  User, 
  Users, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Home,
  Shield,
  Briefcase
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="w-5 h-5" />,
      roles: [UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.COWORKER]
    },
    {
      name: 'My Profile',
      href: `/profile/${user.id}`,
      icon: <User className="w-5 h-5" />,
      roles: [UserRole.MANAGER, UserRole.EMPLOYEE]
    },
    {
      name: 'All Profiles',
      href: '/profiles',
      icon: <Users className="w-5 h-5" />,
      roles: [UserRole.MANAGER]
    },
    {
      name: 'Feedback',
      href: '/feedback',
      icon: <MessageSquare className="w-5 h-5" />,
      roles: [UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.COWORKER]
    },
    {
      name: 'Absence Requests',
      href: '/absence',
      icon: <Calendar className="w-5 h-5" />,
      roles: [UserRole.MANAGER, UserRole.EMPLOYEE]
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="w-5 h-5" />,
      roles: [UserRole.MANAGER]
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  const getRoleSpecificItems = () => {
    switch (user.role) {
      case UserRole.MANAGER:
        return (
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Manager Tools
            </div>
            <div className="space-y-1">
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Full System Access
              </div>
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Manage All Profiles
              </div>
            </div>
          </div>
        );
      case UserRole.EMPLOYEE:
        return (
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Employee Access
            </div>
            <div className="space-y-1">
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Own Profile + Absence
              </div>
            </div>
          </div>
        );
      case UserRole.COWORKER:
        return (
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Co-worker Access
            </div>
            <div className="space-y-1">
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                Public Data + Feedback
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Menu</span>
        </div>

        {/* Role-specific info */}
        {getRoleSpecificItems()}

        {/* Navigation */}
        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  {item.icon}
                </span>
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
