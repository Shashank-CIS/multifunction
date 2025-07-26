import express from 'express';

const router = express.Router();

// Mock user data
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@cognizant.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'support' as const,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    interests: ['Frontend Development', 'Cloud Computing', 'DevOps'],
    department: 'Engineering',
    joinDate: '2023-01-15',
    points: 1250,
    badges: [],
    isOnline: true
  }
];

// GET /api/users/me - Get current user
router.get('/me', (req, res) => {
  // In real app, get user from authentication token
  res.json(users[0]);
});

// GET /api/users - Get all users
router.get('/', (req, res) => {
  res.json(users);
});

export default router; 