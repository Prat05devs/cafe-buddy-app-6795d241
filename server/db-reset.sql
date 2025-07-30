-- Delete existing tables and insert fresh data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM tables;

-- Insert fresh table data with proper structure
INSERT INTO tables (number, capacity, status, floor, is_active) VALUES
('1', 2, 'available', 'Ground Floor', true),
('2', 4, 'available', 'Ground Floor', true),
('3', 4, 'occupied', 'Ground Floor', true),
('4', 6, 'available', 'Ground Floor', true),
('5', 2, 'available', 'First Floor', true),
('6', 4, 'reserved', 'First Floor', true),
('7', 6, 'available', 'First Floor', true),
('8', 8, 'cleaning', 'First Floor', true);