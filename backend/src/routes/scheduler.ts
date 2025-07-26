import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock data
let shifts = [
  {
    id: '1',
    title: 'Morning Support Shift',
    start: new Date('2023-12-01T08:00:00Z'),
    end: new Date('2023-12-01T16:00:00Z'),
    assignee: 'John Doe',
    type: 'shift' as const,
    status: 'scheduled' as const,
    description: 'Handle morning support tickets and customer inquiries'
  },
  {
    id: '2', 
    title: 'Team Standup',
    start: new Date('2023-12-01T14:00:00Z'),
    end: new Date('2023-12-01T15:00:00Z'),
    assignee: 'All Team',
    type: 'meeting' as const,
    status: 'scheduled' as const,
    description: 'Daily team standup meeting'
  }
];

let tasks = [
  {
    id: '1',
    title: 'Update knowledge base articles',
    description: 'Review and update outdated knowledge base articles',
    assignee: 'Sarah Chen',
    priority: 'medium' as const,
    status: 'todo' as const,
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
    priority: 'high' as const,
    status: 'in-progress' as const,
    dueDate: '2023-12-02T17:00:00Z',
    createdAt: '2023-11-01T14:30:00Z',
    estimatedHours: 6,
    category: 'Infrastructure'
  }
];

// GET /api/scheduler/shifts - Get all shifts
router.get('/shifts', (req, res) => {
  const { start, end, assignee } = req.query;
  let filteredShifts = [...shifts];

  // Filter by date range
  if (start) {
    filteredShifts = filteredShifts.filter(shift =>
      new Date(shift.start) >= new Date(start as string)
    );
  }
  if (end) {
    filteredShifts = filteredShifts.filter(shift =>
      new Date(shift.end) <= new Date(end as string)
    );
  }

  // Filter by assignee
  if (assignee) {
    filteredShifts = filteredShifts.filter(shift =>
      shift.assignee.toLowerCase().includes((assignee as string).toLowerCase())
    );
  }

  res.json(filteredShifts);
});

// POST /api/scheduler/shifts - Create new shift
router.post('/shifts', (req, res) => {
  const { title, start, end, assignee, type, description } = req.body;

  if (!title || !start || !end || !assignee) {
    return res.status(400).json({ error: 'Title, start, end, and assignee are required' });
  }

  const newShift = {
    id: uuidv4(),
    title,
    start: new Date(start),
    end: new Date(end),
    assignee,
    type: type || 'shift',
    status: 'scheduled' as const,
    description: description || ''
  };

  shifts.push(newShift);
  res.status(201).json(newShift);
});

// PUT /api/scheduler/shifts/:id - Update shift
router.put('/shifts/:id', (req, res) => {
  const shiftIndex = shifts.findIndex(s => s.id === req.params.id);
  if (shiftIndex === -1) {
    return res.status(404).json({ error: 'Shift not found' });
  }

  const updatedShift = { ...shifts[shiftIndex], ...req.body };
  shifts[shiftIndex] = updatedShift;
  res.json(updatedShift);
});

// DELETE /api/scheduler/shifts/:id - Delete shift
router.delete('/shifts/:id', (req, res) => {
  const shiftIndex = shifts.findIndex(s => s.id === req.params.id);
  if (shiftIndex === -1) {
    return res.status(404).json({ error: 'Shift not found' });
  }

  shifts.splice(shiftIndex, 1);
  res.json({ message: 'Shift deleted successfully' });
});

// GET /api/scheduler/tasks - Get all tasks
router.get('/tasks', (req, res) => {
  const { status, priority, assignee, category } = req.query;
  let filteredTasks = [...tasks];

  // Apply filters
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  if (assignee) {
    filteredTasks = filteredTasks.filter(task =>
      task.assignee.toLowerCase().includes((assignee as string).toLowerCase())
    );
  }
  if (category) {
    filteredTasks = filteredTasks.filter(task => task.category === category);
  }

  res.json(filteredTasks);
});

// POST /api/scheduler/tasks - Create new task
router.post('/tasks', (req, res) => {
  const { title, description, assignee, priority, dueDate, estimatedHours, category } = req.body;

  if (!title || !assignee || !dueDate) {
    return res.status(400).json({ error: 'Title, assignee, and due date are required' });
  }

  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    assignee,
    priority: priority || 'medium',
    status: 'todo' as const,
    dueDate,
    createdAt: new Date().toISOString(),
    estimatedHours: estimatedHours || 1,
    category: category || 'General'
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/scheduler/tasks/:id - Update task
router.put('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask = { ...tasks[taskIndex], ...req.body };
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// DELETE /api/scheduler/tasks/:id - Delete task
router.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

export default router; 