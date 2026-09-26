/**
 * StockSense API & Service Layer
 * 
 * Configured for seamless transition between local Mock State
 * and a FastAPI REST backend.
 * 
 * To connect to a live FastAPI server:
 * 1. Ensure your FastAPI server runs at VITE_API_BASE_URL (e.g. http://localhost:8000/api)
 * 2. Set VITE_USE_MOCK_DATA=false in your .env file
 */

import { initialProducts } from '../data/products';
import { initialReceipts } from '../data/receipts';
import { initialDeliveries } from '../data/deliveries';
import { initialTransfers } from '../data/transfers';
import { initialAdjustments } from '../data/adjustments';
import { initialLedger } from '../data/ledger';
import { initialWarehouses } from '../data/warehouses';
import { mockAIInsights } from '../data/insights';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Helper for HTTP requests when backend is active
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
  }
  return response.json();
}

// Simulated network latency for realistic feel in mock mode
const simulateLatency = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

export const productsApi = {
  getAll: async () => {
    if (!USE_MOCK_DATA) return request('/products');
    await simulateLatency();
    return [...initialProducts];
  },
  create: async (product) => {
    if (!USE_MOCK_DATA) return request('/products', { method: 'POST', body: JSON.stringify(product) });
    await simulateLatency();
    return { ...product, id: `prod-${Date.now()}`, lastUpdated: new Date().toISOString().split('T')[0] };
  },
  update: async (id, updates) => {
    if (!USE_MOCK_DATA) return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    await simulateLatency();
    return { id, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
  },
  delete: async (id) => {
    if (!USE_MOCK_DATA) return request(`/products/${id}`, { method: 'DELETE' });
    await simulateLatency();
    return { success: true, id };
  }
};

export const receiptsApi = {
  getAll: async () => {
    if (!USE_MOCK_DATA) return request('/receipts');
    await simulateLatency();
    return [...initialReceipts];
  },
  create: async (receipt) => {
    if (!USE_MOCK_DATA) return request('/receipts', { method: 'POST', body: JSON.stringify(receipt) });
    await simulateLatency();
    return {
      ...receipt,
      id: `rec-${Date.now()}`,
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0]
    };
  }
};

export const deliveriesApi = {
  getAll: async () => {
    if (!USE_MOCK_DATA) return request('/deliveries');
    await simulateLatency();
    return [...initialDeliveries];
  },
  create: async (delivery) => {
    if (!USE_MOCK_DATA) return request('/deliveries', { method: 'POST', body: JSON.stringify(delivery) });
    await simulateLatency();
    return {
      ...delivery,
      id: `del-${Date.now()}`,
      deliveryNumber: `DEL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0]
    };
  }
};

export const transfersApi = {
  getAll: async () => {
    if (!USE_MOCK_DATA) return request('/transfers');
    await simulateLatency();
    return [...initialTransfers];
  },
  create: async (transfer) => {
    if (!USE_MOCK_DATA) return request('/transfers', { method: 'POST', body: JSON.stringify(transfer) });
    await simulateLatency();
    return {
      ...transfer,
      id: `trn-${Date.now()}`,
      transferNumber: `TRN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0]
    };
  }
};

export const adjustmentsApi = {
  getAll: async () => {
    if (!USE_MOCK_DATA) return request('/adjustments');
    await simulateLatency();
    return [...initialAdjustments];
  },
  create: async (adjustment) => {
    if (!USE_MOCK_DATA) return request('/adjustments', { method: 'POST', body: JSON.stringify(adjustment) });
    await simulateLatency();
    const difference = Number(adjustment.physicalQuantity) - Number(adjustment.recordedQuantity);
    return {
      ...adjustment,
      id: `adj-${Date.now()}`,
      adjustmentNumber: `ADJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      difference,
      date: new Date().toISOString().split('T')[0]
    };
  }
};

export const ledgerApi = {
  getAll: async () => {
    if (!USE_MOCK_DATA) return request('/ledger');
    await simulateLatency();
    return [...initialLedger];
  }
};

export const warehousesApi = {
  getAll: async () => {
    if (!USE_MOCK_DATA) return request('/warehouses');
    await simulateLatency();
    return [...initialWarehouses];
  },
  create: async (warehouse) => {
    if (!USE_MOCK_DATA) return request('/warehouses', { method: 'POST', body: JSON.stringify(warehouse) });
    await simulateLatency();
    return { ...warehouse, id: `wh-${Date.now()}`, lowStockCount: 0, currentStock: 0, totalProducts: 0 };
  },
  update: async (id, updates) => {
    if (!USE_MOCK_DATA) return request(`/warehouses/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    await simulateLatency();
    return { id, ...updates };
  },
  delete: async (id) => {
    if (!USE_MOCK_DATA) return request(`/warehouses/${id}`, { method: 'DELETE' });
    await simulateLatency();
    return { success: true, id };
  }
};

export const insightsApi = {
  getAll: async () => {
    if (!USE_MOCK_DATA) return request('/ai-insights');
    await simulateLatency();
    return mockAIInsights;
  }
};

const api = {
  products: productsApi,
  receipts: receiptsApi,
  deliveries: deliveriesApi,
  transfers: transfersApi,
  adjustments: adjustmentsApi,
  ledger: ledgerApi,
  warehouses: warehousesApi,
  insights: insightsApi
};

export default api;
