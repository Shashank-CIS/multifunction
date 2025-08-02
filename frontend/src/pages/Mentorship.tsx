import { useState, useEffect } from 'react';
import {
  UserCheck,
  Users,
  Star,
  MessageCircle,
  Calendar,
  Target,
  Award,
  Plus,
  Search,
  Filter,
  Book,
  Clock,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { User, MentorshipPair, MeetingRecord, FeedbackEntry } from '../types';

// Mock data
const mockMentors: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@cognizant.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    role: 'mentor',
    skills: ['React', 'TypeScript', 'Node.js', 'Team Leadership', 'Architecture'],
    interests: ['Frontend Development', 'Mentoring', 'Technical Writing'],
    department: 'Engineering',
    joinDate: '2021-03-15',
    points: 2340,
    badges: [
      { id: '1', name: 'Expert Mentor', description: 'Mentored 10+ team members', icon: '🏆', color: '#f59e0b', earnedAt: '2023-10-01' }
    ],
    isOnline: true
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.johnson@cognizant.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'mentor',
    skills: ['AWS', 'DevOps', 'Python', 'Database Design', 'System Architecture'],
    interests: ['Cloud Computing', 'Automation', 'Infrastructure'],
    department: 'Engineering',
    joinDate: '2020-01-10',
    points: 1890,
    badges: [
      { id: '2', name: 'Cloud Expert', description: 'AWS certified professional', icon: '☁️', color: '#3b82f6', earnedAt: '2023-08-15' }
    ],
    isOnline: false
  }
];

const mockMentees: User[] = [
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex.rivera@cognizant.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'user',
    skills: ['JavaScript', 'HTML', 'CSS'],
    interests: ['Frontend Development', 'UI/UX Design'],
    department: 'Engineering',
    joinDate: '2023-09-01',
    points: 450,
    badges: [],
    isOnline: true
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@cognizant.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'user',
    skills: ['Python', 'SQL', 'Data Analysis'],
    interests: ['Data Science', 'Machine Learning'],
    department: 'Data',
    joinDate: '2023-08-15',
    points: 680,
    badges: [],
    isOnline: true
  }
];

const mockPairs: MentorshipPair[] = [
  {
    id: '1',
    mentor: mockMentors[0],
    mentee: mockMentees[0],
    status: 'active',
    startDate: '2023-10-01',
    goals: ['Learn React best practices', 'Improve code review skills', 'Build a portfolio project'],
    meetings: [
      {
        id: '1',
        date: '2023-10-15',
        duration: 60,
        notes: 'Discussed React component architecture and state management patterns',
        topics: ['React Components', 'State Management', 'Best Practices'],
        nextSteps: ['Complete React hooks exercise', 'Review Redux documentation']
      }
    ],
    feedback: [
      {
        id: '1',
        from: 'Alex Rivera',
        to: 'Sarah Chen',
        content: 'Great session! Really helped me understand React patterns better.',
        rating: 5,
        date: '2023-10-15',
        type: 'mentee-to-mentor'
      }
    ]
  }
];

export default function Mentorship() {
  const [view, setView] = useState<'overview' | 'find-mentor' | 'my-mentorship' | 'become-mentor'>('overview');
  const [mentors, setMentors] = useState<User[]>(mockMentors);
  const [mentees, setMentees] = useState<User[]>(mockMentees);
  const [pairs, setPairs] = useState<MentorshipPair[]>(mockPairs);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);

  // Filter mentors based on search and skills
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = !searchQuery ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill = !skillFilter ||
      mentor.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));

    return matchesSearch && matchesSkill;
  });

  // Get unique skills for filter
  const allSkills = Array.from(new Set(mentors.flatMap(mentor => mentor.skills))).sort();

  const stats = {
    totalMentors: mentors.length,
    activePairs: pairs.filter(p => p.status === 'active').length,
    totalMeetings: pairs.reduce((acc, pair) => acc + pair.meetings.length, 0),
    avgRating: pairs.reduce((acc, pair) => {
      const ratings = pair.feedback.map(f => f.rating);
      return acc + (ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0);
    }, 0) / pairs.length || 0
  };

  const MentorCard = ({ mentor }: { mentor: User }) => (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={mentor.avatar}
          alt={mentor.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${mentor.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-500">{mentor.isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3">{mentor.department}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {mentor.skills.slice(0, 4).map(skill => (
              <span key={skill} className="badge badge-primary text-xs">
                {skill}
              </span>
            ))}
            {mentor.skills.length > 4 && (
              <span className="badge bg-gray-100 text-gray-600 text-xs">
                +{mentor.skills.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                4.8
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                5 mentees
              </span>
            </div>
            <button
              onClick={() => setSelectedMentor(mentor)}
              className="btn btn-primary text-sm"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Mentors</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalMentors}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Pairs</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.activePairs}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Meetings</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalMeetings}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Rating</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setView('find-mentor')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group"
          >
            <Search className="w-8 h-8 text-gray-400 group-hover:text-primary-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">Find a Mentor</h3>
            <p className="text-sm text-gray-500 mt-1">Browse available mentors and connect</p>
          </button>

          <button
            onClick={() => setView('become-mentor')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group"
          >
            <UserCheck className="w-8 h-8 text-gray-400 group-hover:text-primary-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">Become a Mentor</h3>
            <p className="text-sm text-gray-500 mt-1">Share your knowledge with others</p>
          </button>

          <button
            onClick={() => setView('my-mentorship')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group"
          >
            <Book className="w-8 h-8 text-gray-400 group-hover:text-primary-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">My Mentorship</h3>
            <p className="text-sm text-gray-500 mt-1">View your mentoring activities</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {pairs.slice(0, 3).map(pair => (
            <div key={pair.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex -space-x-2">
                <img
                  src={pair.mentor.avatar}
                  alt={pair.mentor.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src={pair.mentee.avatar}
                  alt={pair.mentee.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {pair.mentor.name} is mentoring {pair.mentee.name}
                </p>
                <p className="text-xs text-gray-500">
                  {pair.meetings.length} meetings • {pair.goals.length} goals
                </p>
              </div>
              <span className="badge badge-success text-xs">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FindMentorContent = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors by name or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="input min-w-[200px]"
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors.map(mentor => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
            <p className="text-gray-600">Connect, learn, and grow together</p>
          </div>
          <div className="flex items-center">
            {/* Modern Navigation Pills */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-1.5 shadow-lg border border-white/30">
              <div className="flex space-x-1">
                <button
                  onClick={() => setView('overview')}
                  className={`relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    view === 'overview'
                      ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/25 border border-blue-100'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
                >
                  <span className="relative z-10">Overview</span>
                  {view === 'overview' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl"></div>
                  )}
                </button>
                <button
                  onClick={() => setView('find-mentor')}
                  className={`relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    view === 'find-mentor'
                      ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/25 border border-blue-100'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
                >
                  <span className="relative z-10">Find Mentor</span>
                  {view === 'find-mentor' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl"></div>
                  )}
                </button>
                <button
                  onClick={() => setView('my-mentorship')}
                  className={`relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    view === 'my-mentorship'
                      ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/25 border border-blue-100'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
                >
                  <span className="relative z-10">My Mentorship</span>
                  {view === 'my-mentorship' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'overview' && <OverviewContent />}
      {view === 'find-mentor' && <FindMentorContent />}
      {view === 'my-mentorship' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Mentorship Activities</h2>
          <p className="text-gray-500">Your mentorship dashboard will be displayed here.</p>
        </div>
      )}
      {view === 'become-mentor' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Become a Mentor</h2>
          <p className="text-gray-500">Mentor application form will be displayed here.</p>
        </div>
      )}
    </div>
  );
} 