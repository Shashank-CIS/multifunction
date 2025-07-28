import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Filter, 
  Plus, 
  Clock,
  Building,
  UserCheck,
  Search,
  Download,
  Upload,
  Grid,
  List,
  ChevronDown,
  MapPin,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Engineer, ShiftType, ShiftAssignment, Team, Department, Location, Project, SchedulerFilters } from '@/types';

const localizer = momentLocalizer(moment);

// Mock Data for Enterprise Scale
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

const mockTeams: Team[] = [
  {
    id: 'network',
    name: 'Network Team',
    code: 'NET',
    description: 'Network infrastructure and security',
    color: '#3B82F6',
    department: {} as Department,
    teamLeadId: 'eng-001',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 25
  },
  {
    id: 'os',
    name: 'OS Support',
    code: 'OS',
    description: 'Operating system support and maintenance',
    color: '#10B981',
    department: {} as Department,
    teamLeadId: 'eng-002',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 30
  },
  {
    id: 'desktop',
    name: 'Desktop Support',
    code: 'DSK',
    description: 'End-user desktop and hardware support',
    color: '#F59E0B',
    department: {} as Department,
    teamLeadId: 'eng-003',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 40
  },
  {
    id: 'infra',
    name: 'Infrastructure',
    code: 'INF',
    description: 'Data center and cloud infrastructure',
    color: '#8B5CF6',
    department: {} as Department,
    teamLeadId: 'eng-004',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 20
  }
];

const mockDepartments: Department[] = [
  {
    id: 'it-ops',
    name: 'IT Operations',
    code: 'ITOPS',
    description: 'IT Operations and Infrastructure',
    color: '#3B82F6',
    managerId: 'mgr-001',
    teamIds: ['network', 'infra'],
    headCount: 45,
    location: {} as Location
  },
  {
    id: 'support',
    name: 'Technical Support',
    code: 'SUPP',
    description: 'End-user technical support',
    color: '#10B981',
    managerId: 'mgr-002',
    teamIds: ['os', 'desktop'],
    headCount: 70,
    location: {} as Location
  }
];

const mockLocations: Location[] = [
  {
    id: 'hq-blr',
    name: 'Bangalore HQ',
    address: 'Electronics City, Bangalore',
    city: 'Bangalore',
    country: 'India',
    timezone: 'Asia/Kolkata',
    capacity: 500,
    facilities: ['Cafeteria', 'Parking', 'Gym', 'Medical']
  },
  {
    id: 'hyd-campus',
    name: 'Hyderabad Campus',
    address: 'HITEC City, Hyderabad',
    city: 'Hyderabad',
    country: 'India',
    timezone: 'Asia/Kolkata',
    capacity: 300,
    facilities: ['Cafeteria', 'Parking', 'Medical']
  }
];

// Generate sample engineers (representing 3000+ engineers)
const generateMockEngineers = (): Engineer[] => {
  const engineers: Engineer[] = [];
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Deepika', 'Arjun', 'Kavya', 'Rohit', 'Ananya'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Krishnan', 'Mehta', 'Gupta', 'Jain', 'Rao'];
  
  for (let i = 1; i <= 50; i++) { // Sample of 50 for demo
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const team = mockTeams[Math.floor(Math.random() * mockTeams.length)];
    const location = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    
    engineers.push({
      id: `eng-${i.toString().padStart(3, '0')}`,
      employeeId: `CTS${(1000 + i).toString()}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@cognizant.com`,
      phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      team,
      department: mockDepartments.find(d => d.teamIds.includes(team.id)) || mockDepartments[0],
      location,
      skills: ['React', 'Node.js', 'AWS', 'Docker'].slice(0, Math.floor(Math.random() * 4) + 1),
      shiftHistory: [],
      isTeamLead: i <= 4,
      isOnCall: Math.random() > 0.8,
      status: 'active',
      joinDate: '2023-01-01',
      certifications: ['AWS Certified', 'Azure Fundamentals'].slice(0, Math.floor(Math.random() * 2) + 1),
      experience: Math.floor(Math.random() * 15) + 1
    });
  }
  
  return engineers;
};

const mockEngineers = generateMockEngineers();

export default function EnterpriseScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'grid' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEngineers, setSelectedEngineers] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<SchedulerFilters>({
    dateRange: {
      start: moment().format('YYYY-MM-DD'),
      end: moment().add(7, 'days').format('YYYY-MM-DD')
    },
    teams: [],
    departments: [],
    projects: [],
    locations: [],
    shiftTypes: [],
    engineers: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalEngineers: mockEngineers.length,
    activeShifts: 145,
    teamLeads: mockEngineers.filter(e => e.isTeamLead).length,
    onCallMembers: mockEngineers.filter(e => e.isOnCall).length
  });

  // Generate some sample assignments
  useEffect(() => {
    const generateAssignments = () => {
      const assignments: ShiftAssignment[] = [];
      
      for (let day = 0; day < 7; day++) {
        const date = moment().add(day, 'days').format('YYYY-MM-DD');
        
        mockShiftTypes.forEach(shiftType => {
          const assignedCount = Math.floor(Math.random() * (shiftType.maximumStaff - shiftType.minimumStaff)) + shiftType.minimumStaff;
          
          for (let i = 0; i < Math.min(assignedCount, mockEngineers.length); i++) {
            const engineer = mockEngineers[Math.floor(Math.random() * mockEngineers.length)];
            
            assignments.push({
              id: `assign-${day}-${shiftType.id}-${i}`,
              engineerId: engineer.id,
              shiftTypeId: shiftType.id,
              date,
              locationId: engineer.location.id,
              status: Math.random() > 0.1 ? 'scheduled' : 'active',
              assignedById: 'admin-001',
              assignedAt: moment().subtract(1, 'day').toISOString(),
              notes: Math.random() > 0.7 ? 'Special project assignment' : undefined
            });
          }
        });
      }
      
      setAssignments(assignments);
    };

    generateAssignments();
  }, []);

  const filteredEngineers = mockEngineers.filter(engineer => {
    if (searchTerm && !engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !engineer.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.teams.length > 0 && !filters.teams.includes(engineer.team.id)) {
      return false;
    }
    
    if (filters.departments.length > 0 && !filters.departments.includes(engineer.department.id)) {
      return false;
    }
    
    if (filters.locations.length > 0 && !filters.locations.includes(engineer.location.id)) {
      return false;
    }
    
    return true;
  });

  const calendarEvents = assignments.map(assignment => {
    const engineer = mockEngineers.find(e => e.id === assignment.engineerId);
    const shiftType = mockShiftTypes.find(s => s.id === assignment.shiftTypeId);
    
    if (!engineer || !shiftType) return null;
    
    const start = moment(`${assignment.date} ${shiftType.startTime}`, 'YYYY-MM-DD HH:mm').toDate();
    const end = moment(`${assignment.date} ${shiftType.endTime}`, 'YYYY-MM-DD HH:mm').toDate();
    
    return {
      id: assignment.id,
      title: `${engineer.name} - ${shiftType.name}`,
      start,
      end,
      resource: {
        engineer,
        shiftType,
        assignment
      }
    };
  }).filter(Boolean);

  const handleBulkAssign = () => {
    // Bulk assignment logic would go here
    console.log('Bulk assigning shifts for:', selectedEngineers);
    setShowAssignModal(false);
    setSelectedEngineers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                🗓️ Enterprise Shift Scheduler
              </h1>
              <p className="text-blue-100">Manage shifts for {stats.totalEngineers.toLocaleString()}+ engineers across multiple teams and locations</p>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.activeShifts}</div>
                <div className="text-sm text-blue-200">Active Shifts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.teamLeads}</div>
                <div className="text-sm text-blue-200">Team Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.onCallMembers}</div>
                <div className="text-sm text-blue-200">On-Call</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Control Panel */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search engineers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('calendar')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  view === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Calendar</span>
              </button>
              <button
                onClick={() => setView('grid')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Shifts</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Import CSV</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teams</label>
                  <select multiple className="w-full border border-gray-300 rounded-lg p-2 h-24">
                    {mockTeams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                  <select multiple className="w-full border border-gray-300 rounded-lg p-2 h-24">
                    {mockDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                  <select multiple className="w-full border border-gray-300 rounded-lg p-2 h-24">
                    {mockLocations.map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shift Types</label>
                  <select multiple className="w-full border border-gray-300 rounded-lg p-2 h-24">
                    {mockShiftTypes.map(shift => (
                      <option key={shift.id} value={shift.id}>{shift.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {view === 'calendar' && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={(event) => console.log('Selected event:', event)}
                onSelectSlot={(slotInfo) => console.log('Selected slot:', slotInfo)}
                selectable
                popup
                views={['month', 'week', 'day']}
                defaultView="week"
                step={60}
                showMultiDayTimes
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.resource?.shiftType?.color || '#3174ad',
                    borderRadius: '4px',
                    opacity: 0.8,
                    color: 'white',
                    border: '0px',
                    display: 'block'
                  }
                })}
              />
            </div>
          </div>
        )}

        {view === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockShiftTypes.map(shiftType => {
              const shiftAssignments = assignments.filter(a => a.shiftTypeId === shiftType.id);
              const currentStaff = shiftAssignments.length;
              const utilizationPercent = (currentStaff / shiftType.maximumStaff) * 100;
              
              return (
                <div key={shiftType.id} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: shiftType.color }}
                      ></div>
                      <div>
                        <h3 className="font-bold text-lg">{shiftType.name}</h3>
                        <p className="text-sm text-gray-600">{shiftType.startTime} - {shiftType.endTime}</p>
                      </div>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Staffing:</span>
                      <span className={`font-medium ${
                        currentStaff < shiftType.minimumStaff ? 'text-red-600' : 
                        currentStaff > shiftType.maximumStaff ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {currentStaff} / {shiftType.maximumStaff}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          utilizationPercent < 50 ? 'bg-red-500' :
                          utilizationPercent < 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Min: {shiftType.minimumStaff}</span>
                      <span>Max: {shiftType.maximumStaff}</span>
                    </div>
                    
                    {currentStaff < shiftType.minimumStaff && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Understaffed by {shiftType.minimumStaff - currentStaff}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'list' && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold">Engineer Directory</h3>
              <p className="text-gray-600">Showing {filteredEngineers.length} of {mockEngineers.length} engineers</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/70">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEngineers.slice(0, 20).map((engineer) => (
                    <tr key={engineer.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          checked={selectedEngineers.includes(engineer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEngineers([...selectedEngineers, engineer.id]);
                            } else {
                              setSelectedEngineers(selectedEngineers.filter(id => id !== engineer.id));
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                              {engineer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                              <span>{engineer.name}</span>
                              {engineer.isTeamLead && <UserCheck className="w-4 h-4 text-blue-500" />}
                              {engineer.isOnCall && <AlertCircle className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="text-sm text-gray-500">{engineer.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: engineer.team.color }}
                        >
                          {engineer.team.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {engineer.department.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{engineer.location.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          engineer.status === 'active' ? 'bg-green-100 text-green-800' :
                          engineer.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {engineer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-indigo-600 hover:text-indigo-900">Assign</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/scheduler/current-shifts" 
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50 hover:border-green-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Clock className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Current Shifts</h3>
              <p className="text-sm text-gray-600">View active shifts and real-time status</p>
            </div>
          </Link>

          <Link 
            to="/scheduler/engineers" 
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Engineer Directory</h3>
              <p className="text-sm text-gray-600">Search and manage engineer profiles</p>
            </div>
          </Link>

          <Link 
            to="/scheduler/admin" 
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Building className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Admin Panel</h3>
              <p className="text-sm text-gray-600">Manage teams, projects, and bulk operations</p>
            </div>
          </Link>

          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200/50 hover:border-orange-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Briefcase className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Projects</h3>
              <p className="text-sm text-gray-600">Manage project assignments and timelines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Bulk Shift Assignment</h2>
            <p className="text-gray-600 mb-4">
              {selectedEngineers.length > 0 
                ? `Assigning shifts to ${selectedEngineers.length} selected engineers`
                : 'Select engineers from the list to assign shifts'
              }
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="border border-gray-300 rounded-lg p-2" />
                  <input type="date" className="border border-gray-300 rounded-lg p-2" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
                <select className="w-full border border-gray-300 rounded-lg p-2">
                  {mockShiftTypes.map(shift => (
                    <option key={shift.id} value={shift.id}>{shift.name} ({shift.startTime} - {shift.endTime})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select className="w-full border border-gray-300 rounded-lg p-2">
                  {mockLocations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAssign}
                disabled={selectedEngineers.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Shifts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 