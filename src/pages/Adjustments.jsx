import React, { useState, useMemo } from 'react';
import { Plus, SlidersHorizontal, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import DataTable from '../components/tables/DataTable';
import AdjustmentModal from '../components/modals/AdjustmentModal';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import { formatDate, formatNumber } from '../utils/formatters';

export const Adjustments = () => {
  const {
    adjustments,
    products,
    loading,
    createAdjustment
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reasons = [
    'Count Discrepancy',
    'Damage / Broken Unit',
    'Theft / Unaccounted Shrinkage',
    'Supplier Pack Error',
    'Decommissioned / Obsolete',
    'Cycle Count Found Surplus'
  ];

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((a) => {
      const matchesSearch =
        a.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.adjustmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesReason =
        selectedReason === 'all' || a.reason === selectedReason;

      return matchesSearch && matchesReason;
    });
  }, [adjustments, searchTerm, selectedReason]);

  const columns = [
    {
      header: 'Adjustment #',
      accessor: 'adjustmentNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-semibold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
          {row.adjustmentNumber}
        </span>
      )
    },
    {
      header: 'Product',
      accessor: 'productName',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.productName}</span>
          <span className="text-[11px] text-slate-400">Auditor: {row.approvedBy || 'Inventory Lead'}</span>
        </div>
      )
    },
    {
      header: 'Location',
      accessor: 'location',
      sortable: true,
    },
    {
      header: 'Recorded Quantity',
      accessor: 'recordedQuantity',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-600 text-xs">
          {formatNumber(row.recordedQuantity)}
        </span>
      )
    },
    {
      header: 'Physical Quantity',
      accessor: 'physicalQuantity',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-semibold text-slate-900 text-xs">
          {formatNumber(row.physicalQuantity)}
        </span>
      )
    },
    {
      header: 'Difference',
      accessor: 'difference',
      sortable: true,
      align: 'right',
      cell: (row) => {
        const diff = Number(row.difference);
        return (
          <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded inline-block ${
            diff > 0
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
              : diff < 0
              ? 'text-rose-700 bg-rose-50 border border-rose-200'
              : 'text-slate-600 bg-slate-50 border border-slate-200'
          }`}>
            {diff > 0 ? `+${diff}` : diff}
          </span>
        );
      }
    },
    {
      header: 'Reason',
      accessor: 'reason',
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-slate-700">
          {row.reason}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      sortable: true,
      cell: (row) => formatDate(row.date)
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'center',
      cell: () => (
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Reconciled
        </span>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stock Adjustments</h2>
          <p className="text-xs text-slate-500">
            Audit cycle counts, log physical discrepancy reconciliations, and update ledger balances.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Adjustment
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by product, adjustment #, or location..."
          className="w-full sm:w-80"
        />

        <FilterDropdown
          label="Reason"
          value={selectedReason}
          onChange={setSelectedReason}
          options={reasons}
          placeholder="All Reasons"
        />
      </div>

      {/* Adjustments Table */}
      <DataTable
        columns={columns}
        data={filteredAdjustments}
        isLoading={loading}
        pageSize={10}
        emptyTitle="No adjustments found"
        emptyDescription="No reconciliation records found for the specified filter."
        emptyAction={
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedReason('all');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        }
      />

      {/* Modal with auto Difference calculation */}
      <AdjustmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createAdjustment}
        products={products}
      />
    </div>
  );
};

export default Adjustments;
