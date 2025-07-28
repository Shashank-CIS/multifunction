import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Scheduler from './pages/Scheduler';
import EngineerDirectory from './pages/EngineerDirectory';
import KnowledgeBase from './pages/KnowledgeBase';
import Collaboration from './pages/Collaboration';
import Mentorship from './pages/Mentorship';
import TechTips from './pages/TechTips';
import Challenges from './pages/Challenges';
import ProductionManagement from './pages/ProductionManagement';
import Profile from './pages/Profile';
import CurrentShiftDashboard from './pages/CurrentShiftDashboard';
import AdminPanel from './pages/AdminPanel';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/scheduler/engineers" element={<EngineerDirectory />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/tech-tips" element={<TechTips />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/production" element={<ProductionManagement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/preferences" element={<Profile />} />
            <Route path="/current-shift" element={<CurrentShiftDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App; 