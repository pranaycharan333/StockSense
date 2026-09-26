import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'No matching records match your current search or filter criteria.',
  actionButton
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
      <div className="p-3.5 bg-slate-50 text-slate-400 rounded-full border border-slate-100 mb-3.5">
        <Icon className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
