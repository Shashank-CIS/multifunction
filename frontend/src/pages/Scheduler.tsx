import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
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
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  Target,
  Activity,
  Star,
  Shield,
  Eye,
  Edit
} from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Engineer, ShiftType, ShiftAssignment, Team, Department, Location, Project, SchedulerFilters, ProductionMetrics } from '../types';



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
  },
  {
    id: 'project-dedicated',
    name: 'Project Dedicated',
    code: 'PD',
    description: 'Engineers dedicated to specific client projects',
    color: '#7C3AED',
    department: {} as Department,
    teamLeadId: 'eng-007',
    memberIds: [],
    createdAt: '2023-01-01',
    maxCapacity: 75
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
  
  // Real project dedicated engineers from your employee data (first 21)
  const predefinedEngineers = [
    { name: 'Pradip Shinde', team: 'Project Dedicated', location: 'Pune', empId: '2268205' },
    { name: 'Satya Sharma', team: 'Project Dedicated', location: 'Bangalore', empId: '162296' },
    { name: 'Madhan Raj Selvaraj', team: 'Project Dedicated', location: 'Chennai', empId: '162420' },
    { name: 'Kameswaran Murugesan', team: 'Project Dedicated', location: 'Mumbai', empId: '162421' },
    { name: 'Ashish Avinash Patil', team: 'Project Dedicated', location: 'Pune', empId: '187784' },
    { name: 'Shashankagowda S', team: 'Project Dedicated', location: 'Bangalore', empId: '2171826' },
    { name: 'Mohan Kumar V', team: 'Project Dedicated', location: 'Chennai', empId: '2171825' },
    { name: 'Arunsankar V', team: 'Project Dedicated', location: 'Hyderabad', empId: '2175815' },
    { name: 'Charansai Patnam', team: 'Project Dedicated', location: 'Mumbai', empId: '2176358' },
    { name: 'Dineshkumar T', team: 'Project Dedicated', location: 'Pune', empId: '2181455' },
    { name: 'Dinanath Vijay Patil', team: 'Project Dedicated', location: 'Kolkata', empId: '2438360' },
    { name: 'Saikrishna Maddi', team: 'Project Dedicated', location: 'Bangalore', empId: '265754' },
    { name: 'Denzil F', team: 'Project Dedicated', location: 'Chennai', empId: '282670' },
    { name: 'Suresh Kumar Rampelly', team: 'Project Dedicated', location: 'Hyderabad', empId: '283488' },
    { name: 'Abhishek Reddy Thandra', team: 'Project Dedicated', location: 'Mumbai', empId: '287610' },
    { name: 'Sagar Sadashiv Janwade', team: 'Project Dedicated', location: 'Pune', empId: '315452' },
    { name: 'Somnath Ghosh', team: 'Project Dedicated', location: 'Kolkata', empId: '408515' },
    { name: 'Manash Ranjan Nayak', team: 'Project Dedicated', location: 'Bangalore', empId: '459873' },
    { name: 'Hamsanada S', team: 'Project Dedicated', location: 'Chennai', empId: '482720' },
    { name: 'Vamsi Krishna Vrns Pammy', team: 'Project Dedicated', location: 'Hyderabad', empId: '599860' },
    { name: 'Atul Landge', team: 'Project Dedicated', location: 'Mumbai', empId: '599886' }
  ];
  
  for (let i = 1; i <= 150; i++) {
    let firstName: string;
    let lastName: string;
    let fullName: string;
    let team: any;
    let location: any;
    
    // Use predefined engineers for the first 20
    if (i <= predefinedEngineers.length) {
      const predefined = predefinedEngineers[i - 1];
      fullName = predefined.name;
      // Extract first and last names from full name
      const nameParts = fullName.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' '); // Handle names with multiple parts
      team = mockTeams.find(t => t.name === predefined.team) || mockTeams[0];
      
      // Map predefined location names to actual mockLocation cities
      let locationCity = predefined.location;
      const locationMapping: { [key: string]: string } = {
        'Bangalore': 'Bengaluru',
        'Mumbai': 'Navi Mumbai',
        'Chennai': 'Chennai',
        'Hyderabad': 'Hyderabad', 
        'Pune': 'Pune',
        'Kolkata': 'Kolkata'
      };
      
      const mappedCity = locationMapping[predefined.location] || predefined.location;
      location = mockLocations.find(l => l.city === mappedCity) || mockLocations[0];
    } else {
      // Generate random names for the rest
      do {
        firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        fullName = `${firstName} ${lastName}`;
      } while (usedNames.has(fullName));
      
      team = mockTeams[Math.floor(Math.random() * mockTeams.length)];
      location = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    }
    
    usedNames.add(fullName);
    const skillSet = infraSkills[Math.floor(Math.random() * infraSkills.length)];
    
    // Determine shift preferences based on specific users
    let shiftPrefs: any = {
      preferredShift: ['shift-a', 'shift-b', 'shift-c'][Math.floor(Math.random() * 3)] as 'shift-a' | 'shift-b' | 'shift-c',
      isFlexibleTiming: Math.random() > 0.7, // 30% have flexible timing
      weeklyHours: [40, 45, 50][Math.floor(Math.random() * 3)],
      overtimePreference: ['none', 'limited', 'flexible', 'available'][Math.floor(Math.random() * 4)] as 'none' | 'limited' | 'flexible' | 'available'
    };

    // Set specific preferences for authenticated users
    if (fullName === 'Shashankagowda S') {
      shiftPrefs = {
        preferredShift: 'shift-a' as 'shift-a',
        isFlexibleTiming: false,
        weeklyHours: 50,
        overtimePreference: 'limited' as 'limited'
      };
    } else if (fullName === 'Pradip Shinde') {
      shiftPrefs = {
        preferredShift: 'shift-b' as 'shift-b',
        isFlexibleTiming: true,
        weeklyHours: 45,
        overtimePreference: 'flexible' as 'flexible'
      };
    }

    // Determine rotation schedule policy
    const isRotationSchedule = Math.random() > 0.75; // 25% of engineers have rotation schedule
    let rotationOffDays: number[] = [];
    let worksWeekends = false;

    if (isRotationSchedule) {
      // For rotation engineers, assign 2 random off days (not necessarily weekends)
      const allDays = [0, 1, 2, 3, 4, 5, 6]; // Sunday=0, Monday=1, ..., Saturday=6
      const shuffled = allDays.sort(() => 0.5 - Math.random());
      rotationOffDays = shuffled.slice(0, 2).sort(); // Take 2 random days and sort them
      worksWeekends = rotationOffDays.includes(0) || rotationOffDays.includes(6) ? false : true; // Works weekends if off days don't include weekend
    } else {
      // Standard schedule: Saturday and Sunday off
      rotationOffDays = [0, 6]; // Sunday and Saturday
      worksWeekends = false;
    }

    engineers.push({
      id: `cis-${i.toString().padStart(3, '0')}`,
      employeeId: i <= predefinedEngineers.length ? predefinedEngineers[i - 1].empId : `CTS${(300000 + i).toString()}`,
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
      status: (() => {
        const rand = Math.random();
        if (rand < 0.85) return 'active';      // 85% active
        if (rand < 0.95) return 'on-leave';   // 10% on leave
        return 'inactive';                     // 5% inactive
      })() as 'active' | 'inactive' | 'on-leave' | 'terminated',
      joinDate: '2023-01-01',
      certifications: [
        'ITIL Foundation', 'CompTIA Network+', 'AWS Solutions Architect',
        'Microsoft Azure Admin', 'Oracle DBA', 'Cisco CCNA', 'VMware VCP',
        'Microsoft MCSA', 'Red Hat Certified', 'CompTIA Security+'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      experience: Math.floor(Math.random() * 12) + 2,
      designation: (() => {
        // Set specific designations for known users
        if (fullName === 'Pradip Shinde') {
          return 'System Engineer';
        }
        if (fullName === 'Shashankagowda S') {
          return 'Sr. System Engineer';
        }
        
        const designations = [
          'System Engineer', 'Sr. System Engineer', 'Tech Lead', 
          'Infra Technology Specialist', 'Manager', 'Sr. Manager',
          'Associate', 'Sr. Associate', 'Contractor'
        ];
        // Assign higher designations to team leads
        if (i <= 8) { // Team leads
          return ['Tech Lead', 'Manager', 'Sr. Manager'][Math.floor(Math.random() * 3)];
        }
        // Regular distribution for others
        return designations[Math.floor(Math.random() * 6)]; // Exclude Manager levels for non-leads
      })(),
      // Shift Preferences
      ...shiftPrefs,
      // Schedule Policy
      isRotationSchedule,
      rotationOffDays,
      worksWeekends
    });
  }
  
  return engineers;
};

const mockEngineers = generateMockEngineers();

// Function to get updated engineer data with stored preferences
const getEngineersWithUpdatedPreferences = () => {
  return mockEngineers.map(engineer => {
    // Check if we have stored preferences for this engineer
    const storedPrefs = localStorage.getItem(`shift_prefs_${engineer.employeeId.replace('CTS', '')}`);
    if (storedPrefs) {
      try {
        const prefs = JSON.parse(storedPrefs);
        return {
          ...engineer,
          preferredShift: prefs.preferredShift || engineer.preferredShift,
          customShiftStart: prefs.shiftStartTime,
          customShiftEnd: prefs.shiftEndTime,
          isFlexibleTiming: prefs.isFlexibleTiming !== undefined ? prefs.isFlexibleTiming : engineer.isFlexibleTiming,
          weeklyHours: prefs.weeklyHours || engineer.weeklyHours,
          overtimePreference: prefs.overtimePreference || engineer.overtimePreference
        };
      } catch (error) {
        console.error('Error loading stored preferences for engineer:', engineer.employeeId);
      }
    }
    return engineer;
  });
};

// Function to check if engineer is currently on shift
const isEngineerOnShift = (engineer: Engineer): boolean => {
  const now = moment();
  const currentTime = now.format('HH:mm');
  const currentDay = now.day(); // 0 = Sunday, 1 = Monday, etc.

  // Check if today is an off day for this engineer
  if (engineer.rotationOffDays && engineer.rotationOffDays.includes(currentDay)) {
    return false;
  }

  // Get shift times based on engineer's preferred shift
  let shiftStart = '';
  let shiftEnd = '';
  let isOvernight = false;

  if (engineer.preferredShift === 'shift-a') {
    shiftStart = '06:00';
    shiftEnd = '16:00';
    isOvernight = false;
  } else if (engineer.preferredShift === 'shift-b') {
    shiftStart = '14:00';
    shiftEnd = '00:00';
    isOvernight = true;
  } else if (engineer.preferredShift === 'shift-c') {
    shiftStart = '22:00';
    shiftEnd = '08:00';
    isOvernight = true;
  } else if (engineer.preferredShift === 'shift-d') {
    shiftStart = '04:00';
    shiftEnd = '14:00';
    isOvernight = false;
  } else if (engineer.preferredShift === 'shift-e') {
    shiftStart = '16:00';
    shiftEnd = '02:00';
    isOvernight = true;
  } else if (engineer.preferredShift === 'custom') {
    shiftStart = engineer.customShiftStart || '06:00';
    shiftEnd = engineer.customShiftEnd || '16:00';
    // Determine if custom shift is overnight
    isOvernight = shiftStart > shiftEnd;
  } else {
    // Default to Shift A
    shiftStart = '06:00';
    shiftEnd = '16:00';
    isOvernight = false;
  }

  // Check if current time is within shift hours
  if (isOvernight) {
    // For overnight shifts (e.g., 22:00 to 08:00)
    return currentTime >= shiftStart || currentTime <= shiftEnd;
  } else {
    // For regular shifts (e.g., 06:00 to 16:00)
    return currentTime >= shiftStart && currentTime <= shiftEnd;
  }
};

export default function EnterpriseScheduler() {
  const { user, isManager, isEngineer } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Real-time status updates - force re-render every minute for accurate shift status
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Calculate active shifts count (shifts currently running)
  const getActiveShiftsCount = () => {
    const now = moment();
    const currentTime = now.format('HH:mm');
    return mockShiftTypes.filter(shift => {
      if (shift.isOvernight) {
        return currentTime >= shift.startTime || currentTime <= shift.endTime;
      } else {
        return currentTime >= shift.startTime && currentTime <= shift.endTime;
      }
    }).length;
  };

  // Get currently active shift types
  const getActiveShiftTypes = () => {
    const now = moment();
    const currentTime = now.format('HH:mm');
    return mockShiftTypes.filter(shift => {
      if (shift.isOvernight) {
        return currentTime >= shift.startTime || currentTime <= shift.endTime;
      } else {
        return currentTime >= shift.startTime && currentTime <= shift.endTime;
      }
    });
  };

  // Calculate engineers assigned to currently active shifts
  const getEngineersOnActiveShifts = () => {
    const activeShifts = getActiveShiftTypes();
    const activeShiftIds = activeShifts.map(shift => shift.id);
    
    return getAccessibleEngineers().filter(engineer => {
      // Map engineer's preferred shift to shift ID
      let engineerShiftId = '';
      if (engineer.preferredShift === 'shift-a') engineerShiftId = 'shift-a';
      else if (engineer.preferredShift === 'shift-b') engineerShiftId = 'shift-b';
      else if (engineer.preferredShift === 'shift-c') engineerShiftId = 'shift-c';
      else if (engineer.preferredShift === 'shift-d') engineerShiftId = 'shift-d';
      else if (engineer.preferredShift === 'shift-e') engineerShiftId = 'shift-e';
      else engineerShiftId = 'shift-a'; // Default for custom shifts
      
      return activeShiftIds.includes(engineerShiftId);
    }).length;
  };

  // Calculate active engineers (currently working in active shifts)
  const getTotalActiveEngineers = () => {
    return getAccessibleEngineers().filter(engineer => isEngineerOnShift(engineer)).length;
  };

  // Calculate engineers on leave
  const getEngineersOnLeave = () => {
    return getAccessibleEngineers().filter(e => e.status === 'on-leave').length;
  };

  // Calculate engineers currently working their shifts (for Directory view)
  const getCurrentlyWorkingEngineers = () => {
    return getAccessibleEngineers().filter(engineer => isEngineerOnShift(engineer)).length;
  };
  
  // Main view toggle between Schedule and Directory
  const [mainView, setMainView] = useState<'schedule' | 'directory'>('schedule');
  
  // Scheduler state (existing)
  const [selectedEngineers, setSelectedEngineers] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateShiftModal, setShowCreateShiftModal] = useState(false);
  const [newShiftForm, setNewShiftForm] = useState({
    title: '',
    shiftType: '',
    startDate: '',
    endDate: '',
    location: '',
    assignee: '',
    description: ''
  });
  const [showViewScheduleModal, setShowViewScheduleModal] = useState(false);
  const [showIndividualAssignModal, setShowIndividualAssignModal] = useState(false);
  const [selectedEngineerForView, setSelectedEngineerForView] = useState<Engineer | null>(null);
  const [selectedEngineerForAssign, setSelectedEngineerForAssign] = useState<Engineer | null>(null);
  const [showEngineerProfileModal, setShowEngineerProfileModal] = useState(false);
  const [selectedEngineerForProfile, setSelectedEngineerForProfile] = useState<Engineer | null>(null);
  const [showActiveShiftsModal, setShowActiveShiftsModal] = useState(false);
  const [showEngineersOnShiftModal, setShowEngineersOnShiftModal] = useState(false);
  const [showActiveEngineersModal, setShowActiveEngineersModal] = useState(false);
  const [showEngineersOnLeaveModal, setShowEngineersOnLeaveModal] = useState(false);
  
  // Alert messages state
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    timestamp: number;
  }>>([]);

  // Alert management functions
  const addAlert = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const newAlert = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now()
    };
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto remove alert after 4 seconds
    setTimeout(() => {
      removeAlert(newAlert.id);
    }, 4000);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Show critical alerts when component mounts
  useEffect(() => {
    // Critical system alerts and emergency notifications
    const criticalAlerts = [
      { message: "🚨 CRITICAL: Server maintenance scheduled tonight 11 PM - 3 AM", type: 'error' as const, delay: 1000 },
      { message: "⚠️ URGENT: Emergency leave - Sarah Chen (Database Team)", type: 'warning' as const, delay: 3000 },
      { message: "🔴 OUTAGE: Payment gateway service temporarily unavailable", type: 'error' as const, delay: 5000 },
      { message: "🚨 HIGH PRIORITY: Security incident detected - All hands meeting at 4 PM", type: 'error' as const, delay: 7000 }
    ];

    // Show critical alerts with staggered timing
    criticalAlerts.forEach((alert, index) => {
      setTimeout(() => {
        addAlert(alert.message, alert.type);
      }, alert.delay);
    });

    // Simulate periodic critical updates only
    const interval = setInterval(() => {
      const emergencyMessages = [
        { message: "🚨 CRITICAL: Database server CPU usage at 95%", type: 'error' as const, probability: 0.15 },
        { message: "⚠️ URGENT: Emergency leave request - Mike Johnson", type: 'warning' as const, probability: 0.10 },
        { message: "🔴 OUTAGE: Email service experiencing delays", type: 'error' as const, probability: 0.12 },
        { message: "🚨 SECURITY ALERT: Unusual login attempts detected", type: 'error' as const, probability: 0.08 },
        { message: "⚠️ INFRASTRUCTURE: Network latency spike detected", type: 'warning' as const, probability: 0.10 },
        { message: "🔴 SERVICE DOWN: File upload service temporarily offline", type: 'error' as const, probability: 0.09 },
        { message: "🚨 EMERGENCY: Fire drill scheduled in 10 minutes", type: 'error' as const, probability: 0.05 },
        { message: "⚠️ URGENT: Power outage reported in Building A", type: 'warning' as const, probability: 0.07 },
        { message: "🔴 CRITICAL: Backup system failure - Immediate attention required", type: 'error' as const, probability: 0.06 },
        { message: "🚨 INCIDENT: Production deployment rollback in progress", type: 'error' as const, probability: 0.11 }
      ];
      
      // Only show alerts based on probability (simulate real emergency frequency)
      const randomMessage = emergencyMessages[Math.floor(Math.random() * emergencyMessages.length)];
      if (Math.random() < randomMessage.probability) {
        addAlert(randomMessage.message, randomMessage.type);
      }
    }, 30000); // Check for critical alerts every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Engineer Directory state (new)
  const [directorySearchTerm, setDirectorySearchTerm] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [showDirectoryFilters, setShowDirectoryFilters] = useState(false);
  const [directoryFilters, setDirectoryFilters] = useState({
    team: '',
    location: '',
    skills: [] as string[],
    status: ''
  });
  const [directorySortBy, setDirectorySortBy] = useState<'name' | 'experience' | 'joinDate'>('name');
  const [directorySortOrder, setDirectorySortOrder] = useState<'asc' | 'desc'>('asc');
  const [directoryView, setDirectoryView] = useState<'grid' | 'list'>('grid');
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
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState<'all' | 'standard' | 'rotation'>('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalEngineers: mockEngineers.length,
    activeShifts: 75, // 5 shifts across 3 weeks = 15 shifts per week
    teamLeads: mockEngineers.filter(e => e.isTeamLead).length,
    onCallMembers: mockEngineers.filter(e => e.isOnCall).length
  });

  // Listen for preference changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('shift_prefs_')) {
        // setRefreshKey(prev => prev + 1); // This state was removed, so no need to update it here
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle URL parameters for opening engineer profiles
  useEffect(() => {
    const profileParam = searchParams.get('profile');
    if (profileParam) {
      // Find the engineer by ID
      const engineer = mockEngineers.find(eng => eng.id === profileParam);
      if (engineer) {
        // Switch to directory view if needed
        setMainView('directory');
        
        // Open the engineer profile modal
        setSelectedEngineerForProfile(engineer);
        setShowEngineerProfileModal(true);
        
        // Clear the URL parameter after opening
        setTimeout(() => {
          setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('profile');
            return newParams;
          });
        }, 1000);
      } else {
        // Clear invalid parameter
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.delete('profile');
          return newParams;
        });
      }
    }
  }, [searchParams, setSearchParams, mockEngineers]);

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

  // Role-based filtering for Scheduler
  const getAccessibleEngineers = () => {
    const updatedEngineers = getEngineersWithUpdatedPreferences();
    
    if (isManager) {
      return updatedEngineers; // Managers can schedule all engineers
    } else {
      // Engineers can view all engineers for schedule visibility, but with limited actions
      // This allows them to see team schedules and coordinate better
      return updatedEngineers;
    }
  };

  const filteredEngineers = getAccessibleEngineers().filter(engineer => {
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
    
    // Schedule type filter
    if (scheduleTypeFilter === 'standard' && engineer.isRotationSchedule) {
      return false;
    }
    if (scheduleTypeFilter === 'rotation' && !engineer.isRotationSchedule) {
      return false;
    }
    
    return true;
  });



  

  const handleBulkAssign = () => {
    // Bulk assignment logic would go here
    setShowAssignModal(false);
  };

  // Engineer Directory handlers
  const handleUpdateProduction = (engineer: Engineer) => {
    setSelectedEngineerForProduction(engineer);
    setProductionForm(engineer.productionMetrics);
    setShowProductionModal(true);
  };

  const handleSaveProduction = () => {
    if (selectedEngineerForProduction) {
      const updatedMetrics = {
        ...productionForm,
        lastUpdated: new Date().toISOString()
      };
      
      selectedEngineerForProduction.productionMetrics = updatedMetrics;
      setShowProductionModal(false);
      setSelectedEngineerForProduction(null);
      alert('Production metrics updated successfully!');
    }
  };

  // Create Shift handlers
  const handleCreateShift = () => {
    setShowCreateShiftModal(true);
  };

  const handleSaveNewShift = () => {
    if (newShiftForm.title && newShiftForm.shiftType && newShiftForm.startDate && newShiftForm.endDate) {
      // In a real app, this would make an API call
      console.log('Creating new shift:', newShiftForm);
      alert('Shift created successfully!');
      setShowCreateShiftModal(false);
      setNewShiftForm({
        title: '',
        shiftType: '',
        startDate: '',
        endDate: '',
        location: '',
        assignee: '',
        description: ''
      });
    } else {
      alert('Please fill in all required fields.');
    }
  };

  // View Schedule handlers
  const handleViewSchedule = (engineer: Engineer) => {
    setSelectedEngineerForView(engineer);
    setShowViewScheduleModal(true);
  };

  // Individual Assignment handlers
  const handleIndividualAssign = (engineer: Engineer) => {
    setSelectedEngineerForAssign(engineer);
    setShowIndividualAssignModal(true);
  };

  // Engineer Profile handlers
  const handleViewProfile = (engineer: Engineer) => {
    setSelectedEngineerForProfile(engineer);
    setShowEngineerProfileModal(true);
  };

  const handleSaveIndividualAssignment = () => {
    if (selectedEngineerForAssign && newShiftForm.shiftType && newShiftForm.startDate) {
      // Check if assignment conflicts with off days
      const startDate = new Date(newShiftForm.startDate);
      const dayOfWeek = startDate.getDay(); // 0=Sunday, 1=Monday, etc.
      
      if (selectedEngineerForAssign.rotationOffDays?.includes(dayOfWeek)) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        alert(`Cannot assign shift on ${dayNames[dayOfWeek]} - this is ${selectedEngineerForAssign.name}'s off day.`);
        return;
      }
      
      console.log('Assigning shift to:', selectedEngineerForAssign.name, newShiftForm);
      alert(`Shift assigned to ${selectedEngineerForAssign.name} successfully!`);
      setShowIndividualAssignModal(false);
      setSelectedEngineerForAssign(null);
      setNewShiftForm({
        title: '',
        shiftType: '',
        startDate: '',
        endDate: '',
        location: '',
        assignee: '',
        description: ''
      });
    } else {
      alert('Please fill in required fields.');
    }
  };

  // Engineer Directory filtering
  const getDirectoryFilteredEngineers = () => {
    return getAccessibleEngineers().filter(engineer => {
      // Search filter
      if (directorySearchTerm && !engineer.name.toLowerCase().includes(directorySearchTerm.toLowerCase()) && 
          !engineer.employeeId.toLowerCase().includes(directorySearchTerm.toLowerCase()) &&
          !engineer.email.toLowerCase().includes(directorySearchTerm.toLowerCase())) {
        return false;
      }
      
      // Team filter
      if (directoryFilters.team && engineer.team.id !== directoryFilters.team) {
        return false;
      }
      
      // Location filter
      if (directoryFilters.location && engineer.location.id !== directoryFilters.location) {
        return false;
      }
      
      // Status filter - now based on shift schedule
      if (directoryFilters.status) {
        if (directoryFilters.status === 'active' && !isEngineerOnShift(engineer)) {
          return false;
        }
        if (directoryFilters.status === 'inactive' && isEngineerOnShift(engineer)) {
          return false;
        }
        if (directoryFilters.status === 'on_call' && !engineer.isOnCall) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      let aValue, bValue;
      
      switch (directorySortBy) {
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
      
      if (directorySortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Get stats for directory
  const getDirectoryStats = () => {
    const accessibleEngineers = getAccessibleEngineers();
    return {
      total: accessibleEngineers.length,
      active: accessibleEngineers.filter(engineer => isEngineerOnShift(engineer)).length,
      teamLeads: accessibleEngineers.filter(e => e.isTeamLead).length,
      onCall: accessibleEngineers.filter(e => e.isOnCall).length
    };
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Main View Toggle */}
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex">
          <button
            onClick={() => setMainView('schedule')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              mainView === 'schedule'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-4 h-4 mr-2 inline" />
            Shift Schedule
          </button>
          <button
            onClick={() => setMainView('directory')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              mainView === 'directory'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 mr-2 inline" />
            Engineer Directory
          </button>
        </div>
      </div>

      {/* Conditional Content Based on Main View */}
      {mainView === 'schedule' ? (
        <>
          {/* Header and Stats Section with Background */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shift Scheduler</h1>
                <p className="text-gray-600">Manage your CIS team schedules with precision</p>
              </div>
              
              {/* My Shift Display */}
              {user?.engineerId && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-w-[220px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">My Shift:</span>
                    <span className="font-medium text-indigo-600">
                      {(() => {
                        const storedPrefs = localStorage.getItem(`shift_prefs_${user.engineerId}`);
                        if (storedPrefs) {
                          try {
                            const prefs = JSON.parse(storedPrefs);
                            if (prefs.preferredShift === 'shift-a') return '06:00 - 16:00';
                            if (prefs.preferredShift === 'shift-b') return '14:00 - 00:00';
                            if (prefs.preferredShift === 'shift-c') return '22:00 - 08:00';
                            if (prefs.preferredShift === 'custom') return `${prefs.shiftStartTime || '06:00'} - ${prefs.shiftEndTime || '16:00'}`;
                          } catch (e) {
                            // ignore error
                          }
                        }
                        return '06:00 - 16:00';
                      })()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div 
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-blue-50"
                onClick={() => setShowActiveShiftsModal(true)}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Active Shifts</h3>
                    <p className="text-2xl font-semibold text-gray-900">{getActiveShiftsCount()}</p>

                  </div>
                </div>
              </div>

              <div 
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-green-50"
                onClick={() => setShowEngineersOnShiftModal(true)}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Engineers on Shift</h3>
                    <p className="text-2xl font-semibold text-gray-900">{getEngineersOnActiveShifts()}</p>

                  </div>
                </div>
              </div>

              <div 
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-purple-50"
                onClick={() => setShowActiveEngineersModal(true)}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Active Engineers</h3>
                    <p className="text-2xl font-semibold text-gray-900">{getTotalActiveEngineers()}</p>

                  </div>
                </div>
              </div>

              <div 
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-orange-50"
                onClick={() => setShowEngineersOnLeaveModal(true)}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Engineers on Leave</h3>
                    <p className="text-2xl font-semibold text-gray-900">{getEngineersOnLeave()}</p>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Engineer Dashboard - Only for Engineers */}
          {isEngineer && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Personal Shift Details */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Shift Details</h3>
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                
                {(() => {
                  if (!user) return <div>Please log in to view shift details</div>;
                  const currentEngineer = mockEngineers.find(e => e.name === user.name);
                  if (!currentEngineer) return <div>Engineer not found</div>;
                  
                  const myAssignments = assignments.filter(a => a.engineerId === currentEngineer.id);
                  const todayAssignment = myAssignments.find(a => a.date === moment().format('YYYY-MM-DD'));
                  const upcomingAssignments = myAssignments.filter(a => moment(a.date).isAfter(moment()));
                  
                  // Get this week's assignments (Monday to Sunday)
                  const startOfWeek = moment().startOf('isoWeek'); // Monday
                  const endOfWeek = moment().endOf('isoWeek'); // Sunday
                  const weeklyAssignments = myAssignments.filter(a => {
                    const assignmentDate = moment(a.date);
                    return assignmentDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
                  });
                  
                  return (
                    <div className="space-y-4">
                      {/* Engineer Name Header */}
                      <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-indigo-700" />
                          </div>
                          <div>
                            <div className="font-semibold text-indigo-900">{currentEngineer.name}</div>
                            <div className="text-sm text-indigo-600">
                              {currentEngineer.team.name} • {currentEngineer.designation}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Today's Shift */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Today's Shift ({moment().format('MMM DD, dddd')})</h4>
                        {todayAssignment ? (
                          <div>
                            {(() => {
                              const shiftType = mockShiftTypes.find(s => s.id === todayAssignment.shiftTypeId);
                              return (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-blue-800 font-medium">{shiftType?.name}</span>
                                    <span className="text-blue-600 font-bold">{shiftType?.startTime} - {shiftType?.endTime}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-blue-600">Duration: {shiftType?.duration} hours</span>
                                    <span className="text-blue-600 capitalize">Status: {todayAssignment.status}</span>
                                  </div>
                                  <div className="text-sm text-blue-600">
                                    Location: {currentEngineer.location.name}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="text-blue-600">No shift scheduled for today</div>
                        )}
                      </div>
                      
                      {/* Weekly Schedule */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">This Week Schedule ({startOfWeek.format('MMM DD')} - {endOfWeek.format('MMM DD')})</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {weeklyAssignments.length > 0 ? (
                            weeklyAssignments.map((assignment) => {
                              const shiftType = mockShiftTypes.find(s => s.id === assignment.shiftTypeId);
                              const assignmentDate = moment(assignment.date);
                              const isToday = assignmentDate.isSame(moment(), 'day');
                              const isPast = assignmentDate.isBefore(moment(), 'day');
                              
                              return (
                                <div key={assignment.id} className={`flex items-center justify-between py-2 px-3 rounded ${
                                  isToday ? 'bg-blue-100 border border-blue-200' : 
                                  isPast ? 'bg-gray-50' : 'bg-green-50'
                                }`}>
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-3 ${
                                      isToday ? 'bg-blue-500' : 
                                      isPast ? 'bg-gray-400' : 'bg-green-500'
                                    }`}></div>
                                    <div>
                                      <div className="text-sm font-medium">{assignmentDate.format('ddd, MMM DD')}</div>
                                      <div className="text-xs text-gray-500">{shiftType?.name}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs font-medium">{shiftType?.startTime} - {shiftType?.endTime}</div>
                                    <div className="text-xs text-gray-500 capitalize">{assignment.status}</div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-gray-500 text-sm">No shifts scheduled for this week</div>
                          )}
                        </div>
                        
                        {/* Weekly Summary */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Total Shifts:</span>
                              <span className="ml-2 font-semibold text-gray-900">{weeklyAssignments.length}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Hours:</span>
                              <span className="ml-2 font-semibold text-gray-900">
                                {weeklyAssignments.reduce((total, assignment) => {
                                  const shiftType = mockShiftTypes.find(s => s.id === assignment.shiftTypeId);
                                  return total + (shiftType?.duration || 0);
                                }, 0)}h
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Teammate Shifts */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Team Today</h3>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                
                {(() => {
                  if (!user) return <div>Please log in to view team details</div>;
                  const currentEngineer = mockEngineers.find(e => e.name === user.name);
                  if (!currentEngineer) return <div>Engineer not found</div>;
                  
                  const teammates = mockEngineers.filter(e => 
                    e.team.id === currentEngineer.team.id && e.id !== currentEngineer.id
                  );
                  
                  const todayDate = moment().format('YYYY-MM-DD');
                  const teammateAssignments = assignments.filter(a => 
                    a.date === todayDate && teammates.some(t => t.id === a.engineerId)
                  );
                  
                  // Check if current engineer is working today
                  const currentEngineerWorking = assignments.some(a => 
                    a.date === todayDate && a.engineerId === currentEngineer.id
                  );
                  
                  const totalTeamMembers = teammates.length + 1; // Including current engineer
                  const presentCount = teammateAssignments.length + (currentEngineerWorking ? 1 : 0);
                  const absentCount = totalTeamMembers - presentCount;
                  const attendanceRate = Math.round((presentCount / totalTeamMembers) * 100);
                  
                  return (
                    <div className="space-y-4">
                      {/* Team Header */}
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-sm text-green-600 mb-2">
                          Team: <span className="font-semibold text-green-900">{currentEngineer.team.name}</span>
                          {currentEngineer.team.code === 'PD' && (
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                              Project Dedicated
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-green-600">
                          {currentEngineer.team.description}
                        </div>
                        {currentEngineer.team.code === 'PD' && (
                          <div className="text-xs text-green-700 mt-2 font-medium">
                            🎯 Dedicated to specific client projects with flexible shift timings
                          </div>
                        )}
                      </div>

                      {/* Team Attendance Summary */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-green-100 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-green-700">{presentCount}</div>
                          <div className="text-xs text-green-600">Present</div>
                        </div>
                        <div className="bg-red-100 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-red-700">{absentCount}</div>
                          <div className="text-xs text-red-600">Absent</div>
                        </div>
                        <div className="bg-blue-100 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-blue-700">{attendanceRate}%</div>
                          <div className="text-xs text-blue-600">Attendance</div>
                        </div>
                      </div>

                      {/* Current Engineer Status */}
                      <div className={`rounded-lg p-3 border ${
                        currentEngineerWorking 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            currentEngineerWorking ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm font-medium">
                            You are {currentEngineerWorking ? 'scheduled to work' : 'not scheduled'} today
                          </span>
                        </div>
                      </div>
                      
                      {/* Working Teammates List */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Working Today ({teammateAssignments.length} teammates)
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {teammateAssignments.length > 0 ? (
                            teammateAssignments.map((assignment) => {
                              const teammate = teammates.find(t => t.id === assignment.engineerId);
                              const shiftType = mockShiftTypes.find(s => s.id === assignment.shiftTypeId);
                              
                              return (
                                <div key={assignment.id} className="flex items-center justify-between py-3 px-3 bg-green-50 rounded-lg border border-green-200">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-3">
                                      <User className="w-4 h-4 text-green-700" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-green-900">{teammate?.name}</div>
                                      <div className="text-xs text-green-600">
                                        {shiftType?.name} • {teammate?.designation}
                                        {teammate?.team.code === 'PD' && (
                                          <span className="ml-2 px-1 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">PD</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-green-700 font-medium">{shiftType?.startTime} - {shiftType?.endTime}</div>
                                    <div className="text-xs text-green-600 capitalize">{assignment.status}</div>
                                    {teammate?.team.code === 'PD' && (
                                      <div className="text-xs text-purple-600 mt-1">Project Team</div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-gray-500 text-sm text-center py-4">
                              No teammates scheduled for today
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Absent Teammates */}
                      {absentCount > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Not Working Today ({absentCount} members)
                          </h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {teammates
                              .filter(teammate => !teammateAssignments.some(a => a.engineerId === teammate.id))
                              .slice(0, 5) // Show only first 5 absent members
                              .map((teammate) => (
                                <div key={teammate.id} className="flex items-center py-2 px-3 bg-red-50 rounded-lg border border-red-200">
                                  <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center mr-3">
                                    <User className="w-3 h-3 text-red-700" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-red-900">{teammate.name}</div>
                                    <div className="text-xs text-red-600">{teammate.designation}</div>
                                  </div>
                                </div>
                              ))}
                            {absentCount > 5 && (
                              <div className="text-xs text-gray-500 text-center py-2">
                                ... and {absentCount - 5} more absent
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Team Summary */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                          <div>
                            <span>Total Members:</span>
                            <span className="ml-1 font-semibold text-gray-900">{totalTeamMembers}</span>
                          </div>
                          <div>
                            <span>Team Lead:</span>
                            <span className="ml-1 font-semibold text-gray-900">
                              {teammates.find(t => t.isTeamLead)?.name || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Monthly Attendance Graph */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Attendance</h3>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                
                {(() => {
                  if (!user) return <div>Please log in to view attendance details</div>;
                  const currentEngineer = mockEngineers.find(e => e.name === user.name);
                  if (!currentEngineer) return <div>Engineer not found</div>;
                  
                  const currentMonth = moment();
                  const daysInMonth = currentMonth.daysInMonth();
                  const monthStart = currentMonth.startOf('month');
                  
                  // Generate attendance data for current month
                  const attendanceData = [];
                  let workedDays = 0;
                  let absentDays = 0;
                  
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = moment(monthStart).add(day - 1, 'days');
                    const dateStr = date.format('YYYY-MM-DD');
                    const hasAssignment = assignments.some(a => 
                      a.engineerId === currentEngineer.id && 
                      a.date === dateStr && 
                      a.status !== 'cancelled' && 
                      a.status !== 'no-show'
                    );
                    
                    const isWeekday = date.day() !== 0 && date.day() !== 6; // Not Sunday or Saturday
                    const isPast = date.isBefore(moment(), 'day');
                    
                    if (isPast && isWeekday) {
                      if (hasAssignment) {
                        workedDays++;
                      } else {
                        // Simulate realistic attendance (85% attendance rate)
                        if (Math.random() > 0.15) {
                          workedDays++;
                        } else {
                          absentDays++;
                        }
                      }
                    }
                    
                    attendanceData.push({
                      day,
                      date: dateStr,
                      worked: hasAssignment || (isPast && isWeekday && Math.random() > 0.15),
                      isWeekday,
                      isPast
                    });
                  }
                  
                  const totalWorkingDays = attendanceData.filter(d => d.isPast && d.isWeekday).length;
                  const attendanceRate = totalWorkingDays > 0 ? Math.round((workedDays / totalWorkingDays) * 100) : 0;
                  
                  return (
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-green-700">{workedDays}</div>
                          <div className="text-xs text-green-600">Days Worked This Month</div>
                          <div className="text-xs text-green-500 mt-1">
                            Out of {totalWorkingDays} working days
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-red-700">{absentDays}</div>
                          <div className="text-xs text-red-600">Days Absent</div>
                          <div className="text-xs text-red-500 mt-1">
                            {totalWorkingDays - workedDays} days remaining
                          </div>
                        </div>
                      </div>
                      
                      {/* Attendance Rate */}
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-purple-700">Attendance Rate</span>
                          <span className="text-lg font-bold text-purple-800">{attendanceRate}%</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-purple-600">
                          Monthly Target: {Math.ceil(totalWorkingDays * 0.9)} days ({Math.round((totalWorkingDays * 0.9 / totalWorkingDays) * 100)}% minimum)
                        </div>
                      </div>
                      
                      {/* Monthly Summary */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-blue-700 font-medium">Monthly Summary</span>
                          <span className="text-xs text-blue-600">{currentMonth.format('MMMM YYYY')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-blue-600">Working Days:</span>
                            <span className="text-blue-800 font-medium">{totalWorkingDays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Days Worked:</span>
                            <span className="text-blue-800 font-medium">{workedDays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Weekends:</span>
                            <span className="text-blue-800 font-medium">{attendanceData.filter(d => !d.isWeekday).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Efficiency:</span>
                            <span className={`font-medium ${attendanceRate >= 90 ? 'text-green-600' : attendanceRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {attendanceRate >= 90 ? 'Excellent' : attendanceRate >= 80 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mini Calendar View */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{currentMonth.format('MMMM YYYY')}</h4>
                        <div className="grid grid-cols-7 gap-1">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName, index) => (
                            <div key={index} className="text-xs text-gray-500 text-center py-1">{dayName}</div>
                          ))}
                          
                          {/* Empty cells for days before month start */}
                          {Array.from({ length: monthStart.day() }, (_, i) => (
                            <div key={`empty-${i}`} className="w-6 h-6"></div>
                          ))}
                          
                          {/* Calendar days */}
                          {attendanceData.map((dayData) => (
                            <div
                              key={dayData.day}
                              className={`w-6 h-6 text-xs flex items-center justify-center rounded ${
                                !dayData.isWeekday
                                  ? 'text-gray-400'
                                  : dayData.isPast
                                  ? dayData.worked
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                  : 'text-gray-600'
                              }`}
                            >
                              {dayData.day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Legend */}
                        <div className="flex items-center justify-center space-x-4 mt-3 text-xs">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                            <span className="text-gray-600">Worked</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                            <span className="text-gray-600">Absent</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>
                            <span className="text-gray-600">Weekend</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Personal Shift Dashboard - Available for all users */}
          {user && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* My Shift Details */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Shift Details</h3>
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                
                {(() => {
                  const currentEngineer = mockEngineers.find(e => e.name === user.name);
                  if (!currentEngineer) return <div className="text-gray-500">User profile not found</div>;
                  
                  const myAssignments = assignments.filter(a => a.engineerId === currentEngineer.id);
                  const todayAssignment = myAssignments.find(a => a.date === moment().format('YYYY-MM-DD'));
                  const upcomingAssignments = myAssignments.filter(a => moment(a.date).isAfter(moment())).slice(0, 3);
                  
                  return (
                    <div className="space-y-4">
                      {/* Current User Info */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-700" />
                          </div>
                          <div>
                            <div className="font-semibold text-blue-900">{currentEngineer.name}</div>
                            <div className="text-sm text-blue-600">
                              {currentEngineer.team.name} • {currentEngineer.designation}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Today's Shift */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Today ({moment().format('MMM DD, dddd')})</h4>
                        {todayAssignment ? (
                          (() => {
                            const shiftType = mockShiftTypes.find(s => s.id === todayAssignment.shiftTypeId);
                            return (
                              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-green-800 font-medium">{shiftType?.name}</span>
                                  <span className="text-green-600 font-bold">{shiftType?.startTime} - {shiftType?.endTime}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                  <span className="text-green-600">Duration: {shiftType?.duration}h</span>
                                  <span className="text-green-600 capitalize">{todayAssignment.status}</span>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-gray-500 text-sm bg-gray-50 rounded-lg p-3">No shift scheduled for today</div>
                        )}
                      </div>
                      
                      {/* Upcoming Shifts */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Upcoming Shifts</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {upcomingAssignments.length > 0 ? (
                            upcomingAssignments.map((assignment) => {
                              const shiftType = mockShiftTypes.find(s => s.id === assignment.shiftTypeId);
                              const assignmentDate = moment(assignment.date);
                              
                              return (
                                <div key={assignment.id} className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded border border-blue-200">
                                  <div>
                                    <div className="text-sm font-medium">{assignmentDate.format('ddd, MMM DD')}</div>
                                    <div className="text-xs text-gray-500">{shiftType?.name}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs font-medium">{shiftType?.startTime} - {shiftType?.endTime}</div>
                                    <div className="text-xs text-gray-500 capitalize">{assignment.status}</div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-gray-500 text-sm">No upcoming shifts scheduled</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* My Teammates Shift Details */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Teammates Today</h3>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                
                {(() => {
                  const currentEngineer = mockEngineers.find(e => e.name === user.name);
                  if (!currentEngineer) return <div className="text-gray-500">User profile not found</div>;
                  
                  const teammates = mockEngineers.filter(e => 
                    e.team.id === currentEngineer.team.id && e.id !== currentEngineer.id
                  );
                  
                  const todayDate = moment().format('YYYY-MM-DD');
                  const teammateAssignments = assignments.filter(a => 
                    a.date === todayDate && teammates.some(t => t.id === a.engineerId)
                  );
                  
                  return (
                    <div className="space-y-4">
                      {/* Team Info */}
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-sm text-green-600">
                          Team: <span className="font-semibold text-green-900">{currentEngineer.team.name}</span>
                          {currentEngineer.team.code === 'PD' && (
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              Project Dedicated
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-blue-700">{teammateAssignments.length}</div>
                          <div className="text-xs text-blue-600">Working Today</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-gray-700">{teammates.length - teammateAssignments.length}</div>
                          <div className="text-xs text-gray-600">Off Today</div>
                        </div>
                      </div>

                      {/* Working Teammates */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Working Now</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {teammateAssignments.length > 0 ? (
                            teammateAssignments.slice(0, 4).map((assignment) => {
                              const teammate = teammates.find(t => t.id === assignment.engineerId);
                              const shiftType = mockShiftTypes.find(s => s.id === assignment.shiftTypeId);
                              
                              return (
                                <div key={assignment.id} className="flex items-center justify-between py-2 px-3 bg-green-50 rounded border border-green-200">
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-2">
                                      <User className="w-3 h-3 text-green-700" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-green-900">{teammate?.name}</div>
                                      <div className="text-xs text-green-600">{shiftType?.name}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-green-700 font-medium">{shiftType?.startTime}-{shiftType?.endTime}</div>
                                    <div className="text-xs text-green-600 capitalize">{assignment.status}</div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-gray-500 text-sm text-center py-2">No teammates working today</div>
                          )}
                          {teammateAssignments.length > 4 && (
                            <div className="text-xs text-gray-500 text-center">
                              ... and {teammateAssignments.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* My Monthly Shift Attendance */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Attendance</h3>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                
                {(() => {
                  const currentEngineer = mockEngineers.find(e => e.name === user.name);
                  if (!currentEngineer) return <div className="text-gray-500">User profile not found</div>;
                  
                  const currentMonth = moment();
                  const daysInMonth = currentMonth.daysInMonth();
                  const monthStart = currentMonth.startOf('month');
                  
                  // Calculate attendance for current month
                  let workedDays = 0;
                  let totalShifts = 0;
                  
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = moment(monthStart).add(day - 1, 'days');
                    const dateStr = date.format('YYYY-MM-DD');
                    const hasAssignment = assignments.some(a => 
                      a.engineerId === currentEngineer.id && 
                      a.date === dateStr && 
                      a.status !== 'cancelled' && 
                      a.status !== 'no-show'
                    );
                    
                    const isWeekday = date.day() !== 0 && date.day() !== 6;
                    const isPast = date.isBefore(moment(), 'day') || date.isSame(moment(), 'day');
                    
                    if (isPast && isWeekday) {
                      totalShifts++;
                      if (hasAssignment || Math.random() > 0.15) { // Simulate 85% attendance
                        workedDays++;
                      }
                    }
                  }
                  
                  const attendanceRate = totalShifts > 0 ? Math.round((workedDays / totalShifts) * 100) : 0;
                  const totalHours = workedDays * 10; // Assuming 10-hour shifts
                  
                  return (
                    <div className="space-y-4">
                      {/* Month Header */}
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <div className="text-sm text-purple-600 font-medium">
                          {currentMonth.format('MMMM YYYY')} Summary
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-xl font-bold text-green-700">{workedDays}</div>
                          <div className="text-xs text-green-600">Shifts Worked</div>
                          <div className="text-xs text-green-500">Out of {totalShifts} days</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-xl font-bold text-blue-700">{totalHours}h</div>
                          <div className="text-xs text-blue-600">Total Hours</div>
                          <div className="text-xs text-blue-500">This month</div>
                        </div>
                      </div>

                      {/* Attendance Rate */}
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-purple-700">Attendance Rate</span>
                          <span className="text-lg font-bold text-purple-800">{attendanceRate}%</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-purple-600">
                          Target: {Math.ceil(totalShifts * 0.9)} shifts (90% minimum)
                        </div>
                      </div>

                      {/* Performance Indicator */}
                      <div className={`rounded-lg p-2 text-center ${
                        attendanceRate >= 90 ? 'bg-green-100 text-green-800' :
                        attendanceRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <div className="text-sm font-medium">
                          {attendanceRate >= 90 ? '🌟 Excellent' :
                           attendanceRate >= 80 ? '👍 Good' :
                           '📈 Needs Improvement'}
                        </div>
                        <div className="text-xs mt-1">
                          {attendanceRate >= 90 ? 'Outstanding attendance record!' :
                           attendanceRate >= 80 ? 'Keep up the good work!' :
                           'Focus on improving attendance'}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Schedule Type</label>
                  <select 
                    value={scheduleTypeFilter} 
                    onChange={(e) => setScheduleTypeFilter(e.target.value as any)}
                    className="input w-full"
                  >
                    <option value="all">All Schedules</option>
                    <option value="standard">Weekend Off</option>
                    <option value="rotation">Rotation Schedule</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Team</label>
                  <select 
                    value={filters.teams.length === 0 ? '' : filters.teams[0]} 
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      teams: e.target.value === '' ? [] : [e.target.value] 
                    }))}
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
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      locations: e.target.value === '' ? [] : [e.target.value] 
                    }))}
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
                {isManager ? (
                  <button 
                    onClick={handleCreateShift}
                    className="btn btn-primary w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Shift
                  </button>
                ) : (
                  <div className="w-full p-3 bg-gray-100 rounded-lg text-center text-gray-500 text-sm">
                    <span className="flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2" />
                      View Only Access - Engineers
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Policy Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Schedule Policies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                    Standard Schedule
                  </span>
                  <span className="text-blue-900 font-medium">Weekend Off Policy</span>
                </div>
                <p className="text-blue-800">
                  Engineers work Monday to Friday with Saturday and Sunday off. This is the default schedule for most team members.
                </p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                    Rotation Schedule
                  </span>
                  <span className="text-blue-900 font-medium">Flexible Off Days</span>
                </div>
                <p className="text-blue-800">
                  Engineers get 2 days off per week on a rotation basis. Some may work weekends but get weekdays off instead.
                </p>
              </div>
            </div>
          </div>

          {/* Engineers Grid/List */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Engineers Schedule</h2>
              <div className="flex items-center space-x-2">
                {isManager && (
                  <button
                    onClick={() => setShowAssignModal(true)}
                    disabled={selectedEngineers.length === 0}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bulk Assign
                  </button>
                )}
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
                            {filteredEngineers.map(engineer => (
                  <div key={engineer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {isManager && (
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
                        )}
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
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        engineer.isRotationSchedule 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {engineer.isRotationSchedule ? 'Rotation' : 'Weekend Off'}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">{engineer.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{engineer.team.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{engineer.location.name}</p>
                    
                    <div className="flex items-center mb-3 text-xs text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {engineer.preferredShift === 'shift-a' ? 'Shift A (Day)' :
                         engineer.preferredShift === 'shift-b' ? 'Shift B (Evening)' :
                         engineer.preferredShift === 'shift-c' ? 'Shift C (Night)' :
                         engineer.preferredShift === 'custom' ? `Custom (${engineer.customShiftStart || '06:00'}-${engineer.customShiftEnd || '16:00'})` :
                         'Shift A (Day)' // Default
                        }
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {engineer.skills.length} skills
                      </span>
                      <button 
                        onClick={() => handleViewSchedule(engineer)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
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
                        {isManager && (
                          <input
                            type="checkbox"
                            onChange={(e) => {
                                                      if (e.target.checked) {
                          setSelectedEngineers(filteredEngineers.map(e => e.id));
                        } else {
                          setSelectedEngineers([]);
                        }
                            }}
                          />
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Shift</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                {filteredEngineers.map(engineer => (
                      <tr key={engineer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isManager && (
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
                          )}
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
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {engineer.preferredShift === 'shift-a' ? 'Shift A (Day)' :
                               engineer.preferredShift === 'shift-b' ? 'Shift B (Evening)' :
                               engineer.preferredShift === 'shift-c' ? 'Shift C (Night)' :
                               engineer.preferredShift === 'custom' ? `Custom (${engineer.customShiftStart || '06:00'}-${engineer.customShiftEnd || '16:00'})` :
                               'Shift A (Day)' // Default
                              }
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            engineer.isOnCall 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {engineer.isOnCall ? 'On Call' : 'Available'}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            engineer.isRotationSchedule 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {engineer.isRotationSchedule ? 'Rotation' : 'Weekend Off'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleViewSchedule(engineer)}
                            className="text-blue-600 hover:text-blue-700 mr-3"
                          >
                            View
                          </button>
                          {isManager && (
                            <button 
                              onClick={() => handleIndividualAssign(engineer)}
                              className="text-indigo-600 hover:text-indigo-700"
                            >
                              Assign
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredEngineers.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Engineers Found</h3>
              <p className="text-gray-600 mb-4">
                {!isManager 
                  ? "You have view access to all engineer schedules. Try adjusting the filters above."
                  : "No engineers match your current filter criteria. Try adjusting the filters above."
                }
              </p>
              <p className="text-sm text-gray-500">
                Total engineers in system: {mockEngineers.length}
              </p>
            </div>
          )}

          {/* Bulk Assignment Modal */}
          {isManager && showAssignModal && (
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

          {/* Create Shift Modal */}
          {isManager && showCreateShiftModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Create New Shift</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Title</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      value={newShiftForm.title}
                      onChange={(e) => setNewShiftForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter shift title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg p-2" 
                        value={newShiftForm.startDate}
                        onChange={(e) => setNewShiftForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg p-2" 
                        value={newShiftForm.endDate}
                        onChange={(e) => setNewShiftForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={newShiftForm.shiftType}
                      onChange={(e) => setNewShiftForm(prev => ({ ...prev, shiftType: e.target.value }))}
                    >
                      <option value="">Select shift type</option>
                      {mockShiftTypes.map(shift => (
                        <option key={shift.id} value={shift.id}>{shift.name} ({shift.startTime} - {shift.endTime})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={newShiftForm.location}
                      onChange={(e) => setNewShiftForm(prev => ({ ...prev, location: e.target.value }))}
                    >
                      <option value="">Select location</option>
                      {mockLocations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Engineer</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={newShiftForm.assignee}
                      onChange={(e) => setNewShiftForm(prev => ({ ...prev, assignee: e.target.value }))}
                    >
                      <option value="">Select engineer</option>
                      {getAccessibleEngineers().map(engineer => (
                        <option key={engineer.id} value={engineer.id}>{engineer.name} - {engineer.designation}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      rows={3}
                      value={newShiftForm.description}
                      onChange={(e) => setNewShiftForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter shift description"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateShiftModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewShift}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Shift
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Schedule Modal */}
          {showViewScheduleModal && selectedEngineerForView && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Schedule for {selectedEngineerForView.name}</h2>
                  <button
                    onClick={() => setShowViewScheduleModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Engineer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                                              <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <p className="text-sm font-medium text-indigo-600">{selectedEngineerForView.designation}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Team</label>
                      <p className="text-sm text-gray-900">{selectedEngineerForView.team.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">{selectedEngineerForView.location.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferred Shift</label>
                      <p className="text-sm text-gray-900">
                        {selectedEngineerForView.preferredShift === 'shift-a' ? 'Shift A (06:00-16:00)' :
                         selectedEngineerForView.preferredShift === 'shift-b' ? 'Shift B (14:00-00:00)' :
                         selectedEngineerForView.preferredShift === 'shift-c' ? 'Shift C (22:00-08:00)' :
                         'Custom Shift'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEngineerForView.isOnCall 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedEngineerForView.isOnCall ? 'On Call' : 'Available'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <p className="text-sm text-gray-900">{selectedEngineerForView.experience} years</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedEngineerForView.isRotationSchedule 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedEngineerForView.isRotationSchedule ? 'Rotation Schedule' : 'Standard Schedule'}
                        </span>
                        {selectedEngineerForView.worksWeekends && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Works Weekends
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Off Days</label>
                      <p className="text-sm text-gray-900">
                        {selectedEngineerForView.rotationOffDays?.map(day => 
                          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
                        ).join(', ') || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Weekly Schedule */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">This Week's Schedule</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                      const isOffDay = selectedEngineerForView.rotationOffDays?.includes(index) || 
                                       (!selectedEngineerForView.isRotationSchedule && (index === 0 || index === 6));
                      
                      return (
                        <div key={day} className="text-center">
                          <div className="text-sm font-medium text-gray-700 mb-2">{day}</div>
                          <div className={`border rounded-lg p-2 min-h-[80px] ${
                            isOffDay 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-blue-50 border-blue-200'
                          }`}>
                            {isOffDay ? (
                              <div className="text-xs text-red-800 font-medium">OFF DAY</div>
                            ) : (
                              <>
                                <div className="text-xs text-blue-800 font-medium">
                                  {selectedEngineerForView.preferredShift === 'shift-a' ? '06:00-16:00' :
                                   selectedEngineerForView.preferredShift === 'shift-b' ? '14:00-00:00' :
                                   selectedEngineerForView.preferredShift === 'shift-c' ? '22:00-08:00' :
                                   '06:00-16:00'}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {selectedEngineerForView.team.name}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Schedule Policy Info */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule Policy</h4>
                    <div className="text-xs text-gray-600">
                      {selectedEngineerForView.isRotationSchedule ? (
                        <div>
                          <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full mr-2">
                            Rotation Schedule
                          </span>
                          <span>2 days off per week (rotational)</span>
                          {selectedEngineerForView.worksWeekends && (
                            <span className="ml-2 text-orange-600">(Works weekends)</span>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                            Standard Schedule
                          </span>
                          <span>Weekends off (Saturday & Sunday)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEngineerForView.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowViewScheduleModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Individual Assignment Modal */}
          {isManager && showIndividualAssignModal && selectedEngineerForAssign && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Assign Shift to {selectedEngineerForAssign.name}</h2>
                
                {/* Engineer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                                              <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <p className="text-sm font-medium text-indigo-600">{selectedEngineerForAssign.designation}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Team</label>
                      <p className="text-sm text-gray-900">{selectedEngineerForAssign.team.name}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule & Off Days</label>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedEngineerForAssign.isRotationSchedule 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedEngineerForAssign.isRotationSchedule ? 'Rotation Schedule' : 'Standard Schedule'}
                        </span>
                        <div className="text-sm text-gray-600">
                          <strong>Off Days:</strong> {selectedEngineerForAssign.rotationOffDays?.map(day => 
                            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                          ).join(', ') || 'Not set'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Assignment Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg p-2" 
                        value={newShiftForm.startDate}
                        onChange={(e) => setNewShiftForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg p-2" 
                        value={newShiftForm.endDate}
                        onChange={(e) => setNewShiftForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={newShiftForm.shiftType}
                      onChange={(e) => setNewShiftForm(prev => ({ ...prev, shiftType: e.target.value }))}
                    >
                      <option value="">Select shift type</option>
                      {mockShiftTypes.map(shift => (
                        <option key={shift.id} value={shift.id}>{shift.name} ({shift.startTime} - {shift.endTime})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={newShiftForm.location}
                      onChange={(e) => setNewShiftForm(prev => ({ ...prev, location: e.target.value }))}
                    >
                      <option value="">Select location</option>
                      {mockLocations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      rows={3}
                      value={newShiftForm.description}
                      onChange={(e) => setNewShiftForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add any notes for this assignment"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowIndividualAssignModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveIndividualAssignment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Assign Shift
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Engineer Directory View */}
          {/* Header and Stats Section with Background */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Engineer Directory</h1>
                <p className="text-gray-600">View and manage CIS engineers</p>
              </div>
              
              {/* My Shift Display */}
              {user?.engineerId && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-w-[220px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">My Shift:</span>
                    <span className="font-medium text-indigo-600">
                      {(() => {
                        const storedPrefs = localStorage.getItem(`shift_prefs_${user.engineerId}`);
                        if (storedPrefs) {
                          try {
                            const prefs = JSON.parse(storedPrefs);
                            if (prefs.preferredShift === 'shift-a') return '06:00 - 16:00';
                            if (prefs.preferredShift === 'shift-b') return '14:00 - 00:00';
                            if (prefs.preferredShift === 'shift-c') return '22:00 - 08:00';
                            if (prefs.preferredShift === 'custom') return `${prefs.shiftStartTime || '06:00'} - ${prefs.shiftEndTime || '16:00'}`;
                          } catch (e) {
                            // ignore error
                          }
                        }
                        return '06:00 - 16:00';
                      })()}
                    </span>
                  </div>
                </div>
              )}
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
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Currently On Shift</h3>
                    <p className="text-2xl font-semibold text-gray-900">{getCurrentlyWorkingEngineers()}</p>
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
                    <Briefcase className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Teams</h3>
                    <p className="text-2xl font-semibold text-gray-900">{mockTeams.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Filter Engineers</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Search</label>
                  <input 
                    type="text" 
                    placeholder="Search engineers by name, ID, or email" 
                    className="input w-full" 
                    value={directorySearchTerm}
                    onChange={(e) => setDirectorySearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Team</label>
                  <select 
                    value={directoryFilters.team} 
                    onChange={(e) => setDirectoryFilters(prev => ({ ...prev, team: e.target.value }))}
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
                    value={directoryFilters.location} 
                    onChange={(e) => setDirectoryFilters(prev => ({ ...prev, location: e.target.value }))}
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
                <button
                  onClick={() => setShowDirectoryFilters(!showDirectoryFilters)}
                  className="btn btn-secondary w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showDirectoryFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            </div>
          </div>

          {/* Directory Grid/List */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Engineers List</h2>
              <div className="flex items-center space-x-2">
                <div className="flex rounded-lg border border-gray-300 p-1">
                  <button
                    onClick={() => setDirectoryView('grid')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      directoryView === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setDirectoryView('list')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      directoryView === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {showDirectoryFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
                  <select 
                    value={directoryFilters.status} 
                    onChange={(e) => setDirectoryFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Currently On Shift</option>
                    <option value="inactive">Currently Off Shift</option>
                    <option value="on_call">On Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Sort By</label>
                  <select 
                    value={directorySortBy} 
                    onChange={(e) => setDirectorySortBy(e.target.value as any)}
                    className="input w-full"
                  >
                    <option value="name">Name</option>
                    <option value="experience">Experience</option>
                    <option value="joinDate">Join Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Sort Order</label>
                  <select 
                    value={directorySortOrder} 
                    onChange={(e) => setDirectorySortOrder(e.target.value as any)}
                    className="input w-full"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            )}

            {directoryView === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getDirectoryFilteredEngineers().map(engineer => (
                  <div key={engineer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{engineer.name}</h3>
                          <p className="text-sm font-medium text-indigo-600">{engineer.designation}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isEngineerOnShift(engineer) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isEngineerOnShift(engineer) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Team:</span> {engineer.team.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {engineer.location.name}
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="flex space-x-2">
                         <button 
                           onClick={() => handleViewProfile(engineer)}
                           className="text-indigo-600 hover:text-indigo-700 text-sm"
                         >
                           View Profile
                         </button>
                         {isManager && (
                           <button 
                             onClick={() => handleUpdateProduction(engineer)}
                             className="text-blue-600 hover:text-blue-700 text-sm"
                           >
                             Update Production
                           </button>
                         )}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getDirectoryFilteredEngineers().map(engineer => (
                      <tr key={engineer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{engineer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{engineer.designation}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{engineer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{engineer.team.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{engineer.location.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              engineer.isOnCall 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {engineer.isOnCall ? 'On Call' : 'Available'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              engineer.isRotationSchedule 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {engineer.isRotationSchedule ? 'Rotation' : 'Weekend Off'}
                            </span>
                          </div>
                        </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <button 
                             onClick={() => handleViewProfile(engineer)}
                             className="text-indigo-600 hover:text-indigo-700 mr-3"
                           >
                             View Profile
                           </button>
                           {isManager && (
                             <button 
                               onClick={() => handleUpdateProduction(engineer)}
                               className="text-blue-600 hover:text-blue-700 mr-3"
                             >
                               Update Production
                             </button>
                           )}
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State for Directory */}
            {getDirectoryFilteredEngineers().length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Engineers Found</h3>
                <p className="text-gray-600 mb-4">
                  No engineers match your current filter criteria. Try adjusting the filters above.
                </p>
                <p className="text-sm text-gray-500">
                  Total engineers in system: {mockEngineers.length}
                </p>
              </div>
            )}
          </div>

          {/* Engineer Profile Modal */}
          {showEngineerProfileModal && selectedEngineerForProfile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Engineer Profile</h2>
                  <button
                    onClick={() => setShowEngineerProfileModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{selectedEngineerForProfile.name}</h3>
                      <p className="text-lg font-medium text-indigo-600">{selectedEngineerForProfile.designation}</p>
                      <div className="flex space-x-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedEngineerForProfile.isOnCall 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedEngineerForProfile.isOnCall ? 'On Call' : 'Available'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedEngineerForProfile.isRotationSchedule 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedEngineerForProfile.isRotationSchedule ? 'Rotation Schedule' : 'Weekend Off'}
                        </span>
                        {selectedEngineerForProfile.isTeamLead && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            Team Lead
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Basic Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-sm text-gray-900">{selectedEngineerForProfile.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <p className="text-sm font-medium text-indigo-600">{selectedEngineerForProfile.designation}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedEngineerForProfile.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedEngineerForProfile.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Join Date</label>
                        <p className="text-sm text-gray-900">{new Date(selectedEngineerForProfile.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Experience</label>
                        <p className="text-sm text-gray-900">{selectedEngineerForProfile.experience} years</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned Project</label>
                        <p className="text-sm font-semibold text-indigo-600">
                          {(() => {
                            // Find project assignment based on engineer name or employeeId
                            const projectDedicatedTeam = [
                              { empId: '162296', name: 'Satya Sharma', project: 'PAPA' },
                              { empId: '162420', name: 'Madhan Raj Selvaraj', project: 'Metlife' },
                              { empId: '162421', name: 'Kameswaran Murugesan', project: 'Pearson' },
                              { empId: '187784', name: 'Ashish Avinash Patil', project: 'Trafigura & Takeda' },
                              { empId: '239990', name: 'Eswar Pavan Kumar Kundeti', project: 'Philips VA Remediation' },
                              { empId: '252220', name: 'Singaravel P', project: 'Netcentric' },
                              { empId: '265754', name: 'Saikrishna Maddi', project: 'UBS' },
                              { empId: '282670', name: 'Denzil F', project: 'BNYM' },
                              { empId: '283488', name: 'Suresh Kumar Rampelly', project: 'TRV Chn' },
                              { empId: '287610', name: 'Abhishek Reddy Thandra', project: 'Credit Suisse' },
                              { empId: '289148', name: 'Harvin A', project: 'Mirabeau' },
                              { empId: '290008', name: 'Ravi Chandra Sekhar Para', project: 'Credit Suisse' },
                              { empId: '293101', name: 'Pradip Barade', project: 'Telstra Bangalore' },
                              { empId: '293128', name: 'Shivkumar Vishwakarma', project: 'SFDC' },
                              { empId: '305584', name: 'Vishweshwar Chakali', project: 'UBS' },
                              { empId: '306436', name: 'Snehanjan Chatterjee', project: 'Papa Call' },
                              { empId: '315452', name: 'Sagar Sadashiv Janwade', project: 'Google (Asset)' },
                              { empId: '318419', name: 'E Vijaya Simha Reddy', project: 'UBS' },
                              { empId: '321542', name: 'Shiva Kumar Davu', project: 'Centene' },
                              { empId: '337302', name: 'Rajeev Ramakrishnan', project: 'World Bank' },
                              { empId: '340339', name: 'Swapnil Dattatray Kalbhor', project: 'Credit Suisse' },
                              { empId: '346107', name: 'Karthick Kuppusamy', project: 'Kaiser' },
                              { empId: '355670', name: 'Anand VaraPrasad Raju Chekuri', project: 'UBS' },
                              { empId: '360179', name: 'Ganesh Jaiprakash Mahale', project: 'Google (Asset)' },
                              { empId: '367323', name: 'Ramdas Shivdas Gawande', project: 'SFDC' },
                              { empId: '370762', name: 'Surender E', project: 'First Data' },
                              { empId: '371746', name: 'Harshal Ramesh Kulkarni', project: 'World Bank' },
                              { empId: '392173', name: 'Tanmoy Chowdhury', project: 'Google (Asset)' },
                              { empId: '394853', name: 'Deepen Prabhudas Parekh', project: 'E&Y' },
                              { empId: '408515', name: 'Somnath Ghosh', project: 'JPMC' },
                              { empId: '412528', name: 'Mohan Babu S', project: 'Lumeris' },
                              { empId: '437292', name: 'Praveen Devaraj Manoranjitham', project: 'Unbilled' },
                              { empId: '442574', name: 'Prasanna R', project: 'World Bank' },
                              { empId: '444384', name: 'Pralaydeb Bandyopadhyay', project: 'Unbilled' },
                              { empId: '447702', name: 'Plabon Das', project: 'Emblem' },
                              { empId: '451217', name: 'Anil Kumar Basagond Biradar', project: 'Google Network' },
                              { empId: '453106', name: 'Mohan Prabu M', project: 'World Bank' },
                              { empId: '459873', name: 'Manash Ranjan Nayak', project: 'Microsoft (HYD)' },
                              { empId: '467793', name: 'Praveen J', project: 'Cigna' },
                              { empId: '476225', name: 'Vijay Kumar Sama', project: 'TJX Hyderabad' },
                              { empId: '482715', name: 'Koushik Bhattacharya', project: 'First Data' },
                              { empId: '482720', name: 'Hamsanada S', project: 'Apple' },
                              { empId: '486852', name: 'Arun Dey', project: 'CoreLogic' },
                              { empId: '487162', name: 'Rajeev Jaiswal', project: 'Google (Asset)' },
                              { empId: '500033', name: 'Bhaskar Singh Jamwal', project: 'Credit Suisse (50%) & UBS (50%)' },
                              { empId: '528935', name: 'Kathavarayan M', project: 'CIGNA-BPS' },
                              { empId: '539014', name: 'Aldo Samuel Dhason A', project: 'Thomson Reuters' },
                              { empId: '539018', name: 'Dillibabu T', project: 'HS Labs' },
                              { empId: '541618', name: 'Rangesh S K', project: 'Astra Zeneca' },
                              { empId: '544179', name: 'Thamizhazhagan Ramalingam', project: 'Apple' },
                              { empId: '545740', name: 'Mohammed Hafeez', project: 'UBS' },
                              { empId: '550895', name: 'Naresh N', project: 'Telstra Bangalore' },
                              { empId: '554420', name: 'Sathish Gattu', project: 'Apple Warehouse (50%)' },
                              { empId: '557489', name: 'Rajesh A K', project: 'Merck VA Remediation' },
                              { empId: '567506', name: 'Nasar Hussain Sardar Hussain', project: 'World Bank' },
                              { empId: '574427', name: 'M Lakshmi Reddy', project: 'Kaiser' },
                              { empId: '584154', name: 'Jaikumar V', project: 'Google (Asset)' },
                              { empId: '586952', name: 'Jose Carlos Bazan-Aguilar', project: 'Apple (USA)' },
                              { empId: '592367', name: 'Clancy Xinan Chen', project: 'Merck VA Remediation' },
                              { empId: '599860', name: 'Vamsi Krishna Vrns Pammy', project: 'LinkedIn' },
                              { empId: '599864', name: 'Shivgond Metre', project: 'Xylem' },
                              { empId: '599886', name: 'Atul Landge', project: 'JPMC' },
                              { empId: '599895', name: 'Balaji P K', project: 'UHG' },
                              { empId: '600327', name: 'MD Asif Iqbal', project: 'CoreLogic' },
                              { empId: '604287', name: 'Pranay Tambekar', project: 'US Bank' },
                              { empId: '2171825', name: 'Mohan Kumar V', project: 'Takeda' },
                              { empId: '2171826', name: 'Shashankagowda S', project: 'NYL' },
                              { empId: '2175815', name: 'Arunsankar V', project: 'HCSC' },
                              { empId: '2176358', name: 'Charansai Patnam', project: 'IDCS Application' },
                              { empId: '2181455', name: 'Dineshkumar T', project: 'US Bank' },
                              { empId: '2438360', name: 'Dinanath Vijay Patil', project: 'Compliance' }
                            ];

                            const assignment = projectDedicatedTeam.find(p => 
                              p.empId === selectedEngineerForProfile.employeeId || 
                              p.name.toLowerCase().includes(selectedEngineerForProfile.name.toLowerCase()) ||
                              selectedEngineerForProfile.name.toLowerCase().includes(p.name.toLowerCase())
                            );
                            return assignment ? assignment.project : 'Standard Operations';
                          })()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Shift Status</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isEngineerOnShift(selectedEngineerForProfile) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isEngineerOnShift(selectedEngineerForProfile) ? 'ON SHIFT' : 'OFF SHIFT'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Organization Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Organization
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Team</label>
                        <p className="text-sm text-gray-900">{selectedEngineerForProfile.team.name}</p>
                        <p className="text-xs text-gray-500">{selectedEngineerForProfile.team.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="text-sm text-gray-900">{selectedEngineerForProfile.department.name}</p>
                        <p className="text-xs text-gray-500">{selectedEngineerForProfile.department.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="text-sm text-gray-900">{selectedEngineerForProfile.location.name}</p>
                        <p className="text-xs text-gray-500">{selectedEngineerForProfile.location.city}, {selectedEngineerForProfile.location.state}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-indigo-600">{selectedEngineerForProfile.designation}</span>
                          {selectedEngineerForProfile.isTeamLead && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              Team Lead
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Certifications */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Skills & Certifications
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedEngineerForProfile.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedEngineerForProfile.certifications.map((cert, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Schedule Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Shift</label>
                        <p className="text-sm text-gray-900">
                          {selectedEngineerForProfile.preferredShift === 'shift-a' ? 'Shift A (06:00-16:00)' :
                           selectedEngineerForProfile.preferredShift === 'shift-b' ? 'Shift B (14:00-00:00)' :
                           selectedEngineerForProfile.preferredShift === 'shift-c' ? 'Shift C (22:00-08:00)' :
                           selectedEngineerForProfile.preferredShift === 'custom' ? 
                           `Custom (${selectedEngineerForProfile.customShiftStart || '06:00'}-${selectedEngineerForProfile.customShiftEnd || '16:00'})` :
                           'Shift A (06:00-16:00)'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedEngineerForProfile.isRotationSchedule 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedEngineerForProfile.isRotationSchedule ? 'Rotation Schedule' : 'Standard Schedule'}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Off Days</label>
                        <p className="text-sm text-gray-900">
                          {selectedEngineerForProfile.rotationOffDays?.map(day => 
                            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
                          ).join(', ') || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Weekly Hours</label>
                        <p className="text-sm text-gray-900">{selectedEngineerForProfile.weeklyHours || 40} hours</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Flexible Timing</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedEngineerForProfile.isFlexibleTiming 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedEngineerForProfile.isFlexibleTiming ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Overtime Preference</label>
                        <p className="text-sm text-gray-900 capitalize">{selectedEngineerForProfile.overtimePreference || 'None'}</p>
                      </div>
                    </div>
                  </div>

                                     {/* Current Shift Details - Manager Only */}
                   {isManager && (
                     <div className="bg-gray-50 rounded-lg p-6 lg:col-span-2">
                       <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                         <Calendar className="w-5 h-5 mr-2" />
                         Current Week Schedule
                       </h4>
                     <div className="grid grid-cols-7 gap-2 mb-4">
                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                         const isOffDay = selectedEngineerForProfile.rotationOffDays?.includes(index);
                         const currentShift = (() => {
                           if (selectedEngineerForProfile.preferredShift === 'shift-a') return '06:00-16:00';
                           if (selectedEngineerForProfile.preferredShift === 'shift-b') return '14:00-00:00';
                           if (selectedEngineerForProfile.preferredShift === 'shift-c') return '22:00-08:00';
                           if (selectedEngineerForProfile.preferredShift === 'custom') {
                             return `${selectedEngineerForProfile.customShiftStart || '06:00'}-${selectedEngineerForProfile.customShiftEnd || '16:00'}`;
                           }
                           return '06:00-16:00';
                         })();
                         
                         return (
                           <div key={day} className={`text-center p-3 rounded-lg border ${
                             isOffDay 
                               ? 'bg-red-50 border-red-200 text-red-800' 
                               : 'bg-green-50 border-green-200 text-green-800'
                           }`}>
                             <div className="font-semibold text-sm">{day}</div>
                             <div className="text-xs mt-1">
                               {isOffDay ? 'OFF' : currentShift}
                             </div>
                           </div>
                         );
                       })}
                     </div>
                     
                     {/* Shift Assignment Details */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                       <div className="bg-white rounded-lg p-4 border">
                         <h5 className="font-semibold text-gray-900 mb-2">Current Assignment</h5>
                         <p className="text-sm text-gray-600">
                           {(() => {
                             if (selectedEngineerForProfile.preferredShift === 'shift-a') return 'Morning Shift (06:00-16:00)';
                             if (selectedEngineerForProfile.preferredShift === 'shift-b') return 'Evening Shift (14:00-00:00)';
                             if (selectedEngineerForProfile.preferredShift === 'shift-c') return 'Night Shift (22:00-08:00)';
                             if (selectedEngineerForProfile.preferredShift === 'custom') {
                               return `Custom Shift (${selectedEngineerForProfile.customShiftStart || '06:00'}-${selectedEngineerForProfile.customShiftEnd || '16:00'})`;
                             }
                             return 'Morning Shift (06:00-16:00)';
                           })()}
                         </p>
                         <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                           selectedEngineerForProfile.isOnCall 
                             ? 'bg-orange-100 text-orange-800' 
                             : 'bg-blue-100 text-blue-800'
                         }`}>
                           {selectedEngineerForProfile.isOnCall ? 'On Call' : 'Regular Duty'}
                         </span>
                       </div>
                       
                       <div className="bg-white rounded-lg p-4 border">
                         <h5 className="font-semibold text-gray-900 mb-2">Schedule Pattern</h5>
                         <p className="text-sm text-gray-600">
                           {selectedEngineerForProfile.isRotationSchedule 
                             ? 'Rotation Schedule - 2 Days Off Per Week' 
                             : 'Standard Schedule - Weekends Off'}
                         </p>
                         <p className="text-xs text-gray-500 mt-2">
                           Off Days: {selectedEngineerForProfile.rotationOffDays?.map(day => 
                             ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                           ).join(', ') || 'Sat, Sun'}
                         </p>
                       </div>
                       
                       <div className="bg-white rounded-lg p-4 border">
                         <h5 className="font-semibold text-gray-900 mb-2">Weekly Summary</h5>
                         <p className="text-sm text-gray-600">
                           {selectedEngineerForProfile.weeklyHours || 40} hours/week
                         </p>
                         <p className="text-xs text-gray-500 mt-1">
                           Working Days: {7 - (selectedEngineerForProfile.rotationOffDays?.length || 2)} days
                         </p>
                         <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                           selectedEngineerForProfile.isFlexibleTiming 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-gray-100 text-gray-800'
                         }`}>
                           {selectedEngineerForProfile.isFlexibleTiming ? 'Flexible' : 'Fixed'}
                         </span>
                       </div>
                     </div>

                     {/* Recent Shift History */}
                     <div className="bg-white rounded-lg p-4 border">
                       <h5 className="font-semibold text-gray-900 mb-3">Recent Shift History</h5>
                       <div className="space-y-2">
                         {[...Array(5)].map((_, index) => {
                           const date = moment().subtract(index, 'days');
                           const isWeekend = date.day() === 0 || date.day() === 6;
                           const isOffDay = selectedEngineerForProfile.rotationOffDays?.includes(date.day());
                           const worked = !isOffDay && !(isWeekend && !selectedEngineerForProfile.worksWeekends);
                           
                           return (
                             <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                               <div>
                                 <span className="text-sm font-medium">{date.format('ddd, MMM DD')}</span>
                                 <span className="text-xs text-gray-500 ml-2">
                                   {worked ? (
                                     selectedEngineerForProfile.preferredShift === 'shift-a' ? '06:00-16:00' :
                                     selectedEngineerForProfile.preferredShift === 'shift-b' ? '14:00-00:00' :
                                     selectedEngineerForProfile.preferredShift === 'shift-c' ? '22:00-08:00' :
                                     '06:00-16:00'
                                   ) : 'OFF'}
                                 </span>
                               </div>
                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 worked 
                                   ? 'bg-green-100 text-green-800' 
                                   : 'bg-red-100 text-red-800'
                               }`}>
                                 {worked ? 'Worked' : 'Off'}
                               </span>
                             </div>
                           );
                         })}
                       </div>
                                            </div>
                     </div>
                   )}

                   {/* Production Metrics - Manager Only */}
                   {isManager && (
                     <div className="bg-gray-50 rounded-lg p-6 lg:col-span-2">
                     <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                       <TrendingUp className="w-5 h-5 mr-2" />
                       Production Metrics
                     </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedEngineerForProfile.productionMetrics.ticketsResolved}</div>
                        <div className="text-sm text-gray-600">Tickets Resolved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedEngineerForProfile.productionMetrics.incidentsHandled}</div>
                        <div className="text-sm text-gray-600">Incidents Handled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedEngineerForProfile.productionMetrics.tasksCompleted}</div>
                        <div className="text-sm text-gray-600">Tasks Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedEngineerForProfile.productionMetrics.systemUptimeHours}</div>
                        <div className="text-sm text-gray-600">System Uptime (hrs)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{selectedEngineerForProfile.productionMetrics.projectsDelivered}</div>
                        <div className="text-sm text-gray-600">Projects Delivered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{selectedEngineerForProfile.productionMetrics.monthlyTarget}</div>
                        <div className="text-sm text-gray-600">Monthly Target</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{selectedEngineerForProfile.productionMetrics.averageResolutionTime}h</div>
                        <div className="text-sm text-gray-600">Avg Resolution Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-600">{selectedEngineerForProfile.productionMetrics.customerSatisfactionRating}/5</div>
                        <div className="text-sm text-gray-600">Customer Satisfaction</div>
                      </div>
                    </div>
                                         <div className="mt-4 text-xs text-gray-500">
                       Last updated: {selectedEngineerForProfile.productionMetrics.lastUpdated 
                         ? new Date(selectedEngineerForProfile.productionMetrics.lastUpdated).toLocaleDateString()
                         : 'Never'}
                     </div>
                   </div>
                 )}
               </div>

                                 {/* Action Buttons */}
                 <div className="flex justify-end space-x-3 mt-6">
                   {isManager && (
                     <button
                       onClick={() => {
                         setShowEngineerProfileModal(false);
                         handleIndividualAssign(selectedEngineerForProfile);
                       }}
                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                     >
                       Assign Shift
                     </button>
                   )}
                   <button
                     onClick={() => setShowEngineerProfileModal(false)}
                     className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                   >
                     Close
                   </button>
                 </div>
              </div>
            </div>
          )}

          {/* Production Metrics Modal */}
          {isManager && selectedEngineerForProduction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Update Production Metrics for {selectedEngineerForProduction.name}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tickets Resolved</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={productionForm.ticketsResolved}
                      onChange={(e) => setProductionForm(prev => ({ ...prev, ticketsResolved: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Incidents Handled</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={productionForm.incidentsHandled}
                      onChange={(e) => setProductionForm(prev => ({ ...prev, incidentsHandled: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tasks Completed</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={productionForm.tasksCompleted}
                      onChange={(e) => setProductionForm(prev => ({ ...prev, tasksCompleted: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">System Uptime Hours</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={productionForm.systemUptimeHours}
                      onChange={(e) => setProductionForm(prev => ({ ...prev, systemUptimeHours: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Projects Delivered</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={productionForm.projectsDelivered}
                      onChange={(e) => setProductionForm(prev => ({ ...prev, projectsDelivered: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Target</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={productionForm.monthlyTarget}
                      onChange={(e) => setProductionForm(prev => ({ ...prev, monthlyTarget: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Resolution Time (hours)</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={productionForm.averageResolutionTime}
                      onChange={(e) => setProductionForm(prev => ({ ...prev, averageResolutionTime: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Satisfaction Rating</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={productionForm.customerSatisfactionRating}
                      onChange={(e) => setProductionForm(prev => ({ ...prev, customerSatisfactionRating: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowProductionModal(false);
                      setSelectedEngineerForProduction(null);
                      setProductionForm({
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
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduction}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Metrics
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Active Shifts Modal */}
      {showActiveShiftsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Active Shifts & Present Engineers</h2>
              <button
                onClick={() => setShowActiveShiftsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(() => {
              const now = moment();
              const currentTime = now.format('HH:mm');
              const activeShiftTypes = getActiveShiftTypes();
              const engineersOnActiveShifts = getAccessibleEngineers().filter(engineer => isEngineerOnShift(engineer));
              
              return (
                <div className="space-y-6">
                  {/* Current Time */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">Current Time</h3>
                        <p className="text-blue-700">{now.format('dddd, MMMM DD, YYYY')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-900">{currentTime}</div>
                        <div className="text-sm text-blue-600">IST</div>
                      </div>
                    </div>
                  </div>

                  {/* Active Shift Types */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Currently Active Shifts ({activeShiftTypes.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeShiftTypes.map((shiftType) => (
                        <div key={shiftType.id} className="border rounded-lg p-4" style={{ borderColor: shiftType.color }}>
                          <div className="flex items-center mb-3">
                            <div 
                              className="w-4 h-4 rounded-full mr-3" 
                              style={{ backgroundColor: shiftType.color }}
                            ></div>
                            <h4 className="font-semibold text-gray-900">{shiftType.name}</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Time:</span>
                              <span className="font-medium">{shiftType.startTime} - {shiftType.endTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">{shiftType.duration} hours</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pay Rate:</span>
                              <span className="font-medium">{shiftType.payMultiplier}x</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                shiftType.isOvernight ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {shiftType.isOvernight ? 'Overnight' : 'Regular'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Present Engineers */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Present Engineers ({engineersOnActiveShifts.length})
                    </h3>
                    
                    {engineersOnActiveShifts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {engineersOnActiveShifts.map((engineer) => {
                          const engineerShiftType = mockShiftTypes.find(shift => {
                            if (engineer.preferredShift === 'shift-a') return shift.id === 'shift-a';
                            if (engineer.preferredShift === 'shift-b') return shift.id === 'shift-b';
                            if (engineer.preferredShift === 'shift-c') return shift.id === 'shift-c';
                            if (engineer.preferredShift === 'shift-d') return shift.id === 'shift-d';
                            if (engineer.preferredShift === 'shift-e') return shift.id === 'shift-e';
                            return shift.id === 'shift-a'; // Default
                          });
                          
                          return (
                            <div key={engineer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{engineer.name}</h4>
                                  <p className="text-sm text-gray-600">{engineer.designation}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Team:</span>
                                  <span className="font-medium">{engineer.team.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Location:</span>
                                  <span className="font-medium">{engineer.location.city}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Shift:</span>
                                  <span className="font-medium" style={{ color: engineerShiftType?.color }}>
                                    {engineerShiftType?.name}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Timing:</span>
                                  <span className="font-medium">
                                    {engineerShiftType?.startTime} - {engineerShiftType?.endTime}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    engineer.isOnCall 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {engineer.isOnCall ? 'On Call' : 'Working'}
                                  </span>
                                </div>
                              </div>
                              
                              {engineer.team.code === 'PD' && (
                                <div className="mt-3">
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                                    Project Dedicated
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Engineers Currently Working</h3>
                        <p className="text-gray-600">
                          No engineers are scheduled to work at this time ({currentTime}).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Summary Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{activeShiftTypes.length}</div>
                        <div className="text-sm text-gray-600">Active Shifts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{engineersOnActiveShifts.length}</div>
                        <div className="text-sm text-gray-600">Present Engineers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {engineersOnActiveShifts.filter(e => e.team.code === 'PD').length}
                        </div>
                        <div className="text-sm text-gray-600">Project Dedicated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {engineersOnActiveShifts.filter(e => e.isOnCall).length}
                        </div>
                        <div className="text-sm text-gray-600">On Call</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowActiveShiftsModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Engineers on Shift Modal */}
      {showEngineersOnShiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Engineers Currently on Shift</h2>
              <button
                onClick={() => setShowEngineersOnShiftModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(() => {
              const now = moment();
              const currentTime = now.format('HH:mm');
              const engineersOnShift = getAccessibleEngineers().filter(engineer => isEngineerOnShift(engineer));
              
              // Group engineers by shift type
              const engineersByShift = engineersOnShift.reduce((acc, engineer) => {
                const shiftId = engineer.preferredShift === 'shift-a' ? 'shift-a' :
                               engineer.preferredShift === 'shift-b' ? 'shift-b' :
                               engineer.preferredShift === 'shift-c' ? 'shift-c' :
                               engineer.preferredShift === 'shift-d' ? 'shift-d' :
                               engineer.preferredShift === 'shift-e' ? 'shift-e' : 'shift-a';
                
                if (!acc[shiftId]) acc[shiftId] = [];
                acc[shiftId].push(engineer);
                return acc;
              }, {} as Record<string, typeof engineersOnShift>);

              // Group engineers by team
              const engineersByTeam = engineersOnShift.reduce((acc, engineer) => {
                if (!acc[engineer.team.name]) acc[engineer.team.name] = [];
                acc[engineer.team.name].push(engineer);
                return acc;
              }, {} as Record<string, typeof engineersOnShift>);

              return (
                <div className="space-y-6">
                  {/* Current Status Header */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-green-900">Current Shift Status</h3>
                        <p className="text-green-700">{now.format('dddd, MMMM DD, YYYY')} at {currentTime} IST</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-900">{engineersOnShift.length}</div>
                        <div className="text-sm text-green-600">Engineers Working</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {engineersOnShift.filter(e => e.team.code === 'PD').length}
                      </div>
                      <div className="text-xs text-blue-600">Project Dedicated</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {engineersOnShift.filter(e => e.isOnCall).length}
                      </div>
                      <div className="text-xs text-purple-600">On Call</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-700">
                        {engineersOnShift.filter(e => e.isTeamLead).length}
                      </div>
                      <div className="text-xs text-orange-600">Team Leads</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-indigo-700">
                        {Object.keys(engineersByTeam).length}
                      </div>
                      <div className="text-xs text-indigo-600">Teams Active</div>
                    </div>
                  </div>

                  {engineersOnShift.length > 0 ? (
                    <>
                      {/* Engineers by Shift Type */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engineers by Shift Type</h3>
                        <div className="space-y-4">
                          {Object.entries(engineersByShift).map(([shiftId, engineers]) => {
                            const shiftType = mockShiftTypes.find(s => s.id === shiftId);
                            return (
                              <div key={shiftId} className="border rounded-lg p-4" style={{ borderColor: shiftType?.color }}>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-4 h-4 rounded-full mr-3" 
                                      style={{ backgroundColor: shiftType?.color }}
                                    ></div>
                                    <h4 className="font-semibold text-gray-900">{shiftType?.name}</h4>
                                    <span className="ml-2 text-sm text-gray-600">
                                      ({shiftType?.startTime} - {shiftType?.endTime})
                                    </span>
                                  </div>
                                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                                    {engineers.length} Engineers
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {engineers.map((engineer) => (
                                    <div key={engineer.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                      <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                          <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-gray-900 truncate">{engineer.name}</div>
                                          <div className="text-sm text-gray-600 truncate">
                                            {engineer.team.name} • {engineer.designation}
                                          </div>
                                          <div className="flex items-center mt-1">
                                            {engineer.isTeamLead && (
                                              <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded mr-1">
                                                Lead
                                              </span>
                                            )}
                                            {engineer.isOnCall && (
                                              <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded mr-1">
                                                On Call
                                              </span>
                                            )}
                                            {engineer.team.code === 'PD' && (
                                              <span className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                                                PD
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Engineers by Team */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engineers by Team</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(engineersByTeam).map(([teamName, engineers]) => {
                            const team = engineers[0].team;
                            return (
                              <div key={teamName} className="border rounded-lg p-4" style={{ borderColor: team.color }}>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-4 h-4 rounded-full mr-3" 
                                      style={{ backgroundColor: team.color }}
                                    ></div>
                                    <h4 className="font-semibold text-gray-900">{teamName}</h4>
                                    {team.code === 'PD' && (
                                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                        Project Dedicated
                                      </span>
                                    )}
                                  </div>
                                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                                    {engineers.length}
                                  </span>
                                </div>
                                
                                <div className="space-y-2">
                                  {engineers.map((engineer) => {
                                    const engineerShiftType = mockShiftTypes.find(shift => {
                                      if (engineer.preferredShift === 'shift-a') return shift.id === 'shift-a';
                                      if (engineer.preferredShift === 'shift-b') return shift.id === 'shift-b';
                                      if (engineer.preferredShift === 'shift-c') return shift.id === 'shift-c';
                                      if (engineer.preferredShift === 'shift-d') return shift.id === 'shift-d';
                                      if (engineer.preferredShift === 'shift-e') return shift.id === 'shift-e';
                                      return shift.id === 'shift-a';
                                    });
                                    
                                    return (
                                      <div key={engineer.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                        <div className="flex items-center">
                                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                            <User className="w-3 h-3 text-blue-600" />
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-gray-900">{engineer.name}</div>
                                            <div className="text-xs text-gray-600">{engineer.designation}</div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-xs font-medium" style={{ color: engineerShiftType?.color }}>
                                            {engineerShiftType?.code}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {engineerShiftType?.startTime}-{engineerShiftType?.endTime}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Location Distribution */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engineers by Location</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(
                            engineersOnShift.reduce((acc, engineer) => {
                              const city = engineer.location.city;
                              if (!acc[city]) acc[city] = 0;
                              acc[city]++;
                              return acc;
                            }, {} as Record<string, number>)
                          ).map(([city, count]) => (
                            <div key={city} className="bg-gray-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-gray-900">{count}</div>
                              <div className="text-sm text-gray-600">{city}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Engineers Currently on Shift</h3>
                      <p className="text-gray-600 mb-4">
                        No engineers are scheduled to work at this time ({currentTime} IST).
                      </p>
                      <p className="text-sm text-gray-500">
                        Check back during active shift hours or review the shift schedule.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEngineersOnShiftModal(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Engineers Modal */}
      {showActiveEngineersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Active Engineers</h2>
              <button
                onClick={() => setShowActiveEngineersModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(() => {
              const now = moment();
              const currentTime = now.format('HH:mm');
              const allActiveEngineers = getAccessibleEngineers().filter(engineer => engineer.status === 'active');
              const currentlyWorkingEngineers = allActiveEngineers.filter(engineer => isEngineerOnShift(engineer));
              const availableEngineers = allActiveEngineers.filter(engineer => !isEngineerOnShift(engineer));
              
              // Group active engineers by team
              const engineersByTeam = allActiveEngineers.reduce((acc, engineer) => {
                if (!acc[engineer.team.name]) acc[engineer.team.name] = [];
                acc[engineer.team.name].push(engineer);
                return acc;
              }, {} as Record<string, typeof allActiveEngineers>);

              // Group active engineers by location
              const engineersByLocation = allActiveEngineers.reduce((acc, engineer) => {
                const city = engineer.location.city;
                if (!acc[city]) acc[city] = [];
                acc[city].push(engineer);
                return acc;
              }, {} as Record<string, typeof allActiveEngineers>);

              // Group by designation
              const engineersByDesignation = allActiveEngineers.reduce((acc, engineer) => {
                if (!acc[engineer.designation]) acc[engineer.designation] = [];
                acc[engineer.designation].push(engineer);
                return acc;
              }, {} as Record<string, typeof allActiveEngineers>);

              return (
                <div className="space-y-6">
                  {/* Current Status Header */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900">Active Engineers Overview</h3>
                        <p className="text-purple-700">{now.format('dddd, MMMM DD, YYYY')} at {currentTime} IST</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-900">{allActiveEngineers.length}</div>
                        <div className="text-sm text-purple-600">Total Active Engineers</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-700">{currentlyWorkingEngineers.length}</div>
                      <div className="text-xs text-green-600">Currently Working</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-700">{availableEngineers.length}</div>
                      <div className="text-xs text-blue-600">Available/Off Shift</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-700">
                        {allActiveEngineers.filter(e => e.isTeamLead).length}
                      </div>
                      <div className="text-xs text-orange-600">Team Leads</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-indigo-700">
                        {allActiveEngineers.filter(e => e.team.code === 'PD').length}
                      </div>
                      <div className="text-xs text-indigo-600">Project Dedicated</div>
                    </div>
                  </div>

                  {/* Currently Working vs Available */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Currently Working Engineers */}
                    <div className="border border-green-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        Currently Working ({currentlyWorkingEngineers.length})
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {currentlyWorkingEngineers.length > 0 ? (
                          currentlyWorkingEngineers.map((engineer) => {
                            const engineerShiftType = mockShiftTypes.find(shift => {
                              if (engineer.preferredShift === 'shift-a') return shift.id === 'shift-a';
                              if (engineer.preferredShift === 'shift-b') return shift.id === 'shift-b';
                              if (engineer.preferredShift === 'shift-c') return shift.id === 'shift-c';
                              if (engineer.preferredShift === 'shift-d') return shift.id === 'shift-d';
                              if (engineer.preferredShift === 'shift-e') return shift.id === 'shift-e';
                              return shift.id === 'shift-a';
                            });
                            
                            return (
                              <div key={engineer.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-3">
                                      <User className="w-4 h-4 text-green-700" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{engineer.name}</div>
                                      <div className="text-sm text-gray-600">
                                        {engineer.team.name} • {engineer.designation}
                                      </div>
                                      <div className="flex items-center mt-1">
                                        {engineer.isTeamLead && (
                                          <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded mr-1">
                                            Lead
                                          </span>
                                        )}
                                        {engineer.isOnCall && (
                                          <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded mr-1">
                                            On Call
                                          </span>
                                        )}
                                        {engineer.team.code === 'PD' && (
                                          <span className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                                            PD
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium" style={{ color: engineerShiftType?.color }}>
                                      {engineerShiftType?.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {engineerShiftType?.startTime} - {engineerShiftType?.endTime}
                                    </div>
                                    <div className="text-xs text-gray-500">{engineer.location.city}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No engineers currently working
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Available Engineers */}
                    <div className="border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        Available/Off Shift ({availableEngineers.length})
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {availableEngineers.length > 0 ? (
                          availableEngineers.map((engineer) => {
                            const engineerShiftType = mockShiftTypes.find(shift => {
                              if (engineer.preferredShift === 'shift-a') return shift.id === 'shift-a';
                              if (engineer.preferredShift === 'shift-b') return shift.id === 'shift-b';
                              if (engineer.preferredShift === 'shift-c') return shift.id === 'shift-c';
                              if (engineer.preferredShift === 'shift-d') return shift.id === 'shift-d';
                              if (engineer.preferredShift === 'shift-e') return shift.id === 'shift-e';
                              return shift.id === 'shift-a';
                            });
                            
                            return (
                              <div key={engineer.id} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                                      <User className="w-4 h-4 text-blue-700" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{engineer.name}</div>
                                      <div className="text-sm text-gray-600">
                                        {engineer.team.name} • {engineer.designation}
                                      </div>
                                      <div className="flex items-center mt-1">
                                        {engineer.isTeamLead && (
                                          <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded mr-1">
                                            Lead
                                          </span>
                                        )}
                                        {engineer.isOnCall && (
                                          <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded mr-1">
                                            On Call
                                          </span>
                                        )}
                                        {engineer.team.code === 'PD' && (
                                          <span className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                                            PD
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-600">
                                      Next: {engineerShiftType?.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {engineerShiftType?.startTime} - {engineerShiftType?.endTime}
                                    </div>
                                    <div className="text-xs text-gray-500">{engineer.location.city}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            All engineers are currently working
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Engineers by Team */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Engineers by Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(engineersByTeam).map(([teamName, engineers]) => {
                        const team = engineers[0].team;
                        const workingCount = engineers.filter(e => isEngineerOnShift(e)).length;
                        
                        return (
                          <div key={teamName} className="border rounded-lg p-4" style={{ borderColor: team.color }}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div 
                                  className="w-4 h-4 rounded-full mr-3" 
                                  style={{ backgroundColor: team.color }}
                                ></div>
                                <h4 className="font-semibold text-gray-900">{teamName}</h4>
                                {team.code === 'PD' && (
                                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                    PD
                                  </span>
                                )}
                              </div>
                              <div className="text-right text-sm">
                                <div className="font-medium">{engineers.length} Total</div>
                                <div className="text-green-600">{workingCount} Working</div>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              {engineers.slice(0, 5).map((engineer) => (
                                <div key={engineer.id} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                                  <span className="font-medium truncate">{engineer.name}</span>
                                  <span className={`px-1 py-0.5 rounded text-xs ${
                                    isEngineerOnShift(engineer) 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {isEngineerOnShift(engineer) ? 'Working' : 'Off'}
                                  </span>
                                </div>
                              ))}
                              {engineers.length > 5 && (
                                <div className="text-xs text-gray-500 text-center py-1">
                                  ... and {engineers.length - 5} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Engineers by Location */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Engineers by Location</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(engineersByLocation).map(([city, engineers]) => {
                        const workingCount = engineers.filter(e => isEngineerOnShift(e)).length;
                        
                        return (
                          <div key={city} className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{engineers.length}</div>
                            <div className="text-sm text-gray-600 mb-2">{city}</div>
                            <div className="flex justify-center space-x-4 text-xs">
                              <span className="text-green-600">{workingCount} Working</span>
                              <span className="text-gray-500">{engineers.length - workingCount} Off</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Engineers by Designation */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Engineers by Designation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(engineersByDesignation).map(([designation, engineers]) => {
                        const workingCount = engineers.filter(e => isEngineerOnShift(e)).length;
                        
                        return (
                          <div key={designation} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{designation}</h4>
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                                {engineers.length}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-green-600">{workingCount} Working</span>
                              <span className="text-gray-500">{engineers.length - workingCount} Available</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowActiveEngineersModal(false)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Engineers on Leave Modal */}
      {showEngineersOnLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Engineers Currently on Leave</h2>
              <button
                onClick={() => setShowEngineersOnLeaveModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(() => {
              const now = moment();
              const currentTime = now.format('HH:mm');
              const engineersOnLeave = getAccessibleEngineers().filter(engineer => engineer.status === 'on-leave');
              
              // Group engineers on leave by team
              const engineersByTeam = engineersOnLeave.reduce((acc, engineer) => {
                if (!acc[engineer.team.name]) acc[engineer.team.name] = [];
                acc[engineer.team.name].push(engineer);
                return acc;
              }, {} as Record<string, typeof engineersOnLeave>);

              // Group engineers on leave by location
              const engineersByLocation = engineersOnLeave.reduce((acc, engineer) => {
                const city = engineer.location.city;
                if (!acc[city]) acc[city] = [];
                acc[city].push(engineer);
                return acc;
              }, {} as Record<string, typeof engineersOnLeave>);

              // Group by designation
              const engineersByDesignation = engineersOnLeave.reduce((acc, engineer) => {
                if (!acc[engineer.designation]) acc[engineer.designation] = [];
                acc[engineer.designation].push(engineer);
                return acc;
              }, {} as Record<string, typeof engineersOnLeave>);

              // Simulate different types of leave
              const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Emergency Leave', 'Compensatory Off'];
              const engineersWithLeaveDetails = engineersOnLeave.map(engineer => ({
                ...engineer,
                leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
                leaveStartDate: moment().subtract(Math.floor(Math.random() * 10) + 1, 'days').format('MMM DD, YYYY'),
                leaveEndDate: moment().add(Math.floor(Math.random() * 15) + 1, 'days').format('MMM DD, YYYY'),
                leaveDuration: Math.floor(Math.random() * 20) + 1,
                leaveReason: Math.random() > 0.7 ? 'Family emergency' : Math.random() > 0.5 ? 'Medical checkup' : 'Personal work'
              }));

              return (
                <div className="space-y-6">
                  {/* Current Status Header */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-orange-900">Leave Status Overview</h3>
                        <p className="text-orange-700">{now.format('dddd, MMMM DD, YYYY')} at {currentTime} IST</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-orange-900">{engineersOnLeave.length}</div>
                        <div className="text-sm text-orange-600">Engineers on Leave</div>
                      </div>
                    </div>
                  </div>

                  {engineersOnLeave.length > 0 ? (
                    <>
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-red-700">
                            {engineersWithLeaveDetails.filter(e => e.leaveType === 'Sick Leave').length}
                          </div>
                          <div className="text-xs text-red-600">Sick Leave</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-700">
                            {engineersWithLeaveDetails.filter(e => e.leaveType === 'Annual Leave').length}
                          </div>
                          <div className="text-xs text-blue-600">Annual Leave</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-purple-700">
                            {engineersOnLeave.filter(e => e.team.code === 'PD').length}
                          </div>
                          <div className="text-xs text-purple-600">Project Dedicated</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-700">
                            {engineersOnLeave.filter(e => e.isTeamLead).length}
                          </div>
                          <div className="text-xs text-green-600">Team Leads</div>
                        </div>
                      </div>

                      {/* Engineers on Leave List */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Details</h3>
                        <div className="space-y-4">
                          {engineersWithLeaveDetails.map((engineer) => (
                            <div key={engineer.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Engineer Info */}
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mr-4">
                                    <User className="w-6 h-6 text-orange-700" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">{engineer.name}</div>
                                    <div className="text-sm text-gray-600">{engineer.team.name}</div>
                                    <div className="text-sm text-gray-600">{engineer.designation}</div>
                                    <div className="flex items-center mt-1">
                                      {engineer.isTeamLead && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded mr-1">
                                          Team Lead
                                        </span>
                                      )}
                                      {engineer.team.code === 'PD' && (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                          Project Dedicated
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Leave Details */}
                                <div>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-600 w-20">Type:</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        engineer.leaveType === 'Sick Leave' ? 'bg-red-100 text-red-800' :
                                        engineer.leaveType === 'Annual Leave' ? 'bg-blue-100 text-blue-800' :
                                        engineer.leaveType === 'Personal Leave' ? 'bg-green-100 text-green-800' :
                                        engineer.leaveType === 'Maternity Leave' ? 'bg-pink-100 text-pink-800' :
                                        engineer.leaveType === 'Emergency Leave' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {engineer.leaveType}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-600 w-20">Duration:</span>
                                      <span className="text-sm font-medium text-gray-900">{engineer.leaveDuration} days</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-600 w-20">Reason:</span>
                                      <span className="text-sm text-gray-700">{engineer.leaveReason}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Leave Dates */}
                                <div>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-600 w-16">From:</span>
                                      <span className="text-sm font-medium text-gray-900">{engineer.leaveStartDate}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-600 w-16">To:</span>
                                      <span className="text-sm font-medium text-gray-900">{engineer.leaveEndDate}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-600 w-16">Location:</span>
                                      <span className="text-sm text-gray-700">{engineer.location.city}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Engineers by Team */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Impact by Team</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(engineersByTeam).map(([teamName, engineers]) => {
                            const team = engineers[0].team;
                            const totalTeamMembers = getAccessibleEngineers().filter(e => e.team.name === teamName).length;
                            const impactPercentage = Math.round((engineers.length / totalTeamMembers) * 100);
                            
                            return (
                              <div key={teamName} className="border rounded-lg p-4" style={{ borderColor: team.color }}>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-4 h-4 rounded-full mr-3" 
                                      style={{ backgroundColor: team.color }}
                                    ></div>
                                    <h4 className="font-semibold text-gray-900">{teamName}</h4>
                                    {team.code === 'PD' && (
                                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                        PD
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-right text-sm">
                                    <div className="font-medium text-orange-700">{engineers.length} on leave</div>
                                    <div className="text-gray-500">{impactPercentage}% impact</div>
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  {engineers.slice(0, 3).map((engineer) => (
                                    <div key={engineer.id} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                                      <span className="font-medium truncate">{engineer.name}</span>
                                      <span className="text-xs text-orange-600">
                                        {engineersWithLeaveDetails.find(e => e.id === engineer.id)?.leaveType}
                                      </span>
                                    </div>
                                  ))}
                                  {engineers.length > 3 && (
                                    <div className="text-xs text-gray-500 text-center py-1">
                                      ... and {engineers.length - 3} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Engineers by Location */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Distribution by Location</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {Object.entries(engineersByLocation).map(([city, engineers]) => (
                            <div key={city} className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                              <div className="text-2xl font-bold text-orange-700">{engineers.length}</div>
                              <div className="text-sm text-orange-600 mb-2">{city}</div>
                              <div className="text-xs text-gray-600">
                                Engineers on leave
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Leave Types Summary */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Types Breakdown</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {leaveTypes.map((leaveType) => {
                            const count = engineersWithLeaveDetails.filter(e => e.leaveType === leaveType).length;
                            if (count === 0) return null;
                            
                            return (
                              <div key={leaveType} className="border border-gray-200 rounded-lg p-4 text-center">
                                <div className="text-xl font-bold text-gray-900">{count}</div>
                                <div className="text-sm text-gray-600">{leaveType}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Engineers Currently on Leave</h3>
                      <p className="text-gray-600 mb-4">
                        All engineers are currently available for work.
                      </p>
                      <p className="text-sm text-gray-500">
                        This is great for maintaining full operational capacity!
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEngineersOnLeaveModal(false)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Alert Messages Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              transform transition-all duration-500 ease-out
              translate-x-0 opacity-100
              animate-slide-in-right
              max-w-sm rounded-lg shadow-lg border-l-4 p-4 bg-white
              ${alert.type === 'success' ? 'border-green-500 bg-green-50' :
                alert.type === 'error' ? 'border-red-500 bg-red-50' :
                alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'}
            `}
            style={{
              animation: 'slideInFromRight 0.5s ease-out forwards'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center mr-3
                  ${alert.type === 'success' ? 'bg-green-100' :
                    alert.type === 'error' ? 'bg-red-100' :
                    alert.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'}
                `}>
                  {alert.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {alert.type === 'error' && (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {alert.type === 'warning' && (
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                  {alert.type === 'info' && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className={`
                  text-sm font-medium
                  ${alert.type === 'success' ? 'text-green-800' :
                    alert.type === 'error' ? 'text-red-800' :
                    alert.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'}
                `}>
                  {alert.message}
                </p>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className={`
                  ml-4 text-gray-400 hover:text-gray-600 transition-colors
                  ${alert.type === 'success' ? 'hover:text-green-600' :
                    alert.type === 'error' ? 'hover:text-red-600' :
                    alert.type === 'warning' ? 'hover:text-yellow-600' :
                    'hover:text-blue-600'}
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}