import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export const WarehouseModal = ({
  isOpen,
  onClose,
  onSubmit,
  warehouse = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    capacity: 20000,
    manager: '',
    contact: '',
    status: 'Operational'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name || '',
        code: warehouse.code || '',
        location: warehouse.location || '',
        capacity: warehouse.capacity || 20000,
        manager: warehouse.manager || '',
        contact: warehouse.contact || '',
        status: warehouse.status || 'Operational'
      });
    } else {
      setFormData({
        name: '',
        code: '',
        location: '',
        capacity: 20000,
        manager: '',
        contact: '',
        status: 'Operational'
      });
    }
    setErrors({});
  }, [warehouse, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Warehouse name is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.capacity || formData.capacity <= 0) errs.capacity = 'Capacity must be greater than 0';
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
      title={warehouse ? 'Edit Warehouse Facility' : 'Register New Warehouse'}
      subtitle={warehouse ? `Facility ID: ${warehouse.code || warehouse.name}` : 'Expand your supply chain footprint.'}
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
            {warehouse ? 'Update Facility' : 'Add Facility'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Warehouse Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Great Lakes Fulfillment Center"
            className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
              errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
            }`}
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Facility Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. GLF-06"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location / City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Detroit, MI"
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                errors.location ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.location && <p className="text-[11px] text-rose-500 mt-1">{errors.location}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Storage Capacity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1000"
              step="500"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                errors.capacity ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.capacity && <p className="text-[11px] text-rose-500 mt-1">{errors.capacity}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operational Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="Operational">Operational</option>
              <option value="Near Capacity">Near Capacity</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Site Manager
            </label>
            <input
              type="text"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              placeholder="e.g. Rachel Adams"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="e.g. r.adams@stocksense.io"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default WarehouseModal;
