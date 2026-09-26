USE stocksense_db;

INSERT INTO users(full_name,email,password_hash,role) VALUES
('Aarav Sharma','aarav@stocksense.demo','$2b$12$demo_hash_inventory_manager','inventory_manager'),
('Priya Verma','priya@stocksense.demo','$2b$12$demo_hash_warehouse_staff','warehouse_staff'),
('Rohan Mehta','rohan@stocksense.demo','$2b$12$demo_hash_admin','admin');

INSERT INTO categories(name,description) VALUES
('Raw Materials','Materials used in production'),
('Finished Goods','Finished products ready for delivery'),
('Packaging','Packaging and shipping materials'),
('Office Supplies','General office inventory');

INSERT INTO units_of_measure(name,abbreviation) VALUES
('Piece','pcs'),
('Kilogram','kg'),
('Meter','m'),
('Box','box');

INSERT INTO products(sku,name,category_id,uom_id,description) VALUES
('STL-001','Steel Rods',1,2,'Industrial steel rods'),
('CHR-001','Office Chair',2,1,'Ergonomic office chair'),
('DSK-001','Office Desk',2,1,'Standard office desk'),
('BOX-001','Packaging Box',3,1,'Medium shipping box'),
('CAB-001','Network Cable',4,3,'Ethernet network cable');

INSERT INTO suppliers(supplier_code,name,contact_person,email,phone,address) VALUES
('SUP-001','Bharat Metals Pvt Ltd','Anil Kumar','sales@bharatmetals.demo','+91-9000000001','Gurugram, Haryana'),
('SUP-002','Modern Office Furnishings','Neha Singh','orders@modernoffice.demo','+91-9000000002','New Delhi, India'),
('SUP-003','PackRight Supplies','Vikas Rao','sales@packright.demo','+91-9000000003','Faridabad, Haryana');

INSERT INTO warehouses(warehouse_code,name,address) VALUES
('WH-MAIN','Main Warehouse','Gurugram, Haryana'),
('WH-SEC','Secondary Warehouse','Faridabad, Haryana');

INSERT INTO locations(warehouse_id,location_code,name,location_type) VALUES
(1,'MAIN-REC','Receiving Area','receiving'),
(1,'MAIN-A','Rack A','rack'),
(1,'MAIN-B','Rack B','rack'),
(1,'MAIN-PROD','Production Floor','production'),
(2,'SEC-A','Secondary Rack A','rack'),
(2,'SEC-SHIP','Shipping Area','shipping');

INSERT INTO inventory(product_id,location_id,quantity,reserved_quantity) VALUES
(1,2,100,0),
(2,2,40,5),
(3,3,25,0),
(4,5,200,20),
(5,3,500,50);

INSERT INTO reorder_rules(product_id,location_id,min_quantity,reorder_quantity,max_quantity) VALUES
(1,2,25,100,250),
(2,2,10,30,80),
(3,3,8,20,60),
(4,5,50,150,400),
(5,3,100,300,1000);

INSERT INTO stock_documents(
    document_number,document_type,status,supplier_id,
    destination_location_id,created_by,scheduled_at,reference_note
) VALUES
('REC-0001','receipt','done',1,2,1,'2026-09-20 10:00:00','Initial steel rod receipt'),
('REC-0002','receipt','ready',2,3,1,'2026-09-28 11:00:00','Office furniture delivery'),
('DEL-0001','delivery','ready',NULL,6,1,'2026-09-29 15:00:00','Customer shipment'),
('TRF-0001','internal_transfer','waiting',NULL,2,3,1,'2026-09-30 09:00:00','Move material to production');

INSERT INTO stock_document_items(document_id,product_id,quantity,unit_cost) VALUES
(1,1,100,85.00),
(2,2,15,6500.00),
(2,3,10,9000.00),
(3,2,10,NULL),
(4,1,20,NULL);

INSERT INTO stock_ledger(
    document_id,document_item_id,product_id,location_id,
    movement_type,quantity_change,quantity_after,performed_by,note
) VALUES
(1,1,1,2,'receipt',100,100,1,'Initial receipt of steel rods');

INSERT INTO alerts(
    product_id,location_id,alert_type,current_quantity,threshold_quantity,status
) VALUES
(3,3,'low_stock',25,8,'resolved');

INSERT INTO audit_logs(user_id,entity_type,entity_id,action,details) VALUES
(1,'stock_document',1,'validate',JSON_OBJECT('document_number','REC-0001')),
(1,'product',1,'create',JSON_OBJECT('sku','STL-001')),
(1,'warehouse',1,'create',JSON_OBJECT('warehouse_code','WH-MAIN'));
