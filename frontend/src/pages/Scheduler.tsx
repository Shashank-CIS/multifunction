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
  Search
} from 'lucide-react';
import { Shift, Task } from '../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Mock data
const mockShifts: Shift[] = [
  {
    id: '1',
    title: 'Morning Support Shift',
    start: new Date(2023, 11, 1, 8, 0),
    end: new Date(2023, 11, 1, 16, 0),
    assignee: 'John Doe',
    type: 'shift',
    status: 'scheduled',
    description: 'Handle morning support tickets and customer inquiries'
  },
  {
    id: '2',
    title: 'Team Standup',
    start: new Date(2023, 11, 1, 14, 0),
    end: new Date(2023, 11, 1, 15, 0),
    assignee: 'All Team',
    type: 'meeting',
    status: 'scheduled',
    description: 'Daily team standup meeting'
  },
  {
    id: '3',
    title: 'Evening Support Coverage',
    start: new Date(2023, 11, 2, 16, 0),
    end: new Date(2023, 11, 3, 0, 0),
    assignee: 'Sarah Chen',
    type: 'shift',
    status: 'in-progress',
    description: 'Evening shift coverage for international support'
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
    dueDate: '2023-12-05T23:59:59Z',
    createdAt: '2023-11-01T10:00:00Z',
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
    dueDate: '2023-12-02T17:00:00Z',
    createdAt: '2023-11-01T14:30:00Z',
    estimatedHours: 6,
    category: 'Infrastructure'
  },
  {
    id: '3',
    title: 'Code review for authentication module',
    description: 'Review security implementation for new authentication system',
    assignee: 'John Doe',
    priority: 'high',
    status: 'todo',
    dueDate: '2023-12-01T17:00:00Z',
    createdAt: '2023-11-01T16:00:00Z',
    estimatedHours: 2,
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

export default function Scheduler() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Shift | null>(null);
  const [showTaskView, setShowTaskView] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');

  // Convert shifts to calendar events
  const calendarEvents = useMemo(() => {
    return shifts.map(shift => ({
      id: shift.id,
      title: shift.title,
      start: shift.start,
      end: shift.end,
      resource: shift,
      allDay: false
    }));
  }, [shifts]);

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

  // Custom event component
  const EventComponent = ({ event }: { event: Event }) => {
    const shift = (event as any).resource as Shift;
    return (
      <div className="p-1">
        <div className="font-medium text-xs">{event.title}</div>
        <div className="text-xs opacity-75">{shift.assignee}</div>
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

  // Custom event style getter
  const eventStyleGetter = (event: Event) => {
    const shift = (event as any).resource as Shift;
    let backgroundColor = '#3b82f6';
    
    switch (shift.type) {
      case 'shift':
        backgroundColor = shift.status === 'in-progress' ? '#10b981' : '#3b82f6';
        break;
      case 'meeting':
        backgroundColor = '#8b5cf6';
        break;
      case 'training':
        backgroundColor = '#f59e0b';
        break;
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
          <p className="text-gray-600">Manage shifts, meetings, and team schedules</p>
        </div>
        <div className="flex items-center space-x-3">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <h3 className="text-sm font-medium text-gray-500">Active Shifts</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {shifts.filter(s => s.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(shifts.map(s => s.assignee)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Tasks</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => t.status === 'todo').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Team Calendar</h2>
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

      {/* Upcoming Events */}
      <div className="mt-6 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {shifts
            .filter(shift => moment(shift.start).isAfter(moment()))
            .slice(0, 5)
            .map(shift => (
              <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    shift.type === 'shift' ? 'bg-blue-500' : 
                    shift.type === 'meeting' ? 'bg-purple-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{shift.title}</h4>
                    <p className="text-sm text-gray-500">
                      {moment(shift.start).format('MMM D, h:mm A')} - {moment(shift.end).format('h:mm A')}
                    </p>
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