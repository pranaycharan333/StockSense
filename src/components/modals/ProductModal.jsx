import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product = null, // null for create, object for edit
  warehouses = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Industrial Parts',
    unit: 'Units',
    currentStock: 0,
    warehouse: '',
    reorderLevel: 50,
    costPrice: '',
    sellingPrice: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'Industrial Parts',
        unit: product.unit || 'Units',
        currentStock: product.currentStock ?? 0,
        warehouse: product.warehouse || (warehouses[0]?.name || 'Central Logistics Hub'),
        reorderLevel: product.reorderLevel ?? 50,
        costPrice: product.costPrice ?? '',
        sellingPrice: product.sellingPrice ?? ''
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: 'Industrial Parts',
        unit: 'Units',
        currentStock: 0,
        warehouse: warehouses[0]?.name || 'Central Logistics Hub',
        reorderLevel: 50,
        costPrice: '',
        sellingPrice: ''
      });
    }
    setErrors({});
  }, [product, isOpen, warehouses]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.sku.trim()) errs.sku = 'SKU is required';
    if (!formData.warehouse) errs.warehouse = 'Please select a warehouse';
    if (formData.currentStock < 0) errs.currentStock = 'Stock cannot be negative';
    if (formData.reorderLevel < 0) errs.reorderLevel = 'Reorder level cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  const categories = [
    'Industrial Parts',
    'Electronics',
    'Chemicals & Fluids',
    'Packaging',
    'Safety & PPE',
    'Raw Materials'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product Specification' : 'Add New Inventory Item'}
      subtitle={product ? `Modifying SKU: ${product.sku}` : 'Fill in the details to register a new product in the system.'}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
          >
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Precision Microcontroller Board"
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              SKU (Stock Keeping Unit) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              placeholder="e.g. ELE-MCU-004"
              className={`w-full px-3 py-2 text-xs bg-white font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                errors.sku ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.sku && <p className="text-[11px] text-rose-500 mt-1">{errors.sku}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit of Measure
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="e.g. Units, Boxes (50), Rolls"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Warehouse <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {warehouses.map((wh) => (
                <option key={wh.id || wh.name} value={wh.name}>{wh.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Stock
            </label>
            <input
              type="number"
              min="0"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reorder Level
            </label>
            <input
              type="number"
              min="0"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cost Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              placeholder="0.00"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Selling Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              placeholder="0.00"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
