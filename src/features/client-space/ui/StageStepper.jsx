import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Code, TestTube, Rocket } from 'lucide-react';

const STAGES = [
  { id: 'Planificación', label: 'Planificación', icon: Clock, desc: 'Definición de requerimientos y arquitectura' },
  { id: 'Desarrollo', label: 'Desarrollo', icon: Code, desc: 'Construcción modular de backend y frontend' },
  { id: 'Pruebas', label: 'Pruebas', icon: TestTube, desc: 'Control de calidad y pruebas de staging' },
  { id: 'Despliegue', label: 'Despliegue', icon: Rocket, desc: 'Puesta en producción y entrega final' },
];

export const StageStepper = ({ currentStage = 'Planificación', themeColor = '#3B82F6' }) => {
  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStage);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;
  const progressPercent = (activeIndex / (STAGES.length - 1)) * 100;

  return (
    <div className="w-full py-2 sm:py-6 overflow-x-auto no-scrollbar">
      <div className="relative min-w-[300px]">
        {/* Línea de Fondo Adaptativa */}
        <div className="absolute top-[18px] sm:top-6 left-4 sm:left-6 right-4 sm:right-6 h-1 bg-slate-200 rounded-full z-0" />

        {/* Línea de Progreso Animada */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `calc(${progressPercent}% - 8px)` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ backgroundColor: themeColor }}
          className="absolute top-[18px] sm:top-6 left-4 sm:left-6 h-1 rounded-full z-0 shadow-sm"
        />

        {/* Pasos */}
        <div className="relative z-10 flex justify-between items-start">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex flex-col items-center group w-1/4 px-0.5">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  style={{
                    backgroundColor: isActive || isCompleted ? themeColor : '#F1F5F9',
                    borderColor: isActive || isCompleted ? themeColor : '#CBD5E1',
                  }}
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                    isActive ? 'ring-4 ring-blue-500/20 scale-105 sm:scale-110' : ''
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  )}
                </motion.div>

                <div className="text-center mt-1.5 sm:mt-3 px-0.5">
                  <span
                    className={`block text-[10px] xs:text-[11px] sm:text-xs font-semibold leading-tight break-words ${
                      isActive ? 'text-slate-900 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="hidden md:block text-[10px] text-slate-500 mt-1 max-w-[120px] mx-auto leading-tight">
                    {stage.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
