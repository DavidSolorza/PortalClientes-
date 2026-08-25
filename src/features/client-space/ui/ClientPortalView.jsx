import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Github, MessageCircle, LogOut, ShieldCheck, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';
import { useClientPortal } from '../hooks/useClientPortal';
import { StageStepper } from './StageStepper';
import { ActivityTimeline } from './ActivityTimeline';
import { Button } from '../../../shared/Button';
import { Card } from '../../../shared/Card';
import { parseGitHubRepo } from '../services/githubService';
import { SUPPORT_PHONE } from '../../../core/config/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const ClientPortalView = ({ clientSlug, initialProjectData, onLogout, isAdminPreview = false, onBackToAdmin }) => {
  const { project, loading, error } = useClientPortal(clientSlug, initialProjectData);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-4">Cargando el espacio de tu proyecto...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card hover={false} className="max-w-md w-full text-center bg-white border-slate-200 shadow-xl">
          <h3 className="text-lg font-bold text-slate-900">Proyecto No Encontrado</h3>
          <p className="text-xs text-slate-500 mt-2">{error || 'No se pudo acceder a la informacion de este portal.'}</p>
          <Button onClick={isAdminPreview ? onBackToAdmin : onLogout} className="mt-6">
            {isAdminPreview ? 'Volver al Panel Admin' : 'Volver al Inicio'}
          </Button>
        </Card>
      </div>
    );
  }

  const themeColor = project.theme_color || '#3B82F6';
  const whatsappUrl = `https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(
    `Hola, me contacto por el seguimiento del proyecto ${project.client_name}`
  )}`;

  const parsedRepo = parseGitHubRepo(project.github_repo);
  const githubWebUrl = parsedRepo ? `https://github.com/${parsedRepo.owner}/${parsedRepo.repo}` : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-3 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Luces de Fondo Glassmorphic Claras */}
      <div
        style={{ backgroundColor: `${themeColor}12` }}
        className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[90px] sm:blur-[120px] pointer-events-none"
      />
      <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-slate-200/40 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-6 sm:space-y-8 relative z-10"
      >
        {/* Banner Superior de Vista Previa Admin */}
        {isAdminPreview && (
          <motion.div
            variants={itemVariants}
            className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800 shadow-sm"
          >
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Modo Vista Previa Administrador</span>
            </div>
            <button
              onClick={onBackToAdmin}
              className="px-3 py-1 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-semibold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Dashboard</span>
            </button>
          </motion.div>
        )}

        {/* Navbar / Header del Cliente (Cascada 1) */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: themeColor }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md text-white font-bold text-lg"
            >
              {project.client_name ? project.client_name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                <span>{project.client_name}</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Espacio de seguimiento en tiempo real
              </p>
            </div>
          </div>

          {isAdminPreview ? (
            <Button onClick={onBackToAdmin} icon={ArrowLeft} className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white">
              Volver al Dashboard Admin
            </Button>
          ) : (
            <Button variant="secondary" onClick={onLogout} icon={LogOut} className="self-start sm:self-auto text-slate-700 border-slate-200 bg-white hover:bg-slate-100">
              Cerrar Sesión
            </Button>
          )}
        </motion.div>

        {/* Banner Principal de Estado (Cascada 2) */}
        <motion.div variants={itemVariants}>
          <Card hover={false} className="border-slate-200 bg-white relative overflow-hidden shadow-lg">
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: themeColor }}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 mb-3 font-medium">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: themeColor }} />
                  <span>Estado Actual: <strong className="text-slate-900">{project.current_stage}</strong></span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Progreso del Desarrollo
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
                  Monitorea las fases del proyecto, accede a la versión de pruebas activa y consulta los últimos avances registrados por el equipo técnico.
                </p>
              </div>

              {/* Botón Acción Destacada */}
              {project.testing_link && (
                <a
                  href={project.testing_link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0"
                >
                  <Button size="lg" icon={Globe} style={{ backgroundColor: themeColor }} className="w-full sm:w-auto">
                    Abrir Entorno de Pruebas
                  </Button>
                </a>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Stepper de 4 Etapas Animado (Cascada 3) */}
        <motion.div variants={itemVariants}>
          <Card hover={false} className="border-slate-200 bg-white shadow-lg">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Fases del Ciclo de Vida</h3>
            <StageStepper currentStage={project.current_stage} themeColor={themeColor} />
          </Card>
        </motion.div>

        {/* Sección de Recursos y Actividad Reciente de GitHub (Cascada 4 y 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ActivityTimeline githubRepo={project.github_repo} themeColor={themeColor} />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            {/* Tarjeta de Entorno de Pruebas Activo */}
            <Card hover={false} className="border-blue-200 bg-blue-50/40 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 pb-2 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Entorno de Pruebas</span>
                </div>
                {project.testing_link ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Activo / Staging</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                    En Preparación
                  </span>
                )}
              </h3>

              <div className="text-xs">
                <p className="text-slate-600 mb-3 leading-relaxed">
                  {project.testing_link
                    ? 'Accede al prototipo activo del proyecto para probar las funcionalidades en desarrollo.'
                    : 'El equipo técnico está desplegando el enlace de pruebas para este proyecto.'}
                </p>

                {project.testing_link ? (
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-white border border-blue-200 text-blue-700 font-mono text-[11px] truncate flex items-center justify-between">
                      <span className="truncate">{project.testing_link}</span>
                    </div>
                    <a href={project.testing_link} target="_blank" rel="noreferrer" className="block">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-blue-600/20"
                        icon={ExternalLink}
                      >
                        Ver Entorno de Pruebas
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200 text-slate-500 text-center italic text-[11px]">
                    El enlace estará disponible una vez inicie la fase de pruebas.
                  </div>
                )}
              </div>
            </Card>

            {/* Tarjeta de Repositorio GitHub */}
            <Card hover={false} className="border-slate-200 bg-white shadow-lg">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Repositorio del Código</span>
              </h3>

              <div className="text-xs">
                <span className="text-slate-500 block mb-1.5 font-medium">Repositorio GitHub</span>
                {project.github_repo ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono">
                      <Github className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="truncate">{project.github_repo}</span>
                    </div>
                    {githubWebUrl && (
                      <a
                        href={githubWebUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium pt-1"
                      >
                        <span>Abrir Repositorio en GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 text-xs italic">Repositorio no configurado</span>
                )}
              </div>
            </Card>

            {/* Tarjeta de Soporte Directo por WhatsApp */}
            <Card hover={false} className="border-emerald-200 bg-emerald-50/50 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">¿Tienes alguna duda o requerimiento?</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Ponte en contacto directo con tu líder de proyecto asignado.
              </p>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-emerald-600/20"
                  icon={MessageCircle}
                >
                  Contactar por WhatsApp
                </Button>
              </a>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
