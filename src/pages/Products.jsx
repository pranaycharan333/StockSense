import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Package, Filter, AlertTriangle } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import DataTable from '../components/tables/DataTable';
import ProductModal from '../components/modals/ProductModal';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import StatusBadge from '../components/common/StatusBadge';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const Products = () => {
  const {
    products,
    warehouses,
    loading,
    addProduct,
    updateProduct,
    deleteProduct
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Categories list
  const categories = [
    'Industrial Parts',
    'Electronics',
    'Chemicals & Fluids',
    'Packaging',
    'Safety & PPE',
    'Raw Materials'
  ];

  // Filtered dataset
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchesWarehouse =
        selectedWarehouse === 'all' || item.warehouse === selectedWarehouse;

      const matchesStatus =
        selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedWarehouse, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      deleteProduct(id);
    }
  };

  const handleModalSubmit = (formData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{row.name}</span>
            <span className="text-[11px] text-slate-400">Unit: {row.unit}</span>
          </div>
        </div>
      )
    },
    {
      header: 'SKU',
      accessor: 'sku',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.sku}
        </span>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      sortable: true,
    },
    {
      header: 'Unit',
      accessor: 'unit',
      sortable: false,
    },
    {
      header: 'Current Stock',
      accessor: 'currentStock',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className={`font-mono font-bold text-xs ${
          row.currentStock === 0
            ? 'text-rose-600'
            : row.currentStock <= row.reorderLevel
            ? 'text-amber-600'
            : 'text-slate-800'
        }`}>
          {formatNumber(row.currentStock)}
        </span>
      )
    },
    {
      header: 'Warehouse',
      accessor: 'warehouse',
      sortable: true,
    },
    {
      header: 'Reorder Level',
      accessor: 'reorderLevel',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-500 text-xs">
          {formatNumber(row.reorderLevel)}
        </span>
      )
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
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit product"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Products Catalog</h2>
          <p className="text-xs text-slate-500">
            Manage SKU specifications, safety stock levels, and warehouse allocations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by product name, SKU, or category..."
          className="w-full md:w-80"
        />

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="Category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories}
            placeholder="All Categories"
          />

          <FilterDropdown
            label="Warehouse"
            value={selectedWarehouse}
            onChange={setSelectedWarehouse}
            options={warehouses.map(w => ({ value: w.name, label: w.name }))}
            placeholder="All Warehouses"
          />

          <FilterDropdown
            label="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['In Stock', 'Low Stock', 'Out of Stock']}
            placeholder="All Statuses"
          />
        </div>
      </div>

      {/* Reusable Data Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        isLoading={loading}
        pageSize={10}
        emptyTitle="No products match your filters"
        emptyDescription="Try clearing your search query or adjusting your category and warehouse filters."
        emptyAction={
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedWarehouse('all');
              setSelectedStatus('all');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        }
      />

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        product={editingProduct}
        warehouses={warehouses}
      />
    </div>
  );
};

export default Products;
