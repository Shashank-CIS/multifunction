import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen,
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Trophy,
  Lightbulb,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  Activity,
  UserCheck,
  ArrowRight,
  MapPin,
  Bell,
  Coffee,
  Award,
  Zap,
  Shield,
  Monitor,
  Globe
} from 'lucide-react';

export default function Dashboard() {
  const { user, isManager } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Holiday interface
  interface Holiday {
    name: string;
    date: string;
    type: 'National' | 'Regional' | 'Religious';
  }

  interface UpcomingHoliday extends Holiday {
    daysUntil: number;
  }

  // India Holiday List 2025 - Location wise
  const holidayData: Record<string, Holiday[]> = {
    'Chennai': [
      { name: 'New Year', date: '2025-01-01', type: 'National' },
      { name: 'Pongal', date: '2025-01-14', type: 'Regional' },
      { name: 'Maha Shivratri', date: '2025-02-26', type: 'Religious' },
      { name: 'Holi', date: '2025-03-14', type: 'Religious' },
      { name: 'Ramzan (Id-ul-Fitr)', date: '2025-03-31', type: 'Religious' },
      { name: 'Tamil New Year', date: '2025-04-14', type: 'Regional' },
      { name: 'Good Friday', date: '2025-04-18', type: 'Religious' },
      { name: 'May Day', date: '2025-05-01', type: 'National' },
      { name: 'Independence Day', date: '2025-08-15', type: 'National' },
      { name: 'Ganesh Chaturthi', date: '2025-08-27', type: 'Religious' },
      { name: 'Gandhi Jayanti', date: '2025-10-02', type: 'National' },
      { name: 'Diwali', date: '2025-10-20', type: 'Religious' },
      { name: 'Christmas', date: '2025-12-25', type: 'National' }
    ],
    'Bangalore': [
      { name: 'New Year', date: '2025-01-01', type: 'National' },
      { name: 'Maha Shivratri', date: '2025-02-26', type: 'Religious' },
      { name: 'Holi', date: '2025-03-14', type: 'Religious' },
      { name: 'Ramzan (Id-ul-Fitr)', date: '2025-03-31', type: 'Religious' },
      { name: 'Good Friday', date: '2025-04-18', type: 'Religious' },
      { name: 'May Day', date: '2025-05-01', type: 'National' },
      { name: 'Independence Day', date: '2025-08-15', type: 'National' },
      { name: 'Ganesh Chaturthi', date: '2025-08-27', type: 'Religious' },
      { name: 'Gandhi Jayanti', date: '2025-10-02', type: 'National' },
      { name: 'Diwali', date: '2025-10-20', type: 'Religious' },
      { name: 'Christmas', date: '2025-12-25', type: 'National' }
    ],
    'Mumbai': [
      { name: 'New Year', date: '2025-01-01', type: 'National' },
      { name: 'Maha Shivratri', date: '2025-02-26', type: 'Religious' },
      { name: 'Holi', date: '2025-03-14', type: 'Religious' },
      { name: 'Ramzan (Id-ul-Fitr)', date: '2025-03-31', type: 'Religious' },
      { name: 'Good Friday', date: '2025-04-18', type: 'Religious' },
      { name: 'May Day', date: '2025-05-01', type: 'National' },
      { name: 'Independence Day', date: '2025-08-15', type: 'National' },
      { name: 'Ganesh Chaturthi', date: '2025-08-27', type: 'Religious' },
      { name: 'Gandhi Jayanti', date: '2025-10-02', type: 'National' },
      { name: 'Diwali', date: '2025-10-20', type: 'Religious' },
      { name: 'Christmas', date: '2025-12-25', type: 'National' }
    ],
    'Hyderabad': [
      { name: 'New Year', date: '2025-01-01', type: 'National' },
      { name: 'Maha Shivratri', date: '2025-02-26', type: 'Religious' },
      { name: 'Holi', date: '2025-03-14', type: 'Religious' },
      { name: 'Ramzan (Id-ul-Fitr)', date: '2025-03-31', type: 'Religious' },
      { name: 'Good Friday', date: '2025-04-18', type: 'Religious' },
      { name: 'May Day', date: '2025-05-01', type: 'National' },
      { name: 'Telangana Formation Day', date: '2025-06-02', type: 'Regional' },
      { name: 'Independence Day', date: '2025-08-15', type: 'National' },
      { name: 'Ganesh Chaturthi', date: '2025-08-27', type: 'Religious' },
      { name: 'Gandhi Jayanti', date: '2025-10-02', type: 'National' },
      { name: 'Diwali', date: '2025-10-20', type: 'Religious' },
      { name: 'Christmas', date: '2025-12-25', type: 'National' }
    ],
    'Pune': [
      { name: 'New Year', date: '2025-01-01', type: 'National' },
      { name: 'Maha Shivratri', date: '2025-02-26', type: 'Religious' },
      { name: 'Holi', date: '2025-03-14', type: 'Religious' },
      { name: 'Ramzan (Id-ul-Fitr)', date: '2025-03-31', type: 'Religious' },
      { name: 'Good Friday', date: '2025-04-18', type: 'Religious' },
      { name: 'May Day', date: '2025-05-01', type: 'National' },
      { name: 'Independence Day', date: '2025-08-15', type: 'National' },
      { name: 'Ganesh Chaturthi', date: '2025-08-27', type: 'Religious' },
      { name: 'Gandhi Jayanti', date: '2025-10-02', type: 'National' },
      { name: 'Diwali', date: '2025-10-20', type: 'Religious' },
      { name: 'Christmas', date: '2025-12-25', type: 'National' }
    ],
    'Kolkata': [
      { name: 'New Year', date: '2025-01-01', type: 'National' },
      { name: 'Maha Shivratri', date: '2025-02-26', type: 'Religious' },
      { name: 'Holi', date: '2025-03-14', type: 'Religious' },
      { name: 'Ramzan (Id-ul-Fitr)', date: '2025-03-31', type: 'Religious' },
      { name: 'Bengali New Year', date: '2025-04-15', type: 'Regional' },
      { name: 'Good Friday', date: '2025-04-18', type: 'Religious' },
      { name: 'May Day', date: '2025-05-01', type: 'National' },
      { name: 'Ratha Yatra', date: '2025-06-27', type: 'Religious' },
      { name: 'Independence Day', date: '2025-08-15', type: 'National' },
      { name: 'Mahanavami (Durga Puja)', date: '2025-10-01', type: 'Regional' },
      { name: 'Gandhi Jayanti', date: '2025-10-02', type: 'National' },
      { name: 'Kali Puja', date: '2025-10-20', type: 'Regional' },
      { name: 'Christmas', date: '2025-12-25', type: 'National' }
    ]
  };

  // Function to get next 3 upcoming holidays for a location
  const getUpcomingHolidays = (location: string): UpcomingHoliday[] => {
    const today = new Date();
    const holidays = holidayData[location] || [];
    
    return holidays
      .filter((holiday: Holiday) => new Date(holiday.date) > today)
      .slice(0, 3)
      .map((holiday: Holiday): UpcomingHoliday => ({
        ...holiday,
        daysUntil: Math.ceil((new Date(holiday.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      }));
  };

  // Get holidays for top CIS locations
  const locationHolidays = {
    'Chennai': getUpcomingHolidays('Chennai'),
    'Bangalore': getUpcomingHolidays('Bangalore'), 
    'Mumbai': getUpcomingHolidays('Mumbai'),
    'Hyderabad': getUpcomingHolidays('Hyderabad'),
    'Pune': getUpcomingHolidays('Pune'),
    'Kolkata': getUpcomingHolidays('Kolkata')
  };

  // Mock data for all sections
  const knowledgeBaseStats = {
    totalArticles: 247,
    recentArticles: [
      { title: 'Docker Troubleshooting Guide', author: 'Rajesh Kumar', views: 342 },
      { title: 'AWS Lambda Best Practices', author: 'Priya Singh', views: 189 },
      { title: 'Kubernetes Network Issues', author: 'Amit Sharma', views: 156 }
    ],
    totalViews: 12450,
    weeklyAdditions: 8
  };

  // Role-based stats - Managers see all data, Engineers see limited/personal data
  const getSchedulerStats = () => {
    if (isManager) {
      return {
        activeShifts: 23,
        upcomingShifts: 12,
        todayShifts: [
          { time: '09:00 - 19:00', team: 'Network Operations', engineers: 8, status: 'active' },
          { time: '14:00 - 24:00', team: 'Database Support', engineers: 6, status: 'upcoming' },
          { time: '19:00 - 07:00', team: 'Security Monitoring', engineers: 5, status: 'upcoming' }
        ],
        totalEngineersOnDuty: 42
      };
    } else {
      // Engineers see only their own shift info
      return {
        activeShifts: 1,
        upcomingShifts: 2,
        todayShifts: [
          { time: '09:00 - 19:00', team: user?.name || 'Your Team', engineers: 1, status: 'active' }
        ],
        totalEngineersOnDuty: 8 // Team level only
      };
    }
  };

  const getEngineerStats = () => {
    if (isManager) {
      return {
        totalEngineers: 150,
        onlineNow: 89,
        onCallEngineers: 19,
        topLocations: [
          { city: 'Chennai', count: 35 },
          { city: 'Bengaluru', count: 28 },
          { city: 'Hyderabad', count: 22 }
        ],
        availableEngineers: 67
      };
    } else {
      // Engineers see team-level stats only
      return {
        totalEngineers: 8, // Team size
        onlineNow: 6,
        onCallEngineers: 1,
        topLocations: [
          { city: 'Bangalore', count: 8 }
        ],
        availableEngineers: 5
      };
    }
  };

  const getProductionStats = () => {
    if (isManager) {
      return {
        ticketsResolved: 2847,
        incidentsHandled: 234,
        avgSatisfaction: 4.6,
        systemUptime: 99.8,
        topPerformers: [
          { name: 'Arjun Reddy', tickets: 89 },
          { name: 'Sneha Patel', tickets: 76 },
          { name: 'Vikram Gupta', tickets: 71 }
        ]
      };
    } else {
      // Engineers see personal/team stats
      return {
        ticketsResolved: 45, // Personal tickets this month
        incidentsHandled: 8,  // Personal incidents
        avgSatisfaction: 4.5,
        systemUptime: 99.8,
        topPerformers: [
          { name: user?.name || 'You', tickets: 45 },
          { name: 'Team Average', tickets: 38 }
        ]
      };
    }
  };

  const schedulerStats = getSchedulerStats();
  const engineerStats = getEngineerStats();
  const productionStats = getProductionStats();

  const collaborationStats = {
    activeChannels: 12,
    todayMessages: 156,
    announcements: 3,
    recentActivity: [
      { type: 'announcement', text: 'New security policies updated', time: '2h ago' },
      { type: 'message', text: 'Database maintenance completed', time: '4h ago' }
    ]
  };

  const mentorshipStats = {
    activePrograms: 8,
    mentorPairs: 45,
    completedSessions: 234,
    upcomingSessions: [
      { mentor: 'Sanjay Kumar', mentee: 'Rahul Verma', topic: 'Cloud Architecture', time: '3:00 PM' },
      { mentor: 'Deepika Joshi', mentee: 'Ankit Singh', topic: 'DevOps Practices', time: '4:30 PM' }
    ]
  };

  const techTipsStats = {
    totalTips: 89,
    todaysTip: 'Use kubectl logs -f to follow real-time container logs',
    weeklyViews: 1250,
    popularTopics: ['Docker', 'Kubernetes', 'AWS', 'Monitoring']
  };

  const challengesStats = {
    activeChallenges: 5,
    weeklyWinners: [
      { name: 'Rohit Sharma', points: 450, challenge: 'Security Quiz' },
      { name: 'Kavya Nair', points: 380, challenge: 'Infrastructure Audit' }
    ],
    totalParticipants: 87,
    completionRate: 73
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header and Stats Section with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name || 'User'}
            </h1>
            <p className="text-gray-600">
              {isManager ? 'Manager Dashboard - Complete CIS Operations Overview' : 'Your comprehensive CIS Operations Command Center'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-gray-600 text-sm">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Engineers on Duty</h3>
              <p className="text-2xl font-semibold text-gray-900">{schedulerStats.totalEngineersOnDuty}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Shifts</h3>
              <p className="text-2xl font-semibold text-gray-900">{schedulerStats.activeShifts}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">System Uptime</h3>
              <p className="text-2xl font-semibold text-gray-900">{productionStats.systemUptime}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Engineers Online</h3>
              <p className="text-2xl font-semibold text-gray-900">{engineerStats.onlineNow}</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Primary Modules */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Knowledge Base Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
              </div>
              <Link to="/knowledge-base" className="text-blue-600 hover:text-blue-700 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{knowledgeBaseStats.totalArticles}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{knowledgeBaseStats.totalViews}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">+{knowledgeBaseStats.weeklyAdditions}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Recent Articles</h4>
              {knowledgeBaseStats.recentArticles.map((article, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 text-sm truncate">{article.title}</span>
                  <span className="text-blue-600 text-xs font-medium">{article.views} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduler Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Shift Scheduler</h2>
              </div>
              <Link to="/scheduler" className="text-green-600 hover:text-green-700 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{schedulerStats.activeShifts}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{schedulerStats.upcomingShifts}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{schedulerStats.totalEngineersOnDuty}</div>
                <div className="text-sm text-gray-600">On Duty</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Today's Shifts</h4>
              {schedulerStats.todayShifts.map((shift, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-gray-900 font-medium text-sm">{shift.time}</span>
                    <span className="text-green-600 ml-2 text-sm">• {shift.team}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2 text-sm">{shift.engineers} engineers</span>
                    <div className={`w-2 h-2 rounded-full ${shift.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Metrics */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Production Metrics</h2>
              </div>
              <Link to="/production" className="text-purple-600 hover:text-purple-700 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{productionStats.ticketsResolved}</div>
                <div className="text-sm text-gray-600">Tickets Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{productionStats.incidentsHandled}</div>
                <div className="text-sm text-gray-600">Incidents Handled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{productionStats.avgSatisfaction}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{productionStats.systemUptime}%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Top Performers</h4>
              {productionStats.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 text-sm">{performer.name}</span>
                  <span className="text-purple-600 font-medium text-sm">{performer.tickets} tickets</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Team Activities */}
        <div className="space-y-6">
          
          {/* Engineers Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <Users className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Engineers</h3>
              </div>
              <Link to="/scheduler" className="text-yellow-600 hover:text-yellow-700 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{engineerStats.totalEngineers}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{engineerStats.onlineNow}</div>
                <div className="text-xs text-gray-600">Online</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{engineerStats.onCallEngineers}</div>
                <div className="text-xs text-gray-600">On Call</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{engineerStats.availableEngineers}</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-xs">Top Locations</h4>
              {engineerStats.topLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 text-gray-500 mr-1" />
                    <span className="text-gray-900">{location.city}</span>
                  </div>
                  <span className="text-blue-600 font-medium">{location.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Collaboration</h3>
              </div>
              <Link to="/collaboration" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{collaborationStats.activeChannels}</div>
                <div className="text-xs text-gray-600">Channels</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{collaborationStats.todayMessages}</div>
                <div className="text-xs text-gray-600">Messages</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{collaborationStats.announcements}</div>
                <div className="text-xs text-gray-600">Alerts</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-xs">Recent Activity</h4>
              {collaborationStats.recentActivity.slice(0, 2).map((activity, index) => (
                <div key={index} className="text-xs bg-gray-50 rounded-lg p-2">
                  <div className="flex items-start">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 ${activity.type === 'announcement' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <span className="text-gray-900">{activity.text}</span>
                      <div className="text-indigo-600 text-xs mt-1">{activity.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Holidays</h3>
              </div>
            </div>
            
            <div className="space-y-3">
              {Object.entries(locationHolidays).slice(0, 3).map(([location, holidays]) => (
                <div key={location}>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-3 h-3 text-red-500 mr-1" />
                    <h4 className="font-medium text-gray-900 text-xs">{location}</h4>
                  </div>
                  {holidays.slice(0, 1).map((holiday, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-2 mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900 text-xs">{holiday.name}</div>
                          <div className="text-gray-600 text-xs">
                            {new Date(holiday.date).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </div>
                        </div>
                        <div className="text-red-600 text-xs font-medium">
                          {holiday.daysUntil} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Holidays Section */}
      <div className="card mt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Upcoming Holidays 2025</h2>
          </div>
          <div className="text-sm text-gray-600">Location-wise Holiday Calendar</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(locationHolidays).map(([location, holidays]) => (
            <div key={location} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <MapPin className="w-4 h-4 text-red-600 mr-2" />
                <h3 className="font-semibold text-gray-900">{location}</h3>
              </div>

              <div className="space-y-3">
                {holidays.length > 0 ? holidays.map((holiday, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{holiday.name}</div>
                        <div className="text-gray-600 text-xs">
                          {new Date(holiday.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${holiday.type === 'National' ? 'bg-green-100 text-green-800' :
                            holiday.type === 'Regional' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'}
                        `}>
                          {holiday.type}
                        </div>
                        <div className="text-red-600 text-xs font-medium mt-1">
                          {holiday.daysUntil} days
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 text-sm py-8">
                    No upcoming holidays in next 3 months
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 