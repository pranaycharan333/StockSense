import React, { useState, useMemo } from 'react';
import { Plus, Check, XCircle, ArrowDownLeft } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import DataTable from '../components/tables/DataTable';
import ReceiptModal from '../components/modals/ReceiptModal';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate, formatNumber } from '../utils/formatters';

export const Receipts = () => {
  const {
    receipts,
    products,
    warehouses,
    loading,
    createReceipt,
    updateReceiptStatus
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const matchesSearch =
        r.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || r.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [receipts, searchTerm, selectedStatus]);

  const columns = [
    {
      header: 'Receipt #',
      accessor: 'receiptNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-semibold text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
          {row.receiptNumber}
        </span>
      )
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.supplier}</span>
          {row.notes && <span className="text-[11px] text-slate-400">{row.notes}</span>}
        </div>
      )
    },
    {
      header: 'Product',
      accessor: 'productName',
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-slate-800">{row.productName}</span>
      )
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-xs text-slate-900">
          +{formatNumber(row.quantity)}
        </span>
      )
    },
    {
      header: 'Warehouse',
      accessor: 'warehouse',
      sortable: true,
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
          {row.status === 'Pending' && (
            <>
              <button
                onClick={() => updateReceiptStatus(row.id, 'Received')}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                title="Mark as Received"
              >
                <Check className="w-3 h-3" />
                Receive
              </button>
              <button
                onClick={() => updateReceiptStatus(row.id, 'Cancelled')}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                title="Cancel Receipt"
              >
                <XCircle className="w-3 h-3 text-slate-400" />
                Cancel
              </button>
            </>
          )}
          {row.status !== 'Pending' && (
            <span className="text-[11px] text-slate-400 italic">Locked</span>
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inbound Receipts</h2>
          <p className="text-xs text-slate-500">
            Log, verify, and receive incoming purchase orders and supplier consignments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Receipt
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by supplier, PO number, or product..."
          className="w-full sm:w-80"
        />

        <FilterDropdown
          label="Status"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={['Pending', 'Received', 'Cancelled']}
          placeholder="All Statuses"
        />
      </div>

      {/* Receipts Table */}
      <DataTable
        columns={columns}
        data={filteredReceipts}
        isLoading={loading}
        pageSize={10}
        emptyTitle="No receipts found"
        emptyDescription="No purchase orders or inbound receipts match your query."
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

      {/* Create Receipt Modal */}
      <ReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createReceipt}
        products={products}
        warehouses={warehouses}
      />
    </div>
  );
};

export default Receipts;
