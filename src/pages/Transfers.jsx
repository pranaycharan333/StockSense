import React, { useState, useMemo } from 'react';
import { Plus, ArrowLeftRight, Check, Truck, XCircle } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import DataTable from '../components/tables/DataTable';
import TransferModal from '../components/modals/TransferModal';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate, formatNumber } from '../utils/formatters';

export const Transfers = () => {
  const {
    transfers,
    products,
    warehouses,
    loading,
    createTransfer,
    updateTransferStatus
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const matchesSearch =
        t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.fromWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.toWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transferNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || t.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [transfers, searchTerm, selectedStatus]);

  const columns = [
    {
      header: 'Transfer #',
      accessor: 'transferNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-semibold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
          {row.transferNumber}
        </span>
      )
    },
    {
      header: 'From Warehouse',
      accessor: 'fromWarehouse',
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-slate-800">{row.fromWarehouse}</span>
      )
    },
    {
      header: 'To Warehouse',
      accessor: 'toWarehouse',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">{row.toWarehouse}</span>
        </div>
      )
    },
    {
      header: 'Product',
      accessor: 'productName',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.productName}</span>
          {row.requestedBy && (
            <span className="text-[11px] text-slate-400">By: {row.requestedBy}</span>
          )}
        </div>
      )
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-xs text-slate-900">
          {formatNumber(row.quantity)}
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
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'center',
      cell: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          {row.status === 'Scheduled' && (
            <button
              onClick={() => updateTransferStatus(row.id, 'In Transit')}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors"
              title="Dispatch to Transit"
            >
              <Truck className="w-3 h-3" />
              Dispatch
            </button>
          )}
          {row.status === 'In Transit' && (
            <button
              onClick={() => updateTransferStatus(row.id, 'Completed')}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
              title="Complete Arrival"
            >
              <Check className="w-3 h-3" />
              Complete
            </button>
          )}
          {['Scheduled', 'In Transit'].includes(row.status) && (
            <button
              onClick={() => updateTransferStatus(row.id, 'Cancelled')}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Cancel Transfer"
            >
              <XCircle className="w-3 h-3 text-slate-400" />
            </button>
          )}
          {['Completed', 'Cancelled'].includes(row.status) && (
            <span className="text-[11px] text-slate-400 italic">Settled</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Internal Stock Transfers</h2>
          <p className="text-xs text-slate-500">
            Rebalance inventory levels across multi-site warehouses and transit hubs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Transfer
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by transfer #, warehouse, or item..."
          className="w-full sm:w-80"
        />

        <FilterDropdown
          label="Status"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={['Scheduled', 'In Transit', 'Completed', 'Cancelled']}
          placeholder="All Statuses"
        />
      </div>

      {/* Transfers Table */}
      <DataTable
        columns={columns}
        data={filteredTransfers}
        isLoading={loading}
        pageSize={10}
        emptyTitle="No internal transfers found"
        emptyDescription="No transfer orders currently match your query."
        emptyAction={
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('all');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        }
      />

      {/* Transfer Modal */}
      <TransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTransfer}
        products={products}
        warehouses={warehouses}
      />
    </div>
  );
};

export default Transfers;
