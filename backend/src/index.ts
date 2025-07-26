import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Import routes
import knowledgeBaseRoutes from './routes/knowledgeBase.js';
import schedulerRoutes from './routes/scheduler.js';
import collaborationRoutes from './routes/collaboration.js';
import mentorshipRoutes from './routes/mentorship.js';
import techTipsRoutes from './routes/techTips.js';
import challengesRoutes from './routes/challenges.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = createServer(app);

// Setup WebSocket server for real-time features
const wss = new WebSocketServer({ server });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/tech-tips', techTipsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/users', userRoutes);

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      // Handle different types of real-time events
      switch (data.type) {
        case 'chat_message':
          // Broadcast chat message to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_message',
                data: data.payload
              }));
            }
          });
          break;
        case 'notification':
          // Handle notifications
          wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify({
                type: 'notification',
                data: data.payload
              }));
            }
          });
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
          data: { message: 'Connected to Cognizant CIS Portal' }
  }));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket server ready for connections`);
});

export default app; 