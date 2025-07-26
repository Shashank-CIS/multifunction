// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'mentor' | 'support' | 'user';
  skills: string[];
  interests: string[];
  department: string;
  joinDate: string;
  points: number;
  badges: Badge[];
  isOnline: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

// Knowledge Base Types
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  helpful: number;
  notHelpful: number;
  status: 'draft' | 'published' | 'archived';
}

export interface AISearch {
  query: string;
  suggestions: string[];
  articles: KnowledgeArticle[];
  confidence: number;
}

// Scheduler Types
export interface Shift {
  id: string;
  title: string;
  start: Date;
  end: Date;
  assignee: string;
  assigneeId: string;
  department: string;
  type: 'shift' | 'meeting' | 'training';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  createdAt: string;
  estimatedHours: number;
  category: string;
}

// Collaboration Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  isPinned: boolean;
  tags: string[];
  views: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  channel: string;
  mentions: string[];
  attachments?: string[];
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  icon: string;
  isExternal: boolean;
}

// Mentorship Types
export interface MentorshipPair {
  id: string;
  mentor: User;
  mentee: User;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  goals: string[];
  meetings: MeetingRecord[];
  feedback: FeedbackEntry[];
}

export interface MeetingRecord {
  id: string;
  date: string;
  duration: number;
  notes: string;
  topics: string[];
  nextSteps: string[];
}

export interface FeedbackEntry {
  id: string;
  from: string;
  to: string;
  content: string;
  rating: number;
  date: string;
  type: 'mentor-to-mentee' | 'mentee-to-mentor';
}

// Tech Tips Types
export interface TechTip {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
  votes: number;
  userVote?: 'up' | 'down';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
}

// Gamification Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'task' | 'learning';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  startDate: string;
  endDate: string;
  participants: string[];
  completions: ChallengeCompletion[];
  isActive: boolean;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChallengeCompletion {
  userId: string;
  completedAt: string;
  score: number;
  timeSpent: number;
}

export interface Leaderboard {
  id: string;
  name: string;
  period: 'weekly' | 'monthly' | 'yearly' | 'all-time';
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  change: number; // Change in rank from previous period
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filter and Search Types
export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  author?: string;
  status?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
} 