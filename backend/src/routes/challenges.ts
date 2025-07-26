import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock data
let challenges = [
  {
    id: '1',
    title: 'API Best Practices Quiz',
    description: 'Test your knowledge of REST API best practices',
    type: 'quiz' as const,
    difficulty: 'medium' as const,
    points: 50,
    startDate: '2023-11-01T00:00:00Z',
    endDate: '2023-11-30T23:59:59Z',
    participants: ['1', '2', '3'],
    completions: [],
    isActive: true,
    questions: [
      {
        id: '1',
        question: 'What HTTP status code should be returned for successful creation?',
        options: ['200', '201', '202', '204'],
        correctAnswer: 1,
        explanation: '201 Created indicates successful resource creation'
      }
    ]
  }
];

let leaderboard = {
  id: '1',
  name: 'Weekly Challenge Leaderboard',
  period: 'weekly' as const,
  entries: [
    { rank: 1, user: { id: '1', name: 'Sarah Chen' }, score: 150, change: 0 },
    { rank: 2, user: { id: '2', name: 'John Doe' }, score: 125, change: 1 }
  ],
  lastUpdated: new Date().toISOString()
};

// GET /api/challenges
router.get('/', (req, res) => {
  res.json(challenges);
});

// GET /api/challenges/leaderboard
router.get('/leaderboard', (req, res) => {
  res.json(leaderboard);
});

// POST /api/challenges/:id/complete
router.post('/:id/complete', (req, res) => {
  const { answers, timeSpent } = req.body;
  const challenge = challenges.find(c => c.id === req.params.id);
  
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  // Calculate score
  let correctAnswers = 0;
  if (challenge.questions) {
    answers.forEach((answer: number, index: number) => {
      if (challenge.questions![index]?.correctAnswer === answer) {
        correctAnswers++;
      }
    });
  }

  const score = Math.round((correctAnswers / (challenge.questions?.length || 1)) * challenge.points);

  const completion = {
    userId: 'current-user',
    completedAt: new Date().toISOString(),
    score,
    timeSpent: timeSpent || 0
  };

  challenge.completions.push(completion);
  res.json({ score, correctAnswers, totalQuestions: challenge.questions?.length || 0 });
});

export default router; 