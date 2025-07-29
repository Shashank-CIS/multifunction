import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload as UploadIcon, 
  User, 
  Settings,
  BarChart3,
  FileText,
  Award,
  Users,
  Calendar,
  Download,
  Shield
} from 'lucide-react';
import DailyProductionForm from '../components/DailyProductionForm';
import AppreciationUpload from '../components/AppreciationUpload';
import ProductionDashboard from '../components/ProductionDashboard';
import EngineerProfileView from '../components/EngineerProfileView';
import { 
  DailyProductionEntry, 
  AppreciationUpload as AppreciationUploadType, 
  Engineer,
  AdminProductionAccess
} from '../types';
import { useAuth } from '../contexts/AuthContext';

// Mock engineer data
const mockEngineer: Engineer = {
  id: 'ENG001',
  employeeId: 'CIS001',
  name: 'John Doe',
  email: 'john.doe@cognizant.com',
  phone: '+91-9876543210',
  team: {
    id: 'noc',
    name: 'Network Operations Center',
    code: 'NOC',
    description: 'Network monitoring and incident response',
    color: '#3B82F6',
    department: {} as any,
    memberIds: [],
    createdAt: '',
    maxCapacity: 0
  },
  department: {
    id: 'network-security',
    name: 'Network & Security Operations',
    code: 'NETSEC',
    description: 'Network infrastructure and security management',
    color: '#3B82F6',
    teamIds: ['noc'],
    headCount: 38,
    location: {} as any
  },
  location: {
    id: 'chennai',
    name: 'Chennai Delivery Center',
    address: 'Sholinganallur, Chennai',
    city: 'Chennai',
    country: 'India',
    timezone: 'Asia/Kolkata'
  },
  skills: ['Network Monitoring', 'Incident Response', 'Linux Administration'],
      shiftHistory: [],
      productionMetrics: {
    ticketsResolved: 0,
    incidentsHandled: 0,
    tasksCompleted: 0,
    systemUptimeHours: 0,
    projectsDelivered: 0,
    monthlyTarget: 0,
    lastUpdated: '',
    averageResolutionTime: 0,
    customerSatisfactionRating: 0
  },
  isTeamLead: false,
  isOnCall: false,
  status: 'active',
  joinDate: '2023-01-15',
  certifications: ['ITIL Foundation', 'CompTIA Network+'],
  experience: 3
};

const ProductionManagement: React.FC = () => {
  const { user, isManager } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'admin'>('dashboard');

  // Create current engineer object from authenticated user
  const currentEngineer: Engineer = {
    id: user?.engineerId || user?.id || 'unknown',
    employeeId: user?.engineerId || 'CIS001',
    name: user?.name || 'Unknown User',
    email: user?.email || 'unknown@cognizant.com',
    phone: '+91-9876543210',
    team: {
      id: 'production',
      name: 'Production Team',
      code: 'PROD',
      description: 'Production support and maintenance',
      color: '#3B82F6',
      department: {} as any,
      memberIds: [],
      createdAt: '',
      maxCapacity: 0
    },
    department: {
      id: 'cis',
      name: 'CIS Operations',
      description: 'Customer Infrastructure Services',
      code: 'CIS',
      color: '#6366F1',
      teamIds: ['production'],
      headCount: 50,
      location: {
        id: 'bangalore',
        name: 'Bangalore',
        address: 'Electronic City, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        timezone: 'Asia/Kolkata'
      }
    },
    location: {
      id: 'bangalore',
      name: 'Bangalore',
      address: 'Electronic City, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      timezone: 'Asia/Kolkata'
    },
    shiftHistory: [],
    productionMetrics: {
      ticketsResolved: 0,
      incidentsHandled: 0,
      tasksCompleted: 0,
      systemUptimeHours: 0,
      projectsDelivered: 0,
      monthlyTarget: 50,
      lastUpdated: '2025-07-29T00:00:00Z',
      averageResolutionTime: 2.5,
      customerSatisfactionRating: 4.5
    },
    isTeamLead: isManager,
    isOnCall: false,
    status: 'active',
    joinDate: '2022-01-15',
    skills: ['Network Operations', 'Incident Response', 'System Administration'],
    certifications: ['ITIL Foundation', 'CompTIA Network+'],
    experience: 3
  };
  const [showProductionForm, setShowProductionForm] = useState(false);
  const [showAppreciationUpload, setShowAppreciationUpload] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyProductionEntry | null>(null);
  const [duration, setDuration] = useState<'this-week' | 'this-month' | 'this-quarter' | 'this-year' | 'last-week' | 'last-month' | 'last-quarter' | 'last-year' | 'custom'>('this-month');
  const [customDateRange, setCustomDateRange] = useState({
    start: '2025-06-29',
    end: '2025-07-29'
  });
  
  // Mock data - in a real app, this would come from API calls
  const [productionEntries, setProductionEntries] = useState<DailyProductionEntry[]>([
    {
      id: '1',
      engineerId: '2171826',
      engineerName: 'Shashankagowda S',
      date: '2025-07-29',
      projectName: 'Network Infrastructure Upgrade',
      tasksCompleted: [
        'Configured new firewall rules for production environment',
        'Updated network documentation for VLAN changes',
        'Completed security audit for client servers'
      ],
      workDuration: 'full-day',
      ticketsResolved: 12,
      blockers: 'Waiting for client approval on new security policies',
      createdAt: '2025-07-29T09:00:00Z',
      updatedAt: '2025-07-29T09:00:00Z'
    },
    {
      id: '2',
      engineerId: '2268205',
      engineerName: 'Pradip Shinde',
      date: '2025-07-28',
      projectName: 'Database Migration',
      tasksCompleted: [
        'Migrated customer data to new database cluster',
        'Validated data integrity post-migration',
        'Updated application connection strings'
      ],
      workDuration: 'full-day',
      ticketsResolved: 8,
      createdAt: '2025-07-28T08:30:00Z',
      updatedAt: '2025-07-28T08:30:00Z'
    },
    {
      id: '3',
      engineerId: '2171826',
      engineerName: 'Shashankagowda S',
      date: '2025-07-26',
      projectName: 'Cloud Infrastructure Optimization',
      tasksCompleted: [
        'Optimized AWS EC2 instances for cost efficiency',
        'Implemented auto-scaling policies',
        'Updated monitoring dashboards'
      ],
      workDuration: 'full-day',
      ticketsResolved: 15,
      blockers: '',
      createdAt: '2025-07-26T08:00:00Z',
      updatedAt: '2025-07-26T08:00:00Z'
    },
    {
      id: '4',
      engineerId: '2268205',
      engineerName: 'Pradip Shinde',
      date: '2025-07-25',
      projectName: 'Security Patch Deployment',
      tasksCompleted: [
        'Applied critical security patches to production servers',
        'Validated system functionality post-patching'
      ],
      workDuration: 'half-day',
      ticketsResolved: 6,
      blockers: '',
      createdAt: '2025-07-25T13:00:00Z',
      updatedAt: '2025-07-25T13:00:00Z'
    }
  ]);

  const [appreciations, setAppreciations] = useState<AppreciationUploadType[]>([
    {
      id: '1',
      engineerId: '2171826',
      engineerName: 'Shashankagowda S',
      projectName: 'Network Infrastructure Upgrade',
      fileName: 'client_appreciation_letter.pdf',
      fileUrl: '/mock-file-url',
      fileType: 'pdf',
      fileSize: 2048576,
      description: 'Client appreciation for excellent network upgrade work with zero downtime.',
      uploadedAt: '2025-07-29T10:00:00Z',
      tags: ['client-feedback', 'network', 'zero-downtime'],
      isPublic: true,
      appreciationType: 'client_feedback'
    },
    {
      id: '2',
      engineerId: '2268205',
      engineerName: 'Pradip Shinde',
      projectName: 'Cloud Infrastructure Optimization',
      fileName: 'team_appreciation_certificate.pdf',
      fileUrl: '/mock-file-url-2',
      fileType: 'pdf',
      fileSize: 1536768,
      description: 'Team appreciation for excellent cloud optimization work that resulted in 40% cost savings.',
      uploadedAt: '2025-07-26T14:30:00Z',
      tags: ['team-recognition', 'cloud', 'cost-optimization'],
      isPublic: true,
      appreciationType: 'team_recognition'
    }
  ]);

  // Filter data based on user role - engineers see only their own data
  const getFilteredEntries = () => {
    if (isManager) {
      return productionEntries; // Managers see all entries
    }
    // Engineers see only their own entries
    return productionEntries.filter(entry => 
      entry.engineerId === (user?.engineerId || user?.id)
    );
  };

  const getFilteredAppreciations = () => {
    if (isManager) {
      return appreciations; // Managers see all appreciations
    }
    // Engineers see only their own appreciations  
    return appreciations.filter(appreciation =>
      appreciation.engineerId === (user?.engineerId || user?.id)
    );
  };

  const filteredEntries = getFilteredEntries();
  const filteredAppreciations = getFilteredAppreciations();

  const handleSubmitProduction = (entry: Omit<DailyProductionEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: DailyProductionEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date('2025-07-29').toISOString(),
      updatedAt: new Date('2025-07-29').toISOString()
    };

    if (editingEntry) {
      setProductionEntries(prev => 
        prev.map(e => e.id === editingEntry.id ? { ...newEntry, id: editingEntry.id } : e)
      );
      setEditingEntry(null);
    } else {
      setProductionEntries(prev => [newEntry, ...prev]);
    }
  };

  const handleSubmitAppreciation = (appreciation: Omit<AppreciationUploadType, 'id' | 'uploadedAt'>) => {
    const newAppreciation: AppreciationUploadType = {
      ...appreciation,
      id: Date.now().toString(),
      uploadedAt: new Date('2025-07-29').toISOString()
    };
    setAppreciations(prev => [newAppreciation, ...prev]);
  };

  const handleEditEntry = (entry: DailyProductionEntry) => {
    setEditingEntry(entry);
    setShowProductionForm(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setProductionEntries(prev => prev.filter(e => e.id !== entryId));
    }
  };

  const handleViewAppreciation = (appreciation: AppreciationUploadType) => {
    // In a real app, this would open the file in a new window or modal
    window.open(appreciation.fileUrl, '_blank');
  };

    const handleExportReport = () => {
    // Generate Excel-compatible CSV format
    const generateCSV = () => {
      const dateRange = duration === 'custom' 
        ? `${customDateRange.start} to ${customDateRange.end}`
        : getDurationDisplayName(duration);

      // Calculate summary statistics
      const totalEntries = filteredViewData.entries.length;
      const totalTickets = filteredViewData.entries.reduce((sum, entry) => sum + (entry.ticketsResolved || 0), 0);
      const totalHours = filteredViewData.entries.reduce((sum, entry) => sum + (entry.workDuration === 'full-day' ? 10 : 5), 0);
      const totalAppreciations = filteredViewData.appreciations.length;

      let csvContent = '';
      
      // Report Header
      csvContent += `Production Management Report\n`;
      csvContent += `Period:,${dateRange}\n`;
      csvContent += `Generated:,${new Date('2025-07-29').toLocaleDateString()}\n`;
      csvContent += `\n`;

      // Summary Section
      csvContent += `SUMMARY\n`;
      csvContent += `Total Entries:,${totalEntries}\n`;
      csvContent += `Total Hours:,${totalHours}\n`;
      csvContent += `Total Tickets Resolved:,${totalTickets}\n`;
      csvContent += `Total Appreciations:,${totalAppreciations}\n`;
      csvContent += `Average Tickets/Day:,${totalEntries > 0 ? (totalTickets / totalEntries).toFixed(2) : 0}\n`;
      csvContent += `\n`;

      // Production Entries Section
      csvContent += `PRODUCTION ENTRIES\n`;
      csvContent += `Date,Engineer Name,Project Name,Work Duration,Hours,Tasks Completed,Tickets Resolved,Blockers,Created At\n`;
      
      filteredViewData.entries.forEach(entry => {
        const tasks = entry.tasksCompleted.join('; ');
        const hours = entry.workDuration === 'full-day' ? 10 : 5;
        const blockers = (entry.blockers || '').replace(/,/g, ';'); // Replace commas to avoid CSV issues
        
        csvContent += `${entry.date},"${entry.engineerName}","${entry.projectName}",${entry.workDuration},${hours},"${tasks}",${entry.ticketsResolved},"${blockers}",${new Date(entry.createdAt).toLocaleDateString()}\n`;
      });

      if (filteredViewData.appreciations.length > 0) {
        csvContent += `\n`;
        csvContent += `APPRECIATIONS\n`;
        csvContent += `Date,Engineer Name,Project Name,Type,Description,File Name,Tags,Public\n`;
        
        filteredViewData.appreciations.forEach(appreciation => {
          const description = (appreciation.description || '').replace(/,/g, ';').replace(/"/g, '""');
          const tags = (appreciation.tags || []).join('; ');
          
          csvContent += `${appreciation.uploadedAt.split('T')[0]},"${appreciation.engineerName}","${appreciation.projectName}",${appreciation.appreciationType},"${description}","${appreciation.fileName}","${tags}",${appreciation.isPublic ? 'Yes' : 'No'}\n`;
        });
      }

      return csvContent;
    };

    // Create and download Excel file
    const csvContent = generateCSV();
    const BOM = '\uFEFF'; // Byte Order Mark for proper Excel UTF-8 encoding
    const dataBlob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `production-report-${duration}-${new Date('2025-07-29').toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    const totalEntries = filteredViewData.entries.length;
    const totalTickets = filteredViewData.entries.reduce((sum, entry) => sum + (entry.ticketsResolved || 0), 0);
    const totalHours = filteredViewData.entries.reduce((sum, entry) => sum + (entry.workDuration === 'full-day' ? 10 : 5), 0);
    
    alert(`Exported Excel report for ${getDurationDisplayName(duration)} with ${totalEntries} entries covering ${totalTickets} tickets and ${totalHours} hours.`);
  };

  // Get filtered data based on duration
  const getFilteredViewData = () => {
    if (duration === 'custom') {
      return {
        entries: productionEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          const startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          return entryDate >= startDate && entryDate <= endDate;
        }),
        appreciations: appreciations.filter(app => {
          const appDate = new Date(app.uploadedAt);
          const startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          return appDate >= startDate && appDate <= endDate;
        })
      };
    }

    // Calculate date range for predefined durations
    const endDate = new Date('2025-07-29');
    const startDate = new Date('2025-07-29');
    
    switch (duration) {
      case 'this-week': {
        // Start of this week (Sunday)
        const dayOfWeek = endDate.getDay();
        startDate.setDate(endDate.getDate() - dayOfWeek);
        break;
      }
      case 'this-month':
        startDate.setDate(1); // Start of this month
        break;
      case 'last-week': {
        // Last week: from Sunday to Saturday of previous week
        const dayOfWeek = endDate.getDay();
        startDate.setDate(endDate.getDate() - dayOfWeek - 7);
        const lastWeekEnd = new Date(endDate);
        lastWeekEnd.setDate(endDate.getDate() - dayOfWeek - 1);
        break;
      }
             case 'last-month': {
         // Last month: from 1st to last day of previous month
         const lastMonth = new Date(endDate);
         lastMonth.setMonth(endDate.getMonth() - 1);
         startDate.setMonth(lastMonth.getMonth(), 1);
         break;
       }
       case 'this-quarter': {
         // Start of current quarter
         const currentQuarter = Math.floor(endDate.getMonth() / 3);
         startDate.setMonth(currentQuarter * 3, 1);
         break;
       }
       case 'this-year':
         startDate.setFullYear(endDate.getFullYear(), 0, 1); // January 1st of current year
         break;
       case 'last-quarter':
         startDate.setMonth(endDate.getMonth() - 3);
         break;
       case 'last-year':
         startDate.setFullYear(endDate.getFullYear() - 1);
         break;
    }
    
    return {
      entries: productionEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      }),
      appreciations: appreciations.filter(app => {
        const appDate = new Date(app.uploadedAt);
        return appDate >= startDate && appDate <= endDate;
      })
    };
  };

  const filteredViewData = getFilteredViewData();

  // Get display name for duration
  const getDurationDisplayName = (dur: typeof duration) => {
    const displayNames = {
      'this-week': 'This Week',
      'this-month': 'This Month',
      'this-quarter': 'This Quarter',
      'this-year': 'This Year',
      'last-week': 'Last Week',
      'last-month': 'Last Month',
      'last-quarter': 'Last Quarter',
      'last-year': 'Last Year',
      'custom': 'Custom Range'
    };
    return displayNames[dur] || dur;
  };



  const renderActionButtons = () => (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setShowProductionForm(true)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Entry
      </button>
      
      <button
        onClick={() => setShowAppreciationUpload(true)}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <UploadIcon className="w-4 h-4 mr-2" />
        Upload Appreciation
      </button>

      {isManager && (
        <button
          onClick={() => setActiveView('admin')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeView === 'admin'
              ? 'bg-purple-600 text-white'
              : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
          }`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin Panel
        </button>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Production Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track daily production updates, manage appreciations, and monitor performance
          </p>
        </div>
        {renderActionButtons()}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
              { id: 'profile', name: 'My Profile', icon: User, description: 'Personal History' },
              ...(isManager ? [{ id: 'admin', name: 'Admin Panel', icon: Settings, description: 'Manage & Reports' }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as typeof activeView)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <div className="text-left">
                  <div>{tab.name}</div>
                  <div className="text-xs text-gray-400">{tab.description}</div>
            </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
                  {activeView === 'dashboard' && (
            <ProductionDashboard
              entries={filteredEntries}
              appreciations={filteredAppreciations}
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
              onViewAppreciation={handleViewAppreciation}
              isAdmin={isManager}
              currentUserId={user?.engineerId || user?.id || 'unknown'}
            />
          )}

                  {activeView === 'profile' && (
            <EngineerProfileView
              engineer={currentEngineer}
              entries={filteredEntries}
              appreciations={filteredAppreciations}
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
              onViewAppreciation={handleViewAppreciation}
            />
          )}

        {activeView === 'admin' && isManager && (
          <div className="space-y-6">
            {/* Admin Controls */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Controls</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    View & Export Duration
                  </label>
            <select 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as typeof duration)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="this-week">This Week</option>
                      <option value="this-month">This Month</option>
                      <option value="this-quarter">This Quarter</option>
                      <option value="this-year">This Year</option>
                      <option value="last-week">Last Week</option>
                      <option value="last-month">Last Month</option>
                      <option value="last-quarter">Last Quarter</option>
                      <option value="last-year">Last Year</option>
                      <option value="custom">Custom Date Range</option>
            </select>
          </div>
          
                {duration === 'custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
          <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
          </div>
                  </>
                )}

                <div className="flex items-end">
                  <button 
                    onClick={handleExportReport}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
              <Download className="w-4 h-4 mr-2" />
                    Export Report
            </button>
          </div>
        </div>
      </div>

            {/* System Overview */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Overview 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({duration === 'custom' 
                    ? `${customDateRange.start} to ${customDateRange.end}`
                    : getDurationDisplayName(duration)})
                    </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                  </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Engineers</h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">150</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Entries</h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filteredViewData.entries.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Appreciations</h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filteredViewData.appreciations.length}</p>
            </div>
          </div>
        </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets</h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {filteredViewData.entries.reduce((sum, entry) => sum + (entry.ticketsResolved || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>

                         {/* Admin Actions */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Actions</h3>
               
               {/* Additional Admin Actions */}
               <div className="mb-6">
                 <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Additional Actions</h4>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <button className="flex items-center justify-center px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Users className="w-5 h-5 mr-3 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Manage Users</div>
                    <div className="text-sm text-gray-500">User permissions & access</div>
                  </div>
                </button>

                <button className="flex items-center justify-center px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <BarChart3 className="w-5 h-5 mr-3 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Analytics</div>
                    <div className="text-sm text-gray-500">Detailed performance metrics</div>
                  </div>
                </button>
          </div>
        </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                {filteredViewData.entries.length > 0 ? (
                  filteredViewData.entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.engineerName} submitted entry for {entry.projectName}
                          </p>
                          <p className="text-sm text-gray-500">
                             {new Date(entry.createdAt).toLocaleDateString()} • {entry.workDuration === 'full-day' ? '10h' : '5h'} worked
                           </p>
                      </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No entries found for the selected time period.
                    </p>
              </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>

      {/* Modals */}
      <DailyProductionForm
        isOpen={showProductionForm}
        onClose={() => {
          setShowProductionForm(false);
          setEditingEntry(null);
        }}
        onSubmit={handleSubmitProduction}
        existingEntry={editingEntry || undefined}
        engineerName={user?.name || 'Unknown'}
        engineerId={user?.engineerId || user?.id || 'unknown'}
      />

      <AppreciationUpload
        isOpen={showAppreciationUpload}
        onClose={() => setShowAppreciationUpload(false)}
        onSubmit={handleSubmitAppreciation}
        engineerName={user?.name || 'Unknown'}
        engineerId={user?.engineerId || user?.id || 'unknown'}
      />


    </div>
  );
};

export default ProductionManagement; 