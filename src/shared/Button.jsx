import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon: Icon = null,
  style = {},
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = {
    primary: 'text-white shadow-blue-500/20 hover:shadow-blue-500/35 active:scale-95',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 active:scale-95 shadow-sm',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20 active:scale-95',
    glass:
      'bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md border border-slate-200 active:scale-95 shadow-sm',
  };

  const styleAttr = variant === 'primary' ? { backgroundColor: 'var(--brand-color, #3B82F6)', ...style } : style;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styleAttr}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};
