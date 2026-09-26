import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#0d9488', // teal-600
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#10b981', // emerald-500
  '#8b5cf6', // purple-500
];

export const StockByCategoryChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-xs text-slate-400">No category stock data available</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-slate-800">
          <p className="font-semibold">{item.name}</p>
          <p className="text-teal-400 font-mono mt-0.5">
            {item.value.toLocaleString()} units ({percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4">
      <div className="w-full md:w-3/5 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-2/5 flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
        {data.map((entry, idx) => {
          const percent = total > 0 ? Math.round((entry.value / total) * 100) : 0;
          return (
            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-600 truncate">{entry.name}</span>
              </div>
              <span className="font-semibold text-slate-800 tabular-nums">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockByCategoryChart;
