import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock data
let mentorshipPairs = [
  {
    id: '1',
    mentor: { id: '1', name: 'Sarah Chen' },
    mentee: { id: '2', name: 'John Doe' },
    status: 'active' as const,
    startDate: '2023-10-01',
    goals: ['Learn React', 'Improve debugging skills'],
    meetings: [],
    feedback: []
  }
];

// GET /api/mentorship/pairs
router.get('/pairs', (req, res) => {
  res.json(mentorshipPairs);
});

// POST /api/mentorship/pairs
router.post('/pairs', (req, res) => {
  const { mentorId, menteeId, goals } = req.body;
  
  const newPair = {
    id: uuidv4(),
    mentor: { id: mentorId, name: 'Mentor Name' },
    mentee: { id: menteeId, name: 'Mentee Name' },
    status: 'active' as const,
    startDate: new Date().toISOString().split('T')[0],
    goals: goals || [],
    meetings: [],
    feedback: []
  };

  mentorshipPairs.push(newPair);
  res.status(201).json(newPair);
});

export default router; 