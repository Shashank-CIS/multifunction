import { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer, View, Views, Event } from 'react-big-calendar';
import moment from 'moment';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Filter,
  List,
  Grid,
  Search,
  Users,
  Building
} from 'lucide-react';
import { Shift, Task } from '../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Mock departments and team members
const departments = [
  'Customer Intelligence & Insights',
  'Technical Support',
  'Infrastructure',
  'Development',
  'Quality Assurance',
  'Security'
];

const mockTeamMembers = [
  { id: '1', name: 'Shashankagowda S', department: 'Customer Intelligence & Insights' },
  { id: '2', name: 'Sarah Chen', department: 'Technical Support' },
  { id: '3', name: 'Mike Johnson', department: 'Infrastructure' },
  { id: '4', name: 'Jessica Williams', department: 'Development' },
  { id: '5', name: 'David Kim', department: 'Quality Assurance' },
  { id: '6', name: 'Emily Rodriguez', department: 'Security' },
  { id: '7', name: 'Alex Thompson', department: 'Technical Support' },
  { id: '8', name: 'Lisa Zhang', department: 'Customer Intelligence & Insights' },
  { id: '9', name: 'Robert Wilson', department: 'Infrastructure' },
  { id: '10', name: 'Maria Garcia', department: 'Development' }
];

// Enhanced mock shifts with 10-hour shifts and department information
const mockShifts: Shift[] = [
  // Week 1 - Morning Shifts (6 AM - 4 PM, 10 hours)
  {
    id: '1',
    title: 'Morning Support Shift - CIS',
    start: new Date(2024, 0, 15, 6, 0), // Jan 15, 2024 6:00 AM
    end: new Date(2024, 0, 15, 16, 0),  // Jan 15, 2024 4:00 PM
    assignee: 'Shashankagowda S',
    assigneeId: '1',
    department: 'Customer Intelligence & Insights',
    type: 'shift',
    status: 'scheduled',
    description: 'Handle morning customer intelligence requests and data analysis tasks'
  },
  {
    id: '2',
    title: 'Technical Support - Morning',
    start: new Date(2024, 0, 15, 6, 0),
    end: new Date(2024, 0, 15, 16, 0),
    assignee: 'Sarah Chen',
    assigneeId: '2',
    department: 'Technical Support',
    type: 'shift',
    status: 'in-progress',
    description: 'Morning technical support coverage for customer issues'
  },
  {
    id: '3',
    title: 'Infrastructure Monitoring',
    start: new Date(2024, 0, 15, 6, 0),
    end: new Date(2024, 0, 15, 16, 0),
    assignee: 'Mike Johnson',
    assigneeId: '3',
    department: 'Infrastructure',
    type: 'shift',
    status: 'scheduled',
    description: 'Monitor infrastructure health and resolve morning issues'
  },
  
  // Evening Shifts (2 PM - 12 AM, 10 hours)
  {
    id: '4',
    title: 'Evening Support Coverage',
    start: new Date(2024, 0, 15, 14, 0), // Jan 15, 2024 2:00 PM
    end: new Date(2024, 0, 16, 0, 0),   // Jan 16, 2024 12:00 AM
    assignee: 'Alex Thompson',
    assigneeId: '7',
    department: 'Technical Support',
    type: 'shift',
    status: 'scheduled',
    description: 'Evening shift coverage for international support'
  },
  {
    id: '5',
    title: 'Development Evening Shift',
    start: new Date(2024, 0, 15, 14, 0),
    end: new Date(2024, 0, 16, 0, 0),
    assignee: 'Jessica Williams',
    assigneeId: '4',
    department: 'Development',
    type: 'shift',
    status: 'scheduled',
    description: 'Development tasks and code deployment during evening hours'
  },
  
  // Week 1 - Tuesday
  {
    id: '6',
    title: 'QA Morning Shift',
    start: new Date(2024, 0, 16, 6, 0),
    end: new Date(2024, 0, 16, 16, 0),
    assignee: 'David Kim',
    assigneeId: '5',
    department: 'Quality Assurance',
    type: 'shift',
    status: 'scheduled',
    description: 'Quality assurance testing and validation activities'
  },
  {
    id: '7',
    title: 'Security Operations',
    start: new Date(2024, 0, 16, 14, 0),
    end: new Date(2024, 0, 17, 0, 0),
    assignee: 'Emily Rodriguez',
    assigneeId: '6',
    department: 'Security',
    type: 'shift',
    status: 'scheduled',
    description: 'Evening security monitoring and incident response'
  },
  
  // Week 1 - Wednesday
  {
    id: '8',
    title: 'CIS Data Analysis Shift',
    start: new Date(2024, 0, 17, 6, 0),
    end: new Date(2024, 0, 17, 16, 0),
    assignee: 'Lisa Zhang',
    assigneeId: '8',
    department: 'Customer Intelligence & Insights',
    type: 'shift',
    status: 'scheduled',
    description: 'Deep dive data analysis and customer insights generation'
  },
  {
    id: '9',
    title: 'Infrastructure Night Ops',
    start: new Date(2024, 0, 17, 14, 0),
    end: new Date(2024, 0, 18, 0, 0),
    assignee: 'Robert Wilson',
    assigneeId: '9',
    department: 'Infrastructure',
    type: 'shift',
    status: 'scheduled',
    description: 'Night infrastructure operations and maintenance'
  },
  
  // Team Meetings
  {
    id: '10',
    title: 'CIS Team Standup',
    start: new Date(2024, 0, 15, 9, 0),
    end: new Date(2024, 0, 15, 10, 0),
    assignee: 'CIS Team',
    assigneeId: 'team-cis',
    department: 'Customer Intelligence & Insights',
    type: 'meeting',
    status: 'scheduled',
    description: 'Daily CIS team standup meeting'
  },
  {
    id: '11',
    title: 'Cross-Department Sync',
    start: new Date(2024, 0, 16, 15, 0),
    end: new Date(2024, 0, 16, 16, 30),
    assignee: 'All Departments',
    assigneeId: 'team-all',
    department: 'All',
    type: 'meeting',
    status: 'scheduled',
    description: 'Weekly cross-department synchronization meeting'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Update knowledge base articles',
    description: 'Review and update outdated knowledge base articles',
    assignee: 'Sarah Chen',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-01-20T23:59:59Z',
    createdAt: '2024-01-01T10:00:00Z',
    estimatedHours: 4,
    category: 'Documentation'
  },
  {
    id: '2',
    title: 'Resolve database performance issue',
    description: 'Investigate and fix slow query performance in production database',
    assignee: 'Mike Johnson',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-01-18T17:00:00Z',
    createdAt: '2024-01-01T14:30:00Z',
    estimatedHours: 6,
    category: 'Infrastructure'
  },
  {
    id: '3',
    title: 'Security audit for customer data',
    description: 'Perform comprehensive security audit for customer intelligence data',
    assignee: 'Emily Rodriguez',
    priority: 'high',
    status: 'todo',
    dueDate: '2024-01-25T17:00:00Z',
    createdAt: '2024-01-01T16:00:00Z',
    estimatedHours: 8,
    category: 'Security'
  }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const departmentColors = {
  'Customer Intelligence & Insights': 'bg-blue-500',
  'Technical Support': 'bg-green-500',
  'Infrastructure': 'bg-purple-500',
  'Development': 'bg-yellow-500',
  'Quality Assurance': 'bg-pink-500',
  'Security': 'bg-red-500',
  'All': 'bg-gray-500'
};

export default function Scheduler() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Shift | null>(null);
  const [showTaskView, setShowTaskView] = useState(false);
  const [showDepartmentView, setShowDepartmentView] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Convert shifts to calendar events
  const calendarEvents = useMemo(() => {
    return shifts
      .filter(shift => departmentFilter === 'all' || shift.department === departmentFilter)
      .map(shift => ({
        id: shift.id,
        title: shift.title,
        start: shift.start,
        end: shift.end,
        resource: shift,
        allDay: false
      }));
  }, [shifts, departmentFilter]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = taskFilter === 'all' || task.status === taskFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, taskFilter]);

  // Group shifts by department for department view
  const shiftsByDepartment = useMemo(() => {
    const grouped = shifts.reduce((acc, shift) => {
      const dept = shift.department;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(shift);
      return acc;
    }, {} as Record<string, Shift[]>);
    
    return grouped;
  }, [shifts]);

  // Custom event component
  const EventComponent = ({ event }: { event: Event }) => {
    const shift = (event as any).resource as Shift;
    return (
      <div className="p-1">
        <div className="font-medium text-xs">{event.title}</div>
        <div className="text-xs opacity-75">{shift.assignee}</div>
        <div className="text-xs opacity-60">{shift.department}</div>
      </div>
    );
  };

  // Task card component
  const TaskCard = ({ task }: { task: Task }) => (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{task.title}</h3>
        <div className="flex items-center space-x-2">
          <span className={`badge ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`badge ${statusColors[task.status]}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3">{task.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {task.assignee}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {task.estimatedHours}h
          </span>
        </div>
        <span className="text-xs">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  // Department view component
  const DepartmentView = () => (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowDepartmentView(false)}
            className="btn btn-ghost"
          >
            ← Back to Calendar
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Shifts</h1>
            <p className="text-gray-600">View shift assignments organized by department</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Shift
        </button>
      </div>

      {/* Department Filter */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <Building className="w-5 h-5 text-gray-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input min-w-[200px]"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Departments</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.keys(shiftsByDepartment).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {mockTeamMembers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Shifts</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {shifts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(shiftsByDepartment)
          .filter(([dept]) => departmentFilter === 'all' || dept === departmentFilter)
          .map(([department, departmentShifts]) => (
            <div key={department} className="card">
              <div className="flex items-center mb-4">
                <div className={`w-4 h-4 rounded-full mr-3 ${departmentColors[department] || 'bg-gray-500'}`} />
                <h3 className="text-lg font-semibold text-gray-900">{department}</h3>
                <span className="ml-auto bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                  {departmentShifts.length} shifts
                </span>
              </div>

              <div className="space-y-3">
                {departmentShifts.map(shift => (
                  <div key={shift.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{shift.title}</h4>
                      <span className={`badge ${
                        shift.status === 'scheduled' ? 'badge-primary' :
                        shift.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                        shift.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {shift.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {shift.assignee}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {moment(shift.end).diff(moment(shift.start), 'hours')}h
                        </span>
                      </div>
                      <span>
                        {moment(shift.start).format('MMM D, h:mm A')}
                      </span>
                    </div>
                    
                    {shift.description && (
                      <p className="text-sm text-gray-500 mt-2">{shift.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {departmentShifts.length === 0 && (
                <div className="text-center py-6">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No shifts scheduled</p>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );

  // Custom event style getter
  const eventStyleGetter = (event: Event) => {
    const shift = (event as any).resource as Shift;
    let backgroundColor = departmentColors[shift.department] || '#3b82f6';
    
    if (shift.status === 'in-progress') {
      backgroundColor = '#10b981';
    } else if (shift.status === 'completed') {
      backgroundColor = '#6b7280';
    } else if (shift.status === 'cancelled') {
      backgroundColor = '#ef4444';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: shift.status === 'cancelled' ? 0.6 : 1,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Show department view
  if (showDepartmentView) {
    return <DepartmentView />;
  }

  if (showTaskView) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTaskView(false)}
              className="btn btn-ghost"
            >
              ← Back to Calendar
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
              <p className="text-gray-600">Manage and track team tasks and assignments</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value as any)}
                className="input min-w-[150px]"
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <List className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
                <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">High Priority</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scheduler</h1>
          <p className="text-gray-600">Manage 10-hour shifts, meetings, and team schedules</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDepartmentView(true)}
            className="btn btn-secondary"
          >
            <Building className="w-4 h-4 mr-2" />
            Department View
          </button>
          <button
            onClick={() => setShowTaskView(true)}
            className="btn btn-secondary"
          >
            <List className="w-4 h-4 mr-2" />
            View Tasks
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Today's Events</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {shifts.filter(s => moment(s.start).isSame(moment(), 'day')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">10-Hour Shifts</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {shifts.filter(s => moment(s.end).diff(moment(s.start), 'hours') === 10).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Departments</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.keys(shiftsByDepartment).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {mockTeamMembers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Shifts</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {shifts.filter(s => s.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Team Calendar</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="input min-w-[200px]"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView(Views.MONTH)}
                className={`px-3 py-1 text-sm rounded ${view === Views.MONTH ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Month
              </button>
              <button
                onClick={() => setView(Views.WEEK)}
                className={`px-3 py-1 text-sm rounded ${view === Views.WEEK ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Week
              </button>
              <button
                onClick={() => setView(Views.DAY)}
                className={`px-3 py-1 text-sm rounded ${view === Views.DAY ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            onSelectEvent={(event) => setSelectedEvent(event.resource)}
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent
            }}
            popup
            className="rbc-calendar"
          />
        </div>
      </div>

      {/* Upcoming 10-Hour Shifts */}
      <div className="mt-6 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming 10-Hour Shifts</h3>
        <div className="space-y-3">
          {shifts
            .filter(shift => moment(shift.start).isAfter(moment()) && moment(shift.end).diff(moment(shift.start), 'hours') === 10)
            .slice(0, 5)
            .map(shift => (
              <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${departmentColors[shift.department] || 'bg-gray-500'}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{shift.title}</h4>
                    <p className="text-sm text-gray-500">
                      {moment(shift.start).format('MMM D, h:mm A')} - {moment(shift.end).format('h:mm A')} (10 hours)
                    </p>
                    <p className="text-xs text-gray-400">{shift.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{shift.assignee}</p>
                  <span className={`badge ${
                    shift.status === 'scheduled' ? 'badge-primary' :
                    shift.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {shift.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 