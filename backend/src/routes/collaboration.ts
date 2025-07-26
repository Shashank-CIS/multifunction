import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock data
let announcements = [
  {
    id: '1',
    title: 'System Maintenance Tonight',
    content: 'We will be performing system maintenance tonight from 2 AM to 4 AM EST. Please plan accordingly.',
    author: 'IT Admin',
    createdAt: '2023-11-01T10:00:00Z',
    priority: 'high' as const,
    isPinned: true,
    tags: ['maintenance', 'system'],
    views: 45
  }
];

let quickLinks = [
  {
    id: '1',
    title: 'Internal Wiki',
    url: 'https://wiki.company.com',
    description: 'Company internal documentation',
    category: 'Documentation',
    icon: 'book',
    isExternal: true
  }
];

// GET /api/collaboration/announcements
router.get('/announcements', (req, res) => {
  res.json(announcements);
});

// POST /api/collaboration/announcements
router.post('/announcements', (req, res) => {
  const { title, content, priority, tags } = req.body;
  
  const newAnnouncement = {
    id: uuidv4(),
    title,
    content,
    author: 'Current User',
    createdAt: new Date().toISOString(),
    priority: priority || 'medium',
    isPinned: false,
    tags: tags || [],
    views: 0
  };

  announcements.push(newAnnouncement);
  res.status(201).json(newAnnouncement);
});

// GET /api/collaboration/quick-links
router.get('/quick-links', (req, res) => {
  res.json(quickLinks);
});

export default router; 