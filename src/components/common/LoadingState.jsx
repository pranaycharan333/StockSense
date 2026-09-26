import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading inventory data...', rows = 5 }) => {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-teal-100 border-t-teal-600 animate-spin" />
        <Loader2 className="w-5 h-5 text-teal-600 absolute inset-0 m-auto animate-pulse opacity-60" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Synchronizing with system records...</p>
    </div>
  );
};

export default LoadingState;
