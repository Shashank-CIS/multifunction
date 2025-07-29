import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Award,
  Clock,
  Building,
  UserCheck,
  AlertCircle,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  Star,
  Shield,
  Briefcase,
  List,
  TrendingUp,
  Target,
  Activity,
  CheckCircle,
  Grid,
  User
} from 'lucide-react';
import { Engineer, Team, Department, Location, ProductionMetrics } from '@/types';

// Mock data (same as in Scheduler)
const mockTeams = [
  {
    id: 'network',
    name: 'Network Team',
    code: 'NET',
    description: 'Network infrastructure and security',
    color: '#3B82F6'
  },
  {
    id: 'os',
    name: 'OS Support',
    code: 'OS',
    description: 'Operating system support and maintenance',
    color: '#10B981'
  },
  {
    id: 'desktop',
    name: 'Desktop Support',
    code: 'DSK',
    description: 'End-user desktop and hardware support',
    color: '#F59E0B'
  },
  {
    id: 'infra',
    name: 'Infrastructure',
    code: 'INF',
    description: 'Data center and cloud infrastructure',
    color: '#8B5CF6'
  }
];

const mockDepartments = [
  {
    id: 'it-ops',
    name: 'IT Operations',
    code: 'ITOPS',
    description: 'IT Operations and Infrastructure',
    color: '#3B82F6'
  },
  {
    id: 'support',
    name: 'Technical Support',
    code: 'SUPP',
    description: 'End-user technical support',
    color: '#10B981'
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
    id: 'chennai-mepz',
    name: 'Cognizant MEPZ Campus',
    address: 'Madras Export Processing Zone (MEPZ), Plot No.A-17, D-2, C-10 & C-1, National Highway 45, Tambaram, Chennai 600 045, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '600045',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
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
  },
  {
    id: 'kolkata-saltlake',
    name: 'Cognizant Kolkata Salt Lake',
    address: 'Technocomplex, Plot-GN 34/3, Sector V, Salt Lake Electronics Complex, Kolkata 700 091, West Bengal',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    pincode: '700091',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  },
  {
    id: 'mumbai-navi',
    name: 'Cognizant Navi Mumbai',
    address: 'Unit Nos. 701, 702 & 601, SEZ Building No.5 & 9, Mindspace-Airoli, Thane Belapur Road, Navi Mumbai 400 708, Maharashtra',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400708',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  },
  {
    id: 'coimbatore-kgisl',
    name: 'Cognizant Coimbatore Campus',
    address: 'KGISL-SEZ-FO Special Economic Zone (SEZ), Saravanampatti VIA, Coimbatore North, Keeranatham Village, Coimbatore 641 035, Tamil Nadu',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '641035',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  }
];

// Generate comprehensive engineer data
const generateMockEngineers = (): Engineer[] => {
  const engineers: Engineer[] = [];
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Deepika', 'Arjun', 'Kavya', 'Rohit', 'Ananya', 'Siddharth', 'Meera', 'Karthik', 'Divya', 'Arun'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Krishnan', 'Mehta', 'Gupta', 'Jain', 'Rao', 'Iyer', 'Nair', 'Agarwal', 'Bansal', 'Verma'];
  const skillSets = [
    ['React', 'Node.js', 'AWS', 'Docker'],
    ['Python', 'Django', 'PostgreSQL', 'Redis'],
    ['Java', 'Spring Boot', 'Microservices', 'Kubernetes'],
    ['Angular', 'TypeScript', 'Azure', 'DevOps'],
    ['Vue.js', 'Express', 'MongoDB', 'CI/CD'],
    ['C#', '.NET Core', 'SQL Server', 'Azure'],
    ['PHP', 'Laravel', 'MySQL', 'Linux'],
    ['Go', 'gRPC', 'Docker', 'Kubernetes']
  ];
  
  for (let i = 1; i <= 150; i++) { // Expanded sample for demo
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const team = mockTeams[Math.floor(Math.random() * mockTeams.length)];
    const location = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    const skills = skillSets[Math.floor(Math.random() * skillSets.length)];
    const experience = Math.floor(Math.random() * 15) + 1;
    const department = mockDepartments.find(d => 
      (team.id === 'network' || team.id === 'infra') ? d.id === 'it-ops' : d.id === 'support'
    );
    
    engineers.push({
      id: `eng-${i.toString().padStart(3, '0')}`,
      employeeId: `CTS${(1000 + i).toString()}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@cognizant.com`,
      phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      team: team as any,
      department: department as any,
      location: location as any,
      skills,
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
      isTeamLead: i <= 8, // 8 team leads
      isOnCall: Math.random() > 0.85,
      status: Math.random() > 0.05 ? 'active' : (Math.random() > 0.5 ? 'on-leave' : 'inactive'),
      joinDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      certifications: ['AWS Certified', 'Azure Fundamentals', 'Kubernetes Certified', 'Agile Certified'].slice(0, Math.floor(Math.random() * 3) + 1),
      experience,
      emergencyContact: {
        name: `${firstName} Emergency Contact`,
        relationship: 'Spouse',
        phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
      }
    });
  }
  
  return engineers;
};

const mockEngineers = generateMockEngineers();

export default function EngineerDirectory() {
  const { user, isManager } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    team: '',
    location: '',
    skills: [] as string[],
    status: ''
  });
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'joinDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [selectedEngineerForProduction, setSelectedEngineerForProduction] = useState<Engineer | null>(null);
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

  const handleUpdateProduction = (engineer: Engineer) => {
    setSelectedEngineerForProduction(engineer);
    setProductionForm(engineer.productionMetrics);
    setShowProductionModal(true);
  };

  const handleSaveProduction = () => {
    if (selectedEngineerForProduction) {
      // Update the engineer's production metrics
      const updatedMetrics = {
        ...productionForm,
        lastUpdated: new Date().toISOString()
      };
      
      // In a real app, this would make an API call
      selectedEngineerForProduction.productionMetrics = updatedMetrics;
      
      setShowProductionModal(false);
      setSelectedEngineerForProduction(null);
      
      // Show success message (you could add a toast notification here)
      alert('Production metrics updated successfully!');
    }
  };

  // Role-based filtering: Engineers see limited data, Managers see all
  const getAccessibleEngineers = () => {
    if (isManager) {
      return mockEngineers; // Managers see all engineers
    } else {
      // Engineers see only their own profile and team members (limited info)
      return mockEngineers.filter(engineer => 
        engineer.employeeId === user?.engineerId || 
        engineer.id === user?.id ||
        engineer.team.id === 'production' // Same team only
      );
    }
  };

  const filteredEngineers = getAccessibleEngineers().filter(engineer => {
    // Search filter
    if (searchTerm && !engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !engineer.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !engineer.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Team filter
    if (filters.team && engineer.team.id !== filters.team) {
      return false;
    }
    
    // Location filter
    if (filters.location && engineer.location.id !== filters.location) {
      return false;
    }
    
    // Status filter
    if (filters.status && engineer.status !== filters.status) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'experience':
        aValue = a.experience;
        bValue = b.experience;
        break;
      case 'joinDate':
        aValue = new Date(a.joinDate).getTime();
        bValue = new Date(b.joinDate).getTime();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Role-based stats
  const getStats = () => {
    const accessibleEngineers = getAccessibleEngineers();
    return {
      total: accessibleEngineers.length,
      active: accessibleEngineers.filter(e => e.status === 'active').length,
      teamLeads: accessibleEngineers.filter(e => e.isTeamLead).length,
      onCall: accessibleEngineers.filter(e => e.isOnCall).length
    };
  };

  const stats = getStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header and Stats Section with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Engineer Directory</h1>
            <p className="text-gray-600">Manage and connect with your CIS team members</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Engineer
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Engineers</h3>
                <p className="text-2xl font-semibold text-gray-900">{mockEngineers.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Engineers</h3>
                <p className="text-2xl font-semibold text-gray-900">{mockEngineers.filter(e => e.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Locations</h3>
                <p className="text-2xl font-semibold text-gray-900">{mockLocations.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Teams</h3>
                <p className="text-2xl font-semibold text-gray-900">{mockTeams.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-gray-700 text-sm font-medium mb-2">Search Engineers</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, skills, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Team</label>
            <select 
              value={filters.team} 
              onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
              className="input w-full"
            >
              <option value="">All Teams</option>
              {mockTeams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
            <select 
              value={filters.location} 
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="input w-full"
            >
              <option value="">All Locations</option>
              {mockLocations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-end">
            <div className="flex rounded-lg border border-gray-300 p-1 w-full">
              <button
                onClick={() => setView('grid')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  view === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  view === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Engineers Display */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredEngineers.length} engineer{filteredEngineers.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEngineers.map(engineer => (
              <div key={engineer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    engineer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {engineer.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{engineer.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{engineer.team.name}</p>
                <p className="text-xs text-gray-500 mb-4">{engineer.location.name}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1">
                    {engineer.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {engineer.skills.length > 3 && (
                      <span className="text-xs text-gray-500">+{engineer.skills.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {engineer.experience} years exp
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedEngineerForProduction(engineer)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Update Production
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{engineer.location.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        engineer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {engineer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => setSelectedEngineerForProduction(engineer)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                      >
                        Update Production
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredEngineers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No engineers found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ team: '', location: '', skills: [], status: '' });
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Production Update Modal */}
      {showProductionModal && selectedEngineerForProduction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Update Production Metrics</h2>
            <p className="text-gray-600 mb-6">
              Updating metrics for {selectedEngineerForProduction.name}
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
                onClick={() => setShowProductionModal(false)}
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