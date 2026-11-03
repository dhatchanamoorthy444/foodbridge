# Database Design Documentation

## Project Overview
This document outlines the complete database design for the FoodBridge project, implemented using MySQL 8 to satisfy academic requirements for Database Management Systems courses.

## 1. Database Design Process

### 1.1 First Normal Form (1NF)

The database design adheres to First Normal Form by:

- **Atomic Values**: All attributes contain atomic (indivisible) values
- **No Repeating Groups**: Each table has a single value per attribute
- **Unique Row Identifiers**: Each row has a primary key

**Example - users table**
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('DONOR', 'RECIPIENT', 'VOLUNTEER', 'ADMIN') NOT NULL,
    organization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 1.2 Second Normal Form (2NF)

The design achieves Second Normal Form by:

- **Removing Partial Dependencies**: All non-key attributes depend on the entire primary key
- **Separating Entity Types**: Creating distinct tables for different entity types
- **Using Foreign Keys**: Establishing relationships between tables

**Example - Separation of Concerns**
```sql
-- Users table for authentication
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table for donor/recipient details
CREATE TABLE organizations (
    org_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    org_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    address TEXT,
    contact_person VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 1.3 Third Normal Form (3NF)

The database is in Third Normal Form by:

- **Removing Transitive Dependencies**: Non-key attributes depend only on primary keys
- **Eliminating Derived Data**: No calculated or dependent attributes stored
- **Proper Decomposition**: Tables broken down into independent entities

**Example - Food Categories**
```sql
-- Categories table (independent entity)
CREATE TABLE food_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food items reference categories directly (not through parent table)
CREATE TABLE food_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    donor_id INT,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    storage_requirement VARCHAR(100) NOT NULL,
    status ENUM('normal', 'urgent', 'critical', 'expired', 'safety_review') DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES food_categories(category_id),
    FOREIGN KEY (donor_id) REFERENCES organizations(org_id)
);
```

## 2. Database Schema

### 2.1 Core Tables

#### 2.1.1 users
Stores user authentication and basic information.

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('DONOR', 'RECIPIENT', 'VOLUNTEER', 'ADMIN') NOT NULL,
    organization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    phone VARCHAR(20),
    address TEXT
);
```

#### 2.1.2 organizations
Stores organization details for donors and recipients.

```sql
CREATE TABLE organizations (
    org_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    org_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    address TEXT,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    email VARCHAR(255),
    established_date DATE,
    capacity DECIMAL(10,2),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

#### 2.1.3 food_categories
Maintains food category information.

```sql
CREATE TABLE food_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2.1.4 food_donations
Tracks food donation records.

```sql
CREATE TABLE food_donations (
    donation_id VARCHAR(36) PRIMARY KEY,
    food_item_id INT NOT NULL,
    donor_id INT NOT NULL,
    requested_quantity DECIMAL(10,2) NOT NULL,
    available_quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    storage_requirement VARCHAR(100) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'ALLOCATED', 'PICKED_UP', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    pickup_address TEXT,
    pickup_date TIMESTAMP NULL,
    pickup_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (food_item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (donor_id) REFERENCES organizations(org_id),
    CHECK (requested_quantity > 0),
    CHECK (available_quantity > 0),
    CHECK (available_quantity <= requested_quantity)
);
```

#### 2.1.5 food_requests
Tracks food requests from recipients.

```sql
CREATE TABLE food_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    requestor_id INT NOT NULL,
    category_id INT NOT NULL,
    requested_quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    urgency ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    description TEXT,
    preferred_pickup_date DATE,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requestor_id) REFERENCES organizations(org_id),
    FOREIGN KEY (category_id) REFERENCES food_categories(category_id),
    CHECK (requested_quantity > 0)
);
```

#### 2.1.6 allocations
Tracks food allocation between donations and requests.

```sql
CREATE TABLE allocations (
    allocation_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id VARCHAR(36) NOT NULL,
    request_id INT NOT NULL,
    allocated_quantity DECIMAL(10,2) NOT NULL,
    allocation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    completed_date TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (donation_id) REFERENCES food_donations(donation_id),
    FOREIGN KEY (request_id) REFERENCES food_requests(request_id),
    CHECK (allocated_quantity > 0),
    UNIQUE KEY unique_allocation (donation_id, request_id)
);
```

#### 2.1.7 pickups
Tracks food pickup operations.

```sql
CREATE TABLE pickups (
    pickup_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id VARCHAR(36) NOT NULL,
    volunteer_id INT NOT NULL,
    pickup_date TIMESTAMP NOT NULL,
    delivery_address TEXT,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    signature TEXT,
    photos TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES food_donations(donation_id),
    FOREIGN KEY (volunteer_id) REFERENCES organizations(org_id)
);
```

#### 2.1.8 notifications
Stores system notifications.

```sql
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('SYSTEM', 'ALERT', 'REMINDER', 'UPDATE') DEFAULT 'SYSTEM',
    related_id VARCHAR(255), -- Generic foreign key reference
    related_type VARCHAR(50), -- Type of related entity
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

#### 2.1.9 donation_history
Audits all donation-related changes.

```sql
CREATE TABLE donation_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id VARCHAR(36) NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE') NOT NULL,
    previous_state JSON,
    new_state JSON,
    performed_by INT NOT NULL,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    FOREIGN KEY (donation_id) REFERENCES food_donations(donation_id),
    FOREIGN KEY (performed_by) REFERENCES users(user_id)
);
```

#### 2.1.10 audit_logs
Comprehensive system audit logging.

```sql
CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### 2.2 Indexes

#### 2.2.1 Database Performance Indexes

```sql
-- Index for frequently queried fields
CREATE INDEX idx_food_items_expiry_date ON food_items(expiry_date);
CREATE INDEX idx_food_items_category ON food_items(category_id);
CREATE INDEX idx_food_items_status ON food_items(status);

-- Index for donation queries
CREATE INDEX idx_donations_status_expiry ON food_donations(status, expiry_date);
CREATE INDEX idx_donations_donor ON food_donations(donor_id);

-- Index for request queries
CREATE INDEX idx_requests_status_urgency ON food_requests(status, urgency);
CREATE INDEX idx_requests_category ON food_requests(category_id);

-- Index for allocation queries
CREATE INDEX idx_allocations_status ON allocations(status);
CREATE INDEX idx_allocations_date ON allocations(allocation_date);

-- Index for notification queries
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- Composite indexes for complex queries
CREATE INDEX idx_food_donations_status_expiry_qty ON food_donations(status, expiry_date, available_quantity);
```

### 2.3 Constraints and Triggers

#### 2.3.1 Database Constraints

```sql
-- Foreign key constraints for referential integrity
ALTER TABLE organizations ADD CONSTRAINT fk_org_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
ALTER TABLE food_items ADD CONSTRAINT fk_food_category FOREIGN KEY (category_id) REFERENCES food_categories(category_id);
ALTER TABLE food_items ADD CONSTRAINT fk_food_donor FOREIGN KEY (donor_id) REFERENCES organizations(org_id);
ALTER TABLE food_donations ADD CONSTRAINT fk_donation_item FOREIGN KEY (food_item_id) REFERENCES food_items(item_id);
ALTER TABLE food_donations ADD CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES organizations(org_id);

-- Check constraints for data integrity
ALTER TABLE food_donations ADD CONSTRAINT chk_quantity_range CHECK (requested_quantity > 0 AND available_quantity > 0 AND available_quantity <= requested_quantity);
ALTER TABLE food_requests ADD CONSTRAINT chk_request_quantity CHECK (requested_quantity > 0);
ALTER TABLE allocations ADD CONSTRAINT chk_allocation_quantity CHECK (allocated_quantity > 0);

-- Unique constraints
ALTER TABLE food_categories ADD CONSTRAINT uk_category_name UNIQUE (category_name);
ALTER TABLE organizations ADD CONSTRAINT uk_registration_number UNIQUE (registration_number);
```

#### 2.3.2 Triggers for Business Logic

```sql
-- Trigger to update timestamps
DELIMITER //
CREATE TRIGGER before_update_users BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger to create donation history
DELIMITER //
CREATE TRIGGER after_insert_food_donations
AFTER INSERT ON food_donations
FOR EACH ROW
BEGIN
    INSERT INTO donation_history (donation_id, action, previous_state, new_state, performed_by, reason)
    VALUES (NEW.donation_id, 'CREATE', NULL, JSON_OBJECT('donation_id', NEW.donation_id, 'status', NEW.status), NEW.donor_id, 'Initial creation');
END //
DELIMITER ;

-- Trigger to update donation status based on expiry
DELIMITER //
CREATE TRIGGER check_food_item_expiry
BEFORE UPDATE ON food_items
FOR EACH ROW
BEGIN
    IF NEW.expiry_date < CURRENT_DATE() THEN
        SET NEW.status = 'expired';
    END IF;
END //
DELIMITER ;
```

## 3. ER Diagram

The Entity Relationship Diagram represents the database structure:

### 3.1 Entity Relationships

1. **Users to Organizations**: One-to-One relationship
   - Users can be associated with one organization
   - Organizations can have one user record

2. **Organizations to Food Items**: One-to-Many relationship
   - One organization can donate multiple food items
   - Each food item belongs to one organization

3. **Organizations to Food Requests**: One-to-Many relationship
   - One organization can make multiple requests
   - Each request belongs to one organization

4. **Food Items to Categories**: Many-to-One relationship
   - Multiple food items can belong to one category
   - Each food item has one category

5. **Food Donations to Food Items**: One-to-Many relationship
   - One food item can have multiple donations
   - Each donation references one food item

6. **Organizations to Allocations**: One-to-Many relationship
   - One organization can allocate food multiple times
   - Each allocation references one organization

7. **Food Donations to Allocations**: One-to-Many relationship
   - One donation can be allocated multiple times
   - Each allocation references one donation

### 3.2 UML Class Diagram

```
+----------------+       +------------------+
|     Users      |       | Organizations    |
+----------------+       +------------------+
| -user_id (PK)  |<-----| -org_id (PK)     |
| -email         |       | -user_id (FK)     |
| -password_hash |       | -org_name        |
| -full_name     |       | -registration_no |
| -role          |       | -address         |
| -created_at    |       | -is_verified     |
+----------------+       +------------------+

+----------------+       +------------------+
| Food Categories|       | Food Items       |
+----------------+       +------------------+
| -category_id (PK)|     | -item_id (PK)    |
| -category_name |<-----| -category_id (FK)|
| -description   |       | -donor_id (FK)   |
| -is_active     |       | -name            |
+----------------+       | -quantity        |
                        | -expiry_date     |
                        | -status          |
                        +------------------+

+----------------+       +------------------+
| Food Donations  |       | Food Requests    |
+----------------+       +------------------+
| -donation_id(PK)|     | -request_id(PK)  |
| -food_item_id(FK)|     | -requestor_id(FK)|
| -donor_id(FK)  |       | -category_id(FK) |
| -quantity      |       | -urgency         |
| -status        |       | -description     |
| -created_at    |       | -status          |
+----------------+       +------------------+

+----------------+       +------------------+
|    Allocations  |       |    Pickups       |
+----------------+       +------------------+
| -allocation_id(PK)|     | -pickup_id(PK)   |
| -donation_id(FK)|<-----| -donation_id(FK) |
| -request_id(FK) |       | -volunteer_id(FK)|
| -quantity      |       | -status          |
| -status        |       | -pickup_date     |
+----------------+       +------------------+

+----------------+       +------------------+
| Notifications   |       |  Audit Logs      |
+----------------+       +------------------+
| -notification_id(PK)|     | -log_id(PK)      |
| -user_id(FK)   |<-----| -user_id(FK)     |
| -message       |       | -action          |
| -is_read       |       | -entity_type      |
| -created_at    |       | -created_at       |
+----------------+       +------------------+
```

## 4. SQL Queries for DBMS Demonstration

### 4.1 Basic CRUD Operations

```sql
-- INSERT a new food donation
INSERT INTO food_donations (donation_id, food_item_id, donor_id, requested_quantity, 
                          available_quantity, unit, expiry_date, storage_requirement, status)
VALUES ('don001', 1, 1, 100.0, 100.0, 'KG', '2024-12-31', 'REFRIGERATED', 'PENDING');

-- SELECT all available food donations
SELECT fd.donation_id, fi.name, fd.available_quantity, fd.unit, fd.expiry_date, fi.category_name
FROM food_donations fd
JOIN food_items fi ON fd.food_item_id = fi.item_id
JOIN food_categories fc ON fi.category_id = fc.category_id
WHERE fd.status = 'PENDING' AND fd.available_quantity > 0;

-- UPDATE donation quantity
UPDATE food_donations 
SET available_quantity = 75.0, updated_at = CURRENT_TIMESTAMP
WHERE donation_id = 'don001';

-- DELETE or deactivate a donation
UPDATE food_donations 
SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
WHERE donation_id = 'don001';
```

### 4.2 JOIN Operations

```sql
-- JOIN users and donations
SELECT u.full_name, u.email, fd.donation_id, fd.available_quantity, fd.unit
FROM users u
JOIN organizations o ON u.user_id = o.user_id
JOIN food_donations fd ON o.org_id = fd.donor_id
WHERE u.role = 'DONOR' AND fd.status = 'PENDING';

-- JOIN food requests and allocations
SELECT fr.request_id, o.org_name, fd.donation_id, a.allocated_quantity
FROM food_requests fr
JOIN organizations o ON fr.requestor_id = o.org_id
JOIN allocations a ON fr.request_id = a.request_id
JOIN food_donations fd ON a.donation_id = fd.donation_id
WHERE fr.status = 'APPROVED' AND a.status = 'CONFIRMED';
```

### 4.3 Aggregation Queries

```sql
-- GROUP BY food category
SELECT fc.category_name, COUNT(fd.donation_id) as donation_count, 
       SUM(fd.available_quantity) as total_quantity
FROM food_categories fc
JOIN food_items fi ON fc.category_id = fi.category_id
JOIN food_donations fd ON fi.item_id = fd.food_item_id
WHERE fd.status = 'PENDING'
GROUP BY fc.category_id, fc.category_name
ORDER BY total_quantity DESC;

-- COUNT total donations
SELECT COUNT(*) as total_donations, COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_donations,
       COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_donations
FROM food_donations;

-- SUM total redistributed quantity
SELECT SUM(a.allocated_quantity) as total_redistributed_quantity
FROM allocations a
JOIN food_requests fr ON a.request_id = fr.request_id
WHERE a.status = 'COMPLETED' AND fr.status = 'COMPLETED';
```

### 4.4 Advanced Queries

```sql
-- Find food expiring within 24 hours
SELECT fi.name, fd.donation_id, fi.expiry_date,
       TIMESTAMPDIFF(HOUR, CURRENT_TIMESTAMP, fi.expiry_date) as hours_until_expiry
FROM food_items fi
JOIN food_donations fd ON fi.item_id = fd.food_item_id
WHERE fi.status IN ('normal', 'urgent', 'critical')
  AND fi.expiry_date BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL 24 HOUR
ORDER BY hours_until_expiry ASC;

-- Find donors with the highest number of donations
SELECT o.org_name, COUNT(fd.donation_id) as donation_count
FROM organizations o
JOIN food_donations fd ON o.org_id = fd.donor_id
GROUP BY o.org_id, o.org_name
ORDER BY donation_count DESC
LIMIT 10;

-- Find NGOs with the highest number of completed collections
SELECT o.org_name, COUNT(p.pickup_id) as completed_collections
FROM organizations o
JOIN pickups p ON o.org_id = p.volunteer_id
WHERE p.status = 'COMPLETED'
GROUP BY o.org_id, o.org_name
ORDER BY completed_collections DESC
LIMIT 10;

-- Use a subquery to identify donors above the average donation count
SELECT org_name, donation_count
FROM (
    SELECT o.org_name, COUNT(fd.donation_id) as donation_count
    FROM organizations o
    JOIN food_donations fd ON o.org_id = fd.donor_id
    GROUP BY o.org_id, o.org_name
) as donor_counts
WHERE donation_count > (
    SELECT AVG(donation_count)
    FROM (
        SELECT COUNT(fd.donation_id) as donation_count
        FROM organizations o
        JOIN food_donations fd ON o.org_id = fd.donor_id
        GROUP BY o.org_id
    ) as all_donor_counts
);

-- Use ORDER BY to display urgent donations first
SELECT fd.donation_id, fi.name, fd.available_quantity, fd.expiry_date
FROM food_donations fd
JOIN food_items fi ON fd.food_item_id = fi.item_id
WHERE fd.status = 'PENDING'
ORDER BY CASE 
    WHEN fi.expiry_date < CURRENT_DATE() THEN 3  -- expired
    WHEN fi.expiry_date BETWEEN CURRENT_DATE() AND CURRENT_DATE() + INTERVAL 3 DAY THEN 2  -- urgent
    WHEN fi.expiry_date BETWEEN CURRENT_DATE() AND CURRENT_DATE() + INTERVAL 7 DAY THEN 1  -- soon
    ELSE 0
END DESC, fi.expiry_date ASC;
```

## 5. Database Normalization Documentation

### 5.1 1NF Compliance

The database satisfies First Normal Form:

- **Atomic Values**: All attributes contain indivisible values
- **Fixed Attributes**: Each table has a defined set of columns
- **No Repeating Groups**: No multi-valued attributes in single cells
- **Unique Rows**: Each row uniquely identified by primary key

### 5.2 2NF Compliance

The database satisfies Second Normal Form:

- **Full Functional Dependencies**: All non-key attributes depend on entire primary key
- **No Partial Dependencies**: Removed attributes dependent only on part of composite key
- **Separate Entities**: Tables separated based on different entity types

**Example**: Food items table contains attributes depending on item_id (primary key), not just category_id (partial dependency removed).

### 5.3 3NF Compliance

The database satisfies Third Normal Form:

- **Eliminated Transitive Dependencies**: Non-key attributes depend only on primary key
- **No Derived Attributes**: No calculated or derived data stored
- **Independent Entities**: Tables structured as independent entities

**Example**: Food categories table stores category information independently, not through parent tables.

## 6. JDBC Demonstration Module

### 6.1 JDBC Connection Setup

```java
public class JDBCDemonstration {
    private static final String URL = "jdbc:mysql://localhost:3306/foodbridge?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password";
    
    public static void demonstrateJDBCConnection() {
        try {
            // Load driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Establish connection
            Connection connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("JDBC Connection established successfully!");
            
            // Demonstrate basic operations
            demonstrateCRUDOperations(connection);
            
            connection.close();
            System.out.println("JDBC Connection closed successfully!");
            
        } catch (ClassNotFoundException e) {
            System.err.println("JDBC Driver not found: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("JDBC Error: " + e.getMessage());
        }
    }
    
    public static void demonstrateCRUDOperations(Connection connection) throws SQLException {
        // INSERT operation
        String insertSQL = "INSERT INTO food_donations (donation_id, food_item_id, donor_id, " +
                          "requested_quantity, available_quantity, unit, expiry_date, " +
                          "storage_requirement, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (PreparedStatement pstmt = connection.prepareStatement(insertSQL)) {
            pstmt.setString(1, "jdbcdemo001");
            pstmt.setInt(2, 1);
            pstmt.setInt(3, 1);
            pstmt.setDouble(4, 50.0);
            pstmt.setDouble(5, 50.0);
            pstmt.setString(6, "KG");
            pstmt.setDate(7, java.sql.Date.valueOf("2024-12-31"));
            pstmt.setString(8, "REFRIGERATED");
            pstmt.setString(9, "PENDING");
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("JDBC INSERT: " + rowsAffected + " row(s) inserted");
        }
        
        // SELECT operation
        String selectSQL = "SELECT donation_id, available_quantity, unit FROM food_donations WHERE donation_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(selectSQL)) {
            pstmt.setString(1, "jdbcdemo001");
            
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                System.out.println("JDBC SELECT: " + rs.getString("donation_id") + ", " +
                                 rs.getDouble("available_quantity") + " " + rs.getString("unit"));
            }
        }
        
        // UPDATE operation
        String updateSQL = "UPDATE food_donations SET available_quantity = ? WHERE donation_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(updateSQL)) {
            pstmt.setDouble(1, 45.0);
            pstmt.setString(2, "jdbcdemo001");
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("JDBC UPDATE: " + rowsAffected + " row(s) updated");
        }
        
        // DELETE operation
        String deleteSQL = "UPDATE food_donations SET status = ? WHERE donation_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(deleteSQL)) {
            pstmt.setString(1, "COMPLETED");
            pstmt.setString(2, "jdbcdemo001");
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("JDBC DELETE (soft): " + rowsAffected + " row(s) deleted");
        }
    }
}
```

### 6.2 JDBC vs JPA/Hibernate Comparison

| Feature | JDBC | JPA/Hibernate |
|---------|------|---------------|
| **Abstraction Level** | Low-level SQL statements | High-level object-oriented API |
| **Boilerplate Code** | High (connection, statement, result set) | Low (repositories, entities) |
| **Database Independence** | Requires database-specific code | Database independent via JPA specs |
| **Object Mapping** | Manual SQL-to-object mapping | Automatic entity mapping |
| **Query Language** | SQL only | JPQL, Criteria API, native SQL |
| **Transaction Management** | Manual begin/commit/rollback | declarative @Transactional |
| **Performance** | Lower-level control | Automatic optimization |
| **Maintainability** | Higher maintenance | Easier maintenance |
| **Use Case** | Simple operations, demonstrations | Production applications |

## 7. Transaction Management

### 7.1 Spring Transaction Configuration

```java
@Service
@Transactional
public class AllocationService {
    
    @Autowired
    private DonationRepository donationRepository;
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
    private AllocationRepository allocationRepository;
    
    @Transactional(rollbackFor = {Exception.class})
    public Allocation allocateFood(String donationId, Integer requestId, Double quantity) {
        // 1. Check donation availability
        FoodDonation donation = donationRepository.findById(donationId)
            .orElseThrow(() -> new DonationNotFoundException("Donation not found: " + donationId));
        
        if (donation.getAvailableQuantity() < quantity) {
            throw new InsufficientFoodQuantityException(
                "Insufficient quantity. Available: " + donation.getAvailableQuantity());
        }
        
        // 2. Check request status
        FoodRequest request = requestRepository.findById(requestId)
            .orElseThrow(() -> new InvalidFoodRequestException("Request not found: " + requestId));
        
        if (!request.getStatus().equals("APPROVED")) {
            throw new UnauthorizedOperationException("Request must be approved for allocation");
        }
        
        // 3. Check for duplicate allocation
        boolean alreadyAllocated = allocationRepository
            .existsByDonationIdAndRequestId(donationId, requestId);
        
        if (alreadyAllocated) {
            throw new InvalidFoodRequestException(
                "This donation has already been allocated to this request");
        }
        
        // 4. Create allocation record
        Allocation allocation = new Allocation();
        allocation.setDonationId(donationId);
        allocation.setRequestId(requestId);
        allocation.setAllocatedQuantity(quantity);
        allocation.setStatus("CONFIRMED");
        
        Allocation savedAllocation = allocationRepository.save(allocation);
        
        // 5. Update donation status
        donation.setAvailableQuantity(donation.getAvailableQuantity() - quantity);
        donation.setAllocatedQuantity(donation.getAllocatedQuantity() + quantity);
        
        if (donation.getAvailableQuantity() <= 0) {
            donation.setStatus("COMPLETED");
        }
        
        donationRepository.save(donation);
        
        // 6. Update request status if allocation is complete
        if (request.getRequestedQuantity().equals(quantity)) {
            request.setStatus("COMPLETED");
        } else {
            request.setRequestedQuantity(request.getRequestedQuantity() - quantity);
        }
        
        requestRepository.save(request);
        
        return savedAllocation;
    }
    
    @Transactional(readOnly = true)
    public List<Allocation> getPendingAllocations() {
        return allocationRepository.findByStatus("PENDING");
    }
}
```

### 7.2 Database Locking for Data Integrity

```sql
-- Pessimistic locking for critical operations
SELECT * FROM food_donations 
WHERE donation_id = ? 
FOR UPDATE;

-- Optimistic locking with version control
ALTER TABLE food_donations ADD COLUMN version INT DEFAULT 0;

UPDATE food_donations 
SET available_quantity = ?, version = version + 1
WHERE donation_id = ? AND version = ?;

-- Trigger-based validation
DELIMITER //
CREATE TRIGGER prevent_negative_allocation
BEFORE INSERT ON allocations
FOR EACH ROW
BEGIN
    DECLARE available_qty DECIMAL(10,2);
    
    SELECT available_quantity INTO available_qty 
    FROM food_donations 
    WHERE donation_id = NEW.donation_id;
    
    IF available_qty < NEW.allocated_quantity THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient food quantity for allocation';
    END IF;
END //
DELIMITER ;
```

## 8. Database Connectivity Documentation

### 8.1 Connection Configuration

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/foodbridge?useSSL=false&serverTimezone=UTC
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        default_batch_fetch_size: 100
  
  flyway:
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true
```

### 8.2 Environment Variables

```bash
# .env.example
DB_HOST=localhost
DB_PORT=3306
DB_NAME=foodbridge
DB_USERNAME=foodbridge_user
DB_PASSWORD=${DB_PASSWORD}
DB_SSL_MODE=DISABLED

# Application constants
APP_BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

### 8.3 JDBC Module Isolation

The JDBC demonstration module uses a separate database instance or a demonstration schema to:

- **Prevent Production Impact**: Avoid disrupting live application data
- **Educational Focus**: Showcase JDBC concepts without complex configuration
- **Safety**: Demonstrate database operations in isolated environment

```sql
-- Create separate demonstration database
CREATE DATABASE IF NOT EXISTS foodbridge_jdbc_demo;

-- Use demonstration schema for JDBC demo
USE foodbridge_jdbc_demo;

-- Create demonstration tables
CREATE TABLE demo_food_donations (
    donation_id VARCHAR(36) PRIMARY KEY,
    donor_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 9. Security and Compliance Documentation

### 9.1 Database Security

```sql
-- Role-based access control
GRANT SELECT, INSERT, UPDATE ON foodbridge.* TO 'donor_user'@'%' IDENTIFIED BY 'password';
GRANT SELECT, INSERT ON foodbridge.food_requests TO 'recipient_user'@'%' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE ON foodbridge.allocations TO 'volunteer_user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON foodbridge.* TO 'admin_user'@'%' IDENTIFIED BY 'admin_password';

-- Connection limits
ALTER USER 'donor_user'@'%' WITH MAX_QUERIES_PER_HOUR 100;
ALTER USER 'recipient_user'@'%' WITH MAX_UPDATES_PER_HOUR 50;

-- Row-level security
CREATE VIEW donor_food_view AS
SELECT donation_id, food_item_id, donor_id, available_quantity, 
       unit, expiry_date, status
FROM food_donations
WHERE status = 'PENDING';
```

### 9.2 Privacy Compliance

```sql
-- Data retention policies
CREATE EVENT delete_expired_audit_logs
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 30 DAY
DO BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL 30 DAY;
END;

-- Anonymization triggers
DELIMITER //
CREATE TRIGGER anonymize_donation_data
BEFORE DELETE ON food_donations
FOR EACH ROW
BEGIN
    INSERT INTO donation_anonymized (
        original_donation_id, anonymized_donor_id, 
        quantity, status, anonymized_date
    ) VALUES (
        OLD.donation_id, MD5(CAST(OLD.donor_id AS CHAR)),
        OLD.available_quantity, OLD.status, CURRENT_TIMESTAMP
    );
    
    DELETE FROM food_donations WHERE donation_id = OLD.donation_id;
END //
DELIMITER ;
```

## 10. Performance Optimization

### 10.1 Indexing Strategy

```sql
-- Composite indexes for complex queries
CREATE INDEX idx_donations_status_expiry_qty ON food_donations(status, expiry_date, available_quantity);
CREATE INDEX idx_requests_status_urgency ON food_requests(status, urgency);
CREATE INDEX idx_allocations_status_date ON allocations(status, allocation_date);

-- Hash indexes for equality checks
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_organizations_reg_no ON organizations(registration_number);

-- Full-text search for descriptions
ALTER TABLE food_items ADD FULLTEXT INDEX ft_search (name, description);
```

### 10.2 Query Optimization

```sql
-- Use EXPLAIN for query analysis
EXPLAIN FORMAT=JSON
SELECT fi.name, fd.available_quantity
FROM food_donations fd
JOIN food_items fi ON fd.food_item_id = fi.item_id
WHERE fd.status = 'PENDING' AND fi.expiry_date > CURRENT_DATE()
ORDER BY fi.expiry_date;

-- Query performance metrics
CREATE TABLE query_performance_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    query_text TEXT,
    execution_time_ms INT,
    rows_examined INT,
    rows_sent INT,
    query_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 11. Maintenance and Backup

### 11.1 Backup Strategy

```bash
#!/bin/bash
# backup.sh

TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
BACKUP_DIR="/backups/foodbridge"

# Create backup
mysqldump -u foodbridge_user -p${DB_PASSWORD} \
    --single-transaction --routines --triggers --all-databases > \
    ${BACKUP_DIR}/foodbridge_${TIMESTAMP}.sql

# Compress backup
cd ${BACKUP_DIR}
tar -czf foodbridge_${TIMESTAMP}.tar.gz foodbridge_${TIMESTAMP}.sql

# Remove old backups
find ${BACKUP_DIR} -name "foodbridge_*.tar.gz" -mtime +30 -delete

# Verify backup integrity
gunzip -t foodbridge_${TIMESTAMP}.tar.gz
```

### 11.2 Database Maintenance

```sql
-- Database maintenance procedures
DELIMITER //

CREATE PROCEDURE cleanup_expired_donations()
BEGIN
    UPDATE food_donations 
    SET status = 'EXPIRED'
    WHERE expiry_date < CURRENT_DATE() AND status IN ('PENDING', 'APPROVED', 'ALLOCATED');
END //

CREATE PROCEDURE update_food_item_status()
BEGIN
    UPDATE food_items fi
    SET status = CASE
        WHEN expiry_date < CURRENT_DATE() THEN 'expired'
        WHEN expiry_date BETWEEN CURRENT_DATE() AND CURRENT_DATE() + INTERVAL 3 DAY THEN 'urgent'
        WHEN expiry_date BETWEEN CURRENT_DATE() AND CURRENT_DATE() + INTERVAL 7 DAY THEN 'critical'
        ELSE 'normal'
    END
    WHERE status NOT IN ('expired', 'safety_review')
    AND expiry_date BETWEEN CURRENT_DATE() AND CURRENT_DATE() + INTERVAL 7 DAY;
END //

DELIMITER ;
```

## Conclusion

This comprehensive database design documentation provides:

1. **Complete Schema**: 10 core tables with proper relationships
2. **Normalization**: Full 1NF, 2NF, and 3NF compliance
3. **Security**: Access control and privacy protection
4. **Performance**: Optimized indexes and query strategies
5. **Maintenance**: Backup and maintenance procedures
6. **Compliance**: GDPR and academic requirements adherence

The database design supports all FoodBridge requirements while maintaining academic integrity and practical usability for OOP and DBMS evaluation.