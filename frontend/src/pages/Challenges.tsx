import { useState, useEffect } from 'react';
import {
  Trophy,
  Star,
  Award,
  Clock,
  Users,
  Target,
  Zap,
  Play,
  CheckCircle,
  XCircle,
  Medal,
  Crown,
  Flame,
  TrendingUp,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Challenge, Leaderboard, User, ChallengeCompletion, QuizQuestion } from '../types';

// Mock data
const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'API Best Practices Quiz',
    description: 'Test your knowledge of REST API design principles, HTTP status codes, and security best practices',
    type: 'quiz',
    difficulty: 'medium',
    topic: 'api',
    points: 50,
    startDate: '2023-11-01T00:00:00Z',
    endDate: '2023-11-30T23:59:59Z',
    participants: ['1', '2', '3', '4', '5'],
    completions: [
      { userId: '1', completedAt: '2023-11-02T10:30:00Z', score: 45, timeSpent: 300 },
      { userId: '2', completedAt: '2023-11-02T14:15:00Z', score: 40, timeSpent: 420 }
    ],
    isActive: true,
    questions: [
      {
        id: '1',
        question: 'What HTTP status code should be returned for successful resource creation?',
        options: ['200 OK', '201 Created', '202 Accepted', '204 No Content'],
        correctAnswer: 1,
        explanation: '201 Created indicates that a new resource has been successfully created'
      },
      {
        id: '2',
        question: 'Which HTTP method is idempotent?',
        options: ['POST', 'PUT', 'PATCH', 'All of the above'],
        correctAnswer: 1,
        explanation: 'PUT is idempotent - calling it multiple times with the same data produces the same result'
      }
    ]
  },
  {
    id: '2',
    title: 'React Performance Challenge',
    description: 'Learn optimization techniques for React applications including memoization, code splitting, and rendering strategies',
    type: 'learning',
    difficulty: 'hard',
    topic: 'frontend',
    points: 75,
    startDate: '2023-10-25T00:00:00Z',
    endDate: '2023-12-25T23:59:59Z',
    participants: ['1', '3', '4'],
    completions: [
      { userId: '3', completedAt: '2023-11-01T16:45:00Z', score: 70, timeSpent: 1800 }
    ],
    isActive: true,
    questions: []
  },
  {
    id: '3',
    title: 'Database Design Fundamentals',
    description: 'Test your understanding of database normalization, indexing, and query optimization',
    type: 'quiz',
    difficulty: 'easy',
    topic: 'database',
    points: 30,
    startDate: '2023-10-20T00:00:00Z',
    endDate: '2023-11-20T23:59:59Z',
    participants: ['2', '4', '5'],
    completions: [
      { userId: '2', completedAt: '2023-10-22T09:20:00Z', score: 28, timeSpent: 240 },
      { userId: '4', completedAt: '2023-10-23T11:30:00Z', score: 25, timeSpent: 360 }
    ],
    isActive: true,
    questions: []
  }
];

const mockLeaderboard: Leaderboard = {
  id: '1',
  name: 'Weekly Challenge Leaderboard',
  period: 'weekly',
  entries: [
    { 
      rank: 1, 
      user: { 
        id: '1', name: 'Sarah Chen', email: 'sarah@cognizant.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        role: 'support', skills: [], interests: [], department: 'Engineering', joinDate: '2023-01-01', 
        points: 320, badges: [], isOnline: true
      }, 
      score: 320, 
      change: 0 
    },
    { 
      rank: 2, 
      user: { 
        id: '2', name: 'Mike Johnson', email: 'mike@cognizant.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'support', skills: [], interests: [], department: 'Engineering', joinDate: '2023-01-01', 
        points: 285, badges: [], isOnline: false
      }, 
      score: 285, 
      change: 1 
    },
    { 
      rank: 3, 
      user: { 
        id: '3', name: 'Alex Rivera', email: 'alex@cognizant.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'user', skills: [], interests: [], department: 'Engineering', joinDate: '2023-01-01', 
        points: 220, badges: [], isOnline: true
      }, 
      score: 220, 
      change: -1 
    },
    { 
      rank: 4, 
      user: { 
        id: '4', name: 'Emily Davis', email: 'emily@cognizant.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        role: 'user', skills: [], interests: [], department: 'Data', joinDate: '2023-01-01', 
        points: 195, badges: [], isOnline: true
      }, 
      score: 195, 
      change: 2 
    }
  ],
  lastUpdated: new Date().toISOString()
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

const topicColors = {
  api: 'bg-blue-100 text-blue-800',
  frontend: 'bg-purple-100 text-purple-800',
  backend: 'bg-green-100 text-green-800',
  security: 'bg-red-100 text-red-800',
  database: 'bg-indigo-100 text-indigo-800',
  devops: 'bg-orange-100 text-orange-800',
  general: 'bg-gray-100 text-gray-800'
};

const typeIcons = {
  quiz: Trophy,
  task: Target,
  learning: Star
};

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [leaderboard, setLeaderboard] = useState<Leaderboard>(mockLeaderboard);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Challenge | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<{score: number, total: number} | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'quiz' | 'task' | 'learning'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [filterTopic, setFilterTopic] = useState<'all' | 'api' | 'frontend' | 'backend' | 'security' | 'database' | 'devops' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = !searchQuery ||
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || challenge.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty;
    const matchesTopic = filterTopic === 'all' || challenge.topic === filterTopic;

    return matchesSearch && matchesType && matchesDifficulty && matchesTopic && challenge.isActive;
  });

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (activeQuiz && currentQuestion < (activeQuiz.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeQuiz || !activeQuiz.questions) return;

    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (activeQuiz.questions![index]?.correctAnswer === answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / activeQuiz.questions.length) * activeQuiz.points);
    setQuizResults({ score, total: activeQuiz.points });

    // Update challenge completions
    const completion: ChallengeCompletion = {
      userId: 'current-user',
      completedAt: new Date().toISOString(),
      score,
      timeSpent: 300 // Mock time
    };

    setChallenges(prev => prev.map(challenge => 
      challenge.id === activeQuiz.id
        ? { ...challenge, completions: [...challenge.completions, completion] }
        : challenge
    ));
  };

  const startChallenge = (challenge: Challenge) => {
    if (challenge.type === 'quiz' && challenge.questions && challenge.questions.length > 0) {
      setActiveQuiz(challenge);
      setCurrentQuestion(0);
      setUserAnswers([]);
      setQuizResults(null);
    } else {
      // Handle other challenge types
      setSelectedChallenge(challenge);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
    return <div className="w-4 h-4" />;
  };

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const IconComponent = typeIcons[challenge.type];
    const isCompleted = challenge.completions.some(c => c.userId === 'current-user');
    
    return (
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${challenge.type === 'quiz' ? 'bg-blue-100' : challenge.type === 'learning' ? 'bg-purple-100' : 'bg-green-100'}`}>
              <IconComponent className={`w-6 h-6 ${challenge.type === 'quiz' ? 'text-blue-600' : challenge.type === 'learning' ? 'text-purple-600' : 'text-green-600'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{challenge.type} Challenge</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`badge ${difficultyColors[challenge.difficulty]} text-xs`}>
              {challenge.difficulty}
            </span>
            <span className={`badge ${topicColors[challenge.topic]} text-xs capitalize`}>
              {challenge.topic}
            </span>
            <span className="badge badge-primary text-xs">{challenge.points}pts</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {challenge.participants.length}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {Math.floor((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
            </span>
          </div>
          {isCompleted && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Completed</span>
            </div>
          )}
        </div>

        <button
          onClick={() => startChallenge(challenge)}
          disabled={isCompleted}
          className={`w-full ${isCompleted ? 'btn btn-secondary opacity-50 cursor-not-allowed' : 'btn btn-primary'}`}
        >
          <Play className="w-4 h-4 mr-2" />
          {isCompleted ? 'Completed' : 'Start Challenge'}
        </button>
      </div>
    );
  };

  // Quiz interface
  if (activeQuiz && !quizResults) {
    const question = activeQuiz.questions![currentQuestion];
    const progress = ((currentQuestion + 1) / activeQuiz.questions!.length) * 100;

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{activeQuiz.title}</h1>
            <button
              onClick={() => setActiveQuiz(null)}
              className="btn btn-ghost"
            >
              Exit Quiz
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {activeQuiz.questions!.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    userAnswers[currentQuestion] === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={userAnswers[currentQuestion] === undefined}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === activeQuiz.questions!.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz results
  if (quizResults) {
    const percentage = (quizResults.score / quizResults.total) * 100;
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="card text-center">
          <div className="mb-6">
            {percentage >= 80 ? (
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            ) : percentage >= 60 ? (
              <Medal className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            ) : (
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <p className="text-gray-600">You scored {quizResults.score} out of {quizResults.total} points</p>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">{Math.round(percentage)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-primary-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-gray-600">
              {percentage >= 80 ? 'Excellent work!' : 
               percentage >= 60 ? 'Good job!' : 
               'Keep practicing!'}
            </p>
          </div>

          <button
            onClick={() => {
              setQuizResults(null);
              setActiveQuiz(null);
            }}
            className="btn btn-primary"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Challenges</h1>
            <p className="text-gray-600">Level up your skills and compete with your team</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="badge bg-yellow-100 text-yellow-800 flex items-center">
              <Flame className="w-4 h-4 mr-1" />
              5 Day Streak
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="card">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="input min-w-[120px]"
                >
                  <option value="all">All Types</option>
                  <option value="quiz">Quiz</option>
                  <option value="task">Task</option>
                  <option value="learning">Learning</option>
                </select>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value as any)}
                  className="input min-w-[120px]"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value as any)}
                  className="input min-w-[120px]"
                >
                  <option value="all">All Topics</option>
                  <option value="api">API</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="security">Security</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.entries.map(entry => (
                <div key={entry.user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(entry.rank)}
                    </div>
                    <img
                      src={entry.user.avatar}
                      alt={entry.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{entry.user.name}</p>
                      <p className="text-xs text-gray-500">{entry.score} points</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(entry.change)}
                    {entry.change !== 0 && (
                      <span className={`text-xs ${entry.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(entry.change)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Challenges Completed</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Points</span>
                <span className="font-semibold">320</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-semibold flex items-center">
                  <Flame className="w-4 h-4 mr-1 text-orange-500" />
                  5 days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rank</span>
                <span className="font-semibold">#1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 