import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, RefreshCw, Eye, EyeOff, Copy, Check, Sparkles, Lock } from 'lucide-react';
import { Button } from '../../../shared/Button';
import { resetProjectPassword } from '../services/adminService';

export const ResetPasswordModal = ({ isOpen, onClose, project }) => {
  const [customPassword, setCustomPassword] = useState('');
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen || !project) return null;

  const slug = project.project_slug || project.slug || project.id;
  const clientName = project.client_name || 'Cliente';

  const handleReset = async (generateRandom) => {
    setLoading(true);
    setMessage(null);
    setErrorMsg(null);
    setCopied(false);

    try {
      const payload = generateRandom ? {} : { password: customPassword.trim() };
      const res = await resetProjectPassword(slug, payload);

      const newPass = res.new_password || res.password || (!generateRandom ? customPassword.trim() : '');
      setRevealedPassword(newPass);
      setMessage('¡Contraseña de espacio actualizada exitosamente!');
      setCustomPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Error al restablecer la contraseña en el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (revealedPassword) {
      navigator.clipboard.writeText(revealedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setCustomPassword('');
    setRevealedPassword(null);
    setMessage(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-900 relative"
        >
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Restablecer Contraseña</h3>
                <p className="text-xs text-slate-500">Genera una clave aleatoria o asigna una personalizada</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Espacio de Cliente: </span>
            <span className="text-blue-600 font-bold">{clientName}</span>{' '}
            <span className="font-mono text-slate-400 text-[11px]">({slug})</span>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Opción 1: Escribir contraseña manual */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Modo B: Contraseña Personalizada
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingresa nueva clave..."
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <Button
                onClick={() => handleReset(false)}
                disabled={loading || !customPassword.trim()}
                className="px-4 py-2 text-xs font-semibold shrink-0"
              >
                Guardar
              </Button>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">o</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Opción 2: Generar aleatoria */}
          <button
            type="button"
            onClick={() => handleReset(true)}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs py-2.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mb-4 shadow-sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            <span>{loading ? 'Generando en servidor...' : 'Modo A: Generar Contraseña Segura Aleatoria'}</span>
          </button>

          {/* Resultado: Muestra la nueva contraseña generada */}
          {revealedPassword && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl"
            >
              <p className="text-xs text-emerald-800 font-semibold mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{message || '¡Nueva contraseña activa para el cliente!'}</span>
              </p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tracking-wider">
                  {showPassword ? revealedPassword : '••••••••••••'}
                </span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Ocultar' : 'Ver'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg text-white font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '✓ Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                Copia esta contraseña y compártela con el cliente por WhatsApp para que pueda ingresar a su portal.
              </p>
            </motion.div>
          )}

          {/* Botón Cerrar */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
