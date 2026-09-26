import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShoppingCart,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import KPICard from '../components/common/KPICard';
import ChartCard from '../components/charts/ChartCard';
import DemandTrendChart from '../components/charts/DemandTrendChart';
import StatusBadge from '../components/common/StatusBadge';
import AlertBanner from '../components/common/AlertBanner';
import { formatNumber } from '../utils/formatters';

export const AIInsights = () => {
  const { insights, showToast } = useInventory();
  const [approvedRecs, setApprovedRecs] = useState({});

  if (!insights) return null;

  const { kpis, highRiskProducts, anomalies, demandTrends, recommendations } = insights;

  const handleActionClick = (recId, actionText) => {
    setApprovedRecs(prev => ({ ...prev, [recId]: true }));
    showToast(`AI Recommendation executed: "${actionText}"`);
  };

  return (
    <div className="space-y-6">
      {/* Demo Warning / Disclaimers Banner */}
      <AlertBanner
        type="info"
        title="Predictive AI & Machine Learning Suite (Simulation Mode)"
        message="These intelligence forecasts and anomaly detections are generated via simulated statistical models. Connect your FastAPI ML model endpoint at /ai-insights to ingest live PyTorch/Scikit-Learn inference pipelines."
        actionButton={
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-md mt-1">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            FastAPI REST Ready • GET /api/ai-insights
          </span>
        }
      />

      {/* Top 5 KPI Cards Requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Demand Forecast"
          value={formatNumber(kpis.forecastDemandNext30Days)}
          subtitle="Next 30 Days (Units)"
          icon={TrendingUp}
          badgeColor="indigo"
          trend={kpis.demandGrowthRate}
          trendDirection="up"
        />

        <KPICard
          title="Stockout Risk"
          value={`${kpis.stockoutRiskPercentage}%`}
          subtitle="Composite vulnerability"
          icon={AlertTriangle}
          badgeColor="rose"
          trend="4 items at critical"
          trendDirection="down"
        />

        <KPICard
          title="Days Until Stockout"
          value={`${kpis.averageDaysUntilStockout}d`}
          subtitle="Fleet average burn time"
          icon={Clock}
          badgeColor="amber"
          trend="Based on 30d velocity"
          trendDirection="neutral"
        />

        <KPICard
          title="Reorder Quantity"
          value={formatNumber(kpis.recommendedReorderUnits)}
          subtitle="Recommended replenishment"
          icon={ShoppingCart}
          badgeColor="teal"
          trend="Across 3 critical nodes"
          trendDirection="up"
        />

        <KPICard
          title="Inventory Anomalies"
          value={kpis.anomaliesDetected}
          subtitle="Active variance flags"
          icon={AlertOctagon}
          badgeColor="purple"
          trend="2 shrinkages, 1 drift"
          trendDirection="down"
        />
      </div>

      {/* Demand Forecast Chart & Anomalies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Demand Forecast & Confidence Interval Band"
            subtitle="Historical actual shipments vs AI predictive curve with 95% Bayesian confidence range"
          >
            <DemandTrendChart data={demandTrends} />
          </ChartCard>
        </div>

        {/* Inventory Anomalies List */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Detected Anomalies</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {anomalies.length} Flagged
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time statistical drift and consumption irregularities.
            </p>

            <div className="space-y-3">
              {anomalies.map((ano) => (
                <div
                  key={ano.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{ano.title}</span>
                    <StatusBadge status={ano.severity} size="sm" />
                  </div>
                  <p className="text-[11px] font-medium text-teal-700 mb-1">{ano.product}</p>
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{ano.description}</p>
                  <div className="p-2 rounded bg-white border border-slate-200 text-[10px] text-slate-600">
                    <span className="font-semibold text-slate-800">Suggested Action:</span> {ano.suggestedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* High-Risk Products Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">High Stockout Risk Products</h3>
            <p className="text-xs text-slate-500">
              Items predicted to deplete below zero safety stock within 14 calendar days.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200">
            High Priority Replenishment
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500 bg-slate-50">
                <th className="p-3">Product & SKU</th>
                <th className="p-3">Warehouse</th>
                <th className="p-3 text-right">Current Stock</th>
                <th className="p-3 text-right">Daily Burn Rate</th>
                <th className="p-3 text-center">Days Remaining</th>
                <th className="p-3">Stockout Risk</th>
                <th className="p-3 text-right">Rec. Reorder</th>
                <th className="p-3">Operational Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {highRiskProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{p.sku}</div>
                  </td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">{p.warehouse}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {p.currentStock}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-600 whitespace-nowrap">
                    {p.dailyBurnRate}/day
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      p.daysRemaining <= 6 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.daysRemaining} days
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="w-28">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-rose-600">{p.stockoutRisk}%</span>
                        <span className="text-[10px] text-slate-400">{p.riskLevel}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full"
                          style={{ width: `${p.stockoutRisk}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-teal-700 whitespace-nowrap">
                    +{p.recommendedReorder} units
                  </td>
                  <td className="p-3 text-slate-500 text-[11px] max-w-xs">
                    {p.impact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendation Cards List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Prescriptive Action Plan</h3>
            <p className="text-xs text-slate-500">
              One-click autonomous decisions calculated to prevent stockouts and cut holding costs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((rec) => {
            const isApproved = approvedRecs[rec.id];

            return (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
                      {rec.warehouse}
                    </span>
                    <StatusBadge status={rec.priority} size="sm" />
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 leading-snug">
                    {rec.action}
                  </h4>

                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    {rec.reason}
                  </p>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 mb-4 text-xs">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Estimated ROI / Savings:
                    </span>
                    <span className="font-semibold text-emerald-900 text-xs">
                      {rec.potentialSavings}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleActionClick(rec.id, rec.action)}
                  disabled={isApproved}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                    isApproved
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Action Approved & Scheduled
                    </>
                  ) : (
                    <>
                      {rec.buttonText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
