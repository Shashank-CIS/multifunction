import { Client } from '@microsoft/microsoft-graph-client';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';
import axios from 'axios';

// Custom authentication provider for Microsoft Graph
class GraphAuthProvider implements AuthenticationProvider {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getAccessToken(): Promise<string> {
    return this.accessToken;
  }
}

// Teams presence status mapping
export interface TeamsPresence {
  id: string;
  availability: 'Available' | 'AvailableIdle' | 'Away' | 'BeRightBack' | 'Busy' | 'BusyIdle' | 'DoNotDisturb' | 'Offline' | 'PresenceUnknown';
  activity: 'Available' | 'Away' | 'BeRightBack' | 'Busy' | 'DoNotDisturb' | 'InACall' | 'InAConferenceCall' | 'Inactive' | 'InAMeeting' | 'Offline' | 'OffWork' | 'OutOfOffice' | 'PresenceUnknown' | 'Presenting' | 'UrgentInterruptionsOnly';
  statusMessage?: {
    message?: {
      content?: string;
      contentType?: string;
    };
    publishedDateTime?: string;
  };
}

export interface EngineerStatus {
  userId: string;
  email: string;
  name: string;
  teamsStatus: {
    availability: string;
    activity: string;
    statusMessage?: string;
    lastSeen?: string;
  };
  isOnline: boolean;
  displayStatus: 'available' | 'away' | 'busy' | 'do-not-disturb' | 'out-of-office' | 'offline';
}

// Check if required environment variables are present
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
const tenantId = process.env.AZURE_TENANT_ID;

if (!clientId || !clientSecret || !tenantId) {
  console.warn('⚠️  Microsoft Teams integration disabled: Missing Azure AD configuration');
  console.warn('   Please set AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, and AZURE_TENANT_ID environment variables');
  console.warn('   The application will continue to work without Teams integration');
}

export class TeamsService {
  private msalInstance: ConfidentialClientApplication | null = null;
  private graphClient: Client | null = null;
  private isConfigured: boolean = false;
  private scopes = ['https://graph.microsoft.com/Presence.Read', 'https://graph.microsoft.com/User.Read'];

  constructor() {
    // Only initialize if all required environment variables are present
    if (clientId && clientSecret && tenantId) {
      try {
        this.msalInstance = new ConfidentialClientApplication({
          auth: {
            clientId,
            clientSecret,
            authority: `https://login.microsoftonline.com/${tenantId}`
          }
        });
        this.isConfigured = true;
        console.log('✅ Microsoft Teams service initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Microsoft Teams service:', error);
        this.isConfigured = false;
      }
    } else {
      console.log('ℹ️  Microsoft Teams service not configured - running without Teams integration');
      this.isConfigured = false;
    }
  }

  // Get authentication URL for user login
  getAuthUrl(): string {
    if (!this.isConfigured) {
      console.warn('Teams service not configured. Cannot get auth URL.');
      return 'Teams integration disabled.';
    }
    const authUrlParameters = {
      scopes: this.scopes,
      redirectUri: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3001/api/teams/auth/callback'
    };

    return this.msalInstance!.getAuthCodeUrl(authUrlParameters);
  }

  // Exchange authorization code for access token
  async getAccessTokenFromCode(code: string): Promise<string> {
    if (!this.isConfigured) {
      console.warn('Teams service not configured. Cannot get access token.');
      throw new Error('Teams integration disabled.');
    }
    try {
      const tokenRequest = {
        code: code,
        scopes: this.scopes,
        redirectUri: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3001/api/teams/auth/callback'
      };

      const response = await this.msalInstance!.acquireTokenByCode(tokenRequest);
      return response.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get access token');
    }
  }

  // Get user presence from Microsoft Graph
  async getUserPresence(accessToken: string, userId?: string): Promise<TeamsPresence> {
    if (!this.isConfigured) {
      console.warn('Teams service not configured. Cannot get user presence.');
      throw new Error('Teams integration disabled.');
    }
    try {
      const authProvider = new GraphAuthProvider(accessToken);
      const graphClient = Client.initWithMiddleware({ authProvider });

      // If no userId provided, get current user's presence
      const endpoint = userId ? `/users/${userId}/presence` : '/me/presence';
      const presence = await graphClient.api(endpoint).get();

      return {
        id: presence.id,
        availability: presence.availability,
        activity: presence.activity,
        statusMessage: presence.statusMessage
      };
    } catch (error) {
      console.error('Error fetching user presence:', error);
      throw new Error('Failed to fetch user presence');
    }
  }

  // Get multiple users' presence
  async getMultipleUsersPresence(accessToken: string, userIds: string[]): Promise<TeamsPresence[]> {
    if (!this.isConfigured) {
      console.warn('Teams service not configured. Cannot get multiple users presence.');
      throw new Error('Teams integration disabled.');
    }
    try {
      const authProvider = new GraphAuthProvider(accessToken);
      const graphClient = Client.initWithMiddleware({ authProvider });

      const batchRequest = {
        requests: userIds.map((userId, index) => ({
          id: index.toString(),
          method: 'GET',
          url: `/users/${userId}/presence`
        }))
      };

      const response = await graphClient.api('/$batch').post(batchRequest);
      
      return response.responses
        .filter((resp: any) => resp.status === 200)
        .map((resp: any) => ({
          id: resp.body.id,
          availability: resp.body.availability,
          activity: resp.body.activity,
          statusMessage: resp.body.statusMessage
        }));
    } catch (error) {
      console.error('Error fetching multiple users presence:', error);
      throw new Error('Failed to fetch users presence');
    }
  }

  // Convert Teams presence to simplified status
  mapTeamsStatusToDisplayStatus(presence: TeamsPresence): EngineerStatus['displayStatus'] {
    const { availability, activity } = presence;

    // Out of office scenarios
    if (activity === 'OutOfOffice' || activity === 'OffWork') {
      return 'out-of-office';
    }

    // Do not disturb scenarios
    if (availability === 'DoNotDisturb' || activity === 'DoNotDisturb' || activity === 'UrgentInterruptionsOnly') {
      return 'do-not-disturb';
    }

    // Busy scenarios
    if (availability === 'Busy' || availability === 'BusyIdle' || 
        activity === 'Busy' || activity === 'InACall' || activity === 'InAConferenceCall' || 
        activity === 'InAMeeting' || activity === 'Presenting') {
      return 'busy';
    }

    // Away scenarios
    if (availability === 'Away' || activity === 'BeRightBack' || 
        activity === 'Away' || activity === 'BeRightBack' || activity === 'Inactive') {
      return 'away';
    }

    // Available scenarios
    if (availability === 'Available' || availability === 'AvailableIdle' || activity === 'Available') {
      return 'available';
    }

    // Default to offline for unknown states
    return 'offline';
  }

  // Get engineer status with Teams data
  async getEngineerStatus(accessToken: string, userId: string, userEmail: string, userName: string): Promise<EngineerStatus> {
    if (!this.isConfigured) {
      console.warn('Teams service not configured. Cannot get engineer status.');
      return {
        userId,
        email: userEmail,
        name: userName,
        teamsStatus: {
          availability: 'PresenceUnknown',
          activity: 'PresenceUnknown'
        },
        isOnline: false,
        displayStatus: 'offline'
      };
    }
    try {
      const presence = await this.getUserPresence(accessToken, userId);
      const displayStatus = this.mapTeamsStatusToDisplayStatus(presence);

      return {
        userId,
        email: userEmail,
        name: userName,
        teamsStatus: {
          availability: presence.availability,
          activity: presence.activity,
          statusMessage: presence.statusMessage?.message?.content,
          lastSeen: new Date().toISOString()
        },
        isOnline: displayStatus !== 'offline',
        displayStatus
      };
    } catch (error) {
      console.error(`Error getting engineer status for ${userId}:`, error);
      
      // Return offline status if Teams data unavailable
      return {
        userId,
        email: userEmail,
        name: userName,
        teamsStatus: {
          availability: 'PresenceUnknown',
          activity: 'PresenceUnknown'
        },
        isOnline: false,
        displayStatus: 'offline'
      };
    }
  }

  // Get team members status
  async getTeamEngineersStatus(accessToken: string, engineers: Array<{id: string, email: string, name: string}>): Promise<EngineerStatus[]> {
    if (!this.isConfigured) {
      console.warn('Teams service not configured. Cannot get team engineers status.');
      return engineers.map(engineer => ({
        userId: engineer.id,
        email: engineer.email,
        name: engineer.name,
        teamsStatus: {
          availability: 'PresenceUnknown',
          activity: 'PresenceUnknown'
        },
        isOnline: false,
        displayStatus: 'offline' as const
      }));
    }
    try {
      const userIds = engineers.map(eng => eng.id);
      const presences = await this.getMultipleUsersPresence(accessToken, userIds);

      return engineers.map(engineer => {
        const presence = presences.find(p => p.id === engineer.id);
        
        if (!presence) {
          return {
            userId: engineer.id,
            email: engineer.email,
            name: engineer.name,
            teamsStatus: {
              availability: 'PresenceUnknown',
              activity: 'PresenceUnknown'
            },
            isOnline: false,
            displayStatus: 'offline' as const
          };
        }

        const displayStatus = this.mapTeamsStatusToDisplayStatus(presence);

        return {
          userId: engineer.id,
          email: engineer.email,
          name: engineer.name,
          teamsStatus: {
            availability: presence.availability,
            activity: presence.activity,
            statusMessage: presence.statusMessage?.message?.content,
            lastSeen: new Date().toISOString()
          },
          isOnline: displayStatus !== 'offline',
          displayStatus
        };
      });
    } catch (error) {
      console.error('Error getting team engineers status:', error);
      
      // Return offline status for all engineers if Teams data unavailable
      return engineers.map(engineer => ({
        userId: engineer.id,
        email: engineer.email,
        name: engineer.name,
        teamsStatus: {
          availability: 'PresenceUnknown',
          activity: 'PresenceUnknown'
        },
        isOnline: false,
        displayStatus: 'offline' as const
      }));
    }
  }
} 