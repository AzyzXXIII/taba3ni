-- ============================================
-- Taba3ni Dairy Distribution System
-- PostgreSQL Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
email VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(500) NOT NULL,
full_name VARCHAR(255) NOT NULL,
phone VARCHAR(20),
role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Distributor', 'Client')),
status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
last_login TIMESTAMP,
refresh_token TEXT,
refresh_token_expiry TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. PRODUCT CATEGORIES
-- ============================================

CREATE TABLE product_categories (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name VARCHAR(100) NOT NULL,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. PRODUCTS
-- ============================================

CREATE TABLE products (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name VARCHAR(255) NOT NULL,
sku VARCHAR(50) UNIQUE NOT NULL,
category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
description TEXT,
unit VARCHAR(50) NOT NULL, -- '1L', '500g', etc.
price DECIMAL(10, 2) NOT NULL,
cost DECIMAL(10, 2), -- Cost price for profit calculation
stock_quantity INTEGER NOT NULL DEFAULT 0,
min_stock_quantity INTEGER DEFAULT 0,
status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'OutOfStock')),
image_url TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);

-- ============================================
-- 4. CLIENTS (STORES)
-- ============================================

CREATE TABLE clients (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
business_name VARCHAR(255) NOT NULL,
business_type VARCHAR(50) CHECK (business_type IN ('Supermarket', 'Grocery', 'Restaurant', 'Cafe', 'Other')),
tax_id VARCHAR(50),
contact_person VARCHAR(255) NOT NULL,
address TEXT NOT NULL,
city VARCHAR(100) NOT NULL,
postal_code VARCHAR(20),
latitude DECIMAL(10, 8),
longitude DECIMAL(11, 8),
credit_limit DECIMAL(10, 2) DEFAULT 0,
current_balance DECIMAL(10, 2) DEFAULT 0,
payment_terms VARCHAR(50) DEFAULT 'Cash', -- 'Cash', 'Net15', 'Net30', 'Net45', 'Net60'
status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Inactive', 'Suspended')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_user ON clients(user_id);
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_clients_status ON clients(status);

-- ============================================
-- 5. DISTRIBUTORS
-- ============================================

CREATE TABLE distributors (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
vehicle_type VARCHAR(50) NOT NULL, -- 'RefrigeratedTruck', 'Van', 'PickupTruck', etc.
vehicle_plate VARCHAR(20) NOT NULL,
vehicle_capacity VARCHAR(50), -- '2 tons', '1 ton', etc.
assigned_zone TEXT, -- 'Tunis, Lac 2, La Marsa'
status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'OnDelivery')),
rating DECIMAL(3, 2) DEFAULT 0.00,
total_ratings INTEGER DEFAULT 0,
total_deliveries INTEGER DEFAULT 0,
completed_deliveries INTEGER DEFAULT 0,
failed_deliveries INTEGER DEFAULT 0,
on_time_deliveries INTEGER DEFAULT 0,
joined_date DATE DEFAULT CURRENT_DATE,
last_delivery_date TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_distributors_user ON distributors(user_id);
CREATE INDEX idx_distributors_status ON distributors(status);

-- ============================================
-- 6. ORDERS
-- ============================================

CREATE TABLE orders (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
order_number VARCHAR(50) UNIQUE NOT NULL,
client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Processing', 'OutForDelivery', 'Delivered', 'Cancelled', 'Failed')),
payment_status VARCHAR(50) DEFAULT 'Unpaid' CHECK (payment_status IN ('Unpaid', 'Partial', 'Paid', 'Refunded')),
subtotal DECIMAL(10, 2) NOT NULL,
tax_amount DECIMAL(10, 2) DEFAULT 0,
total_amount DECIMAL(10, 2) NOT NULL,
paid_amount DECIMAL(10, 2) DEFAULT 0,
notes TEXT,
delivery_date DATE,
delivery_time_slot VARCHAR(50), -- '09:00-11:00', '11:00-13:00', etc.
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);

-- ============================================
-- 7. ORDER ITEMS
-- ============================================

CREATE TABLE order_items (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
quantity INTEGER NOT NULL,
unit_price DECIMAL(10, 2) NOT NULL,
line_total DECIMAL(10, 2) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- 8. DELIVERIES
-- ============================================

CREATE TABLE deliveries (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
delivery_number VARCHAR(50) UNIQUE NOT NULL,
distributor_id UUID REFERENCES distributors(id) ON DELETE SET NULL,
status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'InProgress', 'Completed', 'Failed', 'Cancelled')),
scheduled_date DATE NOT NULL,
scheduled_time VARCHAR(50), -- '09:00-11:00'
started_at TIMESTAMP,
completed_at TIMESTAMP,
total_distance DECIMAL(10, 2), -- in km
estimated_duration INTEGER, -- in minutes
actual_duration INTEGER, -- in minutes
priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
notes TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deliveries_number ON deliveries(delivery_number);
CREATE INDEX idx_deliveries_distributor ON deliveries(distributor_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_date ON deliveries(scheduled_date);

-- ============================================
-- 9. DELIVERY ORDERS (Many-to-Many)
-- ============================================

CREATE TABLE delivery_orders (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
sequence_number INTEGER, -- Order of delivery stops
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(delivery_id, order_id)
);

CREATE INDEX idx_delivery_orders_delivery ON delivery_orders(delivery_id);
CREATE INDEX idx_delivery_orders_order ON delivery_orders(order_id);

-- ============================================
-- 10. DELIVERY TRACKING (GPS)
-- ============================================

CREATE TABLE delivery_tracking (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
latitude DECIMAL(10, 8) NOT NULL,
longitude DECIMAL(11, 8) NOT NULL,
speed DECIMAL(5, 2), -- km/h
heading DECIMAL(5, 2), -- degrees
accuracy DECIMAL(10, 2), -- meters
tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tracking_delivery ON delivery_tracking(delivery_id);
CREATE INDEX idx_tracking_time ON delivery_tracking(tracked_at);

-- ============================================
-- 11. DELIVERY CONFIRMATIONS
-- ============================================

CREATE TABLE delivery_confirmations (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
recipient_name VARCHAR(255) NOT NULL,
signature_data TEXT, -- Base64 image
notes TEXT,
latitude DECIMAL(10, 8),
longitude DECIMAL(11, 8),
confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_confirmations_delivery ON delivery_confirmations(delivery_id);
CREATE INDEX idx_confirmations_order ON delivery_confirmations(order_id);

-- ============================================
-- 12. DELIVERY PHOTOS
-- ============================================

CREATE TABLE delivery_photos (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
delivery_confirmation_id UUID NOT NULL REFERENCES delivery_confirmations(id) ON DELETE CASCADE,
photo_url TEXT NOT NULL,
latitude DECIMAL(10, 8),
longitude DECIMAL(11, 8),
uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_photos_confirmation ON delivery_photos(delivery_confirmation_id);

-- ============================================
-- 13. PAYMENTS
-- ============================================

CREATE TABLE payments (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
amount DECIMAL(10, 2) NOT NULL,
payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Cash', 'BankTransfer', 'Check', 'Credit', 'Card')),
payment_reference VARCHAR(100),
status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
notes TEXT,
payment_date DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- 14. NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
message TEXT NOT NULL,
type VARCHAR(50) NOT NULL CHECK (type IN ('Order', 'Delivery', 'Payment', 'System', 'Alert')),
priority VARCHAR(50) DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
is_read BOOLEAN DEFAULT FALSE,
related_entity_id UUID, -- ID of order, delivery, etc.
related_entity_type VARCHAR(50), -- 'Order', 'Delivery', etc.
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================
-- 15. ACTIVITY LOG (Audit Trail)
-- ============================================

CREATE TABLE activity_logs (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) ON DELETE SET NULL,
action VARCHAR(100) NOT NULL, -- 'OrderCreated', 'DeliveryCompleted', etc.
entity_type VARCHAR(50) NOT NULL, -- 'Order', 'Delivery', 'Product', etc.
entity_id UUID NOT NULL,
old_values JSONB,
new_values JSONB,
ip_address VARCHAR(50),
user_agent TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at);

-- ============================================
-- 16. SYSTEM SETTINGS
-- ============================================

CREATE TABLE system_settings (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
key VARCHAR(100) UNIQUE NOT NULL,
value TEXT NOT NULL,
description TEXT,
category VARCHAR(50), -- 'General', 'Email', 'SMS', 'Payment', etc.
is_public BOOLEAN DEFAULT FALSE,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_settings_key ON system_settings(key);
CREATE INDEX idx_settings_category ON system_settings(category);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;

$$
language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_distributors_updated_at BEFORE UPDATE ON distributors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS
$$

BEGIN
IF NEW.order_number IS NULL THEN
NEW.order_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
END IF;
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq;
CREATE TRIGGER set_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Auto-generate delivery number
CREATE OR REPLACE FUNCTION generate_delivery_number()
RETURNS TRIGGER AS
$$

BEGIN
IF NEW.delivery_number IS NULL THEN
NEW.delivery_number := 'DEL-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('delivery_number_seq')::TEXT, 4, '0');
END IF;
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE SEQUENCE delivery_number_seq;
CREATE TRIGGER set_delivery_number BEFORE INSERT ON deliveries FOR EACH ROW EXECUTE FUNCTION generate_delivery_number();

-- Update client balance on payment
CREATE OR REPLACE FUNCTION update_client_balance()
RETURNS TRIGGER AS
$$

BEGIN
IF NEW.status = 'Completed' THEN
UPDATE clients
SET current_balance = current_balance - NEW.amount
WHERE id = NEW.client_id;
END IF;
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER update_balance_on_payment AFTER INSERT OR UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_client_balance();

-- ============================================
-- SEED DATA (Initial System Settings)
-- ============================================

INSERT INTO system_settings (key, value, description, category, is_public) VALUES
('company_name', 'Taba3ni Dairy', 'Company name', 'General', TRUE),
('tax_rate', '0.19', 'Default tax rate (19%)', 'Financial', TRUE),
('currency', 'TND', 'Currency code', 'Financial', TRUE),
('min_order_amount', '50', 'Minimum order amount', 'Orders', TRUE),
('delivery_fee', '10', 'Standard delivery fee', 'Delivery', TRUE);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Orders with client info
CREATE OR REPLACE VIEW v_orders_with_clients AS
SELECT
    o.*,
    c.business_name as client_name,
    c.city as client_city,
    c.address as client_address,
    u.phone as client_phone
FROM orders o
JOIN clients c ON o.client_id = c.id
JOIN users u ON c.user_id = u.id;

-- Deliveries with distributor info
CREATE OR REPLACE VIEW v_deliveries_with_distributors AS
SELECT
    d.*,
    dist.vehicle_type,
    dist.vehicle_plate,
    u.full_name as distributor_name,
    u.phone as distributor_phone
FROM deliveries d
LEFT JOIN distributors dist ON d.distributor_id = dist.id
LEFT JOIN users u ON dist.user_id = u.id;

-- Product stock status
CREATE OR REPLACE VIEW v_product_stock_status AS
SELECT
    p.*,
    CASE
        WHEN p.stock_quantity = 0 THEN 'OutOfStock'
        WHEN p.stock_quantity < p.min_stock_quantity THEN 'LowStock'
        ELSE 'InStock'
    END as stock_status
FROM products p;

-- Dashboard statistics
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM orders WHERE status NOT IN ('Cancelled', 'Failed')) as total_orders,
    (SELECT COUNT(*) FROM clients WHERE status = 'Active') as active_clients,
    (SELECT COUNT(*) FROM deliveries WHERE status = 'InProgress') as active_deliveries,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'Delivered') as total_revenue,
    (SELECT COUNT(*) FROM products WHERE stock_quantity < min_stock_quantity) as low_stock_products;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'System users (Admin, Distributors, Clients)';
COMMENT ON TABLE products IS 'Product catalog';
COMMENT ON TABLE clients IS 'Client stores/businesses';
COMMENT ON TABLE distributors IS 'Delivery distributors';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE deliveries IS 'Delivery assignments';
COMMENT ON TABLE delivery_tracking IS 'Real-time GPS tracking data';
COMMENT ON TABLE delivery_confirmations IS 'Delivery proof with signatures';
COMMENT ON TABLE payments IS 'Payment transactions';
COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON TABLE activity_logs IS 'System audit trail';

-- ============================================
-- END OF SCHEMA
-- ============================================
$$
