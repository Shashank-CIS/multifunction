import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your CIS Portal assistant. I can help you with questions about the portal features, navigation, and functionality. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (message.includes('dashboard') || message.includes('home')) {
      return 'The Dashboard is your main overview page showing key metrics like engineers on duty, active shifts, system uptime, and quick access to all portal features. You can also view upcoming holidays and recent activities from there.';
    }
    
    if (message.includes('scheduler') || message.includes('shift')) {
      return 'The Scheduler helps you manage shift assignments for CIS engineers. You can view engineers in grid or list format, assign shifts, and track shift schedules across different teams and locations.';
    }
    
    if (message.includes('engineer') || message.includes('directory')) {
      return 'The Engineer Directory shows all 150 CIS engineers across different teams and locations. You can search by name, skills, or location, and update production metrics for each engineer.';
    }
    
    if (message.includes('knowledge') || message.includes('articles') || message.includes('documentation')) {
      return 'The Knowledge Base contains technical documentation and troubleshooting guides. You can search articles by category, create new articles, and access CIS-specific technical resources.';
    }
    
    if (message.includes('production') || message.includes('metrics') || message.includes('performance')) {
      return 'Production Management tracks engineer performance metrics including tickets resolved, incidents handled, system uptime, and customer satisfaction ratings. You can view team statistics and update individual metrics.';
    }
    
    if (message.includes('collaboration') || message.includes('chat') || message.includes('communication')) {
      return 'The Collaboration feature enables team communication through channels, announcements, and real-time messaging for better coordination among CIS teams.';
    }
    
    if (message.includes('mentorship') || message.includes('mentor')) {
      return 'Mentorship connects experienced engineers with junior team members for knowledge sharing and professional development within the CIS organization.';
    }
    
    if (message.includes('tech tips') || message.includes('tips')) {
      return 'Tech Tips provides daily technical insights, best practices, and coding tips to help CIS engineers stay updated with the latest technologies and methodologies.';
    }
    
    if (message.includes('challenges') || message.includes('gamification')) {
      return 'Challenges feature gamifies the work experience with coding challenges, team competitions, and skill-building activities to boost engagement and learning.';
    }
    
    if (message.includes('location') || message.includes('office') || message.includes('delivery center')) {
      return 'CIS operates across multiple Cognizant delivery centers in India including Chennai, Bangalore, Mumbai, Hyderabad, Pune, and Kolkata, each with specific teams and capacities.';
    }
    
    if (message.includes('team') || message.includes('department')) {
      return 'CIS teams include Network Operations, Server Operations, Database Administration, Cloud Operations, and Security Operations, each with specialized engineers and team leads.';
    }
    
    if (message.includes('dark mode') || message.includes('theme')) {
      return 'You can toggle between light and dark modes using the theme switcher in the top navigation bar. The portal supports both themes with a clean blue and white design.';
    }
    
    if (message.includes('help') || message.includes('how to') || message.includes('navigation')) {
      return 'Use the sidebar navigation to access different features. You can auto-hide the sidebar by clicking outside it. Each section has its own dashboard with relevant tools and information.';
    }
    
    if (message.includes('holiday') || message.includes('calendar')) {
      return 'The portal displays upcoming holidays for all CIS locations. You can view location-wise holiday calendars with different types: National, Regional, and Religious holidays for 2025.';
    }
    
    if (message.includes('search') || message.includes('find')) {
      return 'Most pages have search functionality. Use the search bars to find engineers by name/skills, articles by keywords, or filter data by team, location, or other criteria.';
    }
    
    // Default responses for common greetings and unclear queries
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! I\'m here to help you navigate the CIS Portal. You can ask me about any feature like the Dashboard, Scheduler, Engineer Directory, Knowledge Base, or Production Management.';
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! Feel free to ask if you need help with anything else in the CIS Portal.';
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return 'Goodbye! I\'ll be here whenever you need assistance with the CIS Portal. Have a great day!';
    }
    
    // Default response for unrecognized queries
    return 'I can help you with questions about the CIS Portal features including Dashboard, Scheduler, Engineer Directory, Knowledge Base, Production Management, Collaboration, Mentorship, Tech Tips, and Challenges. Could you please be more specific about what you\'d like to know?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 rounded-full p-1">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">CIS Assistant</h3>
              <p className="text-blue-100 text-xs">Online • Always ready to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`rounded-full p-2 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div className={`rounded-2xl p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="bg-gray-200 text-gray-600 rounded-full p-2">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about the CIS Portal..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full p-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot; 