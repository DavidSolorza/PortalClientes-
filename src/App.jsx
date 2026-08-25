import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoginView } from './features/auth/ui/LoginView';
import { AdminDashboard } from './features/admin/ui/AdminDashboard';
import { ClientPortalView } from './features/client-space/ui/ClientPortalView';
import { AnimatedLayout } from './shared/AnimatedLayout';

export default function App() {
  const [view, setView] = useState('login'); // 'login' | 'admin' | 'client'
  const [clientSlug, setClientSlug] = useState('');
  const [clientProject, setClientProject] = useState(null);
  const [isAdminPreview, setIsAdminPreview] = useState(false);

  const handleClientSuccess = (projectData) => {
    setClientProject(projectData);
    setClientSlug(projectData.project_slug);
    setIsAdminPreview(false);
    setView('client');
  };

  const handleAdminSuccess = () => {
    setIsAdminPreview(false);
    setView('admin');
  };

  const handlePreviewClientSpace = (projectData) => {
    setClientProject(projectData);
    setClientSlug(projectData.project_slug);
    setIsAdminPreview(true);
    setView('client');
  };

  const handleBackToAdmin = () => {
    setIsAdminPreview(false);
    setView('admin');
  };

  const handleLogout = () => {
    setView('login');
    setClientSlug('');
    setClientProject(null);
    setIsAdminPreview(false);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <AnimatedLayout key="login">
            <LoginView
              onClientSuccess={handleClientSuccess}
              onAdminSuccess={handleAdminSuccess}
            />
          </AnimatedLayout>
        )}

        {view === 'admin' && (
          <AnimatedLayout key="admin">
            <AdminDashboard
              onLogout={handleLogout}
              onPreviewSpace={handlePreviewClientSpace}
            />
          </AnimatedLayout>
        )}

        {view === 'client' && (
          <AnimatedLayout key="client">
            <ClientPortalView
              clientSlug={clientSlug}
              initialProjectData={clientProject}
              onLogout={handleLogout}
              isAdminPreview={isAdminPreview}
              onBackToAdmin={handleBackToAdmin}
            />
          </AnimatedLayout>
        )}
      </AnimatePresence>
    </div>
  );
}
