import { useState, useEffect } from 'react';
import moment from 'moment';
import { 
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



// CIS Shift Types - 10 hour shifts with multiple login timings
const mockShiftTypes: ShiftType[] = [
  {
    id: 'shift-a',
    name: 'Shift A (Day)',
    code: 'A',
    startTime: '06:00',
    endTime: '16:00',
    duration: 10,
    color: '#3B82F6',
    isOvernight: false,
    minimumStaff: 25,
    maximumStaff: 40,
    payMultiplier: 1.0
  },
  {
    id: 'shift-b',
    name: 'Shift B (Evening)',
    code: 'B',
    startTime: '14:00',
    endTime: '00:00',
    duration: 10,
    color: '#10B981',
    isOvernight: true,
    minimumStaff: 20,
    maximumStaff: 35,
    payMultiplier: 1.2
  },
  {
    id: 'shift-c',
    name: 'Shift C (Night)',
    code: 'C',
    startTime: '22:00',
    endTime: '08:00',
    duration: 10,
    color: '#8B5CF6',
    isOvernight: true,
    minimumStaff: 15,
    maximumStaff: 25,
    payMultiplier: 1.5
  },
  {
    id: 'shift-d',
    name: 'Shift D (Early)',
    code: 'D',
    startTime: '04:00',
    endTime: '14:00',
    duration: 10,
    color: '#F59E0B',
    isOvernight: false,
    minimumStaff: 18,
    maximumStaff: 30,
    payMultiplier: 1.3
  },
  {
    id: 'shift-e',
    name: 'Shift E (Late)',
    code: 'E',
    startTime: '16:00',
    endTime: '02:00',
    duration: 10,
    color: '#EF4444',
    isOvernight: true,
    minimumStaff: 20,
    maximumStaff: 32,
    payMultiplier: 1.4
  }
];

const mockTeams: Team[] = [
  {
    id: 'noc',
    name: 'Network Operations Center',
    code: 'NOC',
    description: '24/7 network monitoring and incident response',
    color: '#3B82F6',
    department: {} as Department,
    teamLeadId: 'eng-001',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 30
  },
  {
    id: 'server-ops',
    name: 'Server Operations',
    code: 'SRV',
    description: 'Server infrastructure and maintenance',
    color: '#10B981',
    department: {} as Department,
    teamLeadId: 'eng-002',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 25
  },
  {
    id: 'dba',
    name: 'Database Administration',
    code: 'DBA',
    description: 'Database management and performance tuning',
    color: '#F59E0B',
    department: {} as Department,
    teamLeadId: 'eng-003',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 20
  },
  {
    id: 'cloud-ops',
    name: 'Cloud Operations',
    code: 'CLD',
    description: 'AWS, Azure, and GCP infrastructure management',
    color: '#8B5CF6',
    department: {} as Department,
    teamLeadId: 'eng-004',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 22
  },
  {
    id: 'security-ops',
    name: 'Security Operations',
    code: 'SOC',
    description: 'Security monitoring and incident response',
    color: '#EF4444',
    department: {} as Department,
    teamLeadId: 'eng-005',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 18
  },
  {
    id: 'service-desk',
    name: 'Service Desk',
    code: 'SD',
    description: 'L1/L2 support and ticket management',
    color: '#06B6D4',
    department: {} as Department,
    teamLeadId: 'eng-006',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 35
  }
];

const mockDepartments: Department[] = [
  {
    id: 'network-security',
    name: 'Network & Security Operations',
    code: 'NETSEC',
    description: 'Network monitoring and security operations',
    color: '#3B82F6',
    managerId: 'mgr-001',
    teamIds: ['noc', 'security-ops'],
    headCount: 48,
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

const mockLocations: Location[] = [
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
    id: 'chennai-siruseri',
    name: 'Cognizant Siruseri SEZ',
    address: 'Siruseri Special Economic Zone, Plot no B 40,41,42 & 44, SIPCOT Siruseri IT Park, Padur Post, Siruseri, Chennai 603 103, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '603103',
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
    id: 'bengaluru-bagmane',
    name: 'Cognizant Bengaluru East',
    address: 'Bagmane Solarium City, Near Graphite India Road, Doddanekundi Extension, Bengaluru East 560037, Karnataka',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560037',
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
    id: 'hyderabad-madhapur',
    name: 'Cognizant Hyderabad Madhapur',
    address: 'Raheja Park, Building No. 20, Mindspace-Cyberabad Project, Survey No: 64 (part), Madhapur, Hyderabad 500 081, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500081',
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
    id: 'pune-kharadi',
    name: 'Cognizant Pune Kharadi',
    address: '4th Floor, Wing 3, Cluster-B, EON Kharadi SEZ, Survey No. 77, Plot No 1, Kharadi MIDC, Pune 411 014, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411014',
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
  },
  {
    id: 'kochi-infopark',
    name: 'Cognizant Kochi Infopark',
    address: 'Naveda Campus, Infopark Phase 2 SEZ, Brahmapuram P.O, Kochi 682303, Kerala',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    pincode: '682303',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  },
  {
    id: 'noida-sector135',
    name: 'Cognizant Noida',
    address: 'Tower 9 & 10, Upper Ground Floor, 1st & 2nd Floor, Building No.10, IT/ITes SEZ, Plot No. 20 & 21, Sector-135, Noida 201 301, Uttar Pradesh',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '201301',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  },
  {
    id: 'gurugram-candor',
    name: 'Cognizant Gurugram',
    address: 'Building No.3, Candor Gurgaon One, Tikri Village, Sector 48, Gurugram 122 001, Haryana',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    pincode: '122001',
    timezone: 'Asia/Kolkata',
    isHeadquarter: false
  }
];

// Generate 150 unique CIS engineers across multiple delivery centers - Updated with real Cognizant locations
const generateMockEngineers = (): Engineer[] => {
  const engineers: Engineer[] = [];
  
  // Comprehensive list of 150+ unique first names
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
  
  // Comprehensive list of 60+ unique last names
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
    ['ServiceNow', 'ITSM', 'Ticket Management', 'Customer Service'],
    ['VMware', 'Hyper-V', 'Virtualization', 'Infrastructure Design'],
    ['Cisco Networking', 'Firewall Management', 'VPN', 'Network Security'],
    ['Monitoring Tools', 'Nagios', 'Zabbix', 'Performance Tuning'],
    ['Backup Solutions', 'Disaster Recovery', 'Business Continuity', 'Data Protection']
  ];
  
  // Generate 150 unique engineers with no name repetition
  const usedNames = new Set<string>();
  
  for (let i = 1; i <= 150; i++) {
    let firstName: string;
    let lastName: string;
    let fullName: string;
    
    // Ensure unique name combinations
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
      team,
      department: mockDepartments.find(d => d.teamIds.includes(team.id)) || mockDepartments[0],
      location,
      skills: skillSet.slice(0, Math.floor(Math.random() * 3) + 2),
      shiftHistory: [],
      isTeamLead: i <= 8, // 8 team leads for 150 engineers
      isOnCall: Math.random() > 0.87, // ~13% on-call engineers
      status: 'active',
      joinDate: '2023-01-01',
      certifications: [
        'ITIL Foundation', 'CompTIA Network+', 'AWS Solutions Architect', 
        'Microsoft Azure Admin', 'Oracle DBA', 'Cisco CCNA', 'VMware VCP',
        'Microsoft MCSA', 'Red Hat Certified', 'CompTIA Security+'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      experience: Math.floor(Math.random() * 12) + 2
    });
  }
  
  return engineers;
};

const mockEngineers = generateMockEngineers();

export default function EnterpriseScheduler() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
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
    activeShifts: 75, // 5 shifts across 3 weeks = 15 shifts per week
    teamLeads: mockEngineers.filter(e => e.isTeamLead).length,
    onCallMembers: mockEngineers.filter(e => e.isOnCall).length
  });

  // Generate some sample assignments
  useEffect(() => {
    const generateAssignments = () => {
      const assignments: ShiftAssignment[] = [];
      
      // Generate assignments for the current week
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

  

  const handleBulkAssign = () => {
    // Bulk assignment logic would go here
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
                🏢 Cognizant Infrastructure Services
              </h1>
              <p className="text-blue-100">CIS Shift Management - {stats.totalEngineers.toLocaleString()}+ engineers across 5 shifts and 4 delivery centers</p>
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

        {/* CIS Quick Actions Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/scheduler/current-shifts" 
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50 hover:border-green-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Clock className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Live Operations</h3>
              <p className="text-sm text-gray-600">24/7 shift monitoring and incident tracking</p>
            </div>
          </Link>

          <Link 
            to="/scheduler/engineers" 
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">CIS Engineers</h3>
              <p className="text-sm text-gray-600">Infrastructure team management across DCs</p>
            </div>
          </Link>

          <Link 
            to="/scheduler/admin" 
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Building className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Delivery Centers</h3>
              <p className="text-sm text-gray-600">Manage operations across all locations</p>
            </div>
          </Link>

          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200/50 hover:border-orange-300/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Briefcase className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Client Projects</h3>
              <p className="text-sm text-gray-600">Infrastructure service delivery management</p>
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