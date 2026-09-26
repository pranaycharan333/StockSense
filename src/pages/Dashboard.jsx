import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  Layers,
  AlertTriangle,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import KPICard from '../components/common/KPICard';
import ChartCard from '../components/charts/ChartCard';
import StockByCategoryChart from '../components/charts/StockByCategoryChart';
import StockByWarehouseChart from '../components/charts/StockByWarehouseChart';
import InventoryMovementChart from '../components/charts/InventoryMovementChart';
import StatusBadge from '../components/common/StatusBadge';
import AlertBanner from '../components/common/AlertBanner';
import { formatNumber } from '../utils/formatters';

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    kpis,
    stockByCategory,
    stockByWarehouse,
    movementChartData,
    products,
    ledger,
    warehouses,
    insights,
    dashboardFilter,
    setDashboardFilter
  } = useInventory();

  const lowStockList = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock');
  const recentMovements = ledger.slice(0, 5);

  const categories = [
    'Industrial Parts',
    'Electronics',
    'Chemicals & Fluids',
    'Packaging',
    'Safety & PPE',
    'Raw Materials'
  ];

  const handleResetFilters = () => {
    setDashboardFilter({
      warehouse: 'all',
      category: 'all',
      stockStatus: 'all',
      dateRange: 'all'
    });
  };

  const hasActiveFilters =
    dashboardFilter.warehouse !== 'all' ||
    dashboardFilter.category !== 'all' ||
    dashboardFilter.stockStatus !== 'all' ||
    dashboardFilter.dateRange !== 'all';

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Inventory Operations Overview</h2>
          <p className="text-xs text-slate-500">Live operational metrics aggregated across facilities.</p>
        </div>

        {/* Dashboard Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Warehouse Filter */}
          <select
            value={dashboardFilter.warehouse}
            onChange={(e) => setDashboardFilter({ ...dashboardFilter, warehouse: e.target.value })}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.name}>{w.name}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={dashboardFilter.category}
            onChange={(e) => setDashboardFilter({ ...dashboardFilter, category: e.target.value })}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={dashboardFilter.stockStatus}
            onChange={(e) => setDashboardFilter({ ...dashboardFilter, stockStatus: e.target.value })}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={dashboardFilter.dateRange}
            onChange={(e) => setDashboardFilter({ ...dashboardFilter, dateRange: e.target.value })}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All-Time</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Products"
          value={formatNumber(kpis.totalProducts)}
          subtitle="Catalog active SKUs"
          icon={Boxes}
          badgeColor="teal"
          trend="+4 new this month"
          trendDirection="up"
          onClick={() => navigate('/products')}
        />
        <KPICard
          title="Total Stock Units"
          value={formatNumber(kpis.totalStock)}
          subtitle="Aggregated on hand"
          icon={Layers}
          badgeColor="blue"
          trend="92.4% facility capacity"
          trendDirection="neutral"
        />
        <KPICard
          title="Low Stock Items"
          value={kpis.lowStockItems}
          subtitle="Below reorder threshold"
          icon={AlertTriangle}
          badgeColor="amber"
          trend="Requires PO replenishment"
          trendDirection="down"
          onClick={() => navigate('/products')}
        />
        <KPICard
          title="Out of Stock Items"
          value={kpis.outOfStockItems}
          subtitle="Zero available balance"
          icon={XCircle}
          badgeColor="rose"
          trend="Critical production halt"
          trendDirection="down"
          onClick={() => navigate('/products')}
        />
      </div>

      {/* Secondary Operations KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Pending Inbound Receipts"
          value={kpis.pendingReceipts}
          subtitle="Incoming supplier POs"
          icon={ArrowDownLeft}
          badgeColor="teal"
          onClick={() => navigate('/receipts')}
          badgeText="Inbound Dock"
        />
        <KPICard
          title="Pending Outbound Deliveries"
          value={kpis.pendingDeliveries}
          subtitle="Customer shipments in queue"
          icon={ArrowUpRight}
          badgeColor="blue"
          onClick={() => navigate('/deliveries')}
          badgeText="Dispatch Bay"
        />
        <KPICard
          title="Scheduled Transfers"
          value={kpis.scheduledTransfers}
          subtitle="Inter-facility rebalancing"
          icon={ArrowLeftRight}
          badgeColor="purple"
          onClick={() => navigate('/transfers')}
          badgeText="Transit Network"
        />
      </div>

      {/* Low-stock Alerts Banner if any */}
      {lowStockList.length > 0 && (
        <AlertBanner
          type="warning"
          title={`Attention: ${lowStockList.length} items require inventory restocking`}
          message={`${lowStockList.map(p => p.name).slice(0, 3).join(', ')}${lowStockList.length > 3 ? ` and ${lowStockList.length - 3} more` : ''} are at or below target reorder buffers.`}
          actionButton={
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
            >
              Inspect low-stock products in catalog &rarr;
            </button>
          }
        />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Stock Volume by Category"
          subtitle="Percentage distribution of inventory units across product categories"
        >
          <StockByCategoryChart data={stockByCategory} />
        </ChartCard>

        <ChartCard
          title="Stock Distribution by Warehouse"
          subtitle="Physical item capacity comparison across active supply nodes"
        >
          <StockByWarehouseChart data={stockByWarehouse} />
        </ChartCard>
      </div>

      {/* Inventory Movement Flow Chart */}
      <ChartCard
        title="Weekly Inventory Flow (Receipts vs Deliveries vs Transfers)"
        subtitle="Tracking multi-facility material movement velocities"
      >
        <InventoryMovementChart data={movementChartData} />
      </ChartCard>

      {/* Bottom Grid: Recent Movements & AI Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Stock Movements Table (2 columns wide) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Stock Movements</h3>
              <p className="text-xs text-slate-500">Latest immutable entries from the stock ledger</p>
            </div>
            <button
              onClick={() => navigate('/ledger')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Full Ledger <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="pb-2.5">Date / Time</th>
                  <th className="pb-2.5">Product</th>
                  <th className="pb-2.5">Type</th>
                  <th className="pb-2.5 text-right">Quantity</th>
                  <th className="pb-2.5">Source &rarr; Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {recentMovements.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 text-slate-500 whitespace-nowrap">{entry.date}</td>
                    <td className="py-2.5 font-medium text-slate-800 whitespace-nowrap">
                      {entry.productName}
                    </td>
                    <td className="py-2.5 whitespace-nowrap">
                      <StatusBadge status={entry.operationType} size="sm" />
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold whitespace-nowrap">
                      <span className={entry.numericQuantity > 0 ? 'text-emerald-600' : 'text-slate-700'}>
                        {entry.quantity}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500 text-[11px] truncate max-w-[200px]">
                      {entry.from} &rarr; {entry.to}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations Section (1 column wide) */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-xl p-5 shadow-md flex flex-col justify-between border border-indigo-900/60">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">AI Prescriptive Actions</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Demo
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mb-4 leading-relaxed">
              Algorithmic inventory intelligence calculated 3 optimal rebalancing recommendations.
            </p>

            <div className="space-y-3">
              {insights?.recommendations?.slice(0, 2).map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-850/90 rounded-lg p-3 border border-indigo-500/20 hover:border-indigo-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{rec.action}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2 leading-tight">
                    {rec.reason}
                  </p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-medium">{rec.potentialSavings}</span>
                    <span className="text-slate-400 font-mono">{rec.sku}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={() => navigate('/insights')}
              className="w-full py-2 px-3 text-xs font-semibold text-center text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              Explore Full AI Intelligence Suite <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
