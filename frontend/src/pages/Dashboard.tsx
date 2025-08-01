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
  Globe,
  X,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MessageCircle,
  BookMarked,
  UserPlus,
  TrendingDown,
  WifiOff,
  Server,
  Database,
  Cloud,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Upload,
  Megaphone,
  Info,
  Wrench,
  Phone
} from 'lucide-react';

export default function Dashboard() {
  const { user, isManager } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHolidayLocation, setSelectedHolidayLocation] = useState('');
  const [selectedHolidayType, setSelectedHolidayType] = useState('');
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] = useState(false);
  const [isLeavesModalOpen, setIsLeavesModalOpen] = useState(false);


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isHolidayModalOpen) {
          setIsHolidayModalOpen(false);
        }
        if (isAnnouncementsModalOpen) {
          setIsAnnouncementsModalOpen(false);
        }
        if (isLeavesModalOpen) {
          setIsLeavesModalOpen(false);
        }

      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isHolidayModalOpen, isAnnouncementsModalOpen, isLeavesModalOpen]);

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

  const collaborationStats = {
    activeChannels: 12,
    todayMessages: 156,
    announcements: 3,
    recentActivity: [
      { type: 'announcement', text: 'New security policies updated', time: '2h ago' },
      { type: 'message', text: 'Database maintenance completed', time: '4h ago' }
    ]
  };

  const schedulerStats = getSchedulerStats();
  const engineerStats = getEngineerStats();

  const recentActivities = [
    { id: 1, type: 'shift', title: 'Evening shift started for Network Operations', time: '5 min ago', severity: 'info', user: 'System' },
    { id: 2, type: 'knowledge', title: 'New article: Docker Troubleshooting Guide', time: '12 min ago', severity: 'info', user: 'Rajesh Kumar' },
    { id: 3, type: 'collaboration', title: 'New announcement posted in #general', time: '18 min ago', severity: 'low', user: 'Admin Team' },
    { id: 4, type: 'schedule', title: 'Shift schedule updated for next week', time: '25 min ago', severity: 'info', user: 'Scheduler' },
    { id: 5, type: 'team', title: 'New engineer joined Database Support team', time: '32 min ago', severity: 'info', user: 'HR Team' }
  ];

  const quickActions = [
    { title: 'Add Article', icon: BookOpen, color: 'green', link: '/knowledge-base', type: 'link' as const },
    { title: 'Schedule Shift', icon: Calendar, color: 'blue', link: '/scheduler', type: 'link' as const },
    { title: 'View Engineers', icon: Users, color: 'purple', link: '/scheduler', type: 'link' as const },
    { title: 'Team Chat', icon: MessageCircle, color: 'indigo', link: '/collaboration', type: 'link' as const },
    { title: 'View Reports', icon: BarChart3, color: 'orange', link: '/reports', type: 'link' as const },
    { title: 'View Holidays', icon: Calendar, color: 'red', type: 'action' as const, onClick: () => setIsHolidayModalOpen(true) }
  ];

  const performanceData = {
    ticketsResolved: 2847,
    incidentsHandled: 234,
    avgResolutionTime: 42,
    customerSatisfaction: 4.6,
    slaCompliance: 98.5,
    teamEfficiency: 92
  };

  const topPerformers = [
    { name: 'Deepika Agnihotri', tickets: 89, rating: 4.9, efficiency: 96, avatar: 'DA' },
    { name: 'Shashankagowda S', tickets: 76, rating: 4.8, efficiency: 94, avatar: 'SS' },
    { name: 'Pradip Shinde', tickets: 71, rating: 4.7, efficiency: 91, avatar: 'PS' }
  ];

  // Today's leaves data
  const todaysLeaves = [
    { 
      name: 'Arjun Mehta', 
      type: 'Sick Leave', 
      location: 'Mumbai', 
      avatar: 'AM',
      duration: 'Full Day',
      contact: '+91 98765 43210'
    },
    { 
      name: 'Kavya Nair', 
      type: 'Personal Leave', 
      location: 'Kochi', 
      avatar: 'KN',
      duration: 'Half Day',
      contact: '+91 87654 32109'
    },
    { 
      name: 'Rohit Gupta', 
      type: 'Emergency Leave', 
      location: 'Delhi', 
      avatar: 'RG',
      duration: 'Full Day',
      contact: '+91 76543 21098'
    },
    { 
      name: 'Deepika Shah', 
      type: 'Medical Leave', 
      location: 'Pune', 
      avatar: 'DS',
      duration: 'Full Day',
      contact: '+91 65432 10987'
    }
  ];

  // Announcements data
  const announcements = [
    {
      id: 1,
      title: 'System Maintenance Window - Database Upgrade',
      message: 'Scheduled maintenance from 2:00 AM to 4:00 AM IST tomorrow. Expect minimal service interruption.',
      type: 'maintenance',
      priority: 'high',
      author: 'IT Operations Team',
      timestamp: '2 hours ago',
      location: 'All Locations'
    },
    {
      id: 2,
      title: 'New Security Protocol Implementation',
      message: 'Enhanced authentication procedures will be implemented across all CIS portals starting next week.',
      type: 'security',
      priority: 'medium',
      author: 'Security Team',
      timestamp: '5 hours ago',
      location: 'Global'
    },
    {
      id: 3,
      title: 'Holiday Schedule Update - Diwali Celebrations',
      message: 'Updated holiday schedule for Diwali celebrations. Check your regional calendar for specific dates.',
      type: 'holiday',
      priority: 'medium',
      author: 'HR Team',
      timestamp: '1 day ago',
      location: 'India Locations'
    },
    {
      id: 4,
      title: 'Knowledge Base Migration Complete',
      message: 'All legacy documentation has been successfully migrated to the new knowledge base system.',
      type: 'success',
      priority: 'low',
      author: 'Knowledge Management',
      timestamp: '2 days ago',
      location: 'All Locations'
    }
  ];

  // Project Dedicated Team Data - Complete List from Employee Database
  const projectDedicatedTeam = [
    { empId: '162296', name: 'Satya Sharma', project: 'PAPA', role: 'Sr. System Engineer', location: 'Bangalore', avatar: 'SS', experience: '6 years', skills: ['Java', 'Spring', 'AWS'] },
    { empId: '162420', name: 'Madhan Raj Selvaraj', project: 'Metlife', role: 'System Engineer', location: 'Chennai', avatar: 'MS', experience: '4 years', skills: ['React', 'Node.js', 'MongoDB'] },
    { empId: '162421', name: 'Kameswaran Murugesan', project: 'Pearson', role: 'Sr. System Engineer', location: 'Mumbai', avatar: 'KM', experience: '7 years', skills: ['Python', 'Django', 'PostgreSQL'] },
    { empId: '187784', name: 'Ashish Avinash Patil', project: 'Trafigura & Takeda', role: 'System Engineer', location: 'Pune', avatar: 'AP', experience: '5 years', skills: ['Angular', 'C#', '.NET'] },
    { empId: '239990', name: 'Eswar Pavan Kumar Kundeti', project: 'Philips VA Remediation', role: 'Sr. System Engineer', location: 'Hyderabad', avatar: 'EK', experience: '6 years', skills: ['Java', 'Spring Boot', 'Oracle'] },
    { empId: '252220', name: 'Singaravel P', project: 'Netcentric', role: 'System Engineer', location: 'Chennai', avatar: 'SP', experience: '4 years', skills: ['React', 'Express', 'MySQL'] },
    { empId: '265754', name: 'Saikrishna Maddi', project: 'UBS', role: 'Sr. System Engineer', location: 'Bangalore', avatar: 'SM', experience: '8 years', skills: ['Java', 'Microservices', 'Kafka'] },
    { empId: '282670', name: 'Denzil F', project: 'BNYM', role: 'System Engineer', location: 'Mumbai', avatar: 'DF', experience: '3 years', skills: ['Python', 'Flask', 'Redis'] },
    { empId: '283488', name: 'Suresh Kumar Rampelly', project: 'TRV Chn', role: 'Sr. System Engineer', location: 'Chennai', avatar: 'SR', experience: '7 years', skills: ['Java', 'Spring', 'Docker'] },
    { empId: '287610', name: 'Abhishek Reddy Thandra', project: 'Credit Suisse', role: 'System Engineer', location: 'Hyderabad', avatar: 'AT', experience: '4 years', skills: ['React', 'Node.js', 'MongoDB'] },
    { empId: '289148', name: 'Harvin A', project: 'Mirabeau', role: 'System Engineer', location: 'Kochi', avatar: 'HA', experience: '3 years', skills: ['Vue.js', 'Python', 'PostgreSQL'] },
    { empId: '290008', name: 'Ravi Chandra Sekhar Para', project: 'Credit Suisse', role: 'Sr. System Engineer', location: 'Pune', avatar: 'RP', experience: '6 years', skills: ['Java', 'Spring Boot', 'AWS'] },
    { empId: '293101', name: 'Pradip Barade', project: 'Telstra Bangalore', role: 'System Engineer', location: 'Bangalore', avatar: 'PB', experience: '5 years', skills: ['Angular', 'Node.js', 'MySQL'] },
    { empId: '293128', name: 'Shivkumar Vishwakarma', project: 'SFDC', role: 'Sr. System Engineer', location: 'Mumbai', avatar: 'SV', experience: '7 years', skills: ['Salesforce', 'Apex', 'Lightning'] },
    { empId: '305584', name: 'Vishweshwar Chakali', project: 'UBS', role: 'System Engineer', location: 'Hyderabad', avatar: 'VC', experience: '4 years', skills: ['Java', 'Spring', 'Oracle'] },
    { empId: '306436', name: 'Snehanjan Chatterjee', project: 'Papa Call', role: 'System Engineer', location: 'Kolkata', avatar: 'SC', experience: '3 years', skills: ['React', 'Express', 'MongoDB'] },
    { empId: '315452', name: 'Sagar Sadashiv Janwade', project: 'Google (Asset)', role: 'Sr. System Engineer', location: 'Pune', avatar: 'SJ', experience: '6 years', skills: ['Python', 'GCP', 'Kubernetes'] },
    { empId: '318419', name: 'E Vijaya Simha Reddy', project: 'UBS', role: 'System Engineer', location: 'Chennai', avatar: 'ES', experience: '5 years', skills: ['Java', 'Microservices', 'Docker'] },
    { empId: '321542', name: 'Shiva Kumar Davu', project: 'Centene', role: 'Sr. System Engineer', location: 'Bangalore', avatar: 'SD', experience: '8 years', skills: ['C#', '.NET Core', 'Azure'] },
    { empId: '337302', name: 'Rajeev Ramakrishnan', project: 'World Bank', role: 'System Engineer', location: 'Delhi', avatar: 'RR', experience: '4 years', skills: ['Java', 'Spring', 'PostgreSQL'] },
    { empId: '340339', name: 'Swapnil Dattatray Kalbhor', project: 'Credit Suisse', role: 'System Engineer', location: 'Mumbai', avatar: 'SK', experience: '3 years', skills: ['React', 'Node.js', 'MySQL'] },
    { empId: '346107', name: 'Karthick Kuppusamy', project: 'Kaiser', role: 'Sr. System Engineer', location: 'Chennai', avatar: 'KK', experience: '7 years', skills: ['Java', 'Spring Boot', 'AWS'] },
    { empId: '355670', name: 'Anand VaraPrasad Raju Chekuri', project: 'UBS', role: 'System Engineer', location: 'Hyderabad', avatar: 'AC', experience: '5 years', skills: ['Python', 'Django', 'Redis'] },
    { empId: '360179', name: 'Ganesh Jaiprakash Mahale', project: 'Google (Asset)', role: 'Sr. System Engineer', location: 'Pune', avatar: 'GM', experience: '6 years', skills: ['Python', 'GCP', 'BigQuery'] },
    { empId: '367323', name: 'Ramdas Shivdas Gawande', project: 'SFDC', role: 'System Engineer', location: 'Bangalore', avatar: 'RG', experience: '4 years', skills: ['Salesforce', 'Lightning', 'Apex'] },
    { empId: '370762', name: 'Surender E', project: 'First Data', role: 'System Engineer', location: 'Chennai', avatar: 'SE', experience: '3 years', skills: ['Java', 'Spring', 'Oracle'] },
    { empId: '371746', name: 'Harshal Ramesh Kulkarni', project: 'World Bank', role: 'Sr. System Engineer', location: 'Mumbai', avatar: 'HK', experience: '7 years', skills: ['C#', '.NET', 'SQL Server'] },
    { empId: '392173', name: 'Tanmoy Chowdhury', project: 'Google (Asset)', role: 'System Engineer', location: 'Kolkata', avatar: 'TC', experience: '4 years', skills: ['Python', 'GCP', 'Docker'] },
    { empId: '394853', name: 'Deepen Prabhudas Parekh', project: 'E&Y', role: 'System Engineer', location: 'Ahmedabad', avatar: 'DP', experience: '5 years', skills: ['Java', 'Spring', 'MySQL'] },
    { empId: '408515', name: 'Somnath Ghosh', project: 'JPMC', role: 'Sr. System Engineer', location: 'Kolkata', avatar: 'SG', experience: '8 years', skills: ['Java', 'Microservices', 'Kafka'] },
    { empId: '412528', name: 'Mohan Babu S', project: 'Lumeris', role: 'System Engineer', location: 'Hyderabad', avatar: 'MS', experience: '4 years', skills: ['C#', '.NET Core', 'Azure'] },
    { empId: '437292', name: 'Praveen Devaraj Manoranjitham', project: 'Unbilled', role: 'System Engineer', location: 'Chennai', avatar: 'PM', experience: '3 years', skills: ['React', 'Node.js', 'MongoDB'] },
    { empId: '442574', name: 'Prasanna R', project: 'World Bank', role: 'Sr. System Engineer', location: 'Bangalore', avatar: 'PR', experience: '6 years', skills: ['Java', 'Spring Boot', 'AWS'] },
    { empId: '444384', name: 'Pralaydeb Bandyopadhyay', project: 'Unbilled', role: 'System Engineer', location: 'Kolkata', avatar: 'PB', experience: '4 years', skills: ['Python', 'Django', 'PostgreSQL'] },
    { empId: '447702', name: 'Plabon Das', project: 'Emblem', role: 'System Engineer', location: 'Kolkata', avatar: 'PD', experience: '3 years', skills: ['Angular', 'Express', 'MySQL'] },
    { empId: '451217', name: 'Anil Kumar Basagond Biradar', project: 'Google Network', role: 'Sr. System Engineer', location: 'Pune', avatar: 'AB', experience: '7 years', skills: ['Python', 'Networking', 'GCP'] },
    { empId: '453106', name: 'Mohan Prabu M', project: 'World Bank', role: 'System Engineer', location: 'Chennai', avatar: 'MP', experience: '5 years', skills: ['Java', 'Spring', 'Oracle'] },
    { empId: '459873', name: 'Manash Ranjan Nayak', project: 'Microsoft (HYD)', role: 'Sr. System Engineer', location: 'Hyderabad', avatar: 'MN', experience: '6 years', skills: ['C#', '.NET', 'Azure'] },
    { empId: '467793', name: 'Praveen J', project: 'Cigna', role: 'System Engineer', location: 'Bangalore', avatar: 'PJ', experience: '4 years', skills: ['Java', 'Spring Boot', 'MySQL'] },
    { empId: '476225', name: 'Vijay Kumar Sama', project: 'TJX Hyderabad', role: 'System Engineer', location: 'Hyderabad', avatar: 'VS', experience: '3 years', skills: ['React', 'Node.js', 'MongoDB'] },
    { empId: '482715', name: 'Koushik Bhattacharya', project: 'First Data', role: 'Sr. System Engineer', location: 'Kolkata', avatar: 'KB', experience: '7 years', skills: ['Java', 'Microservices', 'Docker'] },
    { empId: '482720', name: 'Hamsanada S', project: 'Apple', role: 'System Engineer', location: 'Chennai', avatar: 'HS', experience: '4 years', skills: ['Swift', 'iOS', 'Objective-C'] },
    { empId: '486852', name: 'Arun Dey', project: 'CoreLogic', role: 'System Engineer', location: 'Kolkata', avatar: 'AD', experience: '5 years', skills: ['Java', 'Spring', 'PostgreSQL'] },
    { empId: '487162', name: 'Rajeev Jaiswal', project: 'Google (Asset)', role: 'Sr. System Engineer', location: 'Pune', avatar: 'RJ', experience: '6 years', skills: ['Python', 'GCP', 'Kubernetes'] },
    { empId: '500033', name: 'Bhaskar Singh Jamwal', project: 'Credit Suisse (50%) & UBS (50%)', role: 'System Engineer', location: 'Mumbai', avatar: 'BJ', experience: '4 years', skills: ['Java', 'Spring', 'Oracle'] },
    { empId: '528935', name: 'Kathavarayan M', project: 'CIGNA-BPS', role: 'System Engineer', location: 'Chennai', avatar: 'KM', experience: '3 years', skills: ['C#', '.NET', 'SQL Server'] },
    { empId: '539014', name: 'Aldo Samuel Dhason A', project: 'Thomson Reuters', role: 'Sr. System Engineer', location: 'Bangalore', avatar: 'AD', experience: '7 years', skills: ['Java', 'Spring Boot', 'AWS'] },
    { empId: '539018', name: 'Dillibabu T', project: 'HS Labs', role: 'System Engineer', location: 'Chennai', avatar: 'DT', experience: '4 years', skills: ['React', 'Node.js', 'MySQL'] },
    { empId: '541618', name: 'Rangesh S K', project: 'Astra Zeneca', role: 'System Engineer', location: 'Hyderabad', avatar: 'RS', experience: '5 years', skills: ['Python', 'Django', 'PostgreSQL'] },
    { empId: '544179', name: 'Thamizhazhagan Ramalingam', project: 'Apple', role: 'Sr. System Engineer', location: 'Chennai', avatar: 'TR', experience: '6 years', skills: ['Swift', 'iOS', 'Core Data'] },
    { empId: '545740', name: 'Mohammed Hafeez', project: 'UBS', role: 'System Engineer', location: 'Bangalore', avatar: 'MH', experience: '4 years', skills: ['Java', 'Microservices', 'Kafka'] },
    { empId: '550895', name: 'Naresh N', project: 'Telstra Bangalore', role: 'System Engineer', location: 'Bangalore', avatar: 'NN', experience: '3 years', skills: ['Angular', 'Node.js', 'MySQL'] },
    { empId: '554420', name: 'Sathish Gattu', project: 'Apple Warehouse (50%)', role: 'Sr. System Engineer', location: 'Hyderabad', avatar: 'SG', experience: '6 years', skills: ['Swift', 'iOS', 'CoreML'] },
    { empId: '557489', name: 'Rajesh A K', project: 'Merck VA Remediation', role: 'System Engineer', location: 'Chennai', avatar: 'RK', experience: '4 years', skills: ['Java', 'Spring', 'Oracle'] },
    { empId: '567506', name: 'Nasar Hussain Sardar Hussain', project: 'World Bank', role: 'System Engineer', location: 'Mumbai', avatar: 'NH', experience: '5 years', skills: ['C#', '.NET', 'SQL Server'] },
    { empId: '574427', name: 'M Lakshmi Reddy', project: 'Kaiser', role: 'Sr. System Engineer', location: 'Hyderabad', avatar: 'LR', experience: '7 years', skills: ['Java', 'Spring Boot', 'AWS'] },
    { empId: '584154', name: 'Jaikumar V', project: 'Google (Asset)', role: 'System Engineer', location: 'Chennai', avatar: 'JV', experience: '4 years', skills: ['Python', 'GCP', 'Docker'] },
    { empId: '586952', name: 'Jose Carlos Bazan-Aguilar', project: 'Apple (USA)', role: 'System Engineer', location: 'Bangalore', avatar: 'JB', experience: '3 years', skills: ['Swift', 'iOS', 'Xcode'] },
    { empId: '592367', name: 'Clancy Xinan Chen', project: 'Merck VA Remediation', role: 'Sr. System Engineer', location: 'Pune', avatar: 'CC', experience: '6 years', skills: ['Java', 'Spring', 'PostgreSQL'] },
    { empId: '599860', name: 'Vamsi Krishna Vrns Pammy', project: 'LinkedIn', role: 'System Engineer', location: 'Hyderabad', avatar: 'VP', experience: '4 years', skills: ['Scala', 'Kafka', 'Spark'] },
    { empId: '599864', name: 'Shivgond Metre', project: 'Xylem', role: 'System Engineer', location: 'Pune', avatar: 'SM', experience: '3 years', skills: ['Java', 'Spring', 'MySQL'] },
    { empId: '599886', name: 'Atul Landge', project: 'JPMC', role: 'Sr. System Engineer', location: 'Mumbai', avatar: 'AL', experience: '7 years', skills: ['Java', 'Microservices', 'Kafka'] },
    { empId: '599895', name: 'Balaji P K', project: 'UHG', role: 'System Engineer', location: 'Chennai', avatar: 'BP', experience: '4 years', skills: ['C#', '.NET Core', 'Azure'] },
    { empId: '600327', name: 'MD Asif Iqbal', project: 'CoreLogic', role: 'System Engineer', location: 'Hyderabad', avatar: 'AI', experience: '5 years', skills: ['Java', 'Spring', 'PostgreSQL'] },
    { empId: '604287', name: 'Pranay Tambekar', project: 'US Bank', role: 'Sr. System Engineer', location: 'Pune', avatar: 'PT', experience: '6 years', skills: ['Java', 'Spring Boot', 'Oracle'] },
    { empId: '2171825', name: 'Mohan Kumar V', project: 'Takeda', role: 'System Engineer', location: 'Chennai', avatar: 'MV', experience: '4 years', skills: ['Java', 'Spring', 'MySQL'] },
    { empId: '2171826', name: 'Shashankagowda S', project: 'NYL', role: 'Sr. System Engineer', location: 'Bangalore', avatar: 'SS', experience: '6 years', skills: ['React', 'Node.js', 'AWS'] },
    { empId: '2175815', name: 'Arunsankar V', project: 'HCSC', role: 'System Engineer', location: 'Chennai', avatar: 'AV', experience: '3 years', skills: ['Angular', 'Express', 'MongoDB'] },
    { empId: '2176358', name: 'Charansai Patnam', project: 'IDCS Application', role: 'System Engineer', location: 'Hyderabad', avatar: 'CP', experience: '4 years', skills: ['Java', 'Spring', 'Oracle'] },
    { empId: '2181455', name: 'Dineshkumar T', project: 'US Bank', role: 'Sr. System Engineer', location: 'Chennai', avatar: 'DT', experience: '7 years', skills: ['Java', 'Spring Boot', 'PostgreSQL'] },
    { empId: '2438360', name: 'Dinanath Vijay Patil', project: 'Compliance', role: 'System Engineer', location: 'Pune', avatar: 'DP', experience: '5 years', skills: ['Java', 'Spring', 'MySQL'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name || 'User'}
                </h1>
                <p className="text-gray-600 text-sm">
                  {isManager ? 'Operations Control Center' : 'Your CIS Dashboard'} • {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs text-gray-500">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">


        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Engineers on Duty</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{schedulerStats.totalEngineersOnDuty}</p>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {schedulerStats.activeShifts} active shifts
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Engineers Online</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{engineerStats.onlineNow}</p>
                <p className="text-blue-600 text-sm mt-1 flex items-center">
                  <Activity className="w-4 h-4 mr-1" />
                  {engineerStats.availableEngineers} available
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Knowledge Articles</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{knowledgeBaseStats.totalArticles}</p>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{knowledgeBaseStats.weeklyAdditions} this week
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">On-Call Engineers</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{engineerStats.onCallEngineers}</p>
                <p className="text-gray-500 text-sm mt-1">
                  24/7 coverage
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Megaphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Announcements</h2>
                  <p className="text-blue-100 text-sm">Latest updates and important notices</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAnnouncementsModalOpen(true)} 
                className="text-blue-100 hover:text-white text-sm font-medium bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {announcements.slice(0, 2).map((announcement, index) => (
                <div key={announcement.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        announcement.type === 'maintenance' ? 'bg-orange-100' :
                        announcement.type === 'security' ? 'bg-red-100' :
                        announcement.type === 'holiday' ? 'bg-green-100' :
                        'bg-blue-100'
                      }`}>
                        {announcement.type === 'maintenance' ? (
                          <Wrench className={`w-4 h-4 ${
                            announcement.type === 'maintenance' ? 'text-orange-600' :
                            announcement.type === 'security' ? 'text-red-600' :
                            announcement.type === 'holiday' ? 'text-green-600' :
                            'text-blue-600'
                          }`} />
                        ) : announcement.type === 'security' ? (
                          <Shield className="w-4 h-4 text-red-600" />
                        ) : announcement.type === 'holiday' ? (
                          <Calendar className="w-4 h-4 text-green-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{announcement.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                            announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{announcement.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span>{announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.location}</span>
                    </div>
                    <span>{announcement.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {announcements.length > 2 && (
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setIsAnnouncementsModalOpen(true)} 
                  className="text-blue-100 hover:text-white text-sm font-medium"
                >
                  +{announcements.length - 2} more announcements
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Knowledge Base Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
                <Link to="/knowledge-base" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{knowledgeBaseStats.totalArticles}</div>
                  <div className="text-sm text-gray-600">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{knowledgeBaseStats.totalViews.toLocaleString()}</div>
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

            {/* Shift Scheduler Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Shift Scheduler</h2>
                <Link to="/scheduler" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View Scheduler <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{schedulerStats.activeShifts}</div>
                  <div className="text-sm text-gray-600">Active Shifts</div>
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

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">All Events</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                                         <div className={`p-2 rounded-lg ${
                       activity.severity === 'high' ? 'bg-red-100' :
                       activity.severity === 'medium' ? 'bg-yellow-100' :
                       activity.severity === 'low' ? 'bg-green-100' :
                       'bg-blue-100'
                     }`}>
                       {activity.type === 'shift' && <Calendar className="w-4 h-4 text-blue-600" />}
                       {activity.type === 'knowledge' && <BookOpen className="w-4 h-4 text-green-600" />}
                       {activity.type === 'collaboration' && <MessageSquare className="w-4 h-4 text-purple-600" />}
                       {activity.type === 'schedule' && <Clock className="w-4 h-4 text-orange-600" />}
                       {activity.type === 'team' && <Users className="w-4 h-4 text-indigo-600" />}
                     </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button 
                  onClick={() => alert('Activity page coming soon!')} 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Activity →
                </button>
              </div>
            </div>


          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  if (action.type === 'action') {
                    return (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className={`p-3 rounded-lg border-2 border-dashed transition-colors group ${
                          action.color === 'red' ? 'border-red-200 hover:border-red-300 hover:bg-red-50' :
                          action.color === 'blue' ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' :
                          action.color === 'green' ? 'border-green-200 hover:border-green-300 hover:bg-green-50' :
                          action.color === 'purple' ? 'border-purple-200 hover:border-purple-300 hover:bg-purple-50' :
                          action.color === 'indigo' ? 'border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50' :
                          'border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        <action.icon className={`w-5 h-5 mx-auto mb-2 ${
                          action.color === 'red' ? 'text-red-600' :
                          action.color === 'blue' ? 'text-blue-600' :
                          action.color === 'green' ? 'text-green-600' :
                          action.color === 'purple' ? 'text-purple-600' :
                          action.color === 'indigo' ? 'text-indigo-600' :
                          'text-orange-600'
                        }`} />
                        <p className={`text-xs font-medium text-center ${
                          action.color === 'red' ? 'text-red-700' :
                          action.color === 'blue' ? 'text-blue-700' :
                          action.color === 'green' ? 'text-green-700' :
                          action.color === 'purple' ? 'text-purple-700' :
                          action.color === 'indigo' ? 'text-indigo-700' :
                          'text-orange-700'
                        }`}>{action.title}</p>
                      </button>
                    );
                                     } else {
                     return (
                       <Link
                         key={index}
                         to={action.link || '/'}
                         className={`p-3 rounded-lg border-2 border-dashed transition-colors group ${
                           action.color === 'red' ? 'border-red-200 hover:border-red-300 hover:bg-red-50' :
                           action.color === 'blue' ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' :
                           action.color === 'green' ? 'border-green-200 hover:border-green-300 hover:bg-green-50' :
                           action.color === 'purple' ? 'border-purple-200 hover:border-purple-300 hover:bg-purple-50' :
                           action.color === 'indigo' ? 'border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50' :
                           'border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                         }`}
                       >
                         <action.icon className={`w-5 h-5 mx-auto mb-2 ${
                           action.color === 'red' ? 'text-red-600' :
                           action.color === 'blue' ? 'text-blue-600' :
                           action.color === 'green' ? 'text-green-600' :
                           action.color === 'purple' ? 'text-purple-600' :
                           action.color === 'indigo' ? 'text-indigo-600' :
                           'text-orange-600'
                         }`} />
                         <p className={`text-xs font-medium text-center ${
                           action.color === 'red' ? 'text-red-700' :
                           action.color === 'blue' ? 'text-blue-700' :
                           action.color === 'green' ? 'text-green-700' :
                           action.color === 'purple' ? 'text-purple-700' :
                           action.color === 'indigo' ? 'text-indigo-700' :
                           'text-orange-700'
                         }`}>{action.title}</p>
                       </Link>
                     );
                   }
                })}
              </div>
            </div>

            {/* Today's Leaves */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Leaves</h3>
                <UserCheck className="w-5 h-5 text-orange-500" />
              </div>
              
              <div className="space-y-3">
                {todaysLeaves.slice(0, 3).map((leave, index) => (
                  <div key={index} className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {leave.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{leave.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span>{leave.location}</span>
                            <span>•</span>
                            <span>{leave.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          leave.type === 'Sick Leave' ? 'bg-red-100 text-red-700' :
                          leave.type === 'Personal Leave' ? 'bg-blue-100 text-blue-700' :
                          leave.type === 'Emergency Leave' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {leave.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {todaysLeaves.length > 3 && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setIsLeavesModalOpen(true)} 
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    View All ({todaysLeaves.length}) →
                  </button>
                </div>
              )}
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                    }`}>
                      {performer.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{performer.tickets} tickets</span>
                        <span>★ {performer.rating}</span>
                        <span>{performer.efficiency}% efficiency</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
                              <Link to="/reports" className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-4">
                  View All Rankings
                </Link>
            </div>

            {/* Engineer Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Engineer Overview</h3>
                <Link to="/scheduler" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
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

            {/* Upcoming Holidays - Compact */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Holidays</h3>
                </div>
              </div>
              
              {/* Filters */}
              <div className="mb-4 space-y-2">
                <select 
                  value={selectedHolidayLocation}
                  onChange={(e) => setSelectedHolidayLocation(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
                
                <select 
                  value={selectedHolidayType}
                  onChange={(e) => setSelectedHolidayType(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="National">National</option>
                  <option value="Regional">Regional</option>
                  <option value="Religious">Religious</option>
                </select>
              </div>
              
              {/* Next Holiday Preview */}
              <div className="space-y-2 mb-4">
                {(() => {
                  let locationsToShow: [string, UpcomingHoliday[]][] = [];
                  
                  if (selectedHolidayLocation) {
                    const holidays = locationHolidays[selectedHolidayLocation as keyof typeof locationHolidays];
                    if (holidays) {
                      locationsToShow = [[selectedHolidayLocation, holidays]];
                    }
                  } else {
                    locationsToShow = Object.entries(locationHolidays).slice(0, 2);
                  }
                  
                  // Apply type filter
                  const filteredLocations = locationsToShow.map(([location, holidays]) => {
                    const filteredHolidays = selectedHolidayType 
                      ? holidays.filter(holiday => holiday.type === selectedHolidayType)
                      : holidays;
                    return [location, filteredHolidays] as [string, UpcomingHoliday[]];
                  }).filter(([, holidays]) => holidays.length > 0);
                  
                  return filteredLocations.map(([location, holidays]) => (
                    <div key={location} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{holidays[0].name}</div>
                          <div className="flex items-center text-xs text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {location}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                              holidays[0].type === 'National' ? 'bg-green-100 text-green-800' :
                              holidays[0].type === 'Regional' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {holidays[0].type}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-600 text-xs font-medium">
                            {holidays[0].daysUntil} days
                          </div>
                          <div className="text-gray-500 text-xs">
                            {new Date(holidays[0].date).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              
              {/* View All Button */}
              <button 
                onClick={() => setIsHolidayModalOpen(true)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Upcoming Holidays
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Holiday Modal */}
      {isHolidayModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsHolidayModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-red-400 rounded-lg mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Upcoming Holidays 2025</h2>
                  <p className="text-red-100 text-sm">Location-wise Holiday Calendar</p>
                </div>
              </div>
              <button
                onClick={() => setIsHolidayModalOpen(false)}
                className="p-2 hover:bg-red-400 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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
        </div>
      )}

      {/* Announcements Modal */}
      {isAnnouncementsModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAnnouncementsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-blue-400 rounded-lg mr-4">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">All Announcements</h2>
                  <p className="text-blue-100 text-sm">Stay updated with the latest information</p>
                </div>
              </div>
              <button
                onClick={() => setIsAnnouncementsModalOpen(false)}
                className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div key={announcement.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${
                          announcement.type === 'maintenance' ? 'bg-orange-100' :
                          announcement.type === 'security' ? 'bg-red-100' :
                          announcement.type === 'holiday' ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          {announcement.type === 'maintenance' ? (
                            <Wrench className="w-6 h-6 text-orange-600" />
                          ) : announcement.type === 'security' ? (
                            <Shield className="w-6 h-6 text-red-600" />
                          ) : announcement.type === 'holiday' ? (
                            <Calendar className="w-6 h-6 text-green-600" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">{announcement.title}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                              announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {announcement.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-base leading-relaxed">{announcement.message}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{announcement.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{announcement.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{announcement.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Leaves Modal */}
      {isLeavesModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsLeavesModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-orange-400 rounded-lg mr-4">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Today's Leaves</h2>
                  <p className="text-orange-100 text-sm">Employees on leave today ({new Date().toLocaleDateString()})</p>
                </div>
              </div>
              <button
                onClick={() => setIsLeavesModalOpen(false)}
                className="p-2 hover:bg-orange-500 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {todaysLeaves.map((leave, index) => (
                  <div key={index} className="bg-orange-50 rounded-xl p-6 border border-orange-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {leave.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">{leave.name}</h3>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              leave.type === 'Sick Leave' ? 'bg-red-100 text-red-700' :
                              leave.type === 'Personal Leave' ? 'bg-blue-100 text-blue-700' :
                              leave.type === 'Emergency Leave' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {leave.type}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-6 text-gray-600">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">{leave.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{leave.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span className="font-medium">Contact: {leave.contact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {todaysLeaves.length === 0 && (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leaves Today</h3>
                  <p className="text-gray-600">All employees are present today.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      

    </div>
  );
} 