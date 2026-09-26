import React, { useState } from 'react';
import Modal from '../common/Modal';

export const ReceiptModal = ({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  warehouses = []
}) => {
  const [formData, setFormData] = useState({
    supplier: '',
    productId: products[0]?.id || '',
    productName: products[0]?.name || '',
    quantity: 100,
    warehouse: warehouses[0]?.name || 'Central Logistics Hub',
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

  const validate = () => {
    const errs = {};
    if (!formData.supplier.trim()) errs.supplier = 'Supplier name is required';
    if (!formData.productId) errs.productId = 'Product is required';
    if (!formData.quantity || formData.quantity <= 0) errs.quantity = 'Quantity must be greater than 0';
    if (!formData.warehouse) errs.warehouse = 'Warehouse is required';
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
      title="Create Inbound Receipt"
      subtitle="Log an incoming supplier shipment or purchase order batch."
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
            Confirm Receipt
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Supplier / Vendor Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="e.g. Apex Industrial Supplies Ltd"
            className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
              errors.supplier ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
            }`}
          />
          {errors.supplier && <p className="text-[11px] text-rose-500 mt-1">{errors.supplier}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Item to Receive <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.productId}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — In Stock: {p.currentStock}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity to Receive <span className="text-rose-500">*</span>
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
              Receiving Warehouse <span className="text-rose-500">*</span>
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
            Initial Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="Pending">Pending (Awaiting Physical Arrival)</option>
            <option value="Received">Received (Immediate Stock Increase)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reference / PO Notes
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. PO-7719 freight carrier Bill of Lading"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ReceiptModal;
