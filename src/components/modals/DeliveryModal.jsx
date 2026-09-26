import React, { useState } from 'react';
import Modal from '../common/Modal';

export const DeliveryModal = ({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  warehouses = []
}) => {
  const [formData, setFormData] = useState({
    customer: '',
    productId: products[0]?.id || '',
    productName: products[0]?.name || '',
    quantity: 10,
    warehouse: warehouses[0]?.name || 'Central Logistics Hub',
    destination: '',
    status: 'Pending',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleProductChange = (productId) => {
    const selected = products.find(p => p.id === productId);
    setFormData(prev => ({
      ...prev,
      productId,
      productName: selected ? selected.name : '',
      warehouse: selected ? selected.warehouse : prev.warehouse
    }));
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  const validate = () => {
    const errs = {};
    if (!formData.customer.trim()) errs.customer = 'Customer name is required';
    if (!formData.productId) errs.productId = 'Product is required';
    if (!formData.quantity || formData.quantity <= 0) errs.quantity = 'Quantity must be greater than 0';
    if (selectedProduct && formData.quantity > selectedProduct.currentStock) {
      errs.quantity = `Insufficient stock! Only ${selectedProduct.currentStock} units available.`;
    }
    if (!formData.destination.trim()) errs.destination = 'Destination is required';
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
      title="Create Outbound Delivery Order"
      subtitle="Fulfill customer sales order and prepare dispatch."
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
            Dispatch Order
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Customer / Client Account <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            placeholder="e.g. Tesla Gigafactory Texas"
            className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
              errors.customer ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
            }`}
          />
          {errors.customer && <p className="text-[11px] text-rose-500 mt-1">{errors.customer}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Product to Dispatch <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.productId}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — Available: {p.currentStock}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity <span className="text-rose-500">*</span>
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
              Dispatch From Warehouse
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Destination / Delivery Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="e.g. Austin, TX (Dock 12)"
            className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
              errors.destination ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
            }`}
          />
          {errors.destination && <p className="text-[11px] text-rose-500 mt-1">{errors.destination}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="Pending">Pending (Processing / Packing)</option>
            <option value="Delivered">Delivered (Immediate Stock Deduction)</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default DeliveryModal;
