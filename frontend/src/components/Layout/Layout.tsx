import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search,
  Home,
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  UserCheck,
  Lightbulb,
  Trophy,
  BarChart3,
  Sun,
  Moon,
  Bell,
  Settings,
  User,
  Shield,
  Globe,
  Palette,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Chatbot from '../Chatbot';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isManager } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    return isManager ? 'bg-purple-600' : 'bg-blue-600';
  };

  // Auto-collapse sidebar functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('desktop-sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (sidebar && menuButton && 
          !sidebar.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Role-based navigation - Engineers have limited access, Managers see everything
  const getAllNavigation = () => [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Scheduler', href: '/scheduler', icon: Calendar },
    { name: 'Engineers', href: '/scheduler/engineers', icon: Users },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
    { name: 'Collaboration', href: '/collaboration', icon: MessageSquare },
    { name: 'Mentorship', href: '/mentorship', icon: UserCheck },
    { name: 'Tech Tips', href: '/tech-tips', icon: Lightbulb },
    { name: 'Challenges', href: '/challenges', icon: Trophy },
    { name: 'Production Management', href: '/production', icon: BarChart3 },
  ];

  const getNavigationForRole = () => {
    const allNav = getAllNavigation();
    
    if (isManager) {
      return allNav; // Managers see all navigation items
    } else {
      // Engineers have limited navigation - remove certain admin/management features
      return allNav.filter(item => 
        // Engineers can access these features
        item.name !== 'Engineers' // Hide engineer directory for privacy
      );
    }
  };

  const navigation = getNavigationForRole();

  // Mock notifications data
  const notifications = [
    { id: 1, title: 'Shift Assignment', message: 'You have been assigned to evening shift', time: '2 min ago', unread: true },
    { id: 2, title: 'System Alert', message: 'Server maintenance scheduled for tonight', time: '15 min ago', unread: true },
    { id: 3, title: 'New Knowledge Article', message: 'Database optimization guide published', time: '1 hour ago', unread: false },
    { id: 4, title: 'Team Meeting', message: 'Weekly team sync at 3 PM today', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      {/* Sidebar */}
      <div 
        id="desktop-sidebar"
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${
          sidebarCollapsed && !isHovering ? 'w-16' : 'w-64'
        } bg-white dark:bg-gray-800 shadow-lg transform`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex items-center ${sidebarCollapsed && !isHovering ? 'justify-center' : ''}`}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                CIS
              </div>
              {(!sidebarCollapsed || isHovering) && (
                <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">Portal</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={sidebarCollapsed && !isHovering ? item.name : ''}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}
                  />
                  {(!sidebarCollapsed || isHovering) && item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          {(!sidebarCollapsed || isHovering) && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getRoleBadgeColor()} text-white font-medium text-sm`}>
                  {getUserInitials()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isManager ? 'Manager' : 'CIS Engineer'}
                    {user?.engineerId && ` • ${user.engineerId}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed && !isHovering ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-900 dark:to-indigo-900 shadow-sm border-b border-blue-700 dark:border-blue-800">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Left: Cognizant Logo + Name */}
              <div className="flex items-center space-x-3">
                {/* Mobile menu button */}
                <button
                  id="menu-button"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-blue-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 lg:hidden mr-3"
                >
                  {sidebarCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
                </button>
                
                {/* Cognizant Brand */}
                <div className="text-white">
                  <h1 className="text-lg font-bold tracking-wide">Cognizant</h1>
                  <p className="text-xs text-blue-200 -mt-1">CIS Portal</p>
                </div>
              </div>

              {/* Center: Search */}
              <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-blue-300" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search anything..."
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-2 border border-blue-600 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-blue-50 dark:bg-blue-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative text-blue-100 hover:text-white p-2 rounded-lg transition-colors"
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className="text-blue-100 hover:text-white p-2 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings className="h-5 w-5" />
                  </button>

                  {/* Settings Dropdown */}
                  {showSettingsMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Settings</h3>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            toggleTheme();
                            setShowSettingsMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {theme === 'light' ? <Moon className="w-4 h-4 mr-3" /> : <Sun className="w-4 h-4 mr-3" />}
                          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                        </button>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowSettingsMenu(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/profile/preferences"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowSettingsMenu(false)}
                        >
                          <Palette className="w-4 h-4 mr-3" />
                          Preferences
                        </Link>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowSettingsMenu(false)}
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Security Settings
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowSettingsMenu(false)}
                        >
                          <Globe className="w-4 h-4 mr-3" />
                          Language & Region
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="text-blue-100 hover:text-white p-2 rounded-lg transition-colors"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-blue-100 hover:text-white p-2 rounded-lg transition-colors"
                    title="Profile Menu"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getRoleBadgeColor()} text-white font-medium text-sm border-2 ${isManager ? 'border-purple-400' : 'border-blue-400'}`}>
                      {getUserInitials()}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <div className="text-xs text-blue-200">
                        {isManager ? 'Manager' : 'Engineer'}
                        {user?.engineerId && ` (${user.engineerId})`}
                      </div>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getRoleBadgeColor()} text-white font-medium`}>
                            {getUserInitials()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                            <p className="text-xs font-medium mt-1">
                              <span className={`px-2 py-1 rounded-full text-white text-xs ${isManager ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                {isManager ? 'Manager' : 'Engineer'}
                                {user?.engineerId && ` - ${user.engineerId}`}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/profile/preferences"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Preferences
                        </Link>
                        {isManager && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-purple-700 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setShowProfileMenu(false);
                            logout();
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />

      {/* Click outside handler for dropdowns */}
      {(showNotifications || showProfileMenu || showSettingsMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
            setShowSettingsMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout; 