import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  HelpCircle,
  Building2,
  ChevronDown
} from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';

export const Navbar = ({ onOpenSidebar }) => {
  const location = useLocation();
  const { kpis, products, dashboardFilter, setDashboardFilter, warehouses } = useInventory();
  const [showNotifications, setShowNotifications] = useState(false);

  const routeTitles = {
    '/': 'Executive Dashboard',
    '/products': 'Product Master Catalog',
    '/receipts': 'Inbound Receipts & POs',
    '/deliveries': 'Outbound Dispatch Orders',
    '/transfers': 'Inter-Warehouse Transfers',
    '/adjustments': 'Stock Reconciliation Adjustments',
    '/ledger': 'Perpetual Stock Ledger',
    '/warehouses': 'Facility & Node Management',
    '/insights': 'AI Demand & Anomaly Insights'
  };

  const currentTitle = routeTitles[location.pathname] || 'Inventory Management';
  const lowStockItems = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock');

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {currentTitle}
            </h1>
            {location.pathname === '/insights' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                ML Engine Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Real-time multi-echelon inventory synchronization
          </p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Quick Warehouse Selector */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dashboardFilter.warehouse}
            onChange={(e) => setDashboardFilter(prev => ({ ...prev, warehouse: e.target.value }))}
            className="bg-transparent border-none text-xs font-medium text-slate-700 focus:outline-none cursor-pointer pr-1"
          >
            <option value="all">All Facilities ({warehouses.length})</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.name}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {lowStockItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 text-xs">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Inventory Alerts</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600">
                  {lowStockItems.length} Warnings
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {lowStockItems.length === 0 ? (
                  <p className="px-4 py-3 text-slate-400 text-center">All stock levels healthy!</p>
                ) : (
                  lowStockItems.slice(0, 5).map(item => (
                    <div key={item.id} className="px-4 py-2.5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-slate-800 truncate pr-2">{item.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.status === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.currentStock} left
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.warehouse} • SKU: {item.sku}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <a href="#/products" onClick={() => setShowNotifications(false)} className="text-teal-600 hover:text-teal-700 font-semibold text-[11px]">
                  View all in Product Catalog &rarr;
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-teal-500/20">
            ER
          </div>
          <div className="hidden sm:block text-left text-xs leading-tight">
            <p className="font-semibold text-slate-800">Elena Rostova</p>
            <p className="text-[10px] text-slate-400">Inventory Director</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
