import express from 'express';
import { TeamsService, EngineerStatus } from '../services/teamsService.js';

const router = express.Router();
const teamsService = new TeamsService();

// Store access tokens temporarily (in production, use proper session/token management)
const userTokens = new Map<string, string>();

// Mock engineer data for demo
const mockEngineers = [
  { id: 'engineer1@cognizant.com', email: 'engineer1@cognizant.com', name: 'John Doe' },
  { id: 'engineer2@cognizant.com', email: 'engineer2@cognizant.com', name: 'Jane Smith' },
  { id: 'engineer3@cognizant.com', email: 'engineer3@cognizant.com', name: 'Mike Johnson' },
  { id: 'engineer4@cognizant.com', email: 'engineer4@cognizant.com', name: 'Sarah Wilson' },
  { id: 'engineer5@cognizant.com', email: 'engineer5@cognizant.com', name: 'David Brown' }
];

// GET /api/teams/auth/url - Get Microsoft Graph authentication URL
router.get('/auth/url', (req, res) => {
  try {
    const authUrl = teamsService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ error: 'Failed to get authentication URL' });
  }
});

// GET /api/teams/auth/callback - Handle OAuth callback
router.get('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const accessToken = await teamsService.getAccessTokenFromCode(code as string);
    
    // Store token (in production, use proper session management)
    const userId = state as string || 'default-user';
    userTokens.set(userId, accessToken);

    // Redirect to frontend with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?teams_auth=success`);
  } catch (error) {
    console.error('Error in auth callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?teams_auth=error`);
  }
});

// POST /api/teams/auth/token - Store access token from frontend
router.post('/auth/token', (req, res) => {
  try {
    const { accessToken, userId } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    const userKey = userId || 'default-user';
    userTokens.set(userKey, accessToken);
    
    res.json({ message: 'Token stored successfully' });
  } catch (error) {
    console.error('Error storing token:', error);
    res.status(500).json({ error: 'Failed to store token' });
  }
});

// GET /api/teams/presence/me - Get current user's presence
router.get('/presence/me', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'default-user';
    const accessToken = userTokens.get(userId);
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token found. Please authenticate with Microsoft Teams first.' });
    }

    const presence = await teamsService.getUserPresence(accessToken);
    const displayStatus = teamsService.mapTeamsStatusToDisplayStatus(presence);
    
    res.json({
      presence,
      displayStatus,
      isOnline: displayStatus !== 'offline'
    });
  } catch (error) {
    console.error('Error getting user presence:', error);
    res.status(500).json({ error: 'Failed to get user presence' });
  }
});

// GET /api/teams/presence/user/:id - Get specific user's presence
router.get('/presence/user/:id', async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.query.currentUserId as string || 'default-user';
    const accessToken = userTokens.get(currentUserId);
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token found. Please authenticate with Microsoft Teams first.' });
    }

    const presence = await teamsService.getUserPresence(accessToken, targetUserId);
    const displayStatus = teamsService.mapTeamsStatusToDisplayStatus(presence);
    
    res.json({
      userId: targetUserId,
      presence,
      displayStatus,
      isOnline: displayStatus !== 'offline'
    });
  } catch (error) {
    console.error('Error getting user presence:', error);
    res.status(500).json({ error: 'Failed to get user presence' });
  }
});

// GET /api/teams/presence/team - Get team members' presence
router.get('/presence/team', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'default-user';
    const accessToken = userTokens.get(userId);
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token found. Please authenticate with Microsoft Teams first.' });
    }

    const engineersStatus = await teamsService.getTeamEngineersStatus(accessToken, mockEngineers);
    
    res.json({
      engineers: engineersStatus,
      totalCount: engineersStatus.length,
      onlineCount: engineersStatus.filter(eng => eng.isOnline).length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting team presence:', error);
    res.status(500).json({ error: 'Failed to get team presence' });
  }
});

// POST /api/teams/presence/bulk - Get multiple users' presence
router.post('/presence/bulk', async (req, res) => {
  try {
    const { userIds, currentUserId } = req.body;
    const accessToken = userTokens.get(currentUserId || 'default-user');
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token found. Please authenticate with Microsoft Teams first.' });
    }

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'userIds array is required' });
    }

    const engineers = userIds.map(id => ({
      id,
      email: id,
      name: `User ${id.split('@')[0]}`
    }));

    const engineersStatus = await teamsService.getTeamEngineersStatus(accessToken, engineers);
    
    res.json({
      engineers: engineersStatus,
      totalCount: engineersStatus.length,
      onlineCount: engineersStatus.filter(eng => eng.isOnline).length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting bulk presence:', error);
    res.status(500).json({ error: 'Failed to get bulk presence' });
  }
});

// GET /api/teams/status - Get Teams integration status
router.get('/status', (req, res) => {
  const userId = req.query.userId as string || 'default-user';
  const hasToken = userTokens.has(userId);
  
  res.json({
    isConfigured: !!(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
    isAuthenticated: hasToken,
    supportedStatuses: [
      'available',
      'away', 
      'busy',
      'do-not-disturb',
      'out-of-office',
      'offline'
    ]
  });
});

// DELETE /api/teams/auth/logout - Clear stored token
router.delete('/auth/logout', (req, res) => {
  try {
    const userId = req.query.userId as string || 'default-user';
    userTokens.delete(userId);
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export default router; 