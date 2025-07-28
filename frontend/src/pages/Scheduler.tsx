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
  AlertCircle,
  CheckCircle,
  User
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shift Scheduler</h1>
          <p className="text-gray-600">Manage your CIS team schedules with precision</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Shift
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Shifts</h3>
              <p className="text-2xl font-semibold text-gray-900">{mockShiftTypes.filter(s => s.isOvernight).length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Engineers on Duty</h3>
              <p className="text-2xl font-semibold text-gray-900">{mockEngineers.filter(e => e.isOnCall).length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Locations</h3>
              <p className="text-2xl font-semibold text-gray-900">{mockLocations.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Available Engineers</h3>
              <p className="text-2xl font-semibold text-gray-900">{mockEngineers.filter(e => e.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Management</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">View</label>
              <select 
                value={view} 
                onChange={(e) => setView(e.target.value as any)}
                className="input w-full"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Team</label>
              <select 
                value={filters.teams.length === 0 ? '' : filters.teams[0]} 
                onChange={(e) => setFilters(prev => ({ ...prev, teams: [e.target.value] }))}
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
                value={filters.locations.length === 0 ? '' : filters.locations[0]} 
                onChange={(e) => setFilters(prev => ({ ...prev, locations: [e.target.value] }))}
                className="input w-full"
              >
                <option value="">All Locations</option>
                {mockLocations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex items-end">
            <button className="btn btn-primary w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Shift
            </button>
          </div>
        </div>
      </div>

      {/* Engineers Grid/List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Engineers Schedule</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAssignModal(true)}
              disabled={selectedEngineers.length === 0}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bulk Assign
            </button>
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  view === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
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

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEngineers.slice(0, 12).map(engineer => (
              <div key={engineer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedEngineers.includes(engineer.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEngineers(prev => [...prev, engineer.id]);
                        } else {
                          setSelectedEngineers(prev => prev.filter(id => id !== engineer.id));
                        }
                      }}
                      className="mr-3"
                    />
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    engineer.isOnCall 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {engineer.isOnCall ? 'On Call' : 'Available'}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{engineer.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{engineer.team.name}</p>
                <p className="text-xs text-gray-500">{engineer.location.name}</p>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {engineer.skills.length} skills
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    View Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEngineers(mockEngineers.slice(0, 12).map(e => e.id));
                        } else {
                          setSelectedEngineers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockEngineers.slice(0, 12).map(engineer => (
                  <tr key={engineer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEngineers.includes(engineer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEngineers(prev => [...prev, engineer.id]);
                          } else {
                            setSelectedEngineers(prev => prev.filter(id => id !== engineer.id));
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
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
                        engineer.isOnCall 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {engineer.isOnCall ? 'On Call' : 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-700 mr-3">View</button>
                      <button className="text-indigo-600 hover:text-indigo-700">Assign</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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