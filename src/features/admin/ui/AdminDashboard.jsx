import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, RefreshCw, LogOut, Layers, ExternalLink, Activity } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { ProjectList } from './ProjectList';
import { ProjectModal } from './ProjectModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { Button } from '../../../shared/Button';
import { Card } from '../../../shared/Card';

const STAGES = ['Planificación', 'Desarrollo', 'Pruebas', 'Despliegue'];

export const AdminDashboard = ({ onLogout, onPreviewSpace }) => {
  const {
    projects,
    metrics,
    loading,
    error,
    selectedStage,
    setSelectedStage,
    searchTerm,
    setSearchTerm,
    refreshData,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Estado para Modal de Restablecimiento de Contraseña
  const [resetProject, setResetProject] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const openResetModal = (project) => {
    setResetProject(project);
    setIsResetModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (editingProject) {
      await handleUpdate(editingProject.id || editingProject.project_slug, formData);
    } else {
      await handleCreate(formData);
    }
  };

  const handleStageChange = async (project, newStage) => {
    await handleUpdate(project.id || project.project_slug, { current_stage: newStage });
  };

  const handleDeleteConfirm = async (project) => {
    if (window.confirm(`Desea eliminar el proyecto de ${project.client_name}?`)) {
      await handleDelete(project.id || project.project_slug);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Haz clic en cualquier tarjeta de proyecto para ingresar directamente a su espacio de cliente
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="secondary" onClick={refreshData} icon={RefreshCw} className="flex-1 sm:flex-none text-xs py-2">
              Actualizar
            </Button>
            <Button onClick={openCreateModal} icon={Plus} className="flex-1 sm:flex-none text-xs py-2">
              Nuevo Proyecto
            </Button>
            <Button variant="secondary" onClick={onLogout} icon={LogOut} className="flex-1 sm:flex-none text-xs py-2 text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100">
              Salir
            </Button>
          </div>
        </div>

        {/* Tarjetas de Métricas */}
        {metrics && (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card hover={false} className="border-slate-200 bg-white p-3.5 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500">Total de Proyectos</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{metrics.total_projects}</h3>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Card>

            <Card hover={false} className="border-slate-200 bg-white p-3.5 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500">Enlaces Staging Activos</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">
                    {metrics.active_testing_links}
                  </h3>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Card>

            <Card hover={false} className="border-slate-200 bg-white p-3.5 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500">En Dev / Pruebas</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-600 mt-0.5">
                    {(metrics.stages_breakdown?.Desarrollo || 0) +
                      (metrics.stages_breakdown?.Pruebas || 0)}
                  </h3>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Card>

            <Card hover={false} className="border-slate-200 bg-white p-3.5 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500">En Despliegue</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-indigo-600 mt-0.5">
                    {metrics.stages_breakdown?.Despliegue || 0}
                  </h3>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl glass-card border-slate-200 bg-white">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente o slug..."
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-slate-900 text-xs focus:outline-none placeholder-slate-400 bg-slate-50 border-slate-200"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs text-slate-500 font-medium shrink-0">Etapa:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 text-slate-800 text-xs border border-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="">Todas las Etapas</option>
              {STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Listado de Proyectos */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs text-slate-500 mt-3">Cargando proyectos en tiempo real...</p>
          </div>
        ) : (
          <ProjectList
            projects={projects}
            onEdit={openEditModal}
            onResetPassword={openResetModal}
            onDelete={handleDeleteConfirm}
            onStageChange={handleStageChange}
            onPreviewSpace={onPreviewSpace}
          />
        )}
      </div>

      {/* Modal de Creación / Edición */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingProject}
      />

      {/* Modal de Restablecimiento de Contraseña (OWASP compliant / POST /reset-password) */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        project={resetProject}
      />
    </div>
  );
};
