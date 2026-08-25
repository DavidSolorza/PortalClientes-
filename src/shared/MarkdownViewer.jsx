import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Elimina emojis manteniendo intactos todos los saltos de linea, parrafos y bloques de Markdown
 */
const stripEmojis = (str) => {
  if (!str || typeof str !== 'string') return str || '';
  return str.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu,
    ''
  );
};

export const MarkdownViewer = ({ content, className = '' }) => {
  if (!content) {
    return (
      <div className="p-4 sm:p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-slate-200">
        No se encontró documentación README.md disponible en este repositorio.
      </div>
    );
  }

  const cleanContent = stripEmojis(content);

  return (
    <div className="w-full overflow-x-auto">
      <div
        className={`prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed 
          prose-headings:text-slate-900 prose-headings:font-bold prose-headings:border-b prose-headings:border-slate-100 prose-headings:pb-1 prose-headings:my-3 
          prose-h1:text-base sm:prose-h1:text-lg prose-h2:text-sm sm:prose-h2:text-base prose-h3:text-xs sm:prose-h3:text-sm 
          prose-p:text-slate-600 prose-p:my-2 prose-p:leading-relaxed prose-p:break-words
          prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-3 sm:prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-2 
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:break-all
          prose-code:font-mono prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[11px] sm:prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-code:break-all
          prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-3 sm:prose-pre:p-4 prose-pre:rounded-xl prose-pre:my-3 prose-pre:overflow-x-auto prose-pre:max-w-full
          prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-img:max-w-full prose-img:h-auto
          prose-table:overflow-x-auto prose-table:block sm:prose-table:table
          prose-ul:my-2 prose-ol:my-2 prose-li:my-1 ${className}`}
      >
        <ReactMarkdown>{cleanContent}</ReactMarkdown>
      </div>
    </div>
  );
};
