import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock data - in production this would be a database
let articles = [
  {
    id: '1',
    title: 'How to Reset User Password',
    content: 'To reset a user password, follow these steps:\n1. Navigate to User Management\n2. Find the user account\n3. Click "Reset Password"\n4. Send new credentials to user email',
    summary: 'Step-by-step guide for password reset process',
    category: 'Account Management',
    tags: ['password', 'user management', 'security'],
    author: 'John Smith',
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2023-11-01T10:00:00Z',
    views: 245,
    helpful: 23,
    notHelpful: 2,
    status: 'published' as const
  },
  {
    id: '2',
    title: 'Database Connection Troubleshooting',
    content: 'Common database connection issues and solutions:\n\n1. Check connection string\n2. Verify network connectivity\n3. Check database server status\n4. Review firewall settings\n5. Validate credentials',
    summary: 'Troubleshooting guide for database connectivity issues',
    category: 'Database',
    tags: ['database', 'connectivity', 'troubleshooting'],
    author: 'Sarah Chen',
    createdAt: '2023-10-28T14:30:00Z',
    updatedAt: '2023-10-28T14:30:00Z',
    views: 178,
    helpful: 19,
    notHelpful: 1,
    status: 'published' as const
  },
  {
    id: '3',
    title: 'API Rate Limiting Best Practices',
    content: 'Best practices for implementing API rate limiting:\n\n1. Use appropriate rate limiting algorithms\n2. Provide clear error messages\n3. Include retry-after headers\n4. Implement graceful degradation\n5. Monitor and alert on rate limit violations',
    summary: 'Guidelines for implementing effective API rate limiting',
    category: 'API',
    tags: ['api', 'rate limiting', 'best practices'],
    author: 'Mike Johnson',
    createdAt: '2023-10-25T09:15:00Z',
    updatedAt: '2023-10-25T09:15:00Z',
    views: 156,
    helpful: 15,
    notHelpful: 0,
    status: 'published' as const
  }
];

// GET /api/knowledge-base - Get all articles with search and filtering
router.get('/', (req, res) => {
  const { search, category, tags, page = 1, limit = 10 } = req.query;
  let filteredArticles = [...articles];

  // Search functionality
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Category filter
  if (category) {
    filteredArticles = filteredArticles.filter(article =>
      article.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  // Tags filter
  if (tags) {
    const tagArray = (tags as string).split(',');
    filteredArticles = filteredArticles.filter(article =>
      tagArray.some(tag => article.tags.includes(tag.trim()))
    );
  }

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  res.json({
    articles: paginatedArticles,
    total: filteredArticles.length,
    page: Number(page),
    limit: Number(limit),
    hasNext: endIndex < filteredArticles.length,
    hasPrev: startIndex > 0
  });
});

// GET /api/knowledge-base/:id - Get specific article
router.get('/:id', (req, res) => {
  const article = articles.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Increment view count
  article.views++;

  res.json(article);
});

// POST /api/knowledge-base - Create new article
router.post('/', (req, res) => {
  const { title, content, summary, category, tags } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, content, and category are required' });
  }

  const newArticle = {
    id: uuidv4(),
    title,
    content,
    summary: summary || content.substring(0, 150) + '...',
    category,
    tags: tags || [],
    author: 'Current User', // In real app, get from auth
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    helpful: 0,
    notHelpful: 0,
    status: 'draft' as const
  };

  articles.push(newArticle);
  res.status(201).json(newArticle);
});

// PUT /api/knowledge-base/:id - Update article
router.put('/:id', (req, res) => {
  const articleIndex = articles.findIndex(a => a.id === req.params.id);
  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const { title, content, summary, category, tags, status } = req.body;
  const updatedArticle = {
    ...articles[articleIndex],
    ...(title && { title }),
    ...(content && { content }),
    ...(summary && { summary }),
    ...(category && { category }),
    ...(tags && { tags }),
    ...(status && { status }),
    updatedAt: new Date().toISOString()
  };

  articles[articleIndex] = updatedArticle;
  res.json(updatedArticle);
});

// POST /api/knowledge-base/:id/vote - Vote on article helpfulness
router.post('/:id/vote', (req, res) => {
  const article = articles.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const { vote } = req.body; // 'helpful' or 'not-helpful'
  
  if (vote === 'helpful') {
    article.helpful++;
  } else if (vote === 'not-helpful') {
    article.notHelpful++;
  } else {
    return res.status(400).json({ error: 'Invalid vote type' });
  }

  res.json({ helpful: article.helpful, notHelpful: article.notHelpful });
});

// GET /api/knowledge-base/search/suggestions - AI-powered search suggestions
router.get('/search/suggestions', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.json({ suggestions: [] });
  }

  // Mock AI suggestions - in production this would use actual AI/ML
  const queryStr = (query as string).toLowerCase();
  const suggestions = [
    'password reset procedure',
    'database connection issues',
    'API authentication',
    'server deployment guide',
    'troubleshooting network connectivity'
  ].filter(suggestion => suggestion.includes(queryStr));

  res.json({ suggestions });
});

export default router; 