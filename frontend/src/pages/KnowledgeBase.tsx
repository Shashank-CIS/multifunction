import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  Eye,
  Clock,
  User,
  Tag,
  Lightbulb
} from 'lucide-react';
import { KnowledgeArticle, AISearch } from '../types';

// Mock data - in production this would come from API
const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'How to Reset User Password',
    content: 'To reset a user password, follow these steps:\n\n1. Navigate to User Management\n2. Find the user account\n3. Click "Reset Password"\n4. Send new credentials to user email\n\nFor bulk password resets, use the CSV import feature.',
    summary: 'Step-by-step guide for password reset process',
    category: 'Account Management',
    tags: ['password', 'user management', 'security'],
    author: 'John Smith',
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2023-11-01T10:00:00Z',
    views: 245,
    helpful: 23,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '2',
    title: 'Database Connection Troubleshooting',
    content: 'Common database connection issues and solutions:\n\n1. Check connection string format\n2. Verify network connectivity\n3. Check database server status\n4. Review firewall settings\n5. Validate credentials\n\nFor persistent issues, check the error logs in /var/log/database.',
    summary: 'Troubleshooting guide for database connectivity issues',
    category: 'Database',
    tags: ['database', 'connectivity', 'troubleshooting'],
    author: 'Sarah Chen',
    createdAt: '2023-10-28T14:30:00Z',
    updatedAt: '2023-10-28T14:30:00Z',
    views: 178,
    helpful: 19,
    notHelpful: 1,
    status: 'published'
  },
  {
    id: '3',
    title: 'API Rate Limiting Best Practices',
    content: 'Best practices for implementing API rate limiting:\n\n1. Use appropriate rate limiting algorithms (sliding window, token bucket)\n2. Provide clear error messages with retry-after headers\n3. Implement graceful degradation\n4. Monitor and alert on rate limit violations\n5. Consider different limits for different user tiers',
    summary: 'Guidelines for implementing effective API rate limiting',
    category: 'API',
    tags: ['api', 'rate limiting', 'best practices'],
    author: 'Mike Johnson',
    createdAt: '2023-10-25T09:15:00Z',
    updatedAt: '2023-10-25T09:15:00Z',
    views: 156,
    helpful: 15,
    notHelpful: 0,
    status: 'published'
  }
];

const categories = [
  'All Categories',
  'Account Management',
  'Database',
  'API',
  'Security',
  'Network',
  'Deployment'
];

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || 
      article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Mock AI suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const suggestions = [
          'password reset procedure',
          'database connection issues',
          'API authentication methods',
          'troubleshooting network connectivity'
        ].filter(suggestion => 
          suggestion.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setAiSuggestions(suggestions);
        setLoading(false);
      }, 500);
    } else {
      setAiSuggestions([]);
    }
  }, [searchQuery]);

  const handleVote = (articleId: string, voteType: 'helpful' | 'not-helpful') => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        return {
          ...article,
          helpful: voteType === 'helpful' ? article.helpful + 1 : article.helpful,
          notHelpful: voteType === 'not-helpful' ? article.notHelpful + 1 : article.notHelpful
        };
      }
      return article;
    }));
  };

  const ArticleCard = ({ article }: { article: KnowledgeArticle }) => (
    <div 
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedArticle(article)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {article.title}
        </h3>
        <span className="badge badge-primary ml-2 whitespace-nowrap">
          {article.category}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {article.summary}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {article.tags.map(tag => (
          <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {article.author}
          </span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {article.views}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-green-600">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {article.helpful}
          </span>
          <span className="flex items-center text-red-600">
            <ThumbsDown className="w-4 h-4 mr-1" />
            {article.notHelpful}
          </span>
        </div>
      </div>
    </div>
  );

  const ArticleDetail = ({ article }: { article: KnowledgeArticle }) => (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedArticle(null)}
          className="btn btn-ghost"
        >
          ← Back to Articles
        </button>
        <span className="badge badge-primary">{article.category}</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
      
      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
        <span className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          {article.author}
        </span>
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {article.views} views
        </span>
      </div>

      <div className="prose max-w-none mb-8">
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {article.tags.map(tag => (
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
            onClick={() => handleVote(article.id, 'helpful')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Yes ({article.helpful})</span>
          </button>
          <button
            onClick={() => handleVote(article.id, 'not-helpful')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>No ({article.notHelpful})</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedArticle) {
    return (
      <div className="p-6">
        <ArticleDetail article={selectedArticle} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
          <p className="text-gray-600">
            Search our comprehensive library of guides, troubleshooting articles, and best practices.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Lightbulb className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1 text-sm bg-white text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {searchQuery || selectedCategory !== 'All Categories' 
              ? `${filteredArticles.length} result${filteredArticles.length !== 1 ? 's' : ''} found`
              : 'All Articles'
            }
          </h2>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{articles.length} total articles</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or browse different categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Popular Categories */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(1).map(category => {
            const count = articles.filter(a => a.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">{category}</div>
                <div className="text-sm text-gray-500">{count} articles</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 