import React, { useState } from 'react';
import Modal from '../common/Modal';

export const TransferModal = ({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  warehouses = []
}) => {
  const [formData, setFormData] = useState({
    fromWarehouse: warehouses[0]?.name || 'Central Logistics Hub',
    toWarehouse: warehouses[1]?.name || 'West Coast Depository',
    productId: products[0]?.id || '',
    productName: products[0]?.name || '',
    quantity: 25,
    status: 'Scheduled',
    requestedBy: 'Logistics Supervisor',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleProductChange = (productId) => {
    const selected = products.find(p => p.id === productId);
    setFormData(prev => ({
      ...prev,
      productId,
      productName: selected ? selected.name : ''
    }));
  };

  const validate = () => {
    const errs = {};
    if (formData.fromWarehouse === formData.toWarehouse) {
      errs.toWarehouse = 'Source and destination warehouses cannot be the same';
    }
    if (!formData.productId) errs.productId = 'Please select a product';
    if (!formData.quantity || formData.quantity <= 0) {
      errs.quantity = 'Quantity must be greater than 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Internal Transfer"
      subtitle="Transfer inventory between distributed warehouses."
      size="md"
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
            Schedule Transfer
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Product to Transfer <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.productId}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — Current Stock: {p.currentStock}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              From Warehouse <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.fromWarehouse}
              onChange={(e) => setFormData({ ...formData, fromWarehouse: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {warehouses.map((wh) => (
                <option key={wh.id || wh.name} value={wh.name}>{wh.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              To Warehouse <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.toWarehouse}
              onChange={(e) => setFormData({ ...formData, toWarehouse: e.target.value })}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                errors.toWarehouse ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
              }`}
            >
              {warehouses.map((wh) => (
                <option key={wh.id || wh.name} value={wh.name}>{wh.name}</option>
              ))}
            </select>
            {errors.toWarehouse && <p className="text-[11px] text-rose-500 mt-1">{errors.toWarehouse}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transfer Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                errors.quantity ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.quantity && <p className="text-[11px] text-rose-500 mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Transit">In Transit</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Requested By
          </label>
          <input
            type="text"
            value={formData.requestedBy}
            onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
            placeholder="e.g. Operations Coordinator"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </form>
    </Modal>
  );
};

export default TransferModal;
