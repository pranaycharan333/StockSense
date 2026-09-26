import React, { useState, useMemo } from 'react';
import { History, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, SlidersHorizontal, Download } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import DataTable from '../components/tables/DataTable';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import StatusBadge from '../components/common/StatusBadge';
import { formatNumber } from '../utils/formatters';

export const StockLedger = () => {
  const { ledger, warehouses, loading, showToast } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  const operations = [
    'Receipt',
    'Delivery',
    'Transfer In',
    'Transfer Out',
    'Adjustment'
  ];

  const filteredLedger = useMemo(() => {
    return ledger.filter((entry) => {
      const matchesSearch =
        entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.sku && entry.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.referenceNumber && entry.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.user && entry.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
        entry.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.to.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOp =
        selectedOperation === 'all' || entry.operationType === selectedOperation;

      const matchesWarehouse =
        selectedWarehouse === 'all' ||
        entry.from.includes(selectedWarehouse) ||
        entry.to.includes(selectedWarehouse);

      // Date filtering
      let matchesDate = true;
      if (selectedDateFilter === 'today') {
        matchesDate = entry.date.startsWith('2026-09-26');
      } else if (selectedDateFilter === 'yesterday') {
        matchesDate = entry.date.startsWith('2026-09-25');
      }

      return matchesSearch && matchesOp && matchesWarehouse && matchesDate;
    });
  }, [ledger, searchTerm, selectedOperation, selectedWarehouse, selectedDateFilter]);

  const handleExportCSV = () => {
    // Generate simple client-side CSV download
    const headers = ['Date', 'Product', 'SKU', 'Operation Type', 'Quantity', 'From', 'To', 'User', 'Resulting Stock', 'Reference'];
    const rows = filteredLedger.map(e => [
      `"${e.date}"`,
      `"${e.productName}"`,
      `"${e.sku || ''}"`,
      `"${e.operationType}"`,
      `"${e.quantity}"`,
      `"${e.from}"`,
      `"${e.to}"`,
      `"${e.user || ''}"`,
      e.resultingStock,
      `"${e.referenceNumber || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StockSense_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Stock Ledger export downloaded');
  };

  const columns = [
    {
      header: 'Date & Time',
      accessor: 'date',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-mono text-xs text-slate-800 block">{row.date}</span>
          {row.referenceNumber && (
            <span className="text-[10px] text-teal-600 font-mono">{row.referenceNumber}</span>
          )}
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
          {row.sku && <span className="text-[11px] text-slate-400 font-mono">{row.sku}</span>}
        </div>
      )
    },
    {
      header: 'Operation Type',
      accessor: 'operationType',
      sortable: true,
      cell: (row) => <StatusBadge status={row.operationType} />
    },
    {
      header: 'Quantity',
      accessor: 'numericQuantity',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span
          className={`font-mono font-bold text-xs ${
            row.numericQuantity > 0
              ? 'text-emerald-600'
              : row.numericQuantity < 0
              ? 'text-rose-600'
              : 'text-slate-700'
          }`}
        >
          {row.quantity}
        </span>
      )
    },
    {
      header: 'From',
      accessor: 'from',
      sortable: true,
      cell: (row) => <span className="text-slate-600 text-xs">{row.from}</span>
    },
    {
      header: 'To',
      accessor: 'to',
      sortable: true,
      cell: (row) => <span className="text-slate-800 font-medium text-xs">{row.to}</span>
    },
    {
      header: 'User / Actor',
      accessor: 'user',
      sortable: true,
      cell: (row) => <span className="text-slate-600 text-xs">{row.user}</span>
    },
    {
      header: 'Resulting Stock',
      accessor: 'resultingStock',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {formatNumber(row.resultingStock)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stock Ledger</h2>
          <p className="text-xs text-slate-500">
            Audit-grade perpetual transaction ledger recording all physical and recorded movements.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by product, SKU, user, or reference #..."
          className="w-full lg:w-80"
        />

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="Operation"
            value={selectedOperation}
            onChange={setSelectedOperation}
            options={operations}
            placeholder="All Operations"
          />

          <FilterDropdown
            label="Warehouse"
            value={selectedWarehouse}
            onChange={setSelectedWarehouse}
            options={warehouses.map(w => ({ value: w.name, label: w.name }))}
            placeholder="All Locations"
          />

          <FilterDropdown
            label="Date"
            value={selectedDateFilter}
            onChange={setSelectedDateFilter}
            options={[
              { value: 'today', label: 'Today (Sep 26)' },
              { value: 'yesterday', label: 'Yesterday (Sep 25)' }
            ]}
            placeholder="All History"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <DataTable
        columns={columns}
        data={filteredLedger}
        isLoading={loading}
        pageSize={10}
        emptyTitle="No ledger records found"
        emptyDescription="No inventory transactions match your current search and filter settings."
        emptyAction={
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedOperation('all');
              setSelectedWarehouse('all');
              setSelectedDateFilter('all');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        }
      />
    </div>
  );
};

export default StockLedger;
