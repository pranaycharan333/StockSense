import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const InventoryMovementChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-lg border border-slate-800">
          <p className="font-bold mb-1.5 text-slate-200">{label}</p>
          <div className="space-y-1 font-mono">
            {payload.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="capitalize text-slate-300">{item.name}:</span>
                </span>
                <span className="font-semibold text-white">{item.value} units</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="receiptsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="deliveriesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="transfersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
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
          <Area
            type="monotone"
            dataKey="receipts"
            name="Inbound Receipts"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#receiptsGrad)"
          />
          <Area
            type="monotone"
            dataKey="deliveries"
            name="Outbound Deliveries"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#deliveriesGrad)"
          />
          <Area
            type="monotone"
            dataKey="transfers"
            name="Transfers"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#transfersGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryMovementChart;
