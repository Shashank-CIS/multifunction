import { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  AlertCircle,
  CheckCircle,
  UserCheck,
  Building,
  Calendar,
  TrendingUp,
  Activity,
  Timer,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Star,
  Shield
} from 'lucide-react';
import { Engineer, ShiftType, ShiftAssignment, CurrentShiftView, Team, Department, Location } from '@/types';

// Mock data (reusing from other components)
const mockShiftTypes: ShiftType[] = [
  {
    id: 'morning',
    name: 'Morning Shift',
    code: 'MS',
    startTime: '06:00',
    endTime: '14:00',
    duration: 8,
    color: '#FCD34D',
    isOvernight: false,
    minimumStaff: 50,
    maximumStaff: 100,
    payMultiplier: 1.0
  },
  {
    id: 'evening',
    name: 'Evening Shift',
    code: 'ES',
    startTime: '14:00',
    endTime: '22:00',
    duration: 8,
    color: '#FB7185',
    isOvernight: false,
    minimumStaff: 40,
    maximumStaff: 80,
    payMultiplier: 1.1
  },
  {
    id: 'night',
    name: 'Night Shift',
    code: 'NS',
    startTime: '22:00',
    endTime: '06:00',
    duration: 8,
    color: '#A78BFA',
    isOvernight: true,
    minimumStaff: 30,
    maximumStaff: 60,
    payMultiplier: 1.5
  }
];

const mockTeams = [
  {
    id: 'network',
    name: 'Network Team',
    code: 'NET',
    color: '#3B82F6'
  },
  {
    id: 'os',
    name: 'OS Support',
    code: 'OS',
    color: '#10B981'
  },
  {
    id: 'desktop',
    name: 'Desktop Support',
    code: 'DSK',
    color: '#F59E0B'
  },
  {
    id: 'infra',
    name: 'Infrastructure',
    code: 'INF',
    color: '#8B5CF6'
  }
];

const mockLocations = [
  {
    id: 'hq-blr',
    name: 'Bangalore HQ',
    city: 'Bangalore',
    timezone: 'Asia/Kolkata'
  },
  {
    id: 'hyd-campus',
    name: 'Hyderabad Campus',
    city: 'Hyderabad',
    timezone: 'Asia/Kolkata'
  }
];

// Generate current active shifts
const generateCurrentShifts = (): CurrentShiftView[] => {
  const currentShifts: CurrentShiftView[] = [];
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Deepika', 'Arjun', 'Kavya', 'Rohit', 'Ananya'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Krishnan', 'Mehta', 'Gupta', 'Jain', 'Rao'];
  const currentTasks = [
    'Server Maintenance',
    'Network Troubleshooting',
    'User Support',
    'Database Optimization',
    'Security Monitoring',
    'System Updates',
    'Application Deployment',
    'Infrastructure Monitoring'
  ];

  const now = new Date();
  const currentHour = now.getHours();

  // Determine current shift type based on time
  let currentShiftType: ShiftType;
  if (currentHour >= 6 && currentHour < 14) {
    currentShiftType = mockShiftTypes[0]; // Morning
  } else if (currentHour >= 14 && currentHour < 22) {
    currentShiftType = mockShiftTypes[1]; // Evening
  } else {
    currentShiftType = mockShiftTypes[2]; // Night
  }

  // Generate 85 currently active engineers
  for (let i = 1; i <= 85; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const team = mockTeams[Math.floor(Math.random() * mockTeams.length)];
    const location = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    
    // Calculate check-in time (some early, some late, some on-time)
    const scheduledStart = new Date();
    scheduledStart.setHours(parseInt(currentShiftType.startTime.split(':')[0]));
    scheduledStart.setMinutes(parseInt(currentShiftType.startTime.split(':')[1]));
    
    const checkInVariation = (Math.random() - 0.5) * 60; // -30 to +30 minutes
    const checkInTime = new Date(scheduledStart.getTime() + checkInVariation * 60000);
    
    const expectedEnd = new Date();
    expectedEnd.setHours(parseInt(currentShiftType.endTime.split(':')[0]));
    expectedEnd.setMinutes(parseInt(currentShiftType.endTime.split(':')[1]));
    
    let status: 'on-time' | 'late' | 'early' | 'overtime';
    if (checkInVariation > 15) {
      status = 'late';
    } else if (checkInVariation < -15) {
      status = 'early';
    } else {
      status = 'on-time';
    }
    
    // Some people might be in overtime
    if (Math.random() > 0.9 && currentHour > parseInt(currentShiftType.endTime.split(':')[0])) {
      status = 'overtime';
    }

    const engineer: Engineer = {
      id: `eng-${i.toString().padStart(3, '0')}`,
      employeeId: `CTS${(1000 + i).toString()}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@cognizant.com`,
      phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      team: team as any,
      department: { id: 'it-ops', name: 'IT Operations' } as any,
      location: location as any,
      skills: ['React', 'Node.js', 'AWS', 'Docker'],
      shiftHistory: [],
      isTeamLead: i <= 8,
      isOnCall: Math.random() > 0.85,
      status: 'active',
      joinDate: '2023-01-01',
      certifications: [],
      experience: Math.floor(Math.random() * 15) + 1
    };

    currentShifts.push({
      id: `shift-${i}`,
      engineer,
      shiftType: currentShiftType,
      location: location as any,
      checkInTime: checkInTime.toLocaleTimeString(),
      expectedEndTime: expectedEnd.toLocaleTimeString(),
      status,
      currentTask: currentTasks[Math.floor(Math.random() * currentTasks.length)]
    });
  }

  return currentShifts;
};

export default function CurrentShiftDashboard() {
  const [currentShifts, setCurrentShifts] = useState<CurrentShiftView[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    setCurrentShifts(generateCurrentShifts());
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setCurrentShifts(generateCurrentShifts());
        setLastUpdated(new Date());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredShifts = currentShifts.filter(shift => {
    if (searchTerm && !shift.engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !shift.engineer.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (selectedTeam && shift.engineer.team.id !== selectedTeam) {
      return false;
    }
    
    if (selectedLocation && shift.location.id !== selectedLocation) {
      return false;
    }
    
    if (selectedStatus && shift.status !== selectedStatus) {
      return false;
    }
    
    return true;
  });

  const stats = {
    total: currentShifts.length,
    onTime: currentShifts.filter(s => s.status === 'on-time').length,
    late: currentShifts.filter(s => s.status === 'late').length,
    overtime: currentShifts.filter(s => s.status === 'overtime').length,
    teamLeads: currentShifts.filter(s => s.engineer.isTeamLead).length,
    onCall: currentShifts.filter(s => s.engineer.isOnCall).length
  };

  const refreshData = () => {
    setCurrentShifts(generateCurrentShifts());
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white shadow-2xl">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                ⚡ Current Shift Dashboard
              </h1>
              <p className="text-green-100">Real-time monitoring of {stats.total} currently active engineers</p>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-100">{stats.onTime}</div>
                <div className="text-sm text-green-200">On-Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200">{stats.late}</div>
                <div className="text-sm text-green-200">Late</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-200">{stats.overtime}</div>
                <div className="text-sm text-green-200">Overtime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stats.total}
                  </div>
                  <div className="text-xs text-green-600 font-medium">Currently Active</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Total Engineers</h3>
              <p className="text-gray-500 text-sm mt-1">Across all shifts</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {stats.onTime}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">{Math.round((stats.onTime / stats.total) * 100)}% of total</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">On-Time</h3>
              <p className="text-gray-500 text-sm mt-1">Punctual attendance</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {stats.late}
                  </div>
                  <div className="text-xs text-yellow-600 font-medium">Need attention</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Late Arrivals</h3>
              <p className="text-gray-500 text-sm mt-1">Arrived after scheduled time</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats.teamLeads}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">Leadership present</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold">Team Leads</h3>
              <p className="text-gray-500 text-sm mt-1">On-site supervision</p>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search engineers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Teams</option>
                {mockTeams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {mockLocations.map(location => (
                  <option key={location.id} value={location.id}>{location.city}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="on-time">On-Time</option>
                <option value="late">Late</option>
                <option value="early">Early</option>
                <option value="overtime">Overtime</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-600">Auto-refresh</label>
              </div>

              <button
                onClick={refreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()} • Showing {filteredShifts.length} of {currentShifts.length} engineers
          </div>
        </div>

        {/* Current Shifts Table */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold flex items-center">
              <Zap className="w-6 h-6 mr-2 text-green-600" />
              Live Shift Monitoring
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected End</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-medium">
                            {shift.engineer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                            <span>{shift.engineer.name}</span>
                            {shift.engineer.isTeamLead && <UserCheck className="w-4 h-4 text-blue-500" />}
                            {shift.engineer.isOnCall && <Shield className="w-4 h-4 text-red-500" />}
                          </div>
                          <div className="text-sm text-gray-500">{shift.engineer.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: shift.engineer.team.color }}
                      >
                        {shift.engineer.team.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{shift.shiftType.name}</div>
                        <div className="text-gray-500">{shift.shiftType.startTime} - {shift.shiftType.endTime}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{shift.checkInTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{shift.expectedEndTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{shift.location.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{shift.currentTask}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shift.status === 'on-time' ? 'bg-green-100 text-green-800' :
                        shift.status === 'early' ? 'bg-blue-100 text-blue-800' :
                        shift.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {shift.status === 'on-time' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {shift.status === 'late' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {shift.status === 'overtime' && <TrendingUp className="w-3 h-3 mr-1" />}
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <a 
                          href={`mailto:${shift.engineer.email}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a 
                          href={`tel:${shift.engineer.phone}`}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Distribution */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Team Distribution
            </h3>
            <div className="space-y-4">
              {mockTeams.map(team => {
                const teamCount = currentShifts.filter(s => s.engineer.team.id === team.id).length;
                const percentage = (teamCount / currentShifts.length) * 100;
                
                return (
                  <div key={team.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: team.color }}
                      ></div>
                      <span className="font-medium">{team.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: team.color
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{teamCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              Location Distribution
            </h3>
            <div className="space-y-4">
              {mockLocations.map(location => {
                const locationCount = currentShifts.filter(s => s.location.id === location.id).length;
                const percentage = (locationCount / currentShifts.length) * 100;
                
                return (
                  <div key={location.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{location.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{locationCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 