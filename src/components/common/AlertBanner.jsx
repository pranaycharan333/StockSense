import React from 'react';
import { AlertTriangle, Info, CheckCircle2, AlertOctagon, X } from 'lucide-react';

export const AlertBanner = ({
  type = 'warning', // warning, info, success, danger
  title,
  message,
  onClose,
  actionButton,
  className = ''
}) => {
  const configs = {
    warning: {
      bg: 'bg-amber-50/90 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    danger: {
      bg: 'bg-rose-50/90 border-rose-200 text-rose-900',
      icon: AlertOctagon,
      iconColor: 'text-rose-600',
    },
    info: {
      bg: 'bg-blue-50/90 border-blue-200 text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    success: {
      bg: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    }
  }[type] || configs.warning;

  const Icon = configs.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${configs.bg} shadow-xs ${className}`}>
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${configs.iconColor}`} />
      <div className="flex-1 text-xs">
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <p className="opacity-90 leading-relaxed">{message}</p>
        {actionButton && <div className="mt-2">{actionButton}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
