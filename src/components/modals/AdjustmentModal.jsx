import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export const AdjustmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  products = []
}) => {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [recordedQuantity, setRecordedQuantity] = useState(0);
  const [physicalQuantity, setPhysicalQuantity] = useState(0);
  const [location, setLocation] = useState('');
  const [reason, setReason] = useState('Count Discrepancy');
  const [approvedBy, setApprovedBy] = useState('Elena Rostova');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (products.length > 0) {
      const prod = products.find(p => p.id === selectedProductId) || products[0];
      if (prod) {
        setSelectedProductId(prod.id);
        setRecordedQuantity(prod.currentStock);
        setPhysicalQuantity(prod.currentStock);
        setLocation(prod.warehouse);
      }
    }
  }, [products, selectedProductId, isOpen]);

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setRecordedQuantity(prod.currentStock);
      setPhysicalQuantity(prod.currentStock);
      setLocation(prod.warehouse);
    }
  };

  // Automatically calculate: Difference = Physical Quantity - Recorded Quantity
  const difference = Number(physicalQuantity) - Number(recordedQuantity);

  const handleSubmit = (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    onSubmit({
      productId: prod.id,
      productName: prod.name,
      location,
      recordedQuantity: Number(recordedQuantity),
      physicalQuantity: Number(physicalQuantity),
      difference,
      reason,
      approvedBy,
      notes
    });
    onClose();
  };

  const reasons = [
    'Count Discrepancy',
    'Damage / Broken Unit',
    'Theft / Unaccounted Shrinkage',
    'Supplier Pack Error',
    'Decommissioned / Obsolete',
    'Cycle Count Found Surplus'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Stock Reconciliation Adjustment"
      subtitle="Reconcile recorded inventory with verified physical bin count."
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
            Post Adjustment
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Product to Adjust <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => handleProductSelect(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — Recorded: {p.currentStock}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Warehouse Location
          </label>
          <input
            type="text"
            value={location}
            readOnly
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Recorded (System)
            </label>
            <div className="text-base font-bold text-slate-800">
              {recordedQuantity}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Physical Count <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={physicalQuantity}
              onChange={(e) => setPhysicalQuantity(Number(e.target.value))}
              className="w-full px-2.5 py-1 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Auto Difference
            </label>
            <div
              className={`text-base font-bold tabular-nums ${
                difference > 0
                  ? 'text-emerald-600'
                  : difference < 0
                  ? 'text-rose-600'
                  : 'text-slate-600'
              }`}
            >
              {difference > 0 ? `+${difference}` : difference}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reason for Adjustment <span className="text-rose-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {reasons.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Approving Auditor / Manager
          </label>
          <input
            type="text"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </form>
    </Modal>
  );
};

export default AdjustmentModal;
