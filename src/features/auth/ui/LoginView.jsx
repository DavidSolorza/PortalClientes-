import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, User, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../shared/Button';
import { Card } from '../../../shared/Card';
import { SUPPORT_PHONE } from '../../../core/config/constants';

export const LoginView = ({ onClientSuccess, onAdminSuccess }) => {
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loginClient, loading, error, setError } = useAuth();

  // Lectura automática de parámetros de la URL desde enlaces de correo (ej. ?slug=demo&password=clave123)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#\/?/, '?'));

    const getParam = (key) => searchParams.get(key) || hashParams.get(key);

    const initialSlug =
      getParam('slug') ||
      getParam('user') ||
      getParam('usuario') ||
      getParam('project') ||
      getParam('identificador') ||
      getParam('space') ||
      '';

    const initialPassword =
      getParam('password') ||
      getParam('pass') ||
      getParam('clave') ||
      getParam('key') ||
      getParam('token') ||
      '';

    if (initialSlug) setSlug(initialSlug);
    if (initialPassword) setPassword(initialPassword);

    // Auto-login instantáneo si el enlace contiene ambas credenciales
    if (initialSlug && initialPassword) {
      const autoLogin = async () => {
        const cleanSlug = initialSlug.trim();
        const cleanPassword = initialPassword.trim();

        if (cleanSlug.toLowerCase() === 'admin' && cleanPassword === '210910624Dj') {
          localStorage.setItem('admin_api_key', 'core_backend_secret_key_2026');
          onAdminSuccess();
          return;
        }

        try {
          const projectData = await loginClient(cleanSlug, cleanPassword);
          onClientSuccess(projectData);
        } catch {
          // Si falla, los campos quedan llenos para corregir manualmente
        }
      };
      autoLogin();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Evita clics duplicados durante la verificación
    setError(null);

    const cleanSlug = slug.trim();
    const cleanPassword = password.trim();

    // Verificación unificada para cuenta Administrador
    if (cleanSlug.toLowerCase() === 'admin' && cleanPassword === '210910624Dj') {
      localStorage.setItem('admin_api_key', 'core_backend_secret_key_2026');
      onAdminSuccess();
      return;
    }

    if (!cleanSlug || !cleanPassword) {
      setError('Por favor ingresa el identificador del proyecto y la contraseña.');
      return;
    }

    try {
      const projectData = await loginClient(cleanSlug, cleanPassword);
      onClientSuccess(projectData);
    } catch (err) {
      // El mensaje estructurado de error es gestionado por useAuth
    }
  };

  const whatsappHelpUrl = `https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(
    'Hola, tengo problemas para ingresar a mi espacio en el portal de clientes o no me acuerdo de mi contraseña.'
  )}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-slate-50 text-slate-900">
      {/* Luces de Fondo Glassmorphic Claras */}
      <div className="absolute -top-40 -left-40 w-72 sm:w-96 h-72 sm:h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card hover={false} className="border-slate-200/80 shadow-2xl backdrop-blur-xl bg-white/95 p-5 sm:p-8">
          <div className="text-center mb-6 sm:mb-8 pb-3.5 sm:pb-4 border-b border-slate-100">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Portal de Acceso</h2>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tus credenciales de cliente o de administración
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium space-y-2"
            >
              <p className="text-center leading-relaxed">{error}</p>
              <div className="pt-2 border-t border-rose-200/70 flex items-center justify-between text-[11px]">
                <span className="text-rose-800 font-normal">¿Olvidaste tu contraseña?</span>
                <a
                  href={whatsappHelpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Soporte WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            <div>
              <label htmlFor="slug" className="block text-xs font-medium text-slate-700 mb-1.5">
                Identificador o Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  autoComplete="username"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ej. acme-ecommerce o Admin"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-900 text-sm focus:outline-none placeholder-slate-400 border-slate-200 bg-slate-50/50"
                  required
                />
                <User className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl glass-input text-slate-900 text-sm focus:outline-none placeholder-slate-400 border-slate-200 bg-slate-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 text-sm font-semibold"
              icon={ArrowRight}
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Banner Estratégico de Ayuda por WhatsApp */}
          <div className="mt-5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">¿Problemas para ingresar?</span>
            <a
              href={whatsappHelpUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pedir Ayuda</span>
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Sistema unificado con seguridad scrypt y sincronización activa en tiempo real.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
