import { useState, useEffect } from 'react';
import {
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  User,
  Tag,
  TrendingUp,
  Plus,
  Search,
  Filter,
  BookOpen,
  Award,
  Calendar,
  Eye
} from 'lucide-react';
import { TechTip } from '../types';

// Mock data
const mockTips: TechTip[] = [
  {
    id: '1',
    title: 'Use React.memo for Component Optimization',
    content: `React.memo is a higher-order component that can help optimize your React application by preventing unnecessary re-renders. It's particularly useful for functional components that receive the same props frequently.

Here's how to use it:

\`\`\`javascript
const MyComponent = React.memo(({ name, age }) => {
  return <div>{name} is {age} years old</div>;
});
\`\`\`

React.memo will only re-render the component if its props have changed. For more complex comparison logic, you can provide a custom comparison function as the second argument.`,
    author: 'Sarah Chen',
    category: 'React',
    tags: ['react', 'performance', 'optimization', 'memo'],
    createdAt: '2023-11-01T10:00:00Z',
    votes: 42,
    userVote: 'up',
    difficulty: 'intermediate',
    estimatedReadTime: 3
  },
  {
    id: '2',
    title: 'JavaScript Array Methods You Should Know',
    content: `Modern JavaScript provides powerful array methods that can make your code more concise and readable. Here are some essential ones:

**1. map() - Transform elements**
\`\`\`javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2); // [2, 4, 6, 8]
\`\`\`

**2. filter() - Select elements**
\`\`\`javascript
const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
const adults = users.filter(user => user.age >= 18);
\`\`\`

**3. reduce() - Aggregate data**
\`\`\`javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 10
\`\`\``,
    author: 'Mike Johnson',
    category: 'JavaScript',
    tags: ['javascript', 'arrays', 'functional programming'],
    createdAt: '2023-10-30T14:30:00Z',
    votes: 38,
    userVote: undefined,
    difficulty: 'beginner',
    estimatedReadTime: 5
  },
  {
    id: '3',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    content: `Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes:

**Use Flexbox when:**
- Arranging items in a single direction (row or column)
- Creating flexible component layouts
- Centering content
- Distributing space between items

**Use CSS Grid when:**
- Creating complex 2D layouts
- Positioning items in specific grid areas
- Overlapping elements
- Creating responsive layouts with fractional units

Example Grid Layout:
\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
\`\`\``,
    author: 'Emily Davis',
    category: 'CSS',
    tags: ['css', 'grid', 'flexbox', 'layout'],
    createdAt: '2023-10-28T16:45:00Z',
    votes: 31,
    userVote: undefined,
    difficulty: 'intermediate',
    estimatedReadTime: 4
  },
  {
    id: '4',
    title: 'Git Branching Best Practices',
    content: `Effective Git branching strategies help maintain clean code history and enable smooth collaboration:

**1. Use descriptive branch names**
- feature/user-authentication
- bugfix/login-validation
- hotfix/critical-security-patch

**2. Keep branches short-lived**
Merge or delete branches quickly to avoid conflicts.

**3. Use conventional commit messages**
\`\`\`
feat: add user authentication
fix: resolve login validation bug
docs: update API documentation
\`\`\`

**4. Regular rebasing**
Keep your feature branch up to date with the main branch.`,
    author: 'Alex Rivera',
    category: 'Git',
    tags: ['git', 'version control', 'branching', 'collaboration'],
    createdAt: '2023-10-25T09:15:00Z',
    votes: 29,
    userVote: undefined,
    difficulty: 'beginner',
    estimatedReadTime: 3
  }
];

const categories = ['All', 'React', 'JavaScript', 'CSS', 'Git', 'Node.js', 'Python', 'DevOps'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

export default function TechTips() {
  const [tips, setTips] = useState<TechTip[]>(mockTips);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'votes' | 'trending'>('newest');
  const [selectedTip, setSelectedTip] = useState<TechTip | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [todaysTip, setTodaysTip] = useState<TechTip | null>(null);

  // Set today's tip on component mount
  useEffect(() => {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    setTodaysTip(tip);
  }, [tips]);

  // Filter and sort tips
  const filteredTips = tips
    .filter(tip => {
      const matchesSearch = !searchQuery ||
        tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || tip.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || tip.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return b.votes - a.votes;
        case 'trending':
          // Simple trending calculation based on votes and recency
          const aScore = a.votes * (Date.now() - new Date(a.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000 ? 0.5 : 1);
          const bScore = b.votes * (Date.now() - new Date(b.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000 ? 0.5 : 1);
          return bScore - aScore;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleVote = (tipId: string, voteType: 'up' | 'down') => {
    setTips(prev => prev.map(tip => {
      if (tip.id === tipId) {
        let newVotes = tip.votes;
        let newUserVote: 'up' | 'down' | undefined = voteType;

        // Handle vote changes
        if (tip.userVote === voteType) {
          // Remove vote
          newVotes += voteType === 'up' ? -1 : 1;
          newUserVote = undefined;
        } else if (tip.userVote) {
          // Change vote
          newVotes += voteType === 'up' ? 2 : -2;
        } else {
          // New vote
          newVotes += voteType === 'up' ? 1 : -1;
        }

        return { ...tip, votes: newVotes, userVote: newUserVote };
      }
      return tip;
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const TipCard = ({ tip }: { tip: TechTip }) => (
    <div 
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedTip(tip)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{tip.title}</h3>
        <div className="flex items-center space-x-2 ml-2">
          <span className={`badge ${getDifficultyColor(tip.difficulty)} text-xs`}>
            {tip.difficulty}
          </span>
          <span className="badge badge-primary text-xs">{tip.category}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {tip.content.substring(0, 150)}...
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {tip.tags.slice(0, 3).map(tag => (
          <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
        {tip.tags.length > 3 && (
          <span className="text-xs text-gray-500">+{tip.tags.length - 3} more</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {tip.author}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {tip.estimatedReadTime}m read
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(tip.createdAt)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVote(tip.id, 'up');
            }}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
              tip.userVote === 'up' 
                ? 'bg-green-100 text-green-700' 
                : 'hover:bg-green-50 text-gray-600'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{tip.votes}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVote(tip.id, 'down');
            }}
            className={`p-1 rounded text-sm transition-colors ${
              tip.userVote === 'down' 
                ? 'bg-red-100 text-red-700' 
                : 'hover:bg-red-50 text-gray-600'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const TipDetail = ({ tip }: { tip: TechTip }) => (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedTip(null)}
          className="btn btn-ghost"
        >
          ← Back to Tips
        </button>
        <div className="flex items-center space-x-2">
          <span className={`badge ${getDifficultyColor(tip.difficulty)}`}>
            {tip.difficulty}
          </span>
          <span className="badge badge-primary">{tip.category}</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{tip.title}</h1>

      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
        <span className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          {tip.author}
        </span>
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {tip.estimatedReadTime} min read
        </span>
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(tip.createdAt)}
        </span>
        <span className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {Math.floor(Math.random() * 500) + 50} views
        </span>
      </div>

      <div className="prose max-w-none mb-8">
        {tip.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tip.tags.map(tag => (
          <span key={tag} className="badge bg-gray-100 text-gray-700">
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Was this helpful?</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote(tip.id, 'up')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              tip.userVote === 'up'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Helpful ({tip.votes})</span>
          </button>
          <button
            onClick={() => handleVote(tip.id, 'down')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              tip.userVote === 'down'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>Not helpful</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedTip) {
    return (
      <div className="p-6">
        <TipDetail tip={selectedTip} />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tech Tips</h1>
            <p className="text-gray-600">Daily insights and best practices from the community</p>
          </div>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit Tip
          </button>
        </div>
      </div>

      {/* Today's Tip */}
      {todaysTip && (
        <div className="card mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">💡 Tip of the Day</h2>
              <p className="text-gray-600">Handpicked for you</p>
            </div>
          </div>
          <div className="cursor-pointer" onClick={() => setSelectedTip(todaysTip)}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
              {todaysTip.title}
            </h3>
            <p className="text-gray-700 mb-3">{todaysTip.content.substring(0, 200)}...</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>by {todaysTip.author}</span>
                <span className={`badge ${getDifficultyColor(todaysTip.difficulty)} text-xs`}>
                  {todaysTip.difficulty}
                </span>
                <span className="badge badge-primary text-xs">{todaysTip.category}</span>
              </div>
              <span className="text-primary-600 font-medium">Read more →</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tips, technologies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input min-w-[120px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input min-w-[120px]"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'All' ? 'All Levels' : difficulty}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input min-w-[120px]"
            >
              <option value="newest">Newest</option>
              <option value="votes">Most Voted</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Tips</h3>
              <p className="text-2xl font-semibold text-gray-900">{tips.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Votes</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tips.reduce((acc, tip) => acc + tip.votes, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Top Rated</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.max(...tips.map(tip => tip.votes))}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Categories</h3>
              <p className="text-2xl font-semibold text-gray-900">{categories.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredTips.length} tip{filteredTips.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map(tip => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tips found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 