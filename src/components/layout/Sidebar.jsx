import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  SlidersHorizontal,
  History,
  Warehouse,
  Sparkles,
  X,
  ShieldCheck,
  Server
} from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { USE_MOCK_DATA } from '../../services/api';

export const Sidebar = ({ isOpen, onClose }) => {
  const { kpis } = useInventory();
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/products',
      label: 'Products',
      icon: Boxes,
      badge: kpis.lowStockItems > 0 ? `${kpis.lowStockItems} low` : null,
      badgeColor: 'amber'
    },
    {
      to: '/receipts',
      label: 'Receipts',
      icon: ArrowDownLeft,
      badge: kpis.pendingReceipts > 0 ? kpis.pendingReceipts : null,
      badgeColor: 'teal'
    },
    {
      to: '/deliveries',
      label: 'Deliveries',
      icon: ArrowUpRight,
      badge: kpis.pendingDeliveries > 0 ? kpis.pendingDeliveries : null,
      badgeColor: 'blue'
    },
    {
      to: '/transfers',
      label: 'Internal Transfers',
      icon: ArrowLeftRight,
      badge: kpis.scheduledTransfers > 0 ? kpis.scheduledTransfers : null,
      badgeColor: 'purple'
    },
    {
      to: '/adjustments',
      label: 'Stock Adjustments',
      icon: SlidersHorizontal,
      badge: null
    },
    {
      to: '/ledger',
      label: 'Stock Ledger',
      icon: History,
      badge: null
    },
    {
      to: '/warehouses',
      label: 'Warehouses',
      icon: Warehouse,
      badge: null
    },
    {
      to: '/insights',
      label: 'AI Insights',
      icon: Sparkles,
      badge: 'AI Beta',
      badgeColor: 'indigo'
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Boxes className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white tracking-tight">StockSense</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Inventory Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operations & Flow
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-teal-600/15 text-teal-400 border border-teal-500/20 shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badgeColor === 'teal'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : item.badgeColor === 'blue'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : item.badgeColor === 'purple'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : item.badgeColor === 'indigo'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & API State indicator */}
        <div className="p-3 border-t border-slate-800 text-xs">
          <div className="bg-slate-850/80 rounded-lg p-3 border border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] font-semibold text-slate-300">Backend API</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">
                {USE_MOCK_DATA ? 'Mock Mode (Ready for FastAPI)' : 'FastAPI REST Connected'}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span>v1.0.0 Hackathon Build</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>SOC2 Type II</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
