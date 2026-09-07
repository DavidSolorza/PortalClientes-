import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoginView } from './features/auth/ui/LoginView';
import { AdminDashboard } from './features/admin/ui/AdminDashboard';
import { ClientPortalView } from './features/client-space/ui/ClientPortalView';
import { AnimatedLayout } from './shared/AnimatedLayout';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error no capturado en la aplicación:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white border border-slate-200 shadow-xl rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900">Ocurrió un inconveniente al cargar</h3>
            <p className="text-xs text-slate-500 mt-2">
              {this.state.error?.message || 'Se produjo un error al procesar el espacio. Por favor intenta de nuevo.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = window.location.pathname;
              }}
              className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [view, setView] = useState('login'); // 'login' | 'admin' | 'client'
  const [clientSlug, setClientSlug] = useState('');
  const [clientProject, setClientProject] = useState(null);
  const [isAdminPreview, setIsAdminPreview] = useState(false);

  const handleClientSuccess = (projectData) => {
    if (!projectData) return;
    const project = projectData.project || projectData.data || projectData;
    const slug = project.project_slug || project.slug || project.id || '';
    setClientProject(project);
    setClientSlug(slug);
    setIsAdminPreview(false);
    setView('client');
  };

  const handleAdminSuccess = () => {
    setIsAdminPreview(false);
    setView('admin');
  };

  const handlePreviewClientSpace = (projectData) => {
    if (!projectData) return;
    const project = projectData.project || projectData.data || projectData;
    const slug = project.project_slug || project.slug || project.id || '';
    setClientProject(project);
    setClientSlug(slug);
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
