import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Warehouse as WarehouseIcon, MapPin, Package, AlertTriangle, Layers, LayoutGrid, List } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import DataTable from '../components/tables/DataTable';
import WarehouseModal from '../components/modals/WarehouseModal';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import StatusBadge from '../components/common/StatusBadge';
import { formatNumber } from '../utils/formatters';

export const Warehouses = () => {
  const {
    warehouses,
    products,
    loading,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  // Compute live per-warehouse statistics from current products
  const warehouseStats = useMemo(() => {
    return warehouses.map((wh) => {
      const whProducts = products.filter(p => p.warehouse === wh.name);
      const totalStock = whProducts.reduce((sum, p) => sum + (Number(p.currentStock) || 0), wh.currentStock || 0);
      const lowStockCount = whProducts.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
      const totalProductsCount = Math.max(whProducts.length, wh.totalProducts || 0);
      const utilization = wh.capacity > 0 ? Math.min(100, Math.round((totalStock / wh.capacity) * 100)) : 0;

      return {
        ...wh,
        totalProducts: totalProductsCount,
        totalStock,
        utilization,
        lowStockItems: lowStockCount
      };
    });
  }, [warehouses, products]);

  const filteredWarehouses = useMemo(() => {
    return warehouseStats.filter((wh) => {
      const matchesSearch =
        wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wh.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (wh.code && wh.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (wh.manager && wh.manager.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        selectedStatus === 'all' || wh.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [warehouseStats, searchTerm, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (wh) => {
    setEditingWarehouse(wh);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to decommission facility "${name}"?`)) {
      deleteWarehouse(id);
    }
  };

  const handleModalSubmit = (formData) => {
    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, formData);
    } else {
      addWarehouse(formData);
    }
  };

  const getProgressColor = (utilization) => {
    if (utilization >= 90) return 'bg-rose-500';
    if (utilization >= 75) return 'bg-amber-500';
    return 'bg-teal-500';
  };

  const columns = [
    {
      header: 'Warehouse Name',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <WarehouseIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{row.name}</span>
            <span className="text-[11px] text-slate-400 font-mono">{row.code || 'FACILITY'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Location',
      accessor: 'location',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{row.location}</span>
        </div>
      )
    },
    {
      header: 'Total Products',
      accessor: 'totalProducts',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-800 text-xs">
          {row.totalProducts} SKUs
        </span>
      )
    },
    {
      header: 'Total Stock',
      accessor: 'totalStock',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {formatNumber(row.totalStock)}
        </span>
      )
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-500 text-xs">
          {formatNumber(row.capacity)}
        </span>
      )
    },
    {
      header: 'Utilization',
      accessor: 'utilization',
      sortable: true,
      cell: (row) => (
        <div className="w-32">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold text-slate-700">{row.utilization}%</span>
            <span className="text-slate-400">{formatNumber(row.totalStock)} / {formatNumber(row.capacity)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(row.utilization)}`}
              style={{ width: `${Math.min(100, row.utilization)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Low Stock Items',
      accessor: 'lowStockItems',
      sortable: true,
      align: 'center',
      cell: (row) => (
        row.lowStockItems > 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {row.lowStockItems} alerts
          </span>
        ) : (
          <span className="text-slate-400 text-xs">0 items</span>
        )
      )
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'center',
      cell: (row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit warehouse"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete warehouse"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Warehouse Facilities</h2>
          <p className="text-xs text-slate-500">
            Monitor node capacities, floor utilization ratios, and geographic inventory footprints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Data Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Warehouse
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by facility name, city, code, or manager..."
          className="w-full sm:w-80"
        />

        <FilterDropdown
          label="Status"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={['Operational', 'Near Capacity', 'Maintenance']}
          placeholder="All Statuses"
        />
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWarehouses.map((wh) => (
            <div
              key={wh.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                      <WarehouseIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">{wh.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{wh.location}</span>
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={wh.status} size="sm" />
                </div>

                {/* Progress bar for utilization */}
                <div className="mt-4 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Capacity Utilization</span>
                    <span className="font-bold text-slate-800">{wh.utilization}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(wh.utilization)}`}
                      style={{ width: `${Math.min(100, wh.utilization)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Current: {formatNumber(wh.totalStock)} units</span>
                    <span>Max: {formatNumber(wh.capacity)} units</span>
                  </div>
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Active SKUs</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {wh.totalProducts} items
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Low Stock Alerts</span>
                    <span className={`font-semibold font-mono ${wh.lowStockItems > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {wh.lowStockItems} alerts
                    </span>
                  </div>
                </div>

                {/* Facility Manager info */}
                {wh.manager && (
                  <div className="mt-3 text-[11px] text-slate-500">
                    <span className="text-slate-400">Manager:</span> {wh.manager}{' '}
                    {wh.contact && <span className="text-slate-400">({wh.contact})</span>}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(wh)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(wh.id, wh.name)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Decommission
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredWarehouses}
          isLoading={loading}
          pageSize={10}
        />
      )}

      {/* Warehouse Modal */}
      <WarehouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        warehouse={editingWarehouse}
      />
    </div>
  );
};

export default Warehouses;
