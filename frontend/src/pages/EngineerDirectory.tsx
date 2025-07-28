import { useState, useEffect } from 'react';
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
  List
} from 'lucide-react';
import { Engineer, Team, Department, Location } from '@/types';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'joinDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredEngineers = mockEngineers.filter(engineer => {
    // Search filter
    if (searchTerm && !engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !engineer.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !engineer.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Team filter
    if (selectedTeams.length > 0 && !selectedTeams.includes(engineer.team.id)) {
      return false;
    }
    
    // Department filter
    if (selectedDepartments.length > 0 && !selectedDepartments.includes(engineer.department.id)) {
      return false;
    }
    
    // Location filter
    if (selectedLocations.length > 0 && !selectedLocations.includes(engineer.location.id)) {
      return false;
    }
    
    // Status filter
    if (selectedStatus.length > 0 && !selectedStatus.includes(engineer.status)) {
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

  const stats = {
    total: mockEngineers.length,
    active: mockEngineers.filter(e => e.status === 'active').length,
    teamLeads: mockEngineers.filter(e => e.isTeamLead).length,
    onCall: mockEngineers.filter(e => e.isOnCall).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                👥 Engineer Directory
              </h1>
              <p className="text-blue-100">Comprehensive directory of {stats.total.toLocaleString()} engineers across all teams and locations</p>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-blue-200">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.teamLeads}</div>
                <div className="text-sm text-blue-200">Team Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.onCall}</div>
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
            {/* Search */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search engineers, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4" />
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
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg">
                <Plus className="w-4 h-4" />
                <span>Add Engineer</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teams</label>
                  <select 
                    multiple 
                    value={selectedTeams}
                    onChange={(e) => setSelectedTeams(Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 h-24"
                  >
                    {mockTeams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                  <select 
                    multiple
                    value={selectedDepartments}
                    onChange={(e) => setSelectedDepartments(Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 h-24"
                  >
                    {mockDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                  <select 
                    multiple
                    value={selectedLocations}
                    onChange={(e) => setSelectedLocations(Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 h-24"
                  >
                    {mockLocations.map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    multiple
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 h-24"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                  >
                    <option value="name">Name</option>
                    <option value="experience">Experience</option>
                    <option value="joinDate">Join Date</option>
                  </select>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredEngineers.length}</span> of <span className="font-medium">{mockEngineers.length}</span> engineers
          </p>
        </div>

        {/* Engineers Display */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEngineers.map((engineer) => (
              <div 
                key={engineer.id} 
                className="group bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedEngineer(engineer)}
              >
                {/* Engineer Avatar and Name */}
                <div className="text-center mb-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg mb-3">
                    {engineer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{engineer.name}</h3>
                  <p className="text-sm text-gray-500">{engineer.employeeId}</p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {engineer.isTeamLead && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <UserCheck className="w-3 h-3 mr-1" />
                      Team Lead
                    </span>
                  )}
                  {engineer.isOnCall && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      On-Call
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    engineer.status === 'active' ? 'bg-green-100 text-green-800' :
                    engineer.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {engineer.status}
                  </span>
                </div>

                {/* Team and Department */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: engineer.team.color }}
                    >
                      {engineer.team.name}
                    </span>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {engineer.department.name}
                  </div>
                </div>

                {/* Location and Experience */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{engineer.location.city}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{engineer.experience} years exp.</span>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="mt-4">
                  <div className="flex flex-wrap justify-center gap-1">
                    {engineer.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {engineer.skills.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{engineer.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/70">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEngineers.slice(0, 50).map((engineer) => (
                    <tr key={engineer.id} className="hover:bg-gray-50/70 transition-colors">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {engineer.experience} years
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
                        <button 
                          onClick={() => setSelectedEngineer(engineer)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Engineer Detail Modal */}
      {selectedEngineer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl">
                    {selectedEngineer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEngineer.name}</h2>
                    <p className="text-blue-100">{selectedEngineer.employeeId} • {selectedEngineer.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEngineer(null)}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Team</label>
                        <p className="font-medium">{selectedEngineer.team.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="font-medium">{selectedEngineer.department.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p className="font-medium">{selectedEngineer.location.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Experience</label>
                        <p className="font-medium">{selectedEngineer.experience} years</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Join Date</label>
                        <p className="font-medium">{new Date(selectedEngineer.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedEngineer.status === 'active' ? 'bg-green-100 text-green-800' :
                          selectedEngineer.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedEngineer.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills and Certifications */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-green-600" />
                      Skills & Certifications
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 block mb-2">Technical Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedEngineer.skills.map((skill) => (
                            <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 block mb-2">Certifications</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedEngineer.certifications.map((cert) => (
                            <span key={cert} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                              <Star className="w-3 h-3 mr-1" />
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact and Actions */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-purple-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedEngineer.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedEngineer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedEngineer.location.address}</span>
                      </div>
                    </div>
                    
                    {selectedEngineer.emergencyContact && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Emergency Contact</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>{selectedEngineer.emergencyContact.name}</p>
                          <p>{selectedEngineer.emergencyContact.relationship}</p>
                          <p>{selectedEngineer.emergencyContact.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-orange-600" />
                      Status & Roles
                    </h3>
                    <div className="space-y-3">
                      {selectedEngineer.isTeamLead && (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <UserCheck className="w-4 h-4" />
                          <span className="text-sm font-medium">Team Lead</span>
                        </div>
                      )}
                      {selectedEngineer.isOnCall && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Currently On-Call</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Joined {new Date(selectedEngineer.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span>Assign Shift</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Briefcase className="w-4 h-4" />
                      <span>View Projects</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 