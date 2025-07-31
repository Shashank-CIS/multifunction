import { useState, useEffect } from 'react';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Search,
  User,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  Mail,
  Settings
} from 'lucide-react';

interface ReportData {
  id: string;
  engineerId: string;
  engineerName: string;
  employeeId: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dateRange: {
    start: string;
    end: string;
  };
  generatedDate: string;
  status: 'completed' | 'pending' | 'failed';
  size: string;
  metrics: {
    ticketsResolved: number;
    incidentsHandled: number;
    tasksCompleted: number;
    hoursWorked: number;
    averageResolutionTime: number;
    customerSatisfactionRating: number;
  };
}

const Reports: React.FC = () => {
  const { user, isManager } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  });
  const [showFilters, setShowFilters] = useState(false);
  const [downloadingReports, setDownloadingReports] = useState<Set<string>>(new Set());
  const [selectedEngineers, setSelectedEngineers] = useState<string[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    engineerIds: [] as string[],
    reportType: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'quarterly',
    dateRange: {
      start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD')
    },
    includeMetrics: {
      tickets: true,
      incidents: true,
      tasks: true,
      hours: true,
      resolution: true,
      satisfaction: true
    },
    format: 'csv' as 'csv' | 'pdf',
    sendEmail: false,
    emailRecipients: ''
  });

  // Mock engineers data
  const mockEngineers = [
    { id: 'eng-001', name: 'Alex Johnson', employeeId: 'CTS300012' },
    { id: 'eng-002', name: 'Sarah Wilson', employeeId: 'CTS300045' },
    { id: 'eng-003', name: 'Mike Chen', employeeId: 'CTS300078' },
    { id: 'eng-004', name: 'Lisa Rodriguez', employeeId: 'CTS300091' },
    { id: 'eng-005', name: 'David Kim', employeeId: 'CTS300134' },
  ];

  // Generate mock reports
  const generateMockReports = (): ReportData[] => {
    const reportTypes: ('daily' | 'weekly' | 'monthly' | 'quarterly')[] = ['daily', 'weekly', 'monthly', 'quarterly'];
    const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'pending', 'failed'];
    const reports: ReportData[] = [];

    mockEngineers.forEach((engineer, engineerIndex) => {
      reportTypes.forEach((type, typeIndex) => {
        for (let i = 0; i < 3; i++) {
          const daysAgo = engineerIndex * 10 + typeIndex * 3 + i;
          const generatedDate = moment().subtract(daysAgo, 'days');
          
          let startDate, endDate;
          switch (type) {
            case 'daily':
              startDate = endDate = generatedDate;
              break;
            case 'weekly':
              startDate = generatedDate.clone().startOf('week');
              endDate = generatedDate.clone().endOf('week');
              break;
            case 'monthly':
              startDate = generatedDate.clone().startOf('month');
              endDate = generatedDate.clone().endOf('month');
              break;
            case 'quarterly':
              startDate = generatedDate.clone().startOf('quarter');
              endDate = generatedDate.clone().endOf('quarter');
              break;
          }

          reports.push({
            id: `report-${engineer.id}-${type}-${i}`,
            engineerId: engineer.id,
            engineerName: engineer.name,
            employeeId: engineer.employeeId,

            reportType: type,
            dateRange: {
              start: startDate.format('YYYY-MM-DD'),
              end: endDate.format('YYYY-MM-DD')
            },
            generatedDate: generatedDate.format('YYYY-MM-DD'),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            size: `${Math.floor(Math.random() * 500 + 100)}KB`,
            metrics: {
              ticketsResolved: Math.floor(Math.random() * 50 + 10),
              incidentsHandled: Math.floor(Math.random() * 20 + 1),
              tasksCompleted: Math.floor(Math.random() * 100 + 20),
              hoursWorked: Math.floor(Math.random() * 40 + 30),
              averageResolutionTime: Math.floor(Math.random() * 5 + 1),
              customerSatisfactionRating: Math.floor(Math.random() * 2 + 3)
            }
          });
        }
      });
    });

    return reports.sort((a, b) => moment(b.generatedDate).valueOf() - moment(a.generatedDate).valueOf());
  };

  useEffect(() => {
    const allReports = generateMockReports();
    
    // Role-based filtering
    if (isManager) {
      setReports(allReports);
    } else {
      // Engineers can only see their own reports
      const userReports = allReports.filter(report => 
        report.employeeId === user?.engineerId || report.engineerId === user?.id
      );
      setReports(userReports);
    }
  }, [isManager, user]);

  useEffect(() => {
    let filtered = reports;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Report type filter
    if (selectedReportType) {
      filtered = filtered.filter(report => report.reportType === selectedReportType);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    // Date range filter
    filtered = filtered.filter(report => {
      const reportDate = moment(report.generatedDate);
      return reportDate.isBetween(selectedDateRange.start, selectedDateRange.end, 'day', '[]');
    });

    setFilteredReports(filtered);
  }, [reports, searchTerm, selectedReportType, selectedStatus, selectedDateRange]);

  const handleDownloadReport = async (report: ReportData) => {
    // Check if this report is already being downloaded
    if (downloadingReports.has(report.id)) {
      return;
    }

    // Add report to downloading set
    setDownloadingReports(prev => new Set([...prev, report.id]));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create Excel/CSV content
      const csvContent = [
        // Header row
        ['Report Type', 'Engineer Name', 'Employee ID', 'Period Start', 'Period End', 'Generated Date'],
        [report.reportType.toUpperCase(), report.engineerName, report.employeeId, 
         moment(report.dateRange.start).format('MMM DD, YYYY'), 
         moment(report.dateRange.end).format('MMM DD, YYYY'),
         moment(report.generatedDate).format('MMM DD, YYYY')],
        [],
        ['PERFORMANCE METRICS'],
        ['Metric', 'Value'],
        ['Tickets Resolved', report.metrics.ticketsResolved],
        ['Incidents Handled', report.metrics.incidentsHandled],
        ['Tasks Completed', report.metrics.tasksCompleted],
        ['Hours Worked', report.metrics.hoursWorked],
        ['Average Resolution Time (hours)', report.metrics.averageResolutionTime],
        ['Customer Satisfaction Rating', `${report.metrics.customerSatisfactionRating}/5`],
        [],
        ['Generated by CIS Portal', moment().format('MMM DD, YYYY HH:mm:ss')]
      ].map(row => row.join(',')).join('\n');

      // Create Excel-compatible CSV file
      const blob = new Blob(['\uFEFF' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.engineerName.replace(/\s+/g, '_')}_${report.reportType}_report_${report.generatedDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      alert('Excel report downloaded successfully!');
    } catch (error) {
      alert('Failed to download report. Please try again.');
    } finally {
      // Remove report from downloading set
      setDownloadingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(report.id);
        return newSet;
      });
    }
  };

  const handleGenerateNewReport = () => {
    setShowGenerateModal(true);
  };

  const handleCloseGenerateModal = () => {
    setShowGenerateModal(false);
    setGenerateForm({
      engineerIds: [],
      reportType: 'weekly',
      dateRange: {
        start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD')
      },
      includeMetrics: {
        tickets: true,
        incidents: true,
        tasks: true,
        hours: true,
        resolution: true,
        satisfaction: true
      },
      format: 'csv',
      sendEmail: false,
      emailRecipients: ''
    });
  };

  const handleGenerateReport = async () => {
    if (generateForm.engineerIds.length === 0) {
      alert('Please select at least one engineer.');
      return;
    }

    setIsGeneratingReport(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate new reports for selected engineers
      const newReports: ReportData[] = generateForm.engineerIds.map(engineerId => {
        const engineer = mockEngineers.find(e => e.id === engineerId);
        if (!engineer) return null;

        const newReport: ReportData = {
          id: `report-${engineerId}-${generateForm.reportType}-${Date.now()}`,
          engineerId: engineer.id,
          engineerName: engineer.name,
          employeeId: engineer.employeeId,
          reportType: generateForm.reportType,
          dateRange: {
            start: generateForm.dateRange.start,
            end: generateForm.dateRange.end
          },
          generatedDate: moment().format('YYYY-MM-DD'),
          status: 'completed',
          size: `${Math.floor(Math.random() * 300 + 150)}KB`,
          metrics: {
            ticketsResolved: Math.floor(Math.random() * 50 + 10),
            incidentsHandled: Math.floor(Math.random() * 20 + 1),
            tasksCompleted: Math.floor(Math.random() * 100 + 20),
            hoursWorked: Math.floor(Math.random() * 40 + 30),
            averageResolutionTime: Math.floor(Math.random() * 5 + 1),
            customerSatisfactionRating: Math.floor(Math.random() * 2 + 3)
          }
        };

        return newReport;
      }).filter(Boolean) as ReportData[];

      // Add new reports to the beginning of the reports list
      setReports(prev => [...newReports, ...prev]);

      // If email option is selected, simulate sending
      if (generateForm.sendEmail && generateForm.emailRecipients) {
        // Simulate email sending
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Reports generated and emailed to: ${generateForm.emailRecipients}`);
      } else {
        alert(`${newReports.length} report(s) generated successfully!`);
      }

      handleCloseGenerateModal();
    } catch (error) {
      alert('Failed to generate reports. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleEngineersSelection = (engineerId: string, selected: boolean) => {
    setGenerateForm(prev => ({
      ...prev,
      engineerIds: selected 
        ? [...prev.engineerIds, engineerId]
        : prev.engineerIds.filter(id => id !== engineerId)
    }));
  };

  const handleSelectAllEngineers = () => {
    const allSelected = generateForm.engineerIds.length === mockEngineers.length;
    setGenerateForm(prev => ({
      ...prev,
      engineerIds: allSelected ? [] : mockEngineers.map(e => e.id)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports Dashboard</h1>
            <p className="text-blue-100">
              {isManager 
                ? 'Generate and download performance reports for all engineers' 
                : 'View and download your performance reports'
              }
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg p-4">
              <FileText className="w-8 h-8" />
            </div>
            {isManager && (
              <button
                onClick={handleGenerateNewReport}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Generate New Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Reports</h3>
              <p className="text-2xl font-semibold text-gray-900">{filteredReports.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredReports.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredReports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Engineers</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {isManager ? mockEngineers.length : 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filter Reports</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Filter className="w-4 h-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              type="date"
              value={selectedDateRange.start}
              onChange={(e) => setSelectedDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={selectedDateRange.end}
                  onChange={(e) => setSelectedDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
          <p className="text-gray-600 mt-1">
            {isManager 
              ? `Showing ${filteredReports.length} reports across all engineers`
              : `Showing ${filteredReports.length} of your reports`
            }
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engineer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{report.engineerName}</div>
                        <div className="text-sm text-gray-500">{report.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {report.reportType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {moment(report.dateRange.start).format('MMM DD')} - {moment(report.dateRange.end).format('MMM DD, YYYY')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {moment(report.generatedDate).format('MMM DD, YYYY')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1 capitalize">{report.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                                             {report.status === 'completed' && (
                         <button
                           onClick={() => handleDownloadReport(report)}
                           disabled={downloadingReports.has(report.id)}
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 disabled:opacity-50"
                         >
                           <Download className="w-4 h-4" />
                           <span>{downloadingReports.has(report.id) ? 'Downloading...' : 'Download'}</span>
                         </button>
                       )}
                      <button className="text-gray-600 hover:text-gray-700 flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              {isManager 
                ? 'No reports match your current filter criteria.' 
                : 'You don\'t have any reports yet. Reports will appear here once generated.'
              }
            </p>
                     </div>
         )}
       </div>

       {/* Generate New Report Modal */}
       {showGenerateModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-gray-900">Generate New Report</h2>
               <button
                 onClick={handleCloseGenerateModal}
                 className="text-gray-400 hover:text-gray-600 text-xl"
               >
                 <X className="w-6 h-6" />
               </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Left Column - Configuration */}
               <div className="space-y-6">
                 {/* Report Type */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
                   <div className="grid grid-cols-2 gap-3">
                     {[
                       { value: 'daily', label: 'Daily Report', desc: 'Single day performance' },
                       { value: 'weekly', label: 'Weekly Report', desc: '7-day summary' },
                       { value: 'monthly', label: 'Monthly Report', desc: '30-day analysis' },
                       { value: 'quarterly', label: 'Quarterly Report', desc: '3-month overview' }
                     ].map((type) => (
                       <label key={type.value} className="relative">
                                                   <input
                            type="radio"
                            name="reportType"
                            value={type.value}
                            checked={generateForm.reportType === type.value}
                            onChange={(e) => {
                              const reportType = e.target.value as 'daily' | 'weekly' | 'monthly' | 'quarterly';
                              let newDateRange = { ...generateForm.dateRange };
                              
                              // Auto-adjust date range based on report type
                              switch (reportType) {
                                case 'daily':
                                  newDateRange = {
                                    start: moment().format('YYYY-MM-DD'),
                                    end: moment().format('YYYY-MM-DD')
                                  };
                                  break;
                                case 'weekly':
                                  newDateRange = {
                                    start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                                    end: moment().format('YYYY-MM-DD')
                                  };
                                  break;
                                case 'monthly':
                                  newDateRange = {
                                    start: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                                    end: moment().format('YYYY-MM-DD')
                                  };
                                  break;
                                case 'quarterly':
                                  newDateRange = {
                                    start: moment().subtract(90, 'days').format('YYYY-MM-DD'),
                                    end: moment().format('YYYY-MM-DD')
                                  };
                                  break;
                              }
                              
                              setGenerateForm(prev => ({ 
                                ...prev, 
                                reportType,
                                dateRange: newDateRange
                              }));
                            }}
                            className="sr-only"
                          />
                         <div className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                           generateForm.reportType === type.value
                             ? 'border-blue-500 bg-blue-50'
                             : 'border-gray-200 hover:border-gray-300'
                         }`}>
                           <div className="font-medium text-sm">{type.label}</div>
                           <div className="text-xs text-gray-500">{type.desc}</div>
                         </div>
                       </label>
                     ))}
                   </div>
                 </div>

                 {/* Date Range */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                       <input
                         type="date"
                         value={generateForm.dateRange.start}
                         onChange={(e) => setGenerateForm(prev => ({
                           ...prev,
                           dateRange: { ...prev.dateRange, start: e.target.value }
                         }))}
                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-xs text-gray-500 mb-1">End Date</label>
                       <input
                         type="date"
                         value={generateForm.dateRange.end}
                         onChange={(e) => setGenerateForm(prev => ({
                           ...prev,
                           dateRange: { ...prev.dateRange, end: e.target.value }
                         }))}
                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Include Metrics */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-3">Include Metrics</label>
                   <div className="space-y-2">
                     {[
                       { key: 'tickets', label: 'Tickets Resolved' },
                       { key: 'incidents', label: 'Incidents Handled' },
                       { key: 'tasks', label: 'Tasks Completed' },
                       { key: 'hours', label: 'Hours Worked' },
                       { key: 'resolution', label: 'Average Resolution Time' },
                       { key: 'satisfaction', label: 'Customer Satisfaction' }
                     ].map((metric) => (
                       <label key={metric.key} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={generateForm.includeMetrics[metric.key as keyof typeof generateForm.includeMetrics]}
                           onChange={(e) => setGenerateForm(prev => ({
                             ...prev,
                             includeMetrics: {
                               ...prev.includeMetrics,
                               [metric.key]: e.target.checked
                             }
                           }))}
                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                         />
                         <span className="ml-2 text-sm text-gray-700">{metric.label}</span>
                       </label>
                     ))}
                   </div>
                 </div>

                 {/* Email Options */}
                 <div>
                   <label className="flex items-center mb-3">
                     <input
                       type="checkbox"
                       checked={generateForm.sendEmail}
                       onChange={(e) => setGenerateForm(prev => ({ 
                         ...prev, 
                         sendEmail: e.target.checked 
                       }))}
                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                     />
                     <span className="ml-2 text-sm font-medium text-gray-700">Email reports after generation</span>
                   </label>
                   {generateForm.sendEmail && (
                     <input
                       type="email"
                       placeholder="Enter email addresses (comma-separated)"
                       value={generateForm.emailRecipients}
                       onChange={(e) => setGenerateForm(prev => ({ 
                         ...prev, 
                         emailRecipients: e.target.value 
                       }))}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                   )}
                 </div>
               </div>

               {/* Right Column - Engineer Selection */}
               <div>
                 <div className="flex items-center justify-between mb-3">
                   <label className="block text-sm font-medium text-gray-700">Select Engineers</label>
                   <button
                     onClick={handleSelectAllEngineers}
                     className="text-sm text-blue-600 hover:text-blue-700"
                   >
                     {generateForm.engineerIds.length === mockEngineers.length ? 'Deselect All' : 'Select All'}
                   </button>
                 </div>
                 
                 <div className="border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                   <div className="space-y-3">
                     {mockEngineers.map((engineer) => (
                       <label key={engineer.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                         <input
                           type="checkbox"
                           checked={generateForm.engineerIds.includes(engineer.id)}
                           onChange={(e) => handleEngineersSelection(engineer.id, e.target.checked)}
                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                         />
                         <div className="ml-3 flex items-center">
                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                             <User className="w-4 h-4 text-blue-600" />
                           </div>
                           <div className="ml-3">
                             <div className="text-sm font-medium text-gray-900">{engineer.name}</div>
                             <div className="text-xs font-medium text-indigo-600">{engineer.designation}</div>
                           </div>
                         </div>
                       </label>
                     ))}
                   </div>
                 </div>

                 <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                   <div className="text-sm text-blue-800">
                     <strong>{generateForm.engineerIds.length}</strong> engineer(s) selected
                   </div>
                 </div>
               </div>
             </div>

             {/* Action Buttons */}
             <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
               <button
                 onClick={handleCloseGenerateModal}
                 disabled={isGeneratingReport}
                 className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
               >
                 Cancel
               </button>
               <button
                 onClick={handleGenerateReport}
                 disabled={isGeneratingReport || generateForm.engineerIds.length === 0}
                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
               >
                 {isGeneratingReport ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     <span>Generating...</span>
                   </>
                 ) : (
                   <>
                     <FileText className="w-4 h-4" />
                     <span>Generate Reports</span>
                   </>
                 )}
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default Reports; 