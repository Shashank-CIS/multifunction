import React, { useState, useMemo } from 'react';
import {
  User,
  Calendar,
  Clock,
  CheckSquare,
  Award,
  TrendingUp,
  Edit,
  Trash2,
  Star,
  Briefcase,
  Target,
  BarChart3,
  Trophy,
  FileText,
  Eye
} from 'lucide-react';
import { DailyProductionEntry, AppreciationUpload, Engineer } from '../types';

interface EngineerProfileViewProps {
  engineer: Engineer;
  entries: DailyProductionEntry[];
  appreciations: AppreciationUpload[];
  onEditEntry: (entry: DailyProductionEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onViewAppreciation: (appreciation: AppreciationUpload) => void;
}

const EngineerProfileView: React.FC<EngineerProfileViewProps> = ({
  engineer,
  entries,
  appreciations,
  onEditEntry,
  onDeleteEntry,
  onViewAppreciation
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'entries' | 'appreciations'>('overview');

  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  }, [selectedPeriod]);

  // Filter data by date range
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => 
      entry.engineerId === engineer.id &&
      entry.date >= dateRange.start && 
      entry.date <= dateRange.end
    );
  }, [entries, engineer.id, dateRange]);

  const filteredAppreciations = useMemo(() => {
    return appreciations.filter(appreciation => 
      appreciation.engineerId === engineer.id &&
      appreciation.uploadedAt >= dateRange.start && 
      appreciation.uploadedAt <= dateRange.end
    );
  }, [appreciations, engineer.id, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalHours = filteredEntries.reduce((sum, entry) => {
      return sum + (entry.workDuration === 'full-day' ? 10 : 5);
    }, 0);
    const totalTasks = filteredEntries.reduce((sum, entry) => sum + entry.tasksCompleted.length, 0);
    const totalTickets = filteredEntries.reduce((sum, entry) => sum + (entry.ticketsResolved || 0), 0);
    const workingDays = filteredEntries.length;
    const averageHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;
    const averageTasksPerDay = workingDays > 0 ? totalTasks / workingDays : 0;
    const averageTicketsPerDay = workingDays > 0 ? totalTickets / workingDays : 0;

    // Project breakdown
    const projectStats = filteredEntries.reduce((acc, entry) => {
      if (!acc[entry.projectName]) {
        acc[entry.projectName] = { hours: 0, tasks: 0, days: 0 };
      }
      const hours = entry.workDuration === 'full-day' ? 10 : 5;
      acc[entry.projectName].hours += hours;
      acc[entry.projectName].tasks += entry.tasksCompleted.length;
      acc[entry.projectName].days += 1;
      return acc;
    }, {} as Record<string, { hours: number; tasks: number; days: number }>);

    const topProjects = Object.entries(projectStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 3);

    // Entry counts by date
    const entryCounts = filteredEntries.length;

    // Appreciation types
    const appreciationTypes = filteredAppreciations.reduce((acc, appreciation) => {
      acc[appreciation.appreciationType] = (acc[appreciation.appreciationType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalHours,
      totalTasks,
      totalTickets,
      totalAppreciations: filteredAppreciations.length,
      workingDays,
      averageHoursPerDay,
      averageTasksPerDay,
      averageTicketsPerDay,
      topProjects,
      appreciationTypes,
      productivity: totalHours > 0 ? (totalTasks / totalHours) * 10 : 0 // Tasks per hour * 10
    };
  }, [filteredEntries, filteredAppreciations]);

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'text-gray-600',
      'submitted': 'text-blue-600',
      'approved': 'text-green-600',
      'rejected': 'text-red-600'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const formatAppreciationType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-2xl">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{engineer.name}</h1>
            <div className="flex items-center space-x-6 text-blue-100">
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                {engineer.team.name}
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                {engineer.experience} years experience
              </span>
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                ID: {engineer.employeeId}
              </span>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Project: {(() => {
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
                    p.empId === engineer.employeeId || 
                    p.name.toLowerCase().includes(engineer.name.toLowerCase()) ||
                    engineer.name.toLowerCase().includes(p.name.toLowerCase())
                  );
                  return assignment ? assignment.project : 'Standard Operations';
                })()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100 mb-1">Period</div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white backdrop-blur-sm"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalHours.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.averageHoursPerDay.toFixed(1)} avg/day</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.averageTasksPerDay.toFixed(1)} avg/day</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Appreciations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAppreciations}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.workingDays} working days</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tickets Resolved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTickets}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.averageTicketsPerDay.toFixed(1)} avg/day</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <CheckSquare className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Tickets/Day</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageTicketsPerDay.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">daily average</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'entries', name: 'Production Entries', icon: FileText },
              { id: 'appreciations', name: 'Appreciations', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Projects */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Projects</h3>
                <div className="space-y-3">
                  {stats.topProjects.map((project, index) => (
                    <div key={project.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{project.name}</p>
                          <p className="text-sm text-gray-500">{project.days} days worked</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{project.hours.toFixed(1)}h</p>
                        <p className="text-sm text-gray-500">{project.tasks} tasks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appreciation Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appreciation Types</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.appreciationTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {formatAppreciationType(type)}
                        </span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'entries' && (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{entry.projectName}</h4>
                      </div>
                      
                                             <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                         <span className="flex items-center">
                           <Calendar className="w-4 h-4 mr-1" />
                           {new Date(entry.date).toLocaleDateString()}
                         </span>
                         <span className="flex items-center">
                           <Clock className="w-4 h-4 mr-1" />
                           {entry.workDuration === 'full-day' ? '10h' : '5h'}
                         </span>
                         <span className="flex items-center">
                           <CheckSquare className="w-4 h-4 mr-1" />
                           {entry.tasksCompleted.length} tasks
                         </span>
                         <span className="flex items-center">
                           <Award className="w-4 h-4 mr-1" />
                           {entry.ticketsResolved || 0} tickets
                         </span>
                       </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tasks Completed:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {entry.tasksCompleted.map((task, index) => (
                            <li key={index}>{task}</li>
                          ))}
                        </ul>
                      </div>

                      {entry.blockers && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blockers:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{entry.blockers}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => onEditEntry(entry)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit entry"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEntries.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No production entries found for this period</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appreciations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAppreciations.map((appreciation) => (
                <div key={appreciation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {appreciation.fileType === 'pdf' ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <Star className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium text-blue-600">
                        {formatAppreciationType(appreciation.appreciationType)}
                      </span>
                    </div>
                    <button
                      onClick={() => onViewAppreciation(appreciation)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="View appreciation"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{appreciation.projectName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{appreciation.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{appreciation.fileName}</span>
                    <span>{new Date(appreciation.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}

              {filteredAppreciations.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No appreciations found for this period</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineerProfileView; 