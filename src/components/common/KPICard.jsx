import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'neutral', // 'up' | 'down' | 'neutral'
  badgeColor = 'brand',
  onClick,
  badgeText
}) => {
  const colorMap = {
    brand: 'bg-teal-50 text-teal-600 border-teal-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${colorMap[badgeColor] || colorMap.brand}`}>
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between text-xs">
        {trend && (
          <div className="flex items-center gap-1 font-medium">
            {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
            {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
            <span
              className={
                trendDirection === 'up'
                  ? 'text-emerald-700'
                  : trendDirection === 'down'
                  ? 'text-rose-700'
                  : 'text-slate-600'
              }
            >
              {trend}
            </span>
          </div>
        )}

        {subtitle && (
          <span className="text-slate-500">{subtitle}</span>
        )}

        {badgeText && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default KPICard;
