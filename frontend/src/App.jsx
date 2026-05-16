import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import HODDashboard from './pages/HODDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ResetPassword from './pages/ResetPassword';
import './index.css';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen font-semibold text-indigo-600">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (role && user.role !== role) {
    if (user.role === 'SuperAdmin') return <Navigate to="/super-admin" />;
    if (user.role === 'HOD') return <Navigate to="/hod-dashboard" />;
    return <Navigate to="/teacher-dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute role="SuperAdmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hod-dashboard" 
            element={
              <ProtectedRoute role="HOD">
                <HODDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher-dashboard" 
            element={
              <ProtectedRoute role="Teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
