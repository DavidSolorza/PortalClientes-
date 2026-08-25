import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Clock, ExternalLink, RefreshCw, FileText } from 'lucide-react';
import { Card } from '../../../shared/Card';
import { fetchGitHubCommits, fetchGitHubReadme } from '../services/githubService';
import { MarkdownViewer } from '../../../shared/MarkdownViewer';

const fallbackActivities = [
  {
    id: '1',
    title: 'Sincronización en tiempo real activa',
    desc: 'Escuchando eventos de actualización del espacio en la base de datos.',
    time: 'Hace un momento',
    type: 'commit',
    sha: 'main',
  },
  {
    id: '2',
    title: 'Configuración inicial del espacio',
    desc: 'Asignación de etapa del ciclo de vida y color temático de marca.',
    time: 'Reciente',
    type: 'commit',
    sha: 'init',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const ActivityTimeline = ({ githubRepo = '', themeColor = '#3B82F6' }) => {
  const [activeTab, setActiveTab] = useState('commits'); // 'commits' | 'readme'
  const [commits, setCommits] = useState([]);
  const [readme, setReadme] = useState('');
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [loadingReadme, setLoadingReadme] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (githubRepo) {
      setLoadingCommits(true);
      fetchGitHubCommits(githubRepo)
        .then((data) => {
          if (isMounted) {
            setCommits(data);
            setLoadingCommits(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingCommits(false);
        });

      setLoadingReadme(true);
      fetchGitHubReadme(githubRepo)
        .then((content) => {
          if (isMounted) {
            setReadme(content || '');
            setLoadingReadme(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingReadme(false);
        });
    } else {
      setCommits([]);
      setReadme('');
      setLoadingCommits(false);
      setLoadingReadme(false);
    }
    return () => {
      isMounted = false;
    };
  }, [githubRepo]);

  const displayCommits = commits.length > 0 ? commits : fallbackActivities;

  return (
    <Card hover={false} className="border-slate-200 bg-white shadow-lg p-4 sm:p-6">
      {/* Selector de Pestañas Adaptativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('commits')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'commits'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Commits Recientes</span>
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'readme'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documentación (.md)</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {(loadingCommits || loadingReadme) && (
            <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          )}
          <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono border border-slate-200">
            {githubRepo ? 'GitHub Sync' : 'Live Sync'}
          </span>
        </div>
      </div>

      {/* Pestaña Commits */}
      {activeTab === 'commits' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 max-h-[500px] overflow-y-auto pr-1"
        >
          {displayCommits.map((act) => (
            <motion.div
              key={act.id}
              variants={itemVariants}
              className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
            >
              <div
                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                className="p-1.5 sm:p-2 rounded-lg shrink-0 mt-0.5 border border-slate-200/50"
              >
                <GitCommit className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-slate-900 break-words">{act.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">{act.time}</span>
                </div>
                {act.desc && <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">{act.desc}</p>}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {act.sha && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
                      <span>commit:</span>
                      <span className="text-slate-900 font-semibold">{act.sha}</span>
                    </div>
                  )}
                  {act.url && (
                    <a
                      href={act.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-medium ml-auto sm:ml-0"
                    >
                      <span>Ver en GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pestaña README / Markdown */}
      {activeTab === 'readme' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-h-[520px] overflow-y-auto pr-1"
        >
          {loadingReadme ? (
            <div className="text-center py-12">
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 mt-2">Convirtiendo y renderizando README.md...</p>
            </div>
          ) : (
            <MarkdownViewer content={readme} />
          )}
        </motion.div>
      )}
    </Card>
  );
};
