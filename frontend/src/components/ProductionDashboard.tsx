import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  User,
  Briefcase,
  Clock,
  CheckSquare,
  Award,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  FileText,
  Star
} from 'lucide-react';
import { DailyProductionEntry, AppreciationUpload, ProductionFilters, ProductionSummary } from '../types';

interface ProductionDashboardProps {
  entries: DailyProductionEntry[];
  appreciations: AppreciationUpload[];
  onEditEntry: (entry: DailyProductionEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onViewAppreciation: (appreciation: AppreciationUpload) => void;
  isAdmin?: boolean;
  currentUserId?: string;
}

const ProductionDashboard: React.FC<ProductionDashboardProps> = ({
  entries,
  appreciations,
  onEditEntry,
  onDeleteEntry,
  onViewAppreciation,
  isAdmin = false,
  currentUserId = "2171826"
}) => {
  const [duration, setDuration] = useState<'this-week' | 'this-month' | 'this-quarter' | 'this-year' | 'last-week' | 'last-month' | 'last-quarter' | 'last-year' | 'custom'>('this-month');
  const [customDateRange, setCustomDateRange] = useState({
    start: '2025-06-29',
    end: '2025-07-29'
  });
  
  const [filters, setFilters] = useState<ProductionFilters>({
    dateRange: {
      start: '2025-06-29', // Last 30 days from July 29, 2025
      end: '2025-07-29'
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'workDuration' | 'tasksCompleted'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  // Calculate date range based on duration
  const getDateRangeFromDuration = () => {
    if (duration === 'custom') {
      return customDateRange;
    }

    const endDate = new Date('2025-07-29');
    const startDate = new Date('2025-07-29');
    
    switch (duration) {
      case 'this-week': {
        const dayOfWeek = endDate.getDay();
        startDate.setDate(endDate.getDate() - dayOfWeek);
        break;
      }
      case 'this-month':
        startDate.setDate(1);
        break;
      case 'last-week': {
        const dayOfWeek = endDate.getDay();
        startDate.setDate(endDate.getDate() - dayOfWeek - 7);
        const lastWeekEnd = new Date(endDate);
        lastWeekEnd.setDate(endDate.getDate() - dayOfWeek - 1);
        break;
      }
      case 'last-month': {
        const lastMonth = new Date(endDate);
        lastMonth.setMonth(endDate.getMonth() - 1);
        startDate.setMonth(lastMonth.getMonth(), 1);
        break;
      }
      case 'this-quarter': {
        const currentQuarter = Math.floor(endDate.getMonth() / 3);
        startDate.setMonth(currentQuarter * 3, 1);
        break;
      }
      case 'this-year':
        startDate.setFullYear(endDate.getFullYear(), 0, 1);
        break;
      case 'last-quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'last-year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  // Update filters when duration changes
  React.useEffect(() => {
    const dateRange = getDateRangeFromDuration();
    setFilters(prev => ({
      ...prev,
      dateRange
    }));
  }, [duration, customDateRange]);
  const [activeTab, setActiveTab] = useState<'entries' | 'appreciations'>('entries');
  const [showFilters, setShowFilters] = useState(false);


  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      const matchesSearch = 
        entry.engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tasksCompleted.some(task => task.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDateRange = 
        (!filters.dateRange?.start || entry.date >= filters.dateRange.start) &&
        (!filters.dateRange?.end || entry.date <= filters.dateRange.end);

      const matchesEngineer = !filters.engineerId || entry.engineerId === filters.engineerId;
      const matchesProject = !filters.projectName || entry.projectName.toLowerCase().includes(filters.projectName.toLowerCase());
      const matchesStatus = true;

      // For non-admin users, only show their own entries
      const hasAccess = isAdmin || entry.engineerId === currentUserId;

      return matchesSearch && matchesDateRange && matchesEngineer && matchesProject && matchesStatus && hasAccess;
    });

    // Sort entries
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortField) {
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'workDuration':
          aVal = a.workDuration === 'full-day' ? 10 : 5;
          bVal = b.workDuration === 'full-day' ? 10 : 5;
          break;
        case 'tasksCompleted':
          aVal = a.tasksCompleted.length;
          bVal = b.tasksCompleted.length;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [entries, searchTerm, filters, sortField, sortDirection, isAdmin, currentUserId]);

  // Filter appreciations
  const filteredAppreciations = useMemo(() => {
    return appreciations.filter(appreciation => {
      const matchesSearch = 
        appreciation.engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appreciation.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appreciation.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateRange = 
        (!filters.dateRange?.start || appreciation.uploadedAt >= filters.dateRange.start) &&
        (!filters.dateRange?.end || appreciation.uploadedAt <= filters.dateRange.end);

      const matchesType = !filters.appreciationType || appreciation.appreciationType === filters.appreciationType;

      // For non-admin users, only show their own appreciations or public ones
      const hasAccess = isAdmin || appreciation.engineerId === currentUserId || appreciation.isPublic;

      return matchesSearch && matchesDateRange && matchesType && hasAccess;
    });
  }, [appreciations, searchTerm, filters, isAdmin, currentUserId]);

  // Calculate summary statistics
  const summary: ProductionSummary = useMemo(() => {
    const totalHours = filteredEntries.reduce((sum, entry) => {
      return sum + (entry.workDuration === 'full-day' ? 10 : 5);
    }, 0);
    const totalTasks = filteredEntries.reduce((sum, entry) => sum + entry.tasksCompleted.length, 0);
    const totalTickets = filteredEntries.reduce((sum, entry) => sum + (entry.ticketsResolved || 0), 0);
    const totalAppreciations = filteredAppreciations.length;
    const workingDays = filteredEntries.length;
    const averageHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;

    // Top projects by hours
    const projectHours = filteredEntries.reduce((acc, entry) => {
      const hours = entry.workDuration === 'full-day' ? 10 : 5;
      acc[entry.projectName] = (acc[entry.projectName] || 0) + hours;
      return acc;
    }, {} as Record<string, number>);

    const topProjects = Object.entries(projectHours)
      .map(([projectName, totalHours]) => ({
        projectName,
        totalHours,
        totalTasks: filteredEntries
          .filter(e => e.projectName === projectName)
          .reduce((sum, e) => sum + e.tasksCompleted.length, 0),
        engineersAssigned: new Set(filteredEntries
          .filter(e => e.projectName === projectName)
          .map(e => e.engineerId)).size,
        completionRate: 95 // Mock data - would be calculated based on actual completion metrics
      }))
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 5);

    // Top performers
    const engineerStats = filteredEntries.reduce((acc, entry) => {
      const key = entry.engineerId;
      if (!acc[key]) {
        acc[key] = {
          engineerId: entry.engineerId,
          engineerName: entry.engineerName,
          totalHours: 0,
          totalTasks: 0,
          appreciationCount: 0,
          averageTasksPerDay: 0,
          efficiency: 0
        };
      }
      const hours = entry.workDuration === 'full-day' ? 10 : 5;
      acc[key].totalHours += hours;
      acc[key].totalTasks += entry.tasksCompleted.length;
      return acc;
    }, {} as Record<string, any>);

    // Add appreciation counts
    filteredAppreciations.forEach(appreciation => {
      if (engineerStats[appreciation.engineerId]) {
        engineerStats[appreciation.engineerId].appreciationCount++;
      }
    });

    const topPerformers = Object.values(engineerStats)
      .map((stats: any) => {
        const workingDays = filteredEntries.filter(e => e.engineerId === stats.engineerId).length;
        return {
          ...stats,
          averageTasksPerDay: workingDays > 0 ? stats.totalTasks / workingDays : 0,
          efficiency: stats.totalHours > 0 ? (stats.totalTasks / stats.totalHours) * 10 : 0 // Tasks per hour * 10
        };
      })
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 5);

    return {
      totalHours,
      totalTasks,
      totalTickets,
      totalAppreciations,
      averageHoursPerDay,
      topProjects,
      topPerformers,
      periodStart: filters.dateRange?.start || '',
      periodEnd: filters.dateRange?.end || ''
    };
  }, [filteredEntries, filteredAppreciations, filters.dateRange]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getAppreciationTypeColor = (type: string) => {
    const colors = {
      'client_feedback': 'text-green-600',
      'team_recognition': 'text-blue-600',
      'management_appreciation': 'text-purple-600',
      'other': 'text-gray-600'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Hours</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{summary.totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{summary.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Appreciations</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{summary.totalAppreciations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tickets Resolved</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{summary.totalTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Tickets/Day</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{(summary.totalTickets / (filteredEntries.length || 1)).toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

            {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('entries')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'entries'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Production Entries
              </button>
              <button
                onClick={() => setActiveTab('appreciations')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'appreciations'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Appreciations
              </button>
            </div>

            <button 
              onClick={() => {
                const generateFilteredCSV = () => {
                  let csvContent = '';
                  
                  // Report Header
                  csvContent += `Production Dashboard Export (Filtered)\n`;
                  csvContent += `Generated:,${new Date('2025-07-29').toLocaleDateString()}\n`;
                  csvContent += `\n`;

                  // Applied Filters
                  csvContent += `APPLIED FILTERS\n`;
                  if (filters.engineerId) csvContent += `Engineer ID:,${filters.engineerId}\n`;
                  if (filters.projectName) csvContent += `Project:,${filters.projectName}\n`;
                  if (filters.dateRange?.start) csvContent += `Date From:,${filters.dateRange.start}\n`;
                  if (filters.dateRange?.end) csvContent += `Date To:,${filters.dateRange.end}\n`;
                  csvContent += `\n`;

                  // Summary Statistics
                  csvContent += `SUMMARY\n`;
                  csvContent += `Total Entries:,${filteredEntries.length}\n`;
                  csvContent += `Total Hours:,${summary.totalHours}\n`;
                  csvContent += `Total Tickets:,${summary.totalTickets}\n`;
                  csvContent += `Total Tasks:,${summary.totalTasks}\n`;
                  csvContent += `Average Tickets/Day:,${(summary.totalTickets / (filteredEntries.length || 1)).toFixed(2)}\n`;
                  csvContent += `\n`;

                  // Production Entries
                  csvContent += `PRODUCTION ENTRIES\n`;
                  csvContent += `Date,Engineer Name,Project Name,Work Duration,Hours,Tasks Completed,Tickets Resolved,Blockers,Created At\n`;
                  
                  filteredEntries.forEach(entry => {
                    const tasks = entry.tasksCompleted.join('; ');
                    const hours = entry.workDuration === 'full-day' ? 10 : 5;
                    const blockers = (entry.blockers || '').replace(/,/g, ';');
                    
                    csvContent += `${entry.date},"${entry.engineerName}","${entry.projectName}",${entry.workDuration},${hours},"${tasks}",${entry.ticketsResolved},"${blockers}",${new Date(entry.createdAt).toLocaleDateString()}\n`;
                  });

                  return csvContent;
                };

                const csvContent = generateFilteredCSV();
                const BOM = '\uFEFF';
                const dataBlob = new Blob([BOM + csvContent], { 
                  type: 'text/csv;charset=utf-8;' 
                });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `filtered-production-data-${new Date('2025-07-29').toISOString().split('T')[0]}.csv`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Period Selection */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Period Selection 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({duration === 'custom' 
                    ? `${customDateRange.start} to ${customDateRange.end}`
                    : getDurationDisplayName(duration)})
                </span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Period
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
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Engineer ID</label>
                <input
                  type="text"
                  placeholder="Filter by engineer ID..."
                  value={filters.engineerId || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, engineerId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project</label>
                <input
                  type="text"
                  placeholder="Filter by project..."
                  value={filters.projectName || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, projectName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Tables */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {activeTab === 'entries' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('date')}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                    >
                      <span>Date</span>
                      {sortField === 'date' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Engineer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('workDuration')}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                    >
                      <span>Duration</span>
                      {sortField === 'workDuration' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('tasksCompleted')}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                    >
                      <span>Tasks</span>
                      {sortField === 'tasksCompleted' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-white">{entry.engineerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.workDuration === 'full-day' ? 'Full Day (10h)' : 'Half Day (5h)'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.tasksCompleted.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.ticketsResolved || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {(isAdmin || entry.engineerId === currentUserId) && (
                          <>
                            <button
                              onClick={() => onEditEntry(entry)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteEntry(entry.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No production entries found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppreciations.map((appreciation) => (
                <div key={appreciation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {appreciation.fileType === 'pdf' ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <Star className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className={`text-sm font-medium ${getAppreciationTypeColor(appreciation.appreciationType)}`}>
                        {appreciation.appreciationType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => onViewAppreciation(appreciation)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{appreciation.projectName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{appreciation.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{appreciation.engineerName}</span>
                    <span>{new Date(appreciation.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredAppreciations.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No appreciations found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionDashboard; 