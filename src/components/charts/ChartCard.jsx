import React from 'react';

export const ChartCard = ({
  title,
  subtitle,
  action,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="self-start sm:self-auto">{action}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
