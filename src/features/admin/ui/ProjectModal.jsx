import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../shared/Button';

import { getRememberedPassword } from '../services/passwordStorageService';

const COLOR_PRESETS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#6366F1'];
const STAGES = ['Planificación', 'Desarrollo', 'Pruebas', 'Despliegue'];

export const ProjectModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    project_slug: '',
    password: '',
    github_repo: '',
    testing_link: '',
    current_stage: 'Planificación',
    theme_color: '#10B981',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      const existingPass = getRememberedPassword(initialData);
      setFormData({
        client_name: initialData.client_name || '',
        project_slug: initialData.project_slug || '',
        password: existingPass,
        github_repo: initialData.github_repo || '',
        testing_link: initialData.testing_link || '',
        current_stage: initialData.current_stage || 'Planificación',
        theme_color: initialData.theme_color || '#10B981',
      });
    } else {
      setFormData({
        client_name: '',
        project_slug: '',
        password: '',
        github_repo: '',
        testing_link: '',
        current_stage: 'Planificación',
        theme_color: '#10B981',
      });
    }
    setShowPassword(Boolean(initialData));
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return; // Evita clics duplicados

    // 1. Validación previa en cliente antes de realizar la petición
    if (!formData.client_name.trim()) {
      setError('Por favor ingresa el nombre del cliente o espacio.');
      return;
    }
    if (!initialData && !formData.password.trim()) {
      setError('Por favor ingresa una contraseña para el acceso del cliente.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSubmit(formData);
      setSaving(false);
      onClose();
    } catch (err) {
      setSaving(false);
      if (err.status === 409) {
        setError('Ya existe un espacio registrado con este nombre. Por favor añade un identificador único (ej. "Cliente Alfa 2026").');
      } else if (err.status === 400) {
        setError('Por favor completa los campos obligatorios requeridos.');
      } else if (err.status === 429) {
        setError('Demasiadas solicitudes enviadas. Espera un momento antes de volver a guardar.');
      } else {
        setError(err.message || 'Ocurrió un error al procesar el proyecto.');
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/30 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg glass-card rounded-2xl p-4 sm:p-6 border-slate-200 shadow-2xl bg-white text-slate-900 overflow-hidden relative max-h-[92vh] flex flex-col"
        >
          <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-200 shrink-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              {initialData ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium shrink-0">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 space-y-3.5 sm:space-y-4 overflow-y-auto pr-1 flex-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del Cliente *</label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="ej. Acme Corporation"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 text-sm focus:outline-none placeholder-slate-400 bg-slate-50 border-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Slug de URL (Opcional)</label>
              <input
                type="text"
                value={formData.project_slug}
                onChange={(e) => setFormData({ ...formData, project_slug: e.target.value })}
                placeholder="se genera automáticamente si queda vacío"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 text-sm focus:outline-none placeholder-slate-400 bg-slate-50 border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {initialData ? 'Contraseña del Espacio (Cargada)' : 'Contraseña del Espacio *'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="******"
                  className="w-full px-3.5 py-2 pr-10 rounded-xl glass-input text-slate-900 text-sm focus:outline-none placeholder-slate-400 bg-slate-50 border-slate-200"
                  {...(!initialData ? { required: true } : {})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-blue-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {initialData && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Pulsa el icono del ojo para revelar la contraseña actual asignada a este espacio o editarla.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Repositorio GitHub</label>
                <input
                  type="text"
                  value={formData.github_repo}
                  onChange={(e) => setFormData({ ...formData, github_repo: e.target.value })}
                  placeholder="usuario/repo"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 text-sm focus:outline-none placeholder-slate-400 bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Enlace de Pruebas</label>
                <input
                  type="url"
                  value={formData.testing_link}
                  onChange={(e) => setFormData({ ...formData, testing_link: e.target.value })}
                  placeholder="https://staging.acme.com"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 text-sm focus:outline-none placeholder-slate-400 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Etapa Actual</label>
              <select
                value={formData.current_stage}
                onChange={(e) => setFormData({ ...formData, current_stage: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 text-sm focus:outline-none bg-slate-50 border-slate-200 cursor-pointer"
              >
                {STAGES.map((stg) => (
                  <option key={stg} value={stg} className="bg-white text-slate-900">
                    {stg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Color Temático del Cliente</label>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme_color: color })}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                      formData.theme_color === color ? 'scale-110 ring-2 ring-slate-800' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {formData.theme_color === color && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
                <input
                  type="color"
                  value={formData.theme_color}
                  onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                  className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
              <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                {saving ? 'Guardando...' : initialData ? 'Actualizar Proyecto' : 'Crear Proyecto'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
