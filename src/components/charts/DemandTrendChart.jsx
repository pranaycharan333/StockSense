import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const DemandTrendChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-lg border border-slate-800">
          <p className="font-bold mb-1.5 text-teal-400">{label}</p>
          <div className="space-y-1 font-mono">
            {payload.map((item, index) => {
              if (item.value === null || item.value === undefined) return null;
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300">{item.name}:</span>
                  </span>
                  <span className="font-semibold text-white">
                    {item.value.toLocaleString()} units
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[270px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />

          {/* Confidence interval area */}
          <Area
            type="monotone"
            dataKey="upperConfidence"
            name="95% Confidence Band"
            stroke="transparent"
            fill="url(#confidenceGrad)"
          />

          {/* Actual demand line */}
          <Line
            type="monotone"
            dataKey="actualDemand"
            name="Historical Actual Demand"
            stroke="#0d9488"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#0d9488' }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />

          {/* Predicted forecast line */}
          <Line
            type="monotone"
            dataKey="predictedDemand"
            name="AI Forecasted Demand"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#6366f1' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DemandTrendChart;
