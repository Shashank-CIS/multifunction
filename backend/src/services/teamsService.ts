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

export class TeamsService {
  private msalInstance: ConfidentialClientApplication;
  private scopes = ['https://graph.microsoft.com/Presence.Read', 'https://graph.microsoft.com/User.Read'];

  constructor() {
    this.msalInstance = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.MICROSOFT_CLIENT_ID || '',
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
        authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}`
      }
    });
  }

  // Get authentication URL for user login
  getAuthUrl(): string {
    const authUrlParameters = {
      scopes: this.scopes,
      redirectUri: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3001/api/teams/auth/callback'
    };

    return this.msalInstance.getAuthCodeUrl(authUrlParameters);
  }

  // Exchange authorization code for access token
  async getAccessTokenFromCode(code: string): Promise<string> {
    try {
      const tokenRequest = {
        code: code,
        scopes: this.scopes,
        redirectUri: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3001/api/teams/auth/callback'
      };

      const response = await this.msalInstance.acquireTokenByCode(tokenRequest);
      return response.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get access token');
    }
  }

  // Get user presence from Microsoft Graph
  async getUserPresence(accessToken: string, userId?: string): Promise<TeamsPresence> {
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