import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  Lightbulb,
  FolderOpen,
  RefreshCw
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
    title: 'Setting Up VPN Access',
    content: 'VPN setup instructions for remote access:\n\n1. Download the VPN client\n2. Import the configuration file\n3. Enter your credentials\n4. Connect to the VPN\n5. Verify connection status\n\nContact IT support if you encounter certificate errors.',
    summary: 'Complete guide for VPN configuration and troubleshooting',
    category: 'Network',
    tags: ['vpn', 'remote access', 'security'],
    author: 'Mike Johnson',
    createdAt: '2023-10-25T09:15:00Z',
    updatedAt: '2023-10-25T09:15:00Z',
    views: 312,
    helpful: 28,
    notHelpful: 3,
    status: 'published'
  }
];

const mockCategories = [
  { id: '1', name: 'Infrastructure' },
  { id: '2', name: 'Security' },
  { id: '3', name: 'Database' },
  { id: '4', name: 'Networking' },
  { id: '5', name: 'Account Management' },
  { id: '6', name: 'Troubleshooting' },
  { id: '7', name: 'Deployment' }
];

const KnowledgeBase: React.FC = () => {
  const { user, isManager } = useAuth();
  const [articles, setArticles] = useState<KnowledgeArticle[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Generate AI suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 2) {
      const suggestions = [
        'password reset procedure',
        'database troubleshooting',
        'vpn setup guide',
        'user management',
        'network configuration'
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
        suggestion !== searchTerm
      );
      setAiSuggestions(suggestions.slice(0, 3));
    } else {
      setAiSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header and Stats Section with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
        {/* Header */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
              <p className="text-gray-600">
                {isManager ? 'Manage and browse technical documentation' : 'Search and browse technical documentation'}
              </p>
            </div>
            {isManager && (
              <button className="group relative bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 px-6 py-3 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white/40 hover:text-blue-600">
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                  <span className="relative z-10">New Article</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Articles</h3>
                <p className="text-2xl font-semibold text-gray-900">{mockArticles.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Helpful Votes</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {mockArticles.reduce((sum, article) => sum + article.helpful, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {mockArticles.reduce((sum, article) => sum + article.views, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                <p className="text-2xl font-semibold text-gray-900">{mockCategories.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-gray-700 text-sm font-medium mb-2">Search Articles</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              <option value="">All Categories</option>
              {mockCategories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Lightbulb className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setSearchTerm(suggestion)}
                  className="px-3 py-1 text-sm bg-white text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Articles List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div key={article.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{article.title}</h3>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  article.category === 'Infrastructure' ? 'bg-blue-100 text-blue-800' :
                  article.category === 'Security' ? 'bg-red-100 text-red-800' :
                  article.category === 'Database' ? 'bg-green-100 text-green-800' :
                  article.category === 'Networking' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {article.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.content.substring(0, 150)}...
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {article.author}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.max(1, Math.ceil(article.content.split(' ').length / 200))}m read
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {article.views}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Read more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
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
};

export default KnowledgeBase; 