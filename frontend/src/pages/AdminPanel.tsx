import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  Search,
  Filter,
  Building,
  Calendar,
  FileText,
  Target,
  Shield,
  Database,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Briefcase,
  UserPlus,
  Save,
  X,
  Eye
} from 'lucide-react';
import { Engineer, Team, Department, Location, Project, ShiftType, ShiftAssignment } from '@/types';

// Mock data for admin operations
const mockDashboardStats = {
  totalEngineers: 3247,
  totalTeams: 24,
  totalProjects: 156,
  activeShifts: 234,
  pendingRequests: 12,
  systemUptime: '99.8%'
};

const mockRecentActivities = [
  { id: '1', action: 'Engineer Added', details: 'Rajesh Kumar joined Network Team', timestamp: '2 minutes ago', type: 'success' },
  { id: '2', action: 'Shift Updated', details: 'Morning shift extended for Infrastructure team', timestamp: '15 minutes ago', type: 'info' },
  { id: '3', action: 'Project Created', details: 'New project "Cloud Migration Phase 2" created', timestamp: '1 hour ago', type: 'success' },
  { id: '4', action: 'Team Modified', details: 'Desktop Support team capacity increased', timestamp: '2 hours ago', type: 'warning' },
  { id: '5', action: 'Bulk Import', details: '45 engineers imported from CSV', timestamp: '1 day ago', type: 'info' }
];

export default function AdminPanel() {
  const { user, isManager } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'engineers' | 'teams' | 'projects' | 'shifts' | 'bulk-ops'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Access control - only managers can access admin panel
  if (!isManager) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700">
            You don't have permission to access the Admin Panel. This area is restricted to managers only.
          </p>
          <p className="text-sm text-red-600 mt-2">
            Current Designation: {user?.role || 'Unknown'} | Required Designation: Manager or Sr. Manager
          </p>
        </div>
      </div>
    );
  }

  // Sample data for each section
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [shifts, setShifts] = useState<ShiftAssignment[]>([]);

  useEffect(() => {
    // Initialize with sample data
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Sample teams
    const sampleTeams: Team[] = [
      {
        id: 'team-1',
        name: 'Network Infrastructure',
        code: 'NET',
        description: 'Network security and infrastructure management',
        color: '#3B82F6',
        department: {} as Department,
        teamLeadId: 'eng-001',
        memberIds: ['eng-001', 'eng-002', 'eng-003'],
        createdAt: '2023-01-15',
        maxCapacity: 25
      },
      {
        id: 'team-2',
        name: 'Cloud Operations',
        code: 'CLOUD',
        description: 'Cloud infrastructure and DevOps',
        color: '#10B981',
        department: {} as Department,
        teamLeadId: 'eng-004',
        memberIds: ['eng-004', 'eng-005'],
        createdAt: '2023-02-01',
        maxCapacity: 20
      },
      {
        id: 'team-3',
        name: 'Project Dedicated',
        code: 'PD',
        description: 'Engineers dedicated to specific client projects',
        color: '#7C3AED',
        department: {} as Department,
        teamLeadId: 'eng-007',
        memberIds: ['eng-007', 'eng-008', 'eng-009'],
        createdAt: '2023-03-01',
        maxCapacity: 75
      }
    ];

    // Sample projects
    const sampleProjects: Project[] = [
      {
        id: 'proj-1',
        name: 'Digital Transformation Initiative',
        code: 'DTI-2024',
        description: 'Company-wide digital transformation project',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        teamId: 'team-1',
        assignedEngineerIds: ['eng-001', 'eng-002'],
        priority: 'high',
        budget: 2500000,
        client: 'Internal'
      },
      {
        id: 'proj-2',
        name: 'Cloud Migration Phase 2',
        code: 'CMP2-2024',
        description: 'Migration of legacy systems to cloud infrastructure',
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2024-08-31',
        teamId: 'team-2',
        assignedEngineerIds: ['eng-004', 'eng-005'],
        priority: 'critical',
        budget: 1800000,
        client: 'External'
      }
    ];

    setTeams(sampleTeams);
    setProjects(sampleProjects);
  };

  const handleAdd = (type: string) => {
    setModalType('add');
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalType('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = (item: any) => {
    setModalType('delete');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleBulkUpload = (type: string) => {
    // Simulate CSV upload
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Bulk ${type} upload completed successfully!`);
    }, 2000);
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }: {
    id: string;
    label: string;
    icon: any;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white/70 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-2xl">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                ⚙️ Admin Control Panel
              </h1>
              <p className="text-purple-100">Complete system administration and management dashboard</p>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{mockDashboardStats.totalEngineers.toLocaleString()}</div>
                <div className="text-sm text-purple-200">Engineers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{mockDashboardStats.activeShifts}</div>
                <div className="text-sm text-purple-200">Active Shifts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{mockDashboardStats.systemUptime}</div>
                <div className="text-sm text-purple-200">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 mb-6">
          <div className="flex flex-wrap gap-2">
            <TabButton
              id="overview"
              label="Overview"
              icon={BarChart3}
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <TabButton
              id="engineers"
              label="Engineers"
              icon={Users}
              isActive={activeTab === 'engineers'}
              onClick={() => setActiveTab('engineers')}
            />
            <TabButton
              id="teams"
              label="Teams"
              icon={Building}
              isActive={activeTab === 'teams'}
              onClick={() => setActiveTab('teams')}
            />
            <TabButton
              id="projects"
              label="Projects"
              icon={Briefcase}
              isActive={activeTab === 'projects'}
              onClick={() => setActiveTab('projects')}
            />
            <TabButton
              id="shifts"
              label="Shifts"
              icon={Calendar}
              isActive={activeTab === 'shifts'}
              onClick={() => setActiveTab('shifts')}
            />
            <TabButton
              id="bulk-ops"
              label="Bulk Operations"
              icon={Database}
              isActive={activeTab === 'bulk-ops'}
              onClick={() => setActiveTab('bulk-ops')}
            />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <Users className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{mockDashboardStats.totalEngineers.toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Engineers</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <Building className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{mockDashboardStats.totalTeams}</div>
                <div className="text-sm opacity-90">Teams</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <Briefcase className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{mockDashboardStats.totalProjects}</div>
                <div className="text-sm opacity-90">Projects</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                <Calendar className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{mockDashboardStats.activeShifts}</div>
                <div className="text-sm opacity-90">Active Shifts</div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
                <AlertCircle className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{mockDashboardStats.pendingRequests}</div>
                <div className="text-sm opacity-90">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white">
                <Zap className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{mockDashboardStats.systemUptime}</div>
                <div className="text-sm opacity-90">Uptime</div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-600" />
                Recent Activities
              </h3>
              <div className="space-y-3">
                {mockRecentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' :
                        activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.details}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{activity.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            {/* Teams Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Team Management</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleAdd('team')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team</span>
                </button>
                <button
                  onClick={() => handleBulkUpload('teams')}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Bulk Import</span>
                </button>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: team.color }}
                      ></div>
                      <h3 className="font-bold text-lg">{team.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(team)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(team)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Code:</span>
                      <span className="ml-2 font-medium">{team.code}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Description:</span>
                      <p className="text-sm mt-1">{team.description}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Capacity:</span>
                      <span className="ml-2 font-medium">{team.memberIds.length} / {team.maxCapacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(team.memberIds.length / team.maxCapacity) * 100}%`,
                          backgroundColor: team.color 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Projects Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Project Management</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleAdd('project')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.code}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            project.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {teams.find(t => t.id === project.teamId)?.name || 'Unassigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>{new Date(project.startDate).toLocaleDateString()}</div>
                            {project.endDate && (
                              <div className="text-gray-500">to {new Date(project.endDate).toLocaleDateString()}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(project)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bulk-ops' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bulk Operations</h2>
            
            {/* Bulk Operations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CSV Upload */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center mb-4">
                  <Upload className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-bold">CSV Upload</h3>
                </div>
                <p className="text-gray-600 mb-4">Upload engineers, teams, or shifts via CSV files</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleBulkUpload('engineers')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Upload Engineers</span>
                  </button>
                  <button 
                    onClick={() => handleBulkUpload('teams')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <Building className="w-4 h-4" />
                    <span>Upload Teams</span>
                  </button>
                  <button 
                    onClick={() => handleBulkUpload('shifts')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Upload Shifts</span>
                  </button>
                </div>
              </div>

              {/* Drag & Drop Assignment */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-bold">Drag & Drop</h3>
                </div>
                <p className="text-gray-600 mb-4">Visual shift assignment interface</p>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                  <Calendar className="w-4 h-4" />
                  <span>Open Shift Board</span>
                </button>
              </div>

              {/* Data Export */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center mb-4">
                  <Download className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-bold">Data Export</h3>
                </div>
                <p className="text-gray-600 mb-4">Export data for reporting and analysis</p>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    📊 Engineers Report
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    📈 Shift Analytics
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    📋 Team Performance
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions History */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-bold mb-4">Recent Bulk Operations</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">45 Engineers Imported</div>
                      <div className="text-sm text-gray-500">engineers_batch_2024.csv</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Weekly Shifts Assigned</div>
                      <div className="text-sm text-gray-500">234 shift assignments created</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit/Delete operations */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {modalType === 'add' ? 'Add' : modalType === 'edit' ? 'Edit' : 'Delete'} Item
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {modalType === 'delete' ? (
              <div className="space-y-4">
                <p className="text-gray-600">Are you sure you want to delete this item? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      // Handle delete logic
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Form for {modalType === 'add' ? 'adding' : 'editing'} item would go here.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      // Handle save logic
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing bulk operation...</p>
          </div>
        </div>
      )}
    </div>
  );
} 