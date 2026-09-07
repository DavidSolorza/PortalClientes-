import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Edit, Trash2, Globe, Clock, Eye, Mail } from 'lucide-react';
import { Card } from '../../../shared/Card';
import { format24HourTime } from '../../../shared/utils/dateFormatter';

const STAGES = ['Planificación', 'Desarrollo', 'Pruebas', 'Despliegue'];

const ProjectCard = ({ project, idx, onEdit, onDelete, onStageChange, onPreviewSpace }) => {
  const clientEmail = project.email || project.correo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
    >
      <Card
        onClick={() => onPreviewSpace && onPreviewSpace(project)}
        className="h-full flex flex-col justify-between border-slate-200/80 relative overflow-hidden group bg-white hover:border-blue-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        {/* Color Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: project.theme_color || '#3B82F6' }}
        />

        <div>
          <div className="flex justify-between items-start pt-1 mb-3">
            <div className="flex-1 pr-2">
              <h4 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <span>{project.client_name}</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">/{project.project_slug}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onPreviewSpace && onPreviewSpace(project)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Ver Espacio del Cliente"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(project)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Editar Proyecto (Cambiar Contraseña)"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(project)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selector Rápido de Etapa */}
          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Etapa Actual</label>
            <select
              value={project.current_stage}
              onChange={(e) => onStageChange(project, e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              {STAGES.map((stg) => (
                <option key={stg} value={stg} className="bg-white text-slate-900">
                  {stg}
                </option>
              ))}
            </select>
          </div>

          {/* Enlaces y Datos asociados */}
          <div className="space-y-2 text-xs">
            {clientEmail && (
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-sans text-[11px] text-slate-600">{clientEmail}</span>
              </div>
            )}
            {project.github_repo && (
              <div className="flex items-center gap-2 text-slate-600">
                <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-mono text-[11px]">{project.github_repo}</span>
              </div>
            )}
            {project.testing_link ? (
              <a
                href={project.testing_link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-emerald-600 hover:underline truncate font-medium"
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{project.testing_link}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-slate-400 text-[11px] block">Sin enlace de staging</span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">
              {format24HourTime(project.last_activity || project.updated_at || project.created_at)}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
            {project.current_stage}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};

export const ProjectList = ({ projects, onEdit, onDelete, onStageChange, onPreviewSpace }) => {
  if (!projects || projects.length === 0) {
    return (
      <Card hover={false} className="text-center py-12">
        <p className="text-slate-500 text-sm">No se encontraron proyectos registrados en esta vista.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project, idx) => (
        <ProjectCard
          key={project.id || project.project_slug}
          project={project}
          idx={idx}
          onEdit={onEdit}
          onDelete={onDelete}
          onStageChange={onStageChange}
          onPreviewSpace={onPreviewSpace}
        />
      ))}
    </div>
  );
};
