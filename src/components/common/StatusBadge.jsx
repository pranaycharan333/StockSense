import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  if (!status) return null;

  const getStatusStyles = (text) => {
    const s = String(text).toLowerCase();

    // Positive / active / complete
    if (['in stock', 'received', 'delivered', 'completed', 'operational', 'low'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
    }

    // Warnings / pending / scheduled
    if (['low stock', 'pending', 'scheduled', 'moderate', 'warning'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
    }

    // In transit / in progress
    if (['in transit'].includes(s)) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20';
    }

    // Critical / danger / out of stock / high risk
    if (['out of stock', 'critical', 'high', 'near capacity', 'urgent'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
    }

    // Cancelled / neutral / closed
    if (['cancelled', 'archived', 'inactive'].includes(s)) {
      return 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-400/20';
    }

    return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-400/10';
  };

  const getDotColor = (text) => {
    const s = String(text).toLowerCase();
    if (['in stock', 'received', 'delivered', 'completed', 'operational', 'low'].includes(s)) return 'bg-emerald-500';
    if (['low stock', 'pending', 'scheduled', 'moderate', 'warning'].includes(s)) return 'bg-amber-500';
    if (['in transit'].includes(s)) return 'bg-indigo-500';
    if (['out of stock', 'critical', 'high', 'near capacity', 'urgent'].includes(s)) return 'bg-rose-500';
    return 'bg-slate-400';
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${sizeClasses} ${getStatusStyles(status)}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${getDotColor(status)} animate-pulse`} />
      {status}
    </span>
  );
};

export default StatusBadge;
