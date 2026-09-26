CREATE DATABASE IF NOT EXISTS stocksense_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE stocksense_db;

CREATE TABLE users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('inventory_manager','warehouse_staff','admin') NOT NULL DEFAULT 'warehouse_staff',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE password_reset_otps (
    otp_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE categories (
    category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE units_of_measure (
    uom_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    abbreviation VARCHAR(20) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE products (
    product_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    uom_id BIGINT UNSIGNED NOT NULL,
    description VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_product_uom FOREIGN KEY (uom_id) REFERENCES units_of_measure(uom_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE suppliers (
    supplier_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    supplier_code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(120) NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(30) NULL,
    address VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE warehouses (
    warehouse_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warehouse_code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    address VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE locations (
    location_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    location_code VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    location_type ENUM('warehouse','rack','production','receiving','shipping','virtual') NOT NULL DEFAULT 'rack',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_location_code (warehouse_id, location_code),
    CONSTRAINT fk_location_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE inventory (
    inventory_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    location_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(18,3) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(18,3) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_inventory_product_location (product_id, location_id),
    CONSTRAINT chk_inventory_quantity CHECK (quantity >= 0),
    CONSTRAINT chk_inventory_reserved CHECK (reserved_quantity >= 0 AND reserved_quantity <= quantity),
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_inventory_location FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reorder_rules (
    reorder_rule_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    location_id BIGINT UNSIGNED NOT NULL,
    min_quantity DECIMAL(18,3) NOT NULL DEFAULT 0,
    reorder_quantity DECIMAL(18,3) NOT NULL DEFAULT 0,
    max_quantity DECIMAL(18,3) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_reorder_product_location (product_id, location_id),
    CONSTRAINT chk_reorder_min CHECK (min_quantity >= 0),
    CONSTRAINT chk_reorder_qty CHECK (reorder_quantity > 0),
    CONSTRAINT chk_reorder_max CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
    CONSTRAINT fk_reorder_product FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reorder_location FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE stock_documents (
    document_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_number VARCHAR(50) NOT NULL UNIQUE,
    document_type ENUM('receipt','delivery','internal_transfer','adjustment') NOT NULL,
    status ENUM('draft','waiting','ready','done','canceled') NOT NULL DEFAULT 'draft',
    supplier_id BIGINT UNSIGNED NULL,
    source_location_id BIGINT UNSIGNED NULL,
    destination_location_id BIGINT UNSIGNED NULL,
    reference_note VARCHAR(500) NULL,
    scheduled_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_document_source FOREIGN KEY (source_location_id) REFERENCES locations(location_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_document_destination FOREIGN KEY (destination_location_id) REFERENCES locations(location_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_document_creator FOREIGN KEY (created_by) REFERENCES users(user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_document_locations CHECK (
        document_type <> 'internal_transfer'
        OR (source_location_id IS NOT NULL AND destination_location_id IS NOT NULL
            AND source_location_id <> destination_location_id)
    ),
    CONSTRAINT chk_receipt_supplier CHECK (
        document_type <> 'receipt' OR supplier_id IS NOT NULL
    )
) ENGINE=InnoDB;

CREATE TABLE stock_document_items (
    document_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(18,3) NOT NULL,
    counted_quantity DECIMAL(18,3) NULL,
    unit_cost DECIMAL(15,2) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_document_product (document_id, product_id),
    CONSTRAINT chk_document_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_counted_quantity CHECK (counted_quantity IS NULL OR counted_quantity >= 0),
    CONSTRAINT chk_unit_cost CHECK (unit_cost IS NULL OR unit_cost >= 0),
    CONSTRAINT fk_document_item_document FOREIGN KEY (document_id) REFERENCES stock_documents(document_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_document_item_product FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE stock_ledger (
    ledger_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT UNSIGNED NULL,
    document_item_id BIGINT UNSIGNED NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    location_id BIGINT UNSIGNED NOT NULL,
    movement_type ENUM('receipt','delivery','transfer_in','transfer_out','adjustment_in','adjustment_out','initial_stock') NOT NULL,
    quantity_change DECIMAL(18,3) NOT NULL,
    quantity_after DECIMAL(18,3) NOT NULL,
    occurred_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    performed_by BIGINT UNSIGNED NOT NULL,
    note VARCHAR(500) NULL,
    CONSTRAINT fk_ledger_document FOREIGN KEY (document_id) REFERENCES stock_documents(document_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_ledger_document_item FOREIGN KEY (document_item_id) REFERENCES stock_document_items(document_item_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_ledger_product FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ledger_location FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ledger_user FOREIGN KEY (performed_by) REFERENCES users(user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_ledger_quantity_after CHECK (quantity_after >= 0),
    CONSTRAINT chk_ledger_change CHECK (quantity_change <> 0)
) ENGINE=InnoDB;

CREATE TABLE alerts (
    alert_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    location_id BIGINT UNSIGNED NOT NULL,
    alert_type ENUM('low_stock','out_of_stock') NOT NULL,
    current_quantity DECIMAL(18,3) NOT NULL,
    threshold_quantity DECIMAL(18,3) NOT NULL,
    status ENUM('active','resolved') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    CONSTRAINT fk_alert_product FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_alert_location FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
    audit_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT UNSIGNED NOT NULL,
    action ENUM('create','update','delete','validate','cancel','login','logout','password_reset') NOT NULL,
    details JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
