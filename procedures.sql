USE stocksense_db;

DELIMITER $$

CREATE PROCEDURE sp_add_inventory(
    IN p_product_id BIGINT UNSIGNED,
    IN p_location_id BIGINT UNSIGNED,
    IN p_quantity DECIMAL(18,3),
    IN p_user_id BIGINT UNSIGNED,
    IN p_note VARCHAR(500)
)
BEGIN
    DECLARE v_new_quantity DECIMAL(18,3);

    IF p_quantity <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantity must be greater than zero';
    END IF;

    START TRANSACTION;

    INSERT INTO inventory(product_id, location_id, quantity)
    VALUES(p_product_id, p_location_id, p_quantity)
    ON DUPLICATE KEY UPDATE quantity = quantity + p_quantity;

    SELECT quantity INTO v_new_quantity
    FROM inventory
    WHERE product_id = p_product_id AND location_id = p_location_id
    FOR UPDATE;

    INSERT INTO stock_ledger(
        product_id, location_id, movement_type, quantity_change,
        quantity_after, performed_by, note
    )
    VALUES(
        p_product_id, p_location_id, 'receipt', p_quantity,
        v_new_quantity, p_user_id, p_note
    );

    COMMIT;
END$$

CREATE PROCEDURE sp_remove_inventory(
    IN p_product_id BIGINT UNSIGNED,
    IN p_location_id BIGINT UNSIGNED,
    IN p_quantity DECIMAL(18,3),
    IN p_user_id BIGINT UNSIGNED,
    IN p_note VARCHAR(500)
)
BEGIN
    DECLARE v_available DECIMAL(18,3);
    DECLARE v_new_quantity DECIMAL(18,3);

    IF p_quantity <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantity must be greater than zero';
    END IF;

    START TRANSACTION;

    SELECT quantity - reserved_quantity INTO v_available
    FROM inventory
    WHERE product_id = p_product_id AND location_id = p_location_id
    FOR UPDATE;

    IF v_available IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventory record not found';
    END IF;

    IF v_available < p_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient available stock';
    END IF;

    UPDATE inventory
    SET quantity = quantity - p_quantity
    WHERE product_id = p_product_id AND location_id = p_location_id;

    SELECT quantity INTO v_new_quantity
    FROM inventory
    WHERE product_id = p_product_id AND location_id = p_location_id;

    INSERT INTO stock_ledger(
        product_id, location_id, movement_type, quantity_change,
        quantity_after, performed_by, note
    )
    VALUES(
        p_product_id, p_location_id, 'delivery', -p_quantity,
        v_new_quantity, p_user_id, p_note
    );

    COMMIT;
END$$

CREATE PROCEDURE sp_get_dashboard_kpis()
BEGIN
    SELECT * FROM v_dashboard_kpis;
END$$

CREATE PROCEDURE sp_get_product_stock(IN p_product_id BIGINT UNSIGNED)
BEGIN
    SELECT *
    FROM v_inventory_status
    WHERE product_id = p_product_id
    ORDER BY warehouse_name, location_name;
END$$

CREATE PROCEDURE sp_create_stock_alerts()
BEGIN
    INSERT INTO alerts(
        product_id, location_id, alert_type,
        current_quantity, threshold_quantity, status
    )
    SELECT
        v.product_id,
        v.location_id,
        CASE WHEN v.quantity = 0 THEN 'out_of_stock' ELSE 'low_stock' END,
        v.quantity,
        v.reorder_level,
        'active'
    FROM v_inventory_status v
    WHERE v.stock_status IN ('LOW_STOCK','OUT_OF_STOCK')
      AND NOT EXISTS (
          SELECT 1
          FROM alerts a
          WHERE a.product_id = v.product_id
            AND a.location_id = v.location_id
            AND a.status = 'active'
            AND a.alert_type = CASE
                WHEN v.quantity = 0 THEN 'out_of_stock'
                ELSE 'low_stock'
            END
      );
END$$

DELIMITER ;
