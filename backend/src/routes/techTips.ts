import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock data
let techTips = [
  {
    id: '1',
    title: 'Use React.memo for Component Optimization',
    content: 'React.memo is a higher-order component that can help optimize your React application by preventing unnecessary re-renders.',
    author: 'Sarah Chen',
    category: 'React',
    tags: ['react', 'performance', 'optimization'],
    createdAt: '2023-11-01T10:00:00Z',
    votes: 15,
    userVote: undefined,
    difficulty: 'intermediate' as const,
    estimatedReadTime: 3
  }
];

// GET /api/tech-tips
router.get('/', (req, res) => {
  res.json(techTips);
});

// GET /api/tech-tips/today
router.get('/today', (req, res) => {
  // Return a random tip for today
  const todaysTip = techTips[Math.floor(Math.random() * techTips.length)];
  res.json(todaysTip);
});

// POST /api/tech-tips
router.post('/', (req, res) => {
  const { title, content, category, tags, difficulty } = req.body;
  
  const newTip = {
    id: uuidv4(),
    title,
    content,
    author: 'Current User',
    category,
    tags: tags || [],
    createdAt: new Date().toISOString(),
    votes: 0,
    userVote: undefined,
    difficulty: difficulty || 'beginner',
    estimatedReadTime: Math.ceil(content.split(' ').length / 200)
  };

  techTips.push(newTip);
  res.status(201).json(newTip);
});

export default router; 