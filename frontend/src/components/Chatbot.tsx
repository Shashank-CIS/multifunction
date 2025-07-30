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

// Enhanced mock data for comprehensive technical support
const generateSmartMockData = () => {
  const teams = [
    { id: 'network-ops', name: 'Network Operations', engineers: [] as any[], performanceScore: 92, avgResolutionTime: 45, activeIncidents: 3 },
    { id: 'server-ops', name: 'Server Operations', engineers: [] as any[], performanceScore: 88, avgResolutionTime: 62, activeIncidents: 5 },
    { id: 'db-admin', name: 'Database Administration', engineers: [] as any[], performanceScore: 95, avgResolutionTime: 38, activeIncidents: 2 },
    { id: 'cloud-ops', name: 'Cloud Operations', engineers: [] as any[], performanceScore: 90, avgResolutionTime: 52, activeIncidents: 4 },
    { id: 'security-ops', name: 'Security Operations', engineers: [] as any[], performanceScore: 87, avgResolutionTime: 72, activeIncidents: 6 },
    { id: 'service-desk', name: 'Service Desk', engineers: [] as any[], performanceScore: 93, avgResolutionTime: 28, activeIncidents: 8 }
  ];

  const troubleshootingDatabase = {
    'deployment': {
      category: 'DevOps',
      commonIssues: [
        'Build pipeline failure',
        'Environment configuration mismatch',
        'Database migration errors',
        'Container startup issues'
      ],
      quickFixes: [
        'Check build logs for syntax errors',
        'Verify environment variables',
        'Rollback to previous stable version',
        'Restart deployment pipeline'
      ]
    },
    'network': {
      category: 'Infrastructure',
      commonIssues: [
        'Connection timeouts',
        'DNS resolution failures',
        'Load balancer issues',
        'Firewall blocking'
      ],
      quickFixes: [
        'Check network connectivity',
        'Verify DNS settings',
        'Test firewall rules',
        'Monitor bandwidth usage'
      ]
    },
    'database': {
      category: 'Data',
      commonIssues: [
        'Slow query performance',
        'Connection pool exhaustion',
        'Lock contention',
        'Storage space issues'
      ],
      quickFixes: [
        'Analyze query execution plans',
        'Increase connection pool size',
        'Check for long-running transactions',
        'Monitor disk space usage'
      ]
    },
    'application': {
      category: 'Software',
      commonIssues: [
        'Memory leaks',
        'High CPU usage',
        'API response errors',
        'Session management issues'
      ],
      quickFixes: [
        'Monitor memory usage patterns',
        'Profile CPU-intensive operations',
        'Check API endpoints and logs',
        'Review session configuration'
      ]
    }
  };

  const systemMetrics = {
    systemUptime: '99.8%',
    activeIncidents: 28,
    resolvedToday: 156,
    avgResolutionTime: '42 minutes',
    topPerformer: 'Deepika Agnihotri',
    criticalAlerts: 3,
    systemLoad: 'Normal',
    networkLatency: '12ms'
  };

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

  return { teams, engineers, locations, shifts, troubleshootingDatabase, systemMetrics };
};

const Chatbot: React.FC = () => {
  const { user, isManager } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `👋 Hi ${user?.name || 'there'}! I'm your **CIS Smart Assistant**.\n\nI can help with troubleshooting, performance metrics, team info, navigation, and emergencies.\n\nWhat do you need help with?`,
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
    
    // 🔧 TROUBLESHOOTING & TECHNICAL SUPPORT
    if (message.includes('troubleshoot') || message.includes('issue') || message.includes('problem') || 
        message.includes('error') || message.includes('failure') || message.includes('fix') || 
        message.includes('debug') || message.includes('broken') || message.includes('not working')) {
      
      // Deployment issues
      if (message.includes('deployment') || message.includes('deploy') || message.includes('build') || 
          message.includes('pipeline') || message.includes('ci/cd')) {
        const troubleData = data.troubleshootingDatabase.deployment;
        return `🔧 **Deployment Troubleshooting Guide:**\n\n📋 **Common Issues:**\n${troubleData.commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}\n\n🚀 **Quick Fixes:**\n${troubleData.quickFixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}\n\n👨‍💻 **Next Steps:**\n• Check deployment logs in dashboard\n• Contact DevOps team if issue persists\n• Escalate to: Server Operations Team\n\n📞 **Need Help?** Type "escalate deployment issue" for immediate assistance`;
      }
      
      // Network issues
      if (message.includes('network') || message.includes('connection') || message.includes('timeout') || 
          message.includes('dns') || message.includes('connectivity')) {
        const troubleData = data.troubleshootingDatabase.network;
        return `🌐 **Network Troubleshooting Guide:**\n\n📋 **Common Issues:**\n${troubleData.commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}\n\n🔍 **Diagnostic Steps:**\n${troubleData.quickFixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}\n\n⚡ **Immediate Actions:**\n• Run network diagnostics\n• Check system status dashboard\n• Verify load balancer health\n\n🚨 **Escalation:** Network Operations Team (24/7 support available)`;
      }
      
      // Database issues
      if (message.includes('database') || message.includes('db') || message.includes('sql') || 
          message.includes('query') || message.includes('slow') || message.includes('performance')) {
        const troubleData = data.troubleshootingDatabase.database;
        return `🗄️ **Database Troubleshooting Guide:**\n\n📋 **Common Issues:**\n${troubleData.commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}\n\n🔧 **Resolution Steps:**\n${troubleData.quickFixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}\n\n📊 **Performance Check:**\n• Current DB load: Normal\n• Active connections: 245/500\n• Query response time: 12ms avg\n\n👥 **Expert Help:** Database Administration Team`;
      }
      
      // Application issues
      if (message.includes('application') || message.includes('app') || message.includes('memory') || 
          message.includes('cpu') || message.includes('api') || message.includes('session')) {
        const troubleData = data.troubleshootingDatabase.application;
        return `💻 **Application Troubleshooting Guide:**\n\n📋 **Common Issues:**\n${troubleData.commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}\n\n🛠️ **Resolution Steps:**\n${troubleData.quickFixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}\n\n📈 **Current Metrics:**\n• CPU Usage: 23%\n• Memory Usage: 67%\n• Active Sessions: 1,247\n• API Response Time: 145ms\n\n🔗 **Useful Links:**\n• Application Dashboard\n• Performance Monitoring\n• Log Analysis Tools`;
      }
      
      // Generic troubleshooting
      return `🔧 **Technical Support Assistant Ready!**\n\nI can help troubleshoot:\n🚀 **Deployment Issues** (build failures, CI/CD)\n🌐 **Network Problems** (connectivity, DNS, timeouts)\n🗄️ **Database Issues** (performance, queries, connections)\n💻 **Application Errors** (memory, CPU, APIs)\n\n💡 **Try asking:**\n• "Help with deployment failure"\n• "Network connection issues"\n• "Database performance problem"\n• "Application memory leak"\n\n🚨 **Emergency?** Type "emergency" or "critical issue" for immediate escalation!`;
    }
    
    // 📊 PERFORMANCE & ANALYTICS
    if (message.includes('performance') || message.includes('metrics') || message.includes('analytics') || 
        message.includes('stats') || message.includes('dashboard') || message.includes('kpi')) {
      
      // Team performance
      if (message.includes('team')) {
        let targetTeam = '';
        if (message.includes('network')) targetTeam = 'network-ops';
        else if (message.includes('server')) targetTeam = 'server-ops';
        else if (message.includes('database') || message.includes('db')) targetTeam = 'db-admin';
        else if (message.includes('cloud')) targetTeam = 'cloud-ops';
        else if (message.includes('security')) targetTeam = 'security-ops';
        else if (message.includes('service') || message.includes('desk')) targetTeam = 'service-desk';
        
        if (targetTeam) {
          const team = data.teams.find(t => t.id === targetTeam);
          return `📊 **${team?.name} Performance Dashboard:**\n\n🎯 **Performance Score:** ${team?.performanceScore}%\n⏱️ **Avg Resolution Time:** ${team?.avgResolutionTime} minutes\n🚨 **Active Incidents:** ${team?.activeIncidents}\n👥 **Team Size:** ${team?.engineers.length} engineers\n🟢 **Available Now:** ${team?.engineers.filter(e => e.isAvailable).length}\n\n📈 **This Month:**\n• Tickets Resolved: ${Math.floor(Math.random() * 500 + 200)}\n• Customer Satisfaction: ${(Math.random() * 0.5 + 4.5).toFixed(1)}/5\n• SLA Compliance: ${Math.floor(Math.random() * 10 + 90)}%\n\n🏆 **Top Performer:** ${team?.engineers.find(e => e.experience >= 5)?.name || 'Loading...'}`;
        }
      }
      
      // Top performers
      if (message.includes('top') || message.includes('best') || message.includes('performer')) {
        return `🏆 **Top Performers This Month:**\n\n🥇 **#1 ${data.systemMetrics.topPerformer}**\n• Tickets Resolved: 89\n• Avg Resolution: 22 minutes\n• Customer Rating: 4.9/5\n\n🥈 **#2 Shashankagowda S**\n• Tickets Resolved: 76\n• Avg Resolution: 28 minutes\n• Customer Rating: 4.8/5\n\n🥉 **#3 Pradip Shinde**\n• Tickets Resolved: 71\n• Avg Resolution: 31 minutes\n• Customer Rating: 4.7/5\n\n📊 **Team Rankings:**\n1. Database Administration (95% score)\n2. Service Desk (93% score)\n3. Network Operations (92% score)\n\n🎯 **View detailed analytics in Performance Dashboard**`;
      }
      
      // System metrics
      return `📊 **System Performance Overview:**\n\n🟢 **System Health:** ${data.systemMetrics.systemLoad}\n⏱️ **Uptime:** ${data.systemMetrics.systemUptime}\n🚨 **Active Incidents:** ${data.systemMetrics.activeIncidents}\n✅ **Resolved Today:** ${data.systemMetrics.resolvedToday}\n⚡ **Avg Resolution:** ${data.systemMetrics.avgResolutionTime}\n🌐 **Network Latency:** ${data.systemMetrics.networkLatency}\n\n🔴 **Critical Alerts:** ${data.systemMetrics.criticalAlerts}\n🏆 **Top Performer:** ${data.systemMetrics.topPerformer}\n\n📈 **Quick Actions:**\n• View Real-time Dashboard\n• Generate Performance Report\n• Check Team Metrics\n• Monitor System Health`;
    }
    
    // 🧭 NAVIGATION & HELP
    if (message.includes('navigate') || message.includes('how to') || message.includes('where is') || 
        message.includes('find') || message.includes('access') || message.includes('dashboard') || 
        message.includes('help') || message.includes('guide')) {
      
      if (message.includes('dashboard') || message.includes('main')) {
        return `🧭 **Navigation Guide - Main Dashboard:**\n\n📊 **Key Sections:**\n• **Scheduler** - Manage shifts and assignments\n• **Engineer Directory** - Team profiles and contacts\n• **Reports** - Performance analytics and downloads\n• **Knowledge Base** - Documentation and guides\n• **Collaboration** - Team communication tools\n\n🔍 **Quick Access:**\n• Use search bar (top right)\n• Check sidebar navigation\n• Access user menu (profile icon)\n\n💡 **Pro Tips:**\n• Bookmark frequently used pages\n• Use keyboard shortcuts (Ctrl+K for search)\n• Enable notifications for updates`;
      }
      
      if (message.includes('report') || message.includes('analytics')) {
        return `📈 **Reports & Analytics Guide:**\n\n📊 **Available Reports:**\n• **Performance Reports** - Team and individual metrics\n• **Shift Reports** - Schedule and attendance data\n• **Production Reports** - Output and efficiency stats\n• **Incident Reports** - Issue tracking and resolution\n\n🎯 **Quick Actions:**\n• Generate new report: Click "Generate New Report"\n• Download existing: Use download buttons\n• Filter data: Use search and filter options\n• Schedule reports: Set up automated delivery\n\n👨‍💼 **Manager Features:**\n• Access all team reports\n• Bulk report generation\n• Advanced analytics\n• Performance comparisons`;
      }
      
      return `🧭 **CIS Portal Navigation Help:**\n\n🏠 **Main Areas:**\n• **Dashboard** - Overview and quick actions\n• **Scheduler** - Shift management and planning\n• **Engineer Directory** - Team profiles and skills\n• **Reports** - Analytics and performance data\n• **Knowledge Base** - Documentation and procedures\n\n🔍 **Search & Find:**\n• Use global search (Ctrl+K)\n• Check sidebar menu\n• Access user profile menu\n• Browse help documentation\n\n❓ **Need specific help?** Ask me:\n• "How to generate reports?"\n• "Where is the scheduler?"\n• "How to access team performance?"`;
    }
    
    // 🚨 ESCALATION & EMERGENCY
    if (message.includes('escalate') || message.includes('emergency') || message.includes('critical') || 
        message.includes('urgent') || message.includes('immediate') || message.includes('help me') || 
        message.includes('contact') || message.includes('manager') || message.includes('lead')) {
      
      // Critical incident escalation
      if (message.includes('critical') || message.includes('emergency') || message.includes('urgent')) {
        return `🚨 **CRITICAL INCIDENT ESCALATION PROTOCOL**\n\n⚡ **Immediate Actions:**\n1. **Log incident** in system immediately\n2. **Contact on-call engineer** for affected team\n3. **Notify team lead** within 15 minutes\n4. **Update incident status** every 30 minutes\n\n📞 **Emergency Contacts:**\n🔴 **Critical Escalation Hotline:** +91-XXX-XXXX\n👨‍💼 **Duty Manager:** +91-XXX-XXXX\n🛡️ **Security Team:** +91-XXX-XXXX\n\n⚡ **On-Call Engineers:**\n• Network Ops: ${data.engineers.find(e => e.isOnCall && e.teamId === 'network-ops')?.name || 'Contact NOC'}\n• Server Ops: ${data.engineers.find(e => e.isOnCall && e.teamId === 'server-ops')?.name || 'Contact SOC'}\n• Database: ${data.engineers.find(e => e.isOnCall && e.teamId === 'db-admin')?.name || 'Contact DBA'}\n\n🎯 **Next:** Provide incident details and affected systems`;
      }
      
      // Team lead contact
      if (message.includes('team lead') || message.includes('manager') || message.includes('supervisor')) {
        return `👨‍💼 **Team Leads & Management Contacts:**\n\n🏢 **Team Leaders:**\n• **Network Ops Lead:** Rajesh Kumar (+91-XXX-XXXX)\n• **Server Ops Lead:** Priya Sharma (+91-XXX-XXXX)\n• **Database Lead:** Amit Singh (+91-XXX-XXXX)\n• **Cloud Ops Lead:** Sneha Patel (+91-XXX-XXXX)\n• **Security Lead:** Rohit Gupta (+91-XXX-XXXX)\n• **Service Desk Lead:** Kavya Reddy (+91-XXX-XXXX)\n\n📱 **Management:**\n• **Operations Manager:** Available 9 AM - 6 PM\n• **Technical Director:** Emergency contact only\n• **Duty Manager:** 24/7 availability\n\n⏰ **Current Shift Leads:**\n${data.engineers.filter(e => e.isOnCall && e.experience >= 5).slice(0, 3).map(e => `• ${e.name} (${e.team})`).join('\n')}`;
      }
      
      // General escalation
      return `🔝 **Escalation Pathways:**\n\n📋 **Standard Escalation:**\n1. **L1 Support** → Service Desk Team\n2. **L2 Support** → Specialist Teams\n3. **L3 Support** → Senior Engineers\n4. **Management** → Team Leads/Managers\n\n⚡ **Quick Escalation:**\n• **Technical Issues** → Contact relevant team lead\n• **System Outages** → Immediate escalation to NOC\n• **Security Incidents** → Security Operations Team\n• **Business Impact** → Operations Manager\n\n📞 **24/7 Support:**\n• **Main Helpdesk:** +91-XXX-XXXX\n• **Emergency Line:** +91-XXX-XXXX\n• **After Hours:** +91-XXX-XXXX\n\n💬 **Internal Escalation:** Use @mention in team channels`;
    }
    
    // Intelligent query parsing and response generation (existing functionality continues...)
    
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
      return `Hi ${user?.name || 'there'}! How can I help you today?`;
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! 😊 Happy to help anytime!';
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return 'Goodbye! 👋 I\'m here 24/7 whenever you need help!';
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

    // Default intelligent response with enhanced capabilities
    return `🤖 **I can help with:**\n\n🔧 Troubleshooting (deployment, network, database, app issues)\n📊 Performance metrics and team analytics\n👥 Engineer info and shift schedules\n🧭 Navigation and system help\n🚨 Emergency escalation and contacts\n\n💡 **Try:** "Help with [issue]", "Show [team] performance", "Who is available?", or "Contact [team] lead"`;
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
                  placeholder="Try: 'Help with deployment issue' or 'Show team performance' or 'Who is available?'"
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