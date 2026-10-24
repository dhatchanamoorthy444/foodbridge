-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    organization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
    id VARCHAR(36) PRIMARY KEY,
    donor_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity DOUBLE NOT NULL,
    available_quantity DOUBLE NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    storage_requirement VARCHAR(100),
    condition_notes TEXT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(id)
);

-- Donations Table (Tracking the original donation)
CREATE TABLE IF NOT EXISTS donations (
    id VARCHAR(36) PRIMARY KEY,
    donor_id VARCHAR(36) NOT NULL,
    food_item_id VARCHAR(36) NOT NULL,
    quantity_donated DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

-- Donation Requests Table
CREATE TABLE IF NOT EXISTS donation_requests (
    id VARCHAR(36) PRIMARY KEY,
    donation_id VARCHAR(36) NOT NULL,
    recipient_id VARCHAR(36) NOT NULL,
    requested_quantity DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id)
);

-- Pickups Table
CREATE TABLE IF NOT EXISTS pickups (
    id VARCHAR(36) PRIMARY KEY,
    donation_request_id VARCHAR(36) NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    confirmation_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_request_id) REFERENCES donation_requests(id)
);

-- Audit Logs for Concurrency/Transparency
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
