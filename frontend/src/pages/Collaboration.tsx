import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bell,
  Pin,
  ExternalLink,
  Send,
  Smile,
  Paperclip,
  Hash,
  Users,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Star
} from 'lucide-react';
import { Announcement, ChatMessage, QuickLink } from '../types';

// Mock data
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'System Maintenance Tonight',
    content: 'We will be performing system maintenance tonight from 2 AM to 4 AM EST. Please plan accordingly and save your work before the maintenance window.',
    author: 'IT Admin',
    createdAt: '2023-11-01T10:00:00Z',
    priority: 'high',
    isPinned: true,
    tags: ['maintenance', 'system'],
    views: 145
  },
  {
    id: '2',
    title: 'New Security Training Available',
    content: 'A new cybersecurity training module is now available in the learning portal. All team members are required to complete it by the end of the month.',
    author: 'HR Team',
    createdAt: '2023-10-30T14:30:00Z',
    priority: 'medium',
    isPinned: false,
    tags: ['training', 'security'],
    views: 89
  },
  {
    id: '3',
    title: 'Team Building Event - December 15th',
    content: 'Join us for our quarterly team building event on December 15th at 6 PM. Location: Conference Room A. Food and refreshments will be provided.',
    author: 'Sarah Chen',
    createdAt: '2023-10-28T16:45:00Z',
    priority: 'low',
    isPinned: false,
    tags: ['event', 'team building'],
    views: 67
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Good morning everyone! Ready for the sprint planning meeting?',
    author: 'John Doe',
    timestamp: '2023-11-01T09:00:00Z',
    channel: 'general',
    mentions: []
  },
  {
    id: '2',
    content: 'Yes! I have the user stories ready for review.',
    author: 'Sarah Chen',
    timestamp: '2023-11-01T09:02:00Z',
    channel: 'general',
    mentions: []
  },
  {
    id: '3',
    content: '@Mike Johnson could you join us in 5 minutes?',
    author: 'John Doe',
    timestamp: '2023-11-01T09:03:00Z',
    channel: 'general',
    mentions: ['Mike Johnson']
  }
];

const mockQuickLinks: QuickLink[] = [
  {
    id: '1',
    title: 'Internal Wiki',
    url: 'https://wiki.company.com',
    description: 'Company internal documentation and procedures',
    category: 'Documentation',
    icon: '📚',
    isExternal: true
  },
  {
    id: '2',
    title: 'Project Tracker',
    url: '/projects',
    description: 'Track project progress and milestones',
    category: 'Tools',
    icon: '📊',
    isExternal: false
  },
  {
    id: '3',
    title: 'CIS Portal',
    url: 'https://support.company.com',
    description: 'Customer support and ticketing system',
    category: 'Support',
    icon: '🎫',
    isExternal: true
  },
  {
    id: '4',
    title: 'Code Repository',
    url: 'https://github.com/company',
    description: 'Source code repositories',
    category: 'Development',
    icon: '💻',
    isExternal: true
  }
];

const channels = ['general', 'development', 'support', 'random'];

export default function Collaboration() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [quickLinks] = useState<QuickLink[]>(mockQuickLinks);
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementFilter, setAnnouncementFilter] = useState<'all' | 'pinned' | 'high' | 'medium' | 'low'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = !searchQuery ||
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = announcementFilter === 'all' ||
      (announcementFilter === 'pinned' && announcement.isPinned) ||
      announcement.priority === announcementFilter;

    return matchesSearch && matchesFilter;
  });

  // Filter messages by channel
  const channelMessages = messages.filter(msg => msg.channel === selectedChannel);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      channel: selectedChannel,
      mentions: []
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Collaboration</h1>
          <p className="text-gray-600">Stay connected with announcements, chat, and team resources</p>
        </div>
        <button
          onClick={() => setShowCreateAnnouncement(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Announcements & Quick Links */}
        <div className="lg:col-span-2 space-y-6">
          {/* Announcements */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Announcements
              </h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 text-sm w-64"
                  />
                </div>
                <select
                  value={announcementFilter}
                  onChange={(e) => setAnnouncementFilter(e.target.value as any)}
                  className="input text-sm w-32"
                >
                  <option value="all">All</option>
                  <option value="pinned">Pinned</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAnnouncements.map(announcement => (
                <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {announcement.isPinned && <Pin className="w-4 h-4 text-primary-500" />}
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {announcement.views}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{announcement.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {announcement.author}</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimestamp(announcement.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {announcement.tags.map(tag => (
                        <span key={tag} className="badge bg-gray-100 text-gray-600 text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No announcements found</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2" />
              Quick Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockQuickLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.isExternal ? '_blank' : '_self'}
                  rel={link.isExternal ? 'noopener noreferrer' : ''}
                  className="group p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{link.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                          {link.title}
                        </h3>
                        {link.isExternal && <ExternalLink className="w-3 h-3 text-gray-400" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                      <span className="badge bg-gray-100 text-gray-600 text-xs mt-2">
                        {link.category}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Team Chat */}
        <div className="card h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Team Chat
            </h2>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {new Set(messages.map(m => m.author)).size} online
              </span>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="flex space-x-2 mb-4">
            {channels.map(channel => (
              <button
                key={channel}
                onClick={() => setSelectedChannel(channel)}
                className={`px-3 py-1 text-sm rounded-full flex items-center space-x-1 ${
                  selectedChannel === channel
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Hash className="w-3 h-3" />
                <span>{channel}</span>
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="space-y-3">
              {channelMessages.map(message => (
                <div key={message.id} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {message.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {message.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={`Message #${selectedChannel}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="input pr-20 text-sm"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Smile className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="btn btn-primary px-3"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 