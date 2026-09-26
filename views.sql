USE stocksense_db;

CREATE OR REPLACE VIEW v_inventory_status AS
SELECT
    i.inventory_id,
    p.product_id,
    p.sku,
    p.name AS product_name,
    c.name AS category_name,
    u.abbreviation AS uom,
    l.location_id,
    l.location_code,
    l.name AS location_name,
    w.warehouse_id,
    w.warehouse_code,
    w.name AS warehouse_name,
    i.quantity,
    i.reserved_quantity,
    (i.quantity - i.reserved_quantity) AS available_quantity,
    COALESCE(rr.min_quantity, 0) AS reorder_level,
    COALESCE(rr.reorder_quantity, 0) AS reorder_quantity,
    CASE
        WHEN i.quantity = 0 THEN 'OUT_OF_STOCK'
        WHEN rr.min_quantity IS NOT NULL AND i.quantity <= rr.min_quantity THEN 'LOW_STOCK'
        ELSE 'IN_STOCK'
    END AS stock_status
FROM inventory i
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
JOIN units_of_measure u ON u.uom_id = p.uom_id
JOIN locations l ON l.location_id = i.location_id
JOIN warehouses w ON w.warehouse_id = l.warehouse_id
LEFT JOIN reorder_rules rr
    ON rr.product_id = i.product_id AND rr.location_id = i.location_id;

CREATE OR REPLACE VIEW v_low_stock_items AS
SELECT *
FROM v_inventory_status
WHERE stock_status IN ('LOW_STOCK','OUT_OF_STOCK');

CREATE OR REPLACE VIEW v_stock_movement AS
SELECT
    sl.ledger_id,
    sl.occurred_at,
    sl.movement_type,
    sl.quantity_change,
    sl.quantity_after,
    p.sku,
    p.name AS product_name,
    l.location_code,
    l.name AS location_name,
    w.name AS warehouse_name,
    sd.document_number,
    sd.document_type,
    sd.status,
    u.full_name AS performed_by,
    sl.note
FROM stock_ledger sl
JOIN products p ON p.product_id = sl.product_id
JOIN locations l ON l.location_id = sl.location_id
JOIN warehouses w ON w.warehouse_id = l.warehouse_id
LEFT JOIN stock_documents sd ON sd.document_id = sl.document_id
JOIN users u ON u.user_id = sl.performed_by;

CREATE OR REPLACE VIEW v_pending_operations AS
SELECT
    sd.document_id,
    sd.document_number,
    sd.document_type,
    sd.status,
    sd.scheduled_at,
    w1.name AS source_warehouse,
    w2.name AS destination_warehouse,
    s.name AS supplier_name,
    u.full_name AS created_by
FROM stock_documents sd
LEFT JOIN locations sl ON sl.location_id = sd.source_location_id
LEFT JOIN warehouses w1 ON w1.warehouse_id = sl.warehouse_id
LEFT JOIN locations dl ON dl.location_id = sd.destination_location_id
LEFT JOIN warehouses w2 ON w2.warehouse_id = dl.warehouse_id
LEFT JOIN suppliers s ON s.supplier_id = sd.supplier_id
JOIN users u ON u.user_id = sd.created_by
WHERE sd.status IN ('draft','waiting','ready');

CREATE OR REPLACE VIEW v_dashboard_kpis AS
SELECT
    (SELECT COUNT(DISTINCT product_id) FROM inventory WHERE quantity > 0) AS products_in_stock,
    (SELECT COUNT(*) FROM v_inventory_status WHERE stock_status = 'LOW_STOCK') AS low_stock_items,
    (SELECT COUNT(*) FROM v_inventory_status WHERE stock_status = 'OUT_OF_STOCK') AS out_of_stock_items,
    (SELECT COUNT(*) FROM stock_documents WHERE document_type = 'receipt' AND status IN ('waiting','ready')) AS pending_receipts,
    (SELECT COUNT(*) FROM stock_documents WHERE document_type = 'delivery' AND status IN ('waiting','ready')) AS pending_deliveries,
    (SELECT COUNT(*) FROM stock_documents WHERE document_type = 'internal_transfer' AND status IN ('waiting','ready')) AS scheduled_internal_transfers;
