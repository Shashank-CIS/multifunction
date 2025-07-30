import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  FileText,
  Sun,
  Moon,
  Bell,
  Settings,
  User,
  Shield,
  Globe,
  Palette,
  LogOut,
  Navigation
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Chatbot from '../Chatbot';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isManager } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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

  // Mock data for search functionality
  const generateSearchData = () => {
    const engineers = [
      { id: 'cis-001', name: 'Deepika Agnihotri', team: 'Network Operations', location: 'Chennai', type: 'engineer' },
      { id: 'cis-002', name: 'Shashankagowda S', team: 'Server Operations', location: 'Bangalore', type: 'engineer' },
      { id: 'cis-003', name: 'Pradip Shinde', team: 'Database Administration', location: 'Mumbai', type: 'engineer' },
      { id: 'cis-004', name: 'Rajesh Kumar', team: 'Network Operations', location: 'Hyderabad', type: 'engineer' },
      { id: 'cis-005', name: 'Priya Sharma', team: 'Server Operations', location: 'Pune', type: 'engineer' },
      { id: 'cis-006', name: 'Amit Singh', team: 'Database Administration', location: 'Kolkata', type: 'engineer' },
      { id: 'cis-007', name: 'Sneha Patel', team: 'Cloud Operations', location: 'Chennai', type: 'engineer' },
      { id: 'cis-008', name: 'Rohit Gupta', team: 'Security Operations', location: 'Bangalore', type: 'engineer' },
      { id: 'cis-009', name: 'Aarav Agarwal', team: 'Network Operations', location: 'Mumbai', type: 'engineer' },
      { id: 'cis-010', name: 'Abhay Bansal', team: 'Server Operations', location: 'Hyderabad', type: 'engineer' },
      { id: 'cis-011', name: 'Aditi Bhat', team: 'Database Administration', location: 'Pune', type: 'engineer' },
      { id: 'cis-012', name: 'Ananya Chandra', team: 'Cloud Operations', location: 'Kolkata', type: 'engineer' },
      { id: 'cis-013', name: 'Ankita Choudhary', team: 'Security Operations', location: 'Chennai', type: 'engineer' },
      { id: 'cis-014', name: 'Archana Das', team: 'Service Desk', location: 'Bangalore', type: 'engineer' },
      { id: 'cis-015', name: 'Asha Desai', team: 'Network Operations', location: 'Mumbai', type: 'engineer' },
      { id: 'cis-016', name: 'Bhavana Garg', team: 'Server Operations', location: 'Hyderabad', type: 'engineer' },
      { id: 'cis-017', name: 'Divya Gupta', team: 'Database Administration', location: 'Pune', type: 'engineer' },
      { id: 'cis-018', name: 'Geeta Iyer', team: 'Cloud Operations', location: 'Kolkata', type: 'engineer' },
      { id: 'cis-019', name: 'Kavya Jain', team: 'Security Operations', location: 'Chennai', type: 'engineer' },
      { id: 'cis-020', name: 'Lakshmi Joshi', team: 'Service Desk', location: 'Bangalore', type: 'engineer' }
    ];

    const teams = [
      { id: 'team-001', name: 'Network Operations', description: 'Network infrastructure and connectivity', type: 'team' },
      { id: 'team-002', name: 'Server Operations', description: 'Server management and maintenance', type: 'team' },
      { id: 'team-003', name: 'Database Administration', description: 'Database management and optimization', type: 'team' },
      { id: 'team-004', name: 'Cloud Operations', description: 'Cloud infrastructure and services', type: 'team' },
      { id: 'team-005', name: 'Security Operations', description: 'Cybersecurity and threat management', type: 'team' },
      { id: 'team-006', name: 'Service Desk', description: 'End-user support and helpdesk services', type: 'team' }
    ];

    const reports = [
      { id: 'report-001', name: 'Weekly Performance Report', description: 'Team performance metrics', type: 'report' },
      { id: 'report-002', name: 'Monthly Analytics', description: 'Monthly performance analytics', type: 'report' },
      { id: 'report-003', name: 'Incident Reports', description: 'System incident tracking', type: 'report' },
      { id: 'report-004', name: 'Shift Schedules', description: 'Engineer shift scheduling', type: 'report' }
    ];

    const pages = [
      { id: 'page-001', name: 'Dashboard', description: 'Main dashboard overview', path: '/', type: 'page' },
      { id: 'page-002', name: 'Scheduler', description: 'Shift management and planning', path: '/scheduler', type: 'page' },
      { id: 'page-003', name: 'Engineer Directory', description: 'Team profiles and contacts', path: '/scheduler', type: 'page' },
      { id: 'page-004', name: 'Reports', description: 'Analytics and performance data', path: '/reports', type: 'page' },
      { id: 'page-005', name: 'Knowledge Base', description: 'Documentation and guides', path: '/knowledge-base', type: 'page' },
      { id: 'page-006', name: 'Collaboration', description: 'Team communication tools', path: '/collaboration', type: 'page' },
      { id: 'page-007', name: 'Mentorship', description: 'Mentorship and development', path: '/mentorship', type: 'page' },
      { id: 'page-008', name: 'Tech Tips', description: 'Technical tips and guides', path: '/tech-tips', type: 'page' },
      { id: 'page-009', name: 'Challenges', description: 'Team challenges and competitions', path: '/challenges', type: 'page' },
      { id: 'page-010', name: 'Production Management', description: 'Production monitoring and management', path: '/production', type: 'page' },
      { id: 'page-011', name: 'Profile', description: 'User profile and settings', path: '/profile', type: 'page' },
      { id: 'page-012', name: 'Current Shift', description: 'Current shift dashboard', path: '/current-shift', type: 'page' }
    ];

    return { engineers, teams, reports, pages };
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const data = generateSearchData();
    const searchTerm = query.toLowerCase();
    const results: any[] = [];

    // Search engineers
    data.engineers.forEach(engineer => {
      if (engineer.name.toLowerCase().includes(searchTerm) || 
          engineer.team.toLowerCase().includes(searchTerm) ||
          engineer.location.toLowerCase().includes(searchTerm)) {
        results.push({
          ...engineer,
          matchType: 'Engineer',
          path: `/scheduler?profile=${engineer.id}`,
          icon: 'User',
          isEngineer: true
        });
      }
    });

    // Search teams
    data.teams.forEach(team => {
      if (team.name.toLowerCase().includes(searchTerm) || 
          team.description.toLowerCase().includes(searchTerm)) {
        results.push({
          ...team,
          matchType: 'Team',
          path: '/scheduler',
          icon: 'Users'
        });
      }
    });

    // Search reports
    data.reports.forEach(report => {
      if (report.name.toLowerCase().includes(searchTerm) || 
          report.description.toLowerCase().includes(searchTerm)) {
        results.push({
          ...report,
          matchType: 'Report',
          path: '/reports',
          icon: 'FileText'
        });
      }
    });

    // Search pages
    data.pages.forEach(page => {
      if (page.name.toLowerCase().includes(searchTerm) || 
          page.description.toLowerCase().includes(searchTerm)) {
        results.push({
          ...page,
          matchType: 'Page',
          path: page.path,
          icon: 'Navigation'
        });
      }
    });

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (result: any) => {
    // Close search UI immediately
    setShowSearchResults(false);
    setSearchQuery('');
    setShowMobileSearch(false);
    
    // List of valid routes (including URLs with parameters)
    const validRoutes = [
      '/', '/scheduler', '/knowledge-base', '/collaboration', 
      '/mentorship', '/tech-tips', '/challenges', '/production', 
      '/reports', '/profile', '/current-shift', '/admin'
    ];
    
    // Extract base path for validation (remove query parameters)
    const basePath = result.path.split('?')[0];
    
    // Check if the base path is valid
    if (!validRoutes.includes(basePath)) {
      result.path = '/scheduler';
    }
    
    // Add a small delay to ensure UI state is updated before navigation
    setTimeout(() => {
      try {
        navigate(result.path);
      } catch (error) {
        // Fallback to window.location if navigate fails
        try {
          window.location.href = result.path;
        } catch (fallbackError) {
          // Ultimate fallback - go to dashboard
          window.location.href = '/';
        }
      }
    }, 50);
  };

  const getSearchIcon = (iconType: string) => {
    switch(iconType) {
      case 'User': return <User className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'Navigation': return <Home className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
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

  // Keyboard shortcuts for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      
      // Escape to close search results
      if (event.key === 'Escape') {
        setShowSearchResults(false);
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Role-based navigation - Engineers have limited access, Managers see everything
  const getAllNavigation = () => [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Scheduler', href: '/scheduler', icon: Calendar },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
    { name: 'Collaboration', href: '/collaboration', icon: MessageSquare },
    { name: 'Mentorship', href: '/mentorship', icon: UserCheck },
    { name: 'Tech Tips', href: '/tech-tips', icon: Lightbulb },
    { name: 'Challenges', href: '/challenges', icon: Trophy },
    { name: 'Production Management', href: '/production', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText },
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
                    id="global-search-input"
                    type="text"
                    placeholder="Search engineers, teams, reports... (Ctrl+K)"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 300)}
                    className="w-full pl-10 pr-4 py-2 border border-blue-600 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-blue-50 dark:bg-blue-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
                          Search Results ({searchResults.length})
                        </div>
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            onClick={() => handleSearchResultClick(result)}
                            className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                          >
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                {getSearchIcon(result.icon)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {result.name}
                                </p>
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                                  {result.matchType}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {result.isEngineer 
                                  ? `${result.team} • ${result.location} • Click to view profile`
                                  : result.description || result.team || result.location || 'Click to navigate'
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {searchResults.length === 0 && searchQuery && (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No results found for "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2">
                {/* Mobile Search Button */}
                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="lg:hidden text-blue-100 hover:text-white p-2 rounded-lg transition-colors"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </button>

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

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white dark:bg-gray-800 h-full">
            {/* Mobile Search Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Search</h2>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Mobile Search Input */}
            <div className="p-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search engineers, teams, reports..."
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            
            {/* Mobile Search Results */}
            <div className="px-4 pb-4 max-h-[calc(100vh-140px)] overflow-y-auto">
              {searchResults.length > 0 ? (
                <>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.map((result) => (
                                         <div
                       key={result.id}
                       onClick={() => handleSearchResultClick(result)}
                      className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg transition-colors mb-2 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          {getSearchIcon(result.icon)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {result.name}
                          </p>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full ml-2">
                            {result.matchType}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.isEngineer 
                            ? `${result.team} • ${result.location} • Tap to view profile`
                            : result.description || result.team || result.location || 'Tap to navigate'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Start typing to search...</p>
                  <p className="text-xs mt-2">Engineers • Teams • Reports • Pages</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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