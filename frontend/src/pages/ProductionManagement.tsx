import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  TrendingUp,
  Target,
  Activity,
  AlertCircle,
  Star,
  Clock,
  Briefcase,
  BarChart3,
  PieChart,
  Calendar,
  Award,
  X,
  CheckSquare,
  Download,
  Plus,
  User
} from 'lucide-react';
import { Engineer, Team, Department, Location, ProductionMetrics } from '@/types';

// Import the same mock data from Scheduler
const mockTeams = [
  {
    id: 'noc',
    name: 'Network Operations Center',
    code: 'NOC',
    description: 'Network monitoring and incident response',
    color: '#3B82F6'
  },
  {
    id: 'server-ops',
    name: 'Server Operations',
    code: 'SRVOPS',
    description: 'Server infrastructure and maintenance',
    color: '#10B981'
  },
  {
    id: 'dba',
    name: 'Database Administration',
    code: 'DBA',
    description: 'Database management and optimization',
    color: '#F59E0B'
  },
  {
    id: 'cloud-ops',
    name: 'Cloud Operations',
    code: 'CLOUD',
    description: 'Cloud infrastructure and DevOps',
    color: '#8B5CF6'
  },
  {
    id: 'security-ops',
    name: 'Security Operations',
    code: 'SECOPS',
    description: 'Cybersecurity and compliance monitoring',
    color: '#EF4444'
  },
  {
    id: 'service-desk',
    name: 'Service Desk',
    code: 'DESK',
    description: 'End-user support and helpdesk services',
    color: '#06B6D4'
  }
];

const mockDepartments = [
  {
    id: 'network-security',
    name: 'Network & Security Operations',
    code: 'NETSEC',
    description: 'Network infrastructure and security management',
    color: '#3B82F6',
    managerId: 'mgr-001',
    teamIds: ['noc', 'security-ops'],
    headCount: 38,
    location: {} as Location
  },
  {
    id: 'server-db',
    name: 'Server & Database Operations',
    code: 'SRVDB',
    description: 'Server infrastructure and database management',
    color: '#10B981',
    managerId: 'mgr-002',
    teamIds: ['server-ops', 'dba'],
    headCount: 45,
    location: {} as Location
  },
  {
    id: 'cloud-services',
    name: 'Cloud & Platform Services',
    code: 'CLOUD',
    description: 'Cloud infrastructure and platform management',
    color: '#8B5CF6',
    managerId: 'mgr-003',
    teamIds: ['cloud-ops'],
    headCount: 22,
    location: {} as Location
  },
  {
    id: 'service-support',
    name: 'Service Desk & Support',
    code: 'SUPPORT',
    description: 'Customer support and incident management',
    color: '#06B6D4',
    managerId: 'mgr-004',
    teamIds: ['service-desk'],
    headCount: 35,
    location: {} as Location
  }
];

const mockLocations = [
  {
    id: 'chennai-dlf',
    name: 'Cognizant DLF Chennai',
    address: 'DLF IT Park Block 9, 1/124 Shivaji Gardens, Ramapuram, Mount Poonamallee High Road, Chennai 600 089, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '600089',
    timezone: 'Asia/Kolkata',
    isHeadquarter: true
  },
  {
    id: 'bengaluru-manyata',
    name: 'Cognizant Bengaluru Manyata',
    address: 'Manyata Embassy Business Park, F3 and G3 Buildings, Outer Ring Road, Near Nagawara, Rachenahalli Village, Bengaluru 560 045, Karnataka',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560045',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  },
  {
    id: 'hyderabad-gachibowli',
    name: 'Cognizant Hyderabad Gachibowli',
    address: 'H-04 Vignesh Hi-tech City-2, Survey No. 30(P), 35(P) & 35 (P), Gachibowli, Serilingampally Mandal, Hyderabad 500 019, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500019',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  },
  {
    id: 'pune-hinjewadi',
    name: 'Cognizant Pune Hinjewadi',
    address: 'Plot No.16, Phase III, Rajiv Gandhi Infotech Park, Hinjawadi, Pune 411 057, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411057',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  }
];

// Generate 150 unique CIS engineers with production metrics
const generateMockEngineers = (): Engineer[] => {
  const engineers: Engineer[] = [];
  
  const firstNames = [
    'Aarav', 'Abhay', 'Abhijeet', 'Abhishek', 'Aditya', 'Ajay', 'Akash', 'Akhil', 'Alok', 'Amar',
    'Amit', 'Amol', 'Anand', 'Anil', 'Anirudh', 'Ankit', 'Anoop', 'Anuj', 'Arjun', 'Arun',
    'Ashish', 'Ashok', 'Atul', 'Bharat', 'Chandan', 'Deepak', 'Dev', 'Gaurav', 'Harish', 'Harsh',
    'Hemant', 'Hitesh', 'Jatin', 'Karan', 'Karthik', 'Kishore', 'Krishna', 'Kunal', 'Manoj', 'Manish',
    'Mohit', 'Mukesh', 'Naveen', 'Nikhil', 'Nitin', 'Pankaj', 'Pradeep', 'Prakash', 'Pranav', 'Rajesh',
    'Rakesh', 'Ravi', 'Rohit', 'Sachin', 'Sagar', 'Sanjay', 'Santosh', 'Shashi', 'Shubham', 'Sudhir',
    'Sunil', 'Suresh', 'Tushar', 'Varun', 'Vikash', 'Vikram', 'Vinay', 'Vinod', 'Vishal', 'Vivek',
    'Aditi', 'Ankita', 'Ananya', 'Archana', 'Asha', 'Bhavana', 'Deepika', 'Divya', 'Geeta', 'Kavya',
    'Lakshmi', 'Meera', 'Neha', 'Pooja', 'Priya', 'Priyanka', 'Radha', 'Rashmi', 'Rekha', 'Ritu',
    'Sarita', 'Shilpa', 'Shreya', 'Sneha', 'Sonia', 'Sunita', 'Swati', 'Tanvi', 'Usha', 'Vandana'
  ];
  
  const lastNames = [
    'Agarwal', 'Bansal', 'Bhat', 'Chandra', 'Choudhary', 'Das', 'Desai', 'Garg', 'Gupta', 'Iyer',
    'Jain', 'Joshi', 'Kapoor', 'Krishnan', 'Kumar', 'Malhotra', 'Mehta', 'Menon', 'Mishra', 'Nair',
    'Pandey', 'Patel', 'Pillai', 'Prasad', 'Rao', 'Reddy', 'Roy', 'Saha', 'Saxena', 'Sethi',
    'Shah', 'Sharma', 'Shukla', 'Singh', 'Sinha', 'Soni', 'Srivastava', 'Subramanian', 'Tiwari', 'Trivedi',
    'Varma', 'Verma', 'Yadav', 'Agnihotri', 'Bhardwaj', 'Chopra', 'Dutta', 'Ghosh', 'Kulkarni', 'Mukherjee',
    'Narayanan', 'Raman', 'Raghavan', 'Venkatesh', 'Natarajan', 'Sundaram', 'Balasubramanian', 'Chakraborty', 'Bhattacharya', 'Sengupta'
  ];
  
  const infraSkills = [
    ['Linux Administration', 'Network Monitoring', 'ITIL', 'Incident Management'],
    ['Windows Server', 'Active Directory', 'PowerShell', 'System Administration'],
    ['Oracle DBA', 'SQL Server', 'Database Performance', 'Backup & Recovery'],
    ['AWS', 'Azure', 'Cloud Migration', 'DevOps'],
    ['Security Operations', 'SIEM', 'Vulnerability Assessment', 'Compliance'],
    ['ServiceNow', 'ITSM', 'Ticket Management', 'Customer Service']
  ];
  
  const usedNames = new Set<string>();
  
  for (let i = 1; i <= 150; i++) {
    let firstName: string;
    let lastName: string;
    let fullName: string;
    
    do {
      firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));
    
    usedNames.add(fullName);
    
    const team = mockTeams[Math.floor(Math.random() * mockTeams.length)];
    const location = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    const skillSet = infraSkills[Math.floor(Math.random() * infraSkills.length)];
    
    engineers.push({
      id: `cis-${i.toString().padStart(3, '0')}`,
      employeeId: `CTS${(300000 + i).toString()}`,
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@cognizant.com`,
      phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      team: team as any,
      department: mockDepartments.find(d => d.teamIds.includes(team.id)) || mockDepartments[0] as any,
      location: location as any,
      skills: skillSet.slice(0, Math.floor(Math.random() * 3) + 2),
      shiftHistory: [],
      productionMetrics: {
        ticketsResolved: Math.floor(Math.random() * 150) + 50,
        incidentsHandled: Math.floor(Math.random() * 25) + 5,
        tasksCompleted: Math.floor(Math.random() * 200) + 80,
        systemUptimeHours: Math.floor(Math.random() * 500) + 200,
        projectsDelivered: Math.floor(Math.random() * 8) + 2,
        monthlyTarget: Math.floor(Math.random() * 50) + 100,
        lastUpdated: new Date().toISOString(),
        averageResolutionTime: Math.round((Math.random() * 8 + 2) * 10) / 10,
        customerSatisfactionRating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10
      },
      isTeamLead: i <= 8,
      isOnCall: Math.random() > 0.87,
      status: 'active',
      joinDate: '2023-01-01',
      certifications: [
        'ITIL Foundation', 'CompTIA Network+', 'AWS Solutions Architect',
        'Microsoft Azure Admin', 'Oracle DBA', 'Cisco CCNA'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      experience: Math.floor(Math.random() * 12) + 2
    });
  }
  
  return engineers;
};

const mockEngineers = generateMockEngineers();

export default function ProductionManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productionForm, setProductionForm] = useState<ProductionMetrics>({
    ticketsResolved: 0,
    incidentsHandled: 0,
    tasksCompleted: 0,
    systemUptimeHours: 0,
    projectsDelivered: 0,
    monthlyTarget: 0,
    lastUpdated: '',
    averageResolutionTime: 0,
    customerSatisfactionRating: 0
  });
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [filters, setFilters] = useState({
    team: '',
    period: 'month'
  });

  const filteredEngineers = mockEngineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = !selectedTeam || engineer.team.id === selectedTeam;
    const matchesLocation = !selectedLocation || engineer.location.id === selectedLocation;
    
    return matchesSearch && matchesTeam && matchesLocation;
  });

  const handleUpdateProduction = (engineer: Engineer) => {
    setSelectedEngineer(engineer);
    setProductionForm(engineer.productionMetrics);
    setShowUpdateModal(true);
  };

  const handleSaveProduction = () => {
    if (selectedEngineer) {
      const updatedMetrics = {
        ...productionForm,
        lastUpdated: new Date().toISOString()
      };
      
      selectedEngineer.productionMetrics = updatedMetrics;
      setShowUpdateModal(false);
      setSelectedEngineer(null);
      alert('Production metrics updated successfully!');
    }
  };

  // Calculate team performance stats
  const teamStats = mockTeams.map(team => {
    const teamEngineers = filteredEngineers.filter(e => e.team.id === team.id);
    const totalTickets = teamEngineers.reduce((sum, e) => sum + e.productionMetrics.ticketsResolved, 0);
    const totalIncidents = teamEngineers.reduce((sum, e) => sum + e.productionMetrics.incidentsHandled, 0);
    const avgRating = teamEngineers.length > 0 
      ? teamEngineers.reduce((sum, e) => sum + e.productionMetrics.customerSatisfactionRating, 0) / teamEngineers.length 
      : 0;
    
    return {
      ...team,
      engineerCount: teamEngineers.length,
      totalTickets,
      totalIncidents,
      avgRating: Math.round(avgRating * 10) / 10
    };
  });

  // Calculate overall statistics
  const overallStats = {
    totalTickets: teamStats.reduce((sum, team) => sum + team.totalTickets, 0),
    avgResolutionTime: filteredEngineers.length > 0 
      ? Math.round(filteredEngineers.reduce((sum, e) => sum + e.productionMetrics.averageResolutionTime, 0) / filteredEngineers.length * 10) / 10
      : 0,
    avgSatisfaction: filteredEngineers.length > 0 
      ? Math.round(filteredEngineers.reduce((sum, e) => sum + e.productionMetrics.customerSatisfactionRating, 0) / filteredEngineers.length * 10) / 10
      : 0,
    systemUptime: filteredEngineers.length > 0 
      ? Math.round(filteredEngineers.reduce((sum, e) => sum + e.productionMetrics.systemUptimeHours, 0) / filteredEngineers.length / 24 * 100 * 10) / 10
      : 0
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Production Management</h1>
          <p className="text-gray-600">Monitor and track engineer performance metrics</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Team Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
              <p className="text-2xl font-semibold text-gray-900">{overallStats.totalTickets}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Resolution Time</h3>
              <p className="text-2xl font-semibold text-gray-900">{overallStats.avgResolutionTime}h</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Satisfaction</h3>
              <p className="text-2xl font-semibold text-gray-900">{overallStats.avgSatisfaction}/5</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">System Uptime</h3>
              <p className="text-2xl font-semibold text-gray-900">{overallStats.systemUptime}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Team</label>
            <select 
              value={filters.team} 
              onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
              className="input w-full"
            >
              <option value="">All Teams</option>
              {teamStats.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Period</label>
            <select 
              value={filters.period} 
              onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
              className="input w-full"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div className="lg:col-span-2 flex items-end">
            <button className="btn btn-primary w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

        {/* Team Performance Overview */}
        <div className="bg-white/70 dark:bg-gray-800 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              Team Performance Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamStats.map((team) => (
                <div key={team.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{team.name}</h3>
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.engineerCount} engineers
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tickets Resolved:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{team.totalTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Incidents Handled:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{team.totalIncidents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Rating:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {team.avgRating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 dark:bg-gray-800 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Engineers</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Teams</option>
                  {mockTeams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {mockLocations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Engineers Performance Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Engineer Performance</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incidents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEngineers.map(engineer => (
                <tr key={engineer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{engineer.name}</div>
                        <div className="text-sm text-gray-500">{engineer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{engineer.team.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{engineer.productionMetrics.ticketsResolved}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{engineer.productionMetrics.incidentsHandled}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{engineer.productionMetrics.customerSatisfactionRating.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleUpdateProduction(engineer)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Production Modal */}
      {showUpdateModal && selectedEngineer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Update Production Metrics</h2>
            <p className="text-gray-600 mb-6">
              Updating metrics for {selectedEngineer.name}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tickets Resolved</label>
                <input
                  type="number"
                  value={productionForm.ticketsResolved}
                  onChange={(e) => setProductionForm(prev => ({ ...prev, ticketsResolved: parseInt(e.target.value) || 0 }))}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incidents Handled</label>
                <input
                  type="number"
                  value={productionForm.incidentsHandled}
                  onChange={(e) => setProductionForm(prev => ({ ...prev, incidentsHandled: parseInt(e.target.value) || 0 }))}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">System Uptime Hours</label>
                <input
                  type="number"
                  value={productionForm.systemUptimeHours}
                  onChange={(e) => setProductionForm(prev => ({ ...prev, systemUptimeHours: parseInt(e.target.value) || 0 }))}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Satisfaction (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={productionForm.customerSatisfactionRating}
                  onChange={(e) => setProductionForm(prev => ({ ...prev, customerSatisfactionRating: parseFloat(e.target.value) || 0 }))}
                  className="input w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 