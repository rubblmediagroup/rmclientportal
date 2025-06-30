import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import AdminDashboard from '@/pages/AdminDashboard';
import ClientPortal from '@/pages/ClientPortal';
import ProjectTasks from '@/pages/ProjectTasks';
import TeamManagement from '@/pages/TeamManagement';
import KnowledgeBase from '@/pages/KnowledgeBase';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="rubbl-ui-theme">
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/projects" element={
                <ProtectedRoute requiredRole="admin">
                  <ProjectTasks />
                </ProtectedRoute>
              } />
              <Route path="/admin/tasks" element={
                <ProtectedRoute requiredRole="admin">
                  <ProjectTasks />
                </ProtectedRoute>
              } />
              <Route path="/admin/team" element={
                <ProtectedRoute requiredRole="admin">
                  <TeamManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/knowledge" element={
                <ProtectedRoute requiredRole="admin">
                  <KnowledgeBase />
                </ProtectedRoute>
              } />
              
              {/* Client Routes */}
              <Route path="/client" element={
                <ProtectedRoute requiredRole="client">
                  <ClientPortal />
                </ProtectedRoute>
              } />
              <Route path="/client/projects" element={
                <ProtectedRoute requiredRole="client">
                  <ProjectTasks />
                </ProtectedRoute>
              } />
              <Route path="/client/tasks" element={
                <ProtectedRoute requiredRole="client">
                  <ProjectTasks />
                </ProtectedRoute>
              } />
              <Route path="/client/team" element={
                <ProtectedRoute requiredRole="client">
                  <TeamManagement />
                </ProtectedRoute>
              } />
              <Route path="/client/knowledge" element={
                <ProtectedRoute requiredRole="client">
                  <KnowledgeBase />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;