import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import KnowledgeBase from './pages/KnowledgeBase';
import Scheduler from './pages/Scheduler';
import EngineerDirectory from './pages/EngineerDirectory';
import CurrentShiftDashboard from './pages/CurrentShiftDashboard';
import AdminPanel from './pages/AdminPanel';
import Collaboration from './pages/Collaboration';
import Mentorship from './pages/Mentorship';
import TechTips from './pages/TechTips';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import { User } from './types';

// Mock current user - in real app this would come from authentication
const mockUser: User = {
  id: '1',
  name: 'Shashankagowda S',
  email: 'shashankagowda.s@cognizant.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  role: 'support',
  skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'JavaScript', 'Python'],
  interests: ['Frontend Development', 'Cloud Computing', 'DevOps', 'AI/ML', 'Full Stack Development'],
  department: 'Customer Intelligence & Insights',
  joinDate: '2023-08-15',
  points: 1850,
  badges: [
    {
      id: '1',
      name: 'Problem Solver',
      description: 'Solved 50+ issues',
      icon: '🏆',
      color: '#f59e0b',
      earnedAt: '2023-11-01'
    },
    {
      id: '2',
      name: 'Mentor',
      description: 'Mentored 5+ team members',
      icon: '🎓',
      color: '#10b981',
      earnedAt: '2023-10-15'
    },
    {
      id: '3',
      name: 'Innovation Leader',
      description: 'Led 3+ innovative projects',
      icon: '💡',
      color: '#3b82f6',
      earnedAt: '2023-12-01'
    }
  ],
  isOnline: true
};

function App() {
  const [currentUser] = useState<User>(mockUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout 
        currentUser={currentUser} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/scheduler/engineers" element={<EngineerDirectory />} />
          <Route path="/scheduler/current-shifts" element={<CurrentShiftDashboard />} />
          <Route path="/scheduler/admin" element={<AdminPanel />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/tech-tips" element={<TechTips />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/profile" element={<Profile user={currentUser} />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App; 