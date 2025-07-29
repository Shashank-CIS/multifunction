import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Mock data for intelligent responses
const generateSmartMockData = () => {
  const teams = [
    { id: 'network-ops', name: 'Network Operations', engineers: [] as any[] },
    { id: 'server-ops', name: 'Server Operations', engineers: [] as any[] },
    { id: 'db-admin', name: 'Database Administration', engineers: [] as any[] },
    { id: 'cloud-ops', name: 'Cloud Operations', engineers: [] as any[] },
    { id: 'security-ops', name: 'Security Operations', engineers: [] as any[] },
    { id: 'service-desk', name: 'Service Desk', engineers: [] as any[] }
  ];

  const locations = ['Chennai', 'Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Kolkata'];
  const shifts = [
    { id: 'shift-a', name: 'Day Shift', time: '06:00-16:00' },
    { id: 'shift-b', name: 'Evening Shift', time: '14:00-00:00' },
    { id: 'shift-c', name: 'Night Shift', time: '22:00-08:00' }
  ];

  // Generate engineers with realistic data
  const engineers = [];
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Rohit Gupta', 
    'Kavya Reddy', 'Arjun Nair', 'Pooja Joshi', 'Vikram Rao', 'Anita Verma', 
    'Suresh Iyer', 'Meera Krishnan', 'Shashankagowda S', 'Pradip Shinde', 
    'Ramesh Babu', 'Divya Sree', 'Deepika Agnihotri', 'Ravi Sharma', 
    'Neha Gupta', 'Arun Kumar', 'Swati Patel', 'Kiran Reddy', 'Manish Singh',
    'Shreya Jain', 'Varun Nair', 'Anjali Verma', 'Sanjay Iyer', 'Ritu Krishnan',
    'Ashok Babu', 'Sunita Sree', 'Manoj Kumar', 'Rekha Sharma', 'Vinod Singh',
    'Lakshmi Patel', 'Sunil Gupta', 'Geeta Reddy', 'Naveen Nair', 'Shanti Joshi'
  ];
  
  // Create specific engineers first
  const specificEngineers = [
    { name: 'Deepika Agnihotri', team: teams[0], shift: shifts[1], location: 'Chennai', isOnCall: false, isAvailable: true },
    { name: 'Shashankagowda S', team: teams[1], shift: shifts[0], location: 'Bangalore', isOnCall: true, isAvailable: true },
    { name: 'Pradip Shinde', team: teams[2], shift: shifts[2], location: 'Mumbai', isOnCall: false, isAvailable: true }
  ];

  specificEngineers.forEach((spec, index) => {
    const engineer = {
      id: `eng-${index + 1}`,
      name: spec.name,
      team: spec.team.name,
      teamId: spec.team.id,
      location: spec.location,
      isOnCall: spec.isOnCall,
      isAvailable: spec.isAvailable,
      shift: spec.shift,
      skills: ['Network Security', 'Linux', 'Windows Server', 'Cloud Computing', 'Database Management'][Math.floor(Math.random() * 5)],
      experience: Math.floor(Math.random() * 10) + 3,
      status: spec.isAvailable ? 'active' : 'busy'
    };
    engineers.push(engineer);
    spec.team.engineers.push(engineer);
  });

  // Generate remaining engineers
  for (let i = 3; i < 150; i++) {
    const team = teams[Math.floor(Math.random() * teams.length)];
    const engineer = {
      id: `eng-${i + 1}`,
      name: names[Math.floor(Math.random() * names.length)],
      team: team.name,
      teamId: team.id,
      location: locations[Math.floor(Math.random() * locations.length)],
      isOnCall: Math.random() > 0.8,
      isAvailable: Math.random() > 0.3,
      shift: shifts[Math.floor(Math.random() * shifts.length)],
      skills: ['Network Security', 'Linux', 'Windows Server', 'Cloud Computing', 'Database Management'][Math.floor(Math.random() * 5)],
      experience: Math.floor(Math.random() * 10) + 1,
      status: Math.random() > 0.1 ? 'active' : 'busy'
    };
    engineers.push(engineer);
    team.engineers.push(engineer);
  }

  return { teams, engineers, locations, shifts };
};

const Chatbot: React.FC = () => {
  const { user, isManager } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${user?.name || 'there'}, How can I assist you Today?`,
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

  const getIntelligentBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const data = generateSmartMockData();
    
    // Intelligent query parsing and response generation
    
    // Individual engineer queries - Enhanced pattern matching
    if (message.includes('shift') || message.includes('schedule') || message.includes('timing') || 
        message.includes('working') || message.includes('hours') || message.includes('when')) {
      
      let foundEngineer = null;
      
      // Look for engineer names in the query with improved matching
      for (const engineer of data.engineers) {
        const nameParts = engineer.name.toLowerCase().split(' ');
        const queryLower = message.toLowerCase();
        const queryWords = queryLower.split(' ');
        
        // Check various name matching patterns
        const nameInQuery = nameParts.some(part => queryWords.includes(part)) || 
                           queryLower.includes(engineer.name.toLowerCase()) ||
                           // Handle first name + last name separately
                           (nameParts.length >= 2 && queryWords.includes(nameParts[0]) && queryWords.includes(nameParts[1])) ||
                           // Handle partial matches
                           nameParts.some(part => part.length > 3 && queryLower.includes(part));
        
        if (nameInQuery) {
          foundEngineer = engineer;
          break;
        }
      }
      
      if (foundEngineer) {
        const currentTime = new Date().toLocaleTimeString();
        return `👤 **${foundEngineer.name} - Shift Information:**\n\n⏰ **Current Shift:** ${foundEngineer.shift.name} (${foundEngineer.shift.time})\n📍 **Location:** ${foundEngineer.location}\n🏢 **Team:** ${foundEngineer.team}\n🟢 **Status:** ${foundEngineer.isAvailable ? 'Available' : 'Busy'}\n${foundEngineer.isOnCall ? '🔴 **On Call:** Yes' : '⭕ **On Call:** No'}\n\n💼 **Skills:** ${foundEngineer.skills}\n📅 **Experience:** ${foundEngineer.experience} years\n\n🕐 **Current Time:** ${currentTime}`;
      }
    }
    
    // General engineer information queries with enhanced patterns
    if ((message.includes('who is') || message.includes('about') || message.includes('info') || 
         message.includes('tell me') || message.includes('details') || message.includes('profile')) && 
        !message.includes('available')) {
      
      let foundEngineer = null;
      
      for (const engineer of data.engineers) {
        const nameParts = engineer.name.toLowerCase().split(' ');
        const queryLower = message.toLowerCase();
        const queryWords = queryLower.split(' ');
        
        // Enhanced name matching
        const nameInQuery = nameParts.some(part => queryWords.includes(part)) || 
                           queryLower.includes(engineer.name.toLowerCase()) ||
                           (nameParts.length >= 2 && queryWords.includes(nameParts[0]) && queryWords.includes(nameParts[1])) ||
                           nameParts.some(part => part.length > 3 && queryLower.includes(part));
        
        if (nameInQuery) {
          foundEngineer = engineer;
          break;
        }
      }
      
      if (foundEngineer) {
        return `👤 **${foundEngineer.name} - Profile:**\n\n🏢 **Team:** ${foundEngineer.team}\n📍 **Location:** ${foundEngineer.location}\n⏰ **Shift:** ${foundEngineer.shift.name} (${foundEngineer.shift.time})\n💼 **Skills:** ${foundEngineer.skills}\n📅 **Experience:** ${foundEngineer.experience} years\n🟢 **Current Status:** ${foundEngineer.isAvailable ? 'Available' : 'Busy'}\n${foundEngineer.isOnCall ? '🔴 **On Call:** Yes' : '⭕ **On Call:** No'}`;
      }
    }
    
    // Simple "what is" queries
    if (message.includes('what is') || message.includes('whats') || message.includes("what's")) {
      let foundEngineer = null;
      
      for (const engineer of data.engineers) {
        const nameParts = engineer.name.toLowerCase().split(' ');
        const queryLower = message.toLowerCase();
        const queryWords = queryLower.split(' ');
        
        const nameInQuery = nameParts.some(part => queryWords.includes(part)) || 
                           queryLower.includes(engineer.name.toLowerCase()) ||
                           (nameParts.length >= 2 && queryWords.includes(nameParts[0]) && queryWords.includes(nameParts[1])) ||
                           nameParts.some(part => part.length > 3 && queryLower.includes(part));
        
        if (nameInQuery) {
          foundEngineer = engineer;
          break;
        }
      }
      
      if (foundEngineer) {
        return `👤 **${foundEngineer.name}:**\n\n⏰ **Shift:** ${foundEngineer.shift.name} (${foundEngineer.shift.time})\n🏢 **Team:** ${foundEngineer.team}\n📍 **Location:** ${foundEngineer.location}\n🟢 **Status:** ${foundEngineer.isAvailable ? 'Available' : 'Busy'}\n${foundEngineer.isOnCall ? '🔴 **On Call:** Yes' : '⭕ **On Call:** No'}`;
      }
    }
    
    // Team availability queries
    if (message.includes('available') && (message.includes('team') || message.includes('network') || message.includes('server') || message.includes('database') || message.includes('cloud') || message.includes('security'))) {
      let targetTeam = '';
      if (message.includes('network')) targetTeam = 'network-ops';
      else if (message.includes('server')) targetTeam = 'server-ops';
      else if (message.includes('database') || message.includes('db')) targetTeam = 'db-admin';
      else if (message.includes('cloud')) targetTeam = 'cloud-ops';
      else if (message.includes('security')) targetTeam = 'security-ops';
      else if (message.includes('service') || message.includes('desk')) targetTeam = 'service-desk';
      
      if (targetTeam) {
        const team = data.teams.find(t => t.id === targetTeam);
        const availableEngineers = team?.engineers.filter(e => e.isAvailable && e.status === 'active') || [];
        const onCallEngineers = team?.engineers.filter(e => e.isOnCall) || [];
        
        if (availableEngineers.length > 0) {
          const engineerList = availableEngineers.slice(0, 5).map(e => `• ${e.name} (${e.location}, ${e.shift.name})`).join('\n');
          return `📊 **${team?.name} - Available Engineers:**\n\n${engineerList}\n\n🟢 **Total Available:** ${availableEngineers.length}\n🔴 **On Call:** ${onCallEngineers.length}\n📍 **Current Time:** ${new Date().toLocaleTimeString()}`;
        } else {
          return `⚠️ **${team?.name}**: No engineers are currently available. All ${team?.engineers.length} engineers are either busy or offline. You may want to check the emergency contact list or contact the team lead.`;
        }
      }
    }
    
    // Location-based queries
    if ((message.includes('show') || message.includes('list') || message.includes('who')) && (message.includes('chennai') || message.includes('bangalore') || message.includes('mumbai') || message.includes('hyderabad') || message.includes('pune') || message.includes('kolkata'))) {
      const location = data.locations.find(loc => message.includes(loc.toLowerCase()));
      if (location) {
        const engineersInLocation = data.engineers.filter(e => e.location === location);
        const availableCount = engineersInLocation.filter(e => e.isAvailable).length;
        const onCallCount = engineersInLocation.filter(e => e.isOnCall).length;
        
        const teamBreakdown = data.teams.map(team => {
          const teamCount = engineersInLocation.filter(e => e.teamId === team.id).length;
          return teamCount > 0 ? `${team.name}: ${teamCount}` : null;
        }).filter(Boolean).join(', ');
        
        return `📍 **Engineers in ${location}:**\n\n👥 **Total Engineers:** ${engineersInLocation.length}\n🟢 **Available Now:** ${availableCount}\n🔴 **On Call:** ${onCallCount}\n\n🏢 **Team Distribution:**\n${teamBreakdown}\n\n💡 *Ask me "Who is available in ${location}" for detailed list*`;
      }
    }
    
    // Shift-related queries
    if (message.includes('shift') && (message.includes('current') || message.includes('now') || message.includes('active'))) {
      const currentHour = new Date().getHours();
      let currentShift = '';
      if (currentHour >= 6 && currentHour < 14) currentShift = 'Day Shift (06:00-16:00)';
      else if (currentHour >= 14 && currentHour < 22) currentShift = 'Evening Shift (14:00-00:00)';
      else currentShift = 'Night Shift (22:00-08:00)';
      
      const engineersOnCurrentShift = data.engineers.filter(e => {
        if (currentHour >= 6 && currentHour < 14) return e.shift.id === 'shift-a';
        else if (currentHour >= 14 && currentHour < 22) return e.shift.id === 'shift-b';
        else return e.shift.id === 'shift-c';
      });
      
      const availableOnShift = engineersOnCurrentShift.filter(e => e.isAvailable).length;
      
      return `🕐 **Current Shift Information:**\n\n⏰ **Active Shift:** ${currentShift}\n👥 **Engineers on This Shift:** ${engineersOnCurrentShift.length}\n🟢 **Available:** ${availableOnShift}\n🔴 **On Call:** ${engineersOnCurrentShift.filter(e => e.isOnCall).length}\n\n📊 **Next Shift Change:** ${currentHour >= 6 && currentHour < 14 ? '14:00 (Evening)' : currentHour >= 14 && currentHour < 22 ? '22:00 (Night)' : '06:00 (Day)'}`;
    }
    
    // Experience and skills queries
    if (message.includes('experienced') || message.includes('senior') || message.includes('skill')) {
      const seniorEngineers = data.engineers.filter(e => e.experience >= 5);
      const skillBreakdown = seniorEngineers.reduce((acc: any, eng) => {
        acc[eng.skills] = (acc[eng.skills] || 0) + 1;
        return acc;
      }, {});
      
      const skillsList = Object.entries(skillBreakdown).map(([skill, count]) => `${skill}: ${count}`).join(', ');
      
      return `🎓 **Senior Engineers (5+ years):**\n\n👨‍💻 **Total Senior Engineers:** ${seniorEngineers.length}\n🟢 **Available:** ${seniorEngineers.filter(e => e.isAvailable).length}\n\n🛠️ **Skill Distribution:**\n${skillsList}\n\n💡 *Ask me about specific skills like "Linux experts" or "Network Security specialists"*`;
    }
    
    // Emergency or urgent queries
    if (message.includes('emergency') || message.includes('urgent') || message.includes('critical') || message.includes('escalate')) {
      const onCallEngineers = data.engineers.filter(e => e.isOnCall);
      const teamLeads = data.engineers.filter(e => e.experience >= 7);
      
      return `🚨 **Emergency Response Team:**\n\n🔴 **Engineers On Call:** ${onCallEngineers.length}\n👑 **Team Leads Available:** ${teamLeads.filter(e => e.isAvailable).length}\n\n📞 **Emergency Contacts:**\n• Network Ops: +91-XXX-XXXX\n• Server Ops: +91-XXX-XXXX\n• Security: +91-XXX-XXXX\n\n⚡ **Escalation Path:**\n1. On-call engineer\n2. Team lead\n3. Manager on duty\n4. Director (critical only)`;
    }
    
    // Personal queries (if user is logged in)
    if (user && (message.includes('my') || message.includes('me'))) {
      if (message.includes('team')) {
        return `👤 **Your Information:**\n\n📧 **Email:** ${user.email}\n🏢 **Role:** ${user.role === 'manager' ? 'Manager' : 'Engineer'}\n${user.engineerId ? `🆔 **ID:** ${user.engineerId}\n` : ''}🎯 **Access Level:** ${isManager ? 'Full Access' : 'Engineer Access'}\n\n💡 *Ask me "my shift" or "my team members" for more details*`;
      }
    }
    
    // General system status
    if (message.includes('status') || message.includes('overview') || message.includes('summary')) {
      const totalAvailable = data.engineers.filter(e => e.isAvailable).length;
      const totalOnCall = data.engineers.filter(e => e.isOnCall).length;
      const totalBusy = data.engineers.filter(e => e.status === 'busy').length;
      
      return `📊 **CIS Portal System Status:**\n\n👥 **Total Engineers:** ${data.engineers.length}\n🟢 **Available:** ${totalAvailable}\n🔴 **On Call:** ${totalOnCall}\n🟡 **Busy:** ${totalBusy}\n\n🏢 **Active Locations:** ${data.locations.length}\n⚙️ **Teams Operational:** ${data.teams.length}\n🕐 **Last Updated:** ${new Date().toLocaleTimeString()}\n\n✅ **System Status:** All systems operational`;
    }
    
    // Default responses for common greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello ${user?.name || 'there'}, How can I assist you Today?`;
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! 😊 I\'m always here to help with real-time CIS information. Feel free to ask about any team, location, or engineer availability!';
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return 'Goodbye! 👋 Remember, I\'m available 24/7 for any CIS Portal queries. Have a great day!';
    }
    
    // Enhanced availability queries for specific engineers
    if (message.includes('available') || message.includes('busy') || message.includes('free') || message.includes('status')) {
      let foundEngineer = null;
      
      for (const engineer of data.engineers) {
        const nameParts = engineer.name.toLowerCase().split(' ');
        const queryLower = message.toLowerCase();
        const queryWords = queryLower.split(' ');
        
        const nameInQuery = nameParts.some(part => queryWords.includes(part)) || 
                           queryLower.includes(engineer.name.toLowerCase()) ||
                           (nameParts.length >= 2 && queryWords.includes(nameParts[0]) && queryWords.includes(nameParts[1])) ||
                           nameParts.some(part => part.length > 3 && queryLower.includes(part));
        
        if (nameInQuery) {
          foundEngineer = engineer;
          break;
        }
      }
      
      if (foundEngineer) {
        const statusEmoji = foundEngineer.isAvailable ? '🟢' : '🔴';
        const statusText = foundEngineer.isAvailable ? 'Available' : 'Busy';
        return `👤 **${foundEngineer.name} - Availability Status:**\n\n${statusEmoji} **Status:** ${statusText}\n⏰ **Current Shift:** ${foundEngineer.shift.name} (${foundEngineer.shift.time})\n🏢 **Team:** ${foundEngineer.team}\n📍 **Location:** ${foundEngineer.location}\n${foundEngineer.isOnCall ? '🚨 **On Call:** Yes' : '⭕ **On Call:** No'}\n\n🕐 **Last Updated:** ${new Date().toLocaleTimeString()}`;
      }
    }

    // Fallback: Try to find any engineer name mentioned
    let foundEngineer = null;
    for (const engineer of data.engineers) {
      const nameParts = engineer.name.toLowerCase().split(' ');
      const queryLower = message.toLowerCase();
      const queryWords = queryLower.split(' ');
      
      // Enhanced fallback matching
      const nameInQuery = nameParts.some(part => queryWords.includes(part)) || 
                         queryLower.includes(engineer.name.toLowerCase()) ||
                         (nameParts.length >= 2 && queryWords.includes(nameParts[0]) && queryWords.includes(nameParts[1])) ||
                         nameParts.some(part => part.length > 3 && queryLower.includes(part));
      
      if (nameInQuery) {
        foundEngineer = engineer;
        break;
      }
    }
    
    if (foundEngineer) {
      return `👤 **${foundEngineer.name} - Quick Info:**\n\n🏢 **Team:** ${foundEngineer.team}\n📍 **Location:** ${foundEngineer.location}\n⏰ **Shift:** ${foundEngineer.shift.name} (${foundEngineer.shift.time})\n🟢 **Status:** ${foundEngineer.isAvailable ? 'Available' : 'Busy'}\n${foundEngineer.isOnCall ? '🔴 **On Call:** Yes' : '⭕ **On Call:** No'}\n\n💡 *Try asking: "What is ${foundEngineer.name} shift?" or "${foundEngineer.name} availability?"*`;
    }

    // Default intelligent response
    return `🤖 **I can help you with real-time CIS information!**\n\nTry asking me:\n• "What is [Name] shift?" (e.g., "What is Deepika Agnihotri shift?")\n• "Who is available from [team] team now?"\n• "Show me engineers in [location]"\n• "Current shift status"\n• "Emergency contacts"\n\n💡 **Popular queries:**\n• Deepika Agnihotri shift\n• Available network engineers\n• Engineers in Chennai\n• System overview\n\nWhat specific information do you need?`;
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
        text: getIntelligentBotResponse(inputMessage),
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
              <h3 className="font-semibold text-sm">CIS Smart Assistant</h3>
              <p className="text-blue-100 text-xs">🧠 AI-Powered • Real-time Data</p>
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
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {message.text.split('\n').map((line, index) => (
                            <div key={index}>
                              {line.includes('**') ? (
                                <span className="font-semibold">
                                  {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                                </span>
                              ) : line.includes('*') && !line.includes('**') ? (
                                <span className="italic">
                                  {line.replace(/\*(.*?)\*/g, '$1')}
                                </span>
                              ) : (
                                line
                              )}
                            </div>
                          ))}
                        </div>
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
                  placeholder="Try: 'What is Deepika Agnihotri shift?' or 'Who is available from network team?'"
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