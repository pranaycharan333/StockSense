import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { calculateStatus } from '../utils/formatters';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Global filters for Dashboard
  const [dashboardFilter, setDashboardFilter] = useState({
    warehouse: 'all',
    category: 'all',
    stockStatus: 'all',
    dateRange: 'all'
  });

  // Show a toast message for real feedback
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load initial data
  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);
        const [
          prods,
          recs,
          dels,
          trns,
          adjs,
          leds,
          whs,
          ins
        ] = await Promise.all([
          api.products.getAll(),
          api.receipts.getAll(),
          api.deliveries.getAll(),
          api.transfers.getAll(),
          api.adjustments.getAll(),
          api.ledger.getAll(),
          api.warehouses.getAll(),
          api.insights.getAll()
        ]);

        setProducts(prods);
        setReceipts(recs);
        setDeliveries(dels);
        setTransfers(trns);
        setAdjustments(adjs);
        setLedger(leds);
        setWarehouses(whs);
        setInsights(ins);
      } catch (err) {
        console.error('Failed to load initial inventory data', err);
        showToast('Error loading data from service layer', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, []);

  // PRODUCT ACTIONS
  const addProduct = async (productData) => {
    try {
      const stock = Number(productData.currentStock) || 0;
      const reorder = Number(productData.reorderLevel) || 0;
      const status = calculateStatus(stock, reorder);

      const newProduct = await api.products.create({
        ...productData,
        currentStock: stock,
        reorderLevel: reorder,
        costPrice: Number(productData.costPrice) || 0,
        sellingPrice: Number(productData.sellingPrice) || 0,
        status
      });

      setProducts(prev => [newProduct, ...prev]);

      // Add corresponding ledger initial entry
      const ledgerEntry = {
        id: `led-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        operationType: 'Adjustment',
        quantity: `+${stock}`,
        numericQuantity: stock,
        from: 'Initial Product Setup',
        to: newProduct.warehouse,
        user: 'Admin / Inventory Lead',
        resultingStock: stock,
        referenceNumber: 'INIT-SETUP'
      };
      setLedger(prev => [ledgerEntry, ...prev]);

      // Update warehouse count
      setWarehouses(prev => prev.map(wh => {
        if (wh.name === newProduct.warehouse) {
          return {
            ...wh,
            totalProducts: wh.totalProducts + 1,
            currentStock: wh.currentStock + stock
          };
        }
        return wh;
      }));

      showToast(`Product "${newProduct.name}" created successfully`);
      return newProduct;
    } catch (err) {
      showToast('Failed to create product', 'error');
      throw err;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const stock = updates.currentStock !== undefined ? Number(updates.currentStock) : undefined;
      const reorder = updates.reorderLevel !== undefined ? Number(updates.reorderLevel) : undefined;
      
      const current = products.find(p => p.id === id);
      const newStock = stock !== undefined ? stock : current?.currentStock || 0;
      const newReorder = reorder !== undefined ? reorder : current?.reorderLevel || 0;
      const status = calculateStatus(newStock, newReorder);

      const updated = await api.products.update(id, {
        ...updates,
        status,
        ...(stock !== undefined && { currentStock: newStock }),
        ...(reorder !== undefined && { reorderLevel: newReorder }),
        ...(updates.costPrice !== undefined && { costPrice: Number(updates.costPrice) }),
        ...(updates.sellingPrice !== undefined && { sellingPrice: Number(updates.sellingPrice) }),
      });

      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
      showToast('Product updated successfully');
      return updated;
    } catch (err) {
      showToast('Failed to update product', 'error');
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const prod = products.find(p => p.id === id);
      await api.products.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (prod) {
        showToast(`Product "${prod.name}" removed from inventory`);
      }
    } catch (err) {
      showToast('Failed to delete product', 'error');
      throw err;
    }
  };

  // RECEIPT ACTIONS
  const createReceipt = async (receiptData) => {
    try {
      const newReceipt = await api.receipts.create(receiptData);
      setReceipts(prev => [newReceipt, ...prev]);

      // If status is immediately Received, adjust product stock and log to ledger
      if (newReceipt.status === 'Received') {
        const qty = Number(newReceipt.quantity) || 0;
        setProducts(prev => prev.map(p => {
          if (p.id === newReceipt.productId || p.name === newReceipt.productName) {
            const updatedStock = p.currentStock + qty;
            return {
              ...p,
              currentStock: updatedStock,
              status: calculateStatus(updatedStock, p.reorderLevel)
            };
          }
          return p;
        }));

        const prod = products.find(p => p.id === newReceipt.productId || p.name === newReceipt.productName);
        const newTotalStock = (prod?.currentStock || 0) + qty;

        const ledgerEntry = {
          id: `led-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          productId: newReceipt.productId,
          productName: newReceipt.productName,
          sku: prod?.sku || 'N/A',
          operationType: 'Receipt',
          quantity: `+${qty}`,
          numericQuantity: qty,
          from: newReceipt.supplier,
          to: newReceipt.warehouse,
          user: 'Elena Rostova',
          resultingStock: newTotalStock,
          referenceNumber: newReceipt.receiptNumber
        };
        setLedger(prev => [ledgerEntry, ...prev]);
      }

      showToast(`Receipt ${newReceipt.receiptNumber} recorded`);
      return newReceipt;
    } catch (err) {
      showToast('Failed to create receipt', 'error');
      throw err;
    }
  };

  const updateReceiptStatus = (id, newStatus) => {
    setReceipts(prev => prev.map(r => {
      if (r.id === id) {
        // If moving from non-received to Received
        if (r.status !== 'Received' && newStatus === 'Received') {
          const qty = Number(r.quantity) || 0;
          setProducts(currProds => currProds.map(p => {
            if (p.id === r.productId || p.name === r.productName) {
              const updatedStock = p.currentStock + qty;
              return {
                ...p,
                currentStock: updatedStock,
                status: calculateStatus(updatedStock, p.reorderLevel)
              };
            }
            return p;
          }));

          const prod = products.find(p => p.id === r.productId || p.name === r.productName);
          const newTotalStock = (prod?.currentStock || 0) + qty;

          setLedger(currLedger => [{
            id: `led-${Date.now()}`,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            productId: r.productId,
            productName: r.productName,
            sku: prod?.sku || 'N/A',
            operationType: 'Receipt',
            quantity: `+${qty}`,
            numericQuantity: qty,
            from: r.supplier,
            to: r.warehouse,
            user: 'Inventory Receiver',
            resultingStock: newTotalStock,
            referenceNumber: r.receiptNumber
          }, ...currLedger]);
        }
        return { ...r, status: newStatus };
      }
      return r;
    }));
    showToast(`Receipt status updated to ${newStatus}`);
  };

  // DELIVERY ACTIONS
  const createDelivery = async (deliveryData) => {
    try {
      const newDelivery = await api.deliveries.create(deliveryData);
      setDeliveries(prev => [newDelivery, ...prev]);

      if (newDelivery.status === 'Delivered') {
        const qty = Number(newDelivery.quantity) || 0;
        setProducts(prev => prev.map(p => {
          if (p.id === newDelivery.productId || p.name === newDelivery.productName) {
            const updatedStock = Math.max(0, p.currentStock - qty);
            return {
              ...p,
              currentStock: updatedStock,
              status: calculateStatus(updatedStock, p.reorderLevel)
            };
          }
          return p;
        }));

        const prod = products.find(p => p.id === newDelivery.productId || p.name === newDelivery.productName);
        const newTotalStock = Math.max(0, (prod?.currentStock || 0) - qty);

        const ledgerEntry = {
          id: `led-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          productId: newDelivery.productId,
          productName: newDelivery.productName,
          sku: prod?.sku || 'N/A',
          operationType: 'Delivery',
          quantity: `-${qty}`,
          numericQuantity: -qty,
          from: newDelivery.warehouse,
          to: newDelivery.customer,
          user: 'Shipping Logistics',
          resultingStock: newTotalStock,
          referenceNumber: newDelivery.deliveryNumber
        };
        setLedger(prev => [ledgerEntry, ...prev]);
      }

      showToast(`Outbound delivery ${newDelivery.deliveryNumber} created`);
      return newDelivery;
    } catch (err) {
      showToast('Failed to create delivery', 'error');
      throw err;
    }
  };

  const updateDeliveryStatus = (id, newStatus) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === id) {
        if (d.status !== 'Delivered' && newStatus === 'Delivered') {
          const qty = Number(d.quantity) || 0;
          setProducts(currProds => currProds.map(p => {
            if (p.id === d.productId || p.name === d.productName) {
              const updatedStock = Math.max(0, p.currentStock - qty);
              return {
                ...p,
                currentStock: updatedStock,
                status: calculateStatus(updatedStock, p.reorderLevel)
              };
            }
            return p;
          }));

          const prod = products.find(p => p.id === d.productId || p.name === d.productName);
          const newTotalStock = Math.max(0, (prod?.currentStock || 0) - qty);

          setLedger(currLedger => [{
            id: `led-${Date.now()}`,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            productId: d.productId,
            productName: d.productName,
            sku: prod?.sku || 'N/A',
            operationType: 'Delivery',
            quantity: `-${qty}`,
            numericQuantity: -qty,
            from: d.warehouse,
            to: d.customer,
            user: 'Dispatch Coordinator',
            resultingStock: newTotalStock,
            referenceNumber: d.deliveryNumber
          }, ...currLedger]);
        }
        return { ...d, status: newStatus };
      }
      return d;
    }));
    showToast(`Delivery status marked as ${newStatus}`);
  };

  // TRANSFER ACTIONS
  const createTransfer = async (transferData) => {
    try {
      const newTransfer = await api.transfers.create(transferData);
      setTransfers(prev => [newTransfer, ...prev]);

      if (newTransfer.status === 'Completed') {
        const qty = Number(newTransfer.quantity) || 0;
        const prod = products.find(p => p.id === newTransfer.productId || p.name === newTransfer.productName);

        const outLedger = {
          id: `led-${Date.now()}-out`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          productId: newTransfer.productId,
          productName: newTransfer.productName,
          sku: prod?.sku || 'N/A',
          operationType: 'Transfer Out',
          quantity: `-${qty}`,
          numericQuantity: -qty,
          from: newTransfer.fromWarehouse,
          to: newTransfer.toWarehouse,
          user: newTransfer.requestedBy || 'Logistics Admin',
          resultingStock: (prod?.currentStock || 0),
          referenceNumber: newTransfer.transferNumber
        };

        const inLedger = {
          id: `led-${Date.now()}-in`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          productId: newTransfer.productId,
          productName: newTransfer.productName,
          sku: prod?.sku || 'N/A',
          operationType: 'Transfer In',
          quantity: `+${qty}`,
          numericQuantity: qty,
          from: newTransfer.fromWarehouse,
          to: newTransfer.toWarehouse,
          user: newTransfer.requestedBy || 'Logistics Admin',
          resultingStock: (prod?.currentStock || 0),
          referenceNumber: newTransfer.transferNumber
        };

        setLedger(prev => [inLedger, outLedger, ...prev]);
      }

      showToast(`Transfer order ${newTransfer.transferNumber} scheduled`);
      return newTransfer;
    } catch (err) {
      showToast('Failed to create transfer', 'error');
      throw err;
    }
  };

  const updateTransferStatus = (id, newStatus) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    showToast(`Transfer marked as ${newStatus}`);
  };

  // ADJUSTMENT ACTIONS
  const createAdjustment = async (adjustmentData) => {
    try {
      const newAdjustment = await api.adjustments.create(adjustmentData);
      setAdjustments(prev => [newAdjustment, ...prev]);

      // Update the product's currentStock to the physical quantity verified
      const physQty = Number(newAdjustment.physicalQuantity);
      const diff = newAdjustment.difference;

      setProducts(prev => prev.map(p => {
        if (p.id === newAdjustment.productId || p.name === newAdjustment.productName) {
          return {
            ...p,
            currentStock: physQty,
            status: calculateStatus(physQty, p.reorderLevel),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      }));

      const prod = products.find(p => p.id === newAdjustment.productId || p.name === newAdjustment.productName);

      // Ledger entry
      const ledgerEntry = {
        id: `led-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        productId: newAdjustment.productId,
        productName: newAdjustment.productName,
        sku: prod?.sku || 'N/A',
        operationType: 'Adjustment',
        quantity: diff > 0 ? `+${diff}` : `${diff}`,
        numericQuantity: diff,
        from: diff < 0 ? newAdjustment.location : 'Audit Recon',
        to: diff < 0 ? 'Damage / Shrinkage' : newAdjustment.location,
        user: newAdjustment.approvedBy || 'Inventory Auditor',
        resultingStock: physQty,
        referenceNumber: newAdjustment.adjustmentNumber
      };
      setLedger(prev => [ledgerEntry, ...prev]);

      showToast(`Stock adjustment ${newAdjustment.adjustmentNumber} reconciled`);
      return newAdjustment;
    } catch (err) {
      showToast('Failed to create adjustment', 'error');
      throw err;
    }
  };

  // WAREHOUSE ACTIONS
  const addWarehouse = async (whData) => {
    try {
      const newWh = await api.warehouses.create({
        ...whData,
        capacity: Number(whData.capacity) || 10000,
        currentStock: 0,
        totalProducts: 0,
        lowStockCount: 0,
        status: whData.status || 'Operational'
      });
      setWarehouses(prev => [newWh, ...prev]);
      showToast(`Warehouse "${newWh.name}" added`);
      return newWh;
    } catch (err) {
      showToast('Failed to add warehouse', 'error');
      throw err;
    }
  };

  const updateWarehouse = async (id, updates) => {
    try {
      const updated = await api.warehouses.update(id, {
        ...updates,
        ...(updates.capacity && { capacity: Number(updates.capacity) }),
      });
      setWarehouses(prev => prev.map(w => w.id === id ? { ...w, ...updated } : w));
      showToast('Warehouse updated');
      return updated;
    } catch (err) {
      showToast('Failed to update warehouse', 'error');
      throw err;
    }
  };

  const deleteWarehouse = async (id) => {
    try {
      await api.warehouses.delete(id);
      setWarehouses(prev => prev.filter(w => w.id !== id));
      showToast('Warehouse decommissioned');
    } catch (err) {
      showToast('Failed to delete warehouse', 'error');
      throw err;
    }
  };

  // DYNAMIC COMPUTED DASHBOARD VALUES (dynamically calculated from mock/live data)
  const filteredProducts = products.filter(p => {
    if (dashboardFilter.warehouse !== 'all' && p.warehouse !== dashboardFilter.warehouse) return false;
    if (dashboardFilter.category !== 'all' && p.category !== dashboardFilter.category) return false;
    if (dashboardFilter.stockStatus !== 'all' && p.status !== dashboardFilter.stockStatus) return false;
    return true;
  });

  const kpis = {
    totalProducts: filteredProducts.length,
    totalStock: filteredProducts.reduce((sum, p) => sum + (Number(p.currentStock) || 0), 0),
    lowStockItems: filteredProducts.filter(p => p.status === 'Low Stock').length,
    outOfStockItems: filteredProducts.filter(p => p.status === 'Out of Stock').length,
    pendingReceipts: receipts.filter(r => r.status === 'Pending').length,
    pendingDeliveries: deliveries.filter(d => d.status === 'Pending').length,
    scheduledTransfers: transfers.filter(t => t.status === 'Scheduled').length,
  };

  // Dynamically compute Stock by Category
  const stockByCategory = Object.entries(
    filteredProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + Number(p.currentStock || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Dynamically compute Stock by Warehouse
  const stockByWarehouse = Object.entries(
    filteredProducts.reduce((acc, p) => {
      acc[p.warehouse] = (acc[p.warehouse] || 0) + Number(p.currentStock || 0);
      return acc;
    }, {})
  ).map(([name, stock]) => ({ name: name.replace('Warehouse', '').trim(), stock }));

  // Dynamic Movement Chart data (Receipts vs Deliveries by date)
  const movementChartData = [
    { day: 'Mon', receipts: 150, deliveries: 120, transfers: 50 },
    { day: 'Tue', receipts: 300, deliveries: 180, transfers: 80 },
    { day: 'Wed', receipts: 200, deliveries: 240, transfers: 40 },
    { day: 'Thu', receipts: 450, deliveries: 310, transfers: 110 },
    { day: 'Fri', receipts: 280, deliveries: 390, transfers: 95 },
    { day: 'Sat', receipts: 120, deliveries: 150, transfers: 30 },
    { day: 'Sun', receipts: 90, deliveries: 80, transfers: 20 },
  ];

  return (
    <InventoryContext.Provider value={{
      products,
      receipts,
      deliveries,
      transfers,
      adjustments,
      ledger,
      warehouses,
      insights,
      loading,
      toast,
      showToast,
      dashboardFilter,
      setDashboardFilter,
      kpis,
      stockByCategory,
      stockByWarehouse,
      movementChartData,
      // actions
      addProduct,
      updateProduct,
      deleteProduct,
      createReceipt,
      updateReceiptStatus,
      createDelivery,
      updateDeliveryStatus,
      createTransfer,
      updateTransferStatus,
      createAdjustment,
      addWarehouse,
      updateWarehouse,
      deleteWarehouse
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export default InventoryContext;
