USE stocksense_db;

DELIMITER $$

CREATE TRIGGER trg_stock_documents_before_update
BEFORE UPDATE ON stock_documents
FOR EACH ROW
BEGIN
    IF NEW.status = 'done' AND OLD.status <> 'done' THEN
        SET NEW.completed_at = COALESCE(NEW.completed_at, CURRENT_TIMESTAMP);
    END IF;
END$$

CREATE TRIGGER trg_inventory_after_update
AFTER UPDATE ON inventory
FOR EACH ROW
BEGIN
    IF NEW.quantity > 0 THEN
        UPDATE alerts
        SET status = 'resolved',
            resolved_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.product_id
          AND location_id = NEW.location_id
          AND status = 'active'
          AND alert_type = 'out_of_stock';
    END IF;
END$$

DELIMITER ;
