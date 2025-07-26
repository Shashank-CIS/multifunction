import { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Users, 
  Trophy, 
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  BookOpen,
  Settings,
  Bell,
  Palette,
  Shield,
  Globe,
  Monitor
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockStats = {
  totalTickets: 156,
  resolvedToday: 23,
  avgResponseTime: '2.3h',
  upcomingShifts: 5,
  activeUsers: 42,
  weeklyPoints: 85
};

const mockRecentActivities = [
  {
    id: '1',
    type: 'ticket',
    title: 'Resolved database connection issue',
    time: '10 minutes ago',
    icon: CheckCircle,
    color: 'text-green-500'
  },
  {
    id: '2',
    type: 'challenge',
    title: 'Completed "API Best Practices" quiz',
    time: '1 hour ago',
    icon: Trophy,
    color: 'text-yellow-500'
  },
  {
    id: '3',
    type: 'collaboration',
    title: 'New announcement posted in #general',
    time: '2 hours ago',
    icon: MessageSquare,
    color: 'text-blue-500'
  },
  {
    id: '4',
    type: 'knowledge',
    title: 'Article "Docker Troubleshooting" was updated',
    time: '3 hours ago',
    icon: BookOpen,
    color: 'text-purple-500'
  }
];

const mockTodaysTip = {
  title: "Use React.memo for Component Optimization",
  content: "React.memo is a higher-order component that can help optimize your React application by preventing unnecessary re-renders. It's particularly useful for functional components that receive the same props frequently.",
  author: "Sarah Chen",
  category: "React",
  readTime: 3
};

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoRefresh: true,
    compactView: false
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                🚀 Welcome to CIS Portal
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Your command center for seamless operations. Track progress, collaborate with your team, and achieve excellence together.
              </p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-100 font-medium">System Healthy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100">{currentTime.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
      </div>

      <div className="p-6 max-w-7xl mx-auto -mt-4 relative z-10">

        {/* Quick Stats with Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    {mockStats.resolvedToday}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">+12% from yesterday</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Resolved Today</h3>
              <p className="text-gray-500 text-sm mt-1">Great progress on tickets!</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {mockStats.avgResponseTime}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">-0.5h improved</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Avg Response Time</h3>
              <p className="text-gray-500 text-sm mt-1">Response time is improving</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {mockStats.weeklyPoints}
                  </div>
                  <div className="text-xs text-amber-600 font-medium">+15 this week</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Weekly Points</h3>
              <p className="text-gray-500 text-sm mt-1">Keep up the great work!</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-violet-400 to-pink-500 rounded-xl shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                    {mockStats.upcomingShifts}
                  </div>
                  <div className="text-xs text-violet-600 font-medium">Next in 2 hours</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Upcoming Shifts</h3>
              <p className="text-gray-500 text-sm mt-1">Stay prepared for shifts</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-red-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-rose-400 to-red-500 rounded-xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                    {mockStats.activeUsers}
                  </div>
                  <div className="text-xs text-rose-600 font-medium">Online now</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Active Users</h3>
              <p className="text-gray-500 text-sm mt-1">Team is collaborating</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    {mockStats.totalTickets}
                  </div>
                  <div className="text-xs text-indigo-600 font-medium">+8 new today</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Total Tickets</h3>
              <p className="text-gray-500 text-sm mt-1">System tracking well</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Access */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🚀 Quick Access
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/knowledge-base" 
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Search FAQ</h3>
                    <p className="text-sm text-gray-600">Find answers and guides</p>
                  </div>
                </Link>

                <Link 
                  to="/scheduler" 
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50 hover:border-emerald-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">View Schedule</h3>
                    <p className="text-sm text-gray-600">Check shifts and tasks</p>
                  </div>
                </Link>

                <Link 
                  to="/collaboration" 
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Team Hub</h3>
                    <p className="text-sm text-gray-600">Announcements and chat</p>
                  </div>
                </Link>

                <Link 
                  to="/mentorship" 
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 hover:border-amber-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Mentorship</h3>
                    <p className="text-sm text-gray-600">Connect and grow</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Tip of the Day */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-2">💡</div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Tip of the Day
                </h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                  <h3 className="font-bold text-gray-800 mb-2">{mockTodaysTip.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {mockTodaysTip.content}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">SC</span>
                    </div>
                    <span className="text-gray-600 font-medium">by {mockTodaysTip.author}</span>
                  </div>
                  <span className="text-gray-500">{mockTodaysTip.readTime} min read</span>
                </div>
                <Link 
                  to="/tech-tips" 
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 hover:shadow-lg text-sm font-medium"
                >
                  View all tips →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Quick Settings */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-gray-200 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-slate-500 to-gray-500 rounded-lg mr-3">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                  ⚙️ Dashboard Settings
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Notifications</h4>
                      <p className="text-xs text-gray-600">Enable dashboard alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-slate-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Dark Mode</h4>
                      <p className="text-xs text-gray-600">Toggle dark theme</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-slate-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Auto Refresh</h4>
                      <p className="text-xs text-gray-600">Auto-refresh data every 30s</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.autoRefresh}
                      onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-slate-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Compact View</h4>
                      <p className="text-xs text-gray-600">Reduce spacing and padding</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.compactView}
                      onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link 
                  to="/profile" 
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-500 to-gray-500 text-white rounded-lg hover:from-slate-600 hover:to-gray-600 transition-all duration-300 hover:shadow-lg text-sm font-medium"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg mr-3">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  🔔 Recent Activity
                </h2>
              </div>
              <div className="space-y-4">
                {mockRecentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0">
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 