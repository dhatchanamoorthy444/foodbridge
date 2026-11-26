# FoodBridge Viva Questions and Answers

## Overview
This document provides comprehensive questions and answers for academic evaluation of the FoodBridge project. It covers all major OOP and DBMS concepts implemented in the project, providing clear explanations for viva examinations.

## Purpose
- **Academic Evaluation**: Prepare for viva examinations on OOP and DBMS concepts
- **Documentation**: Provide comprehensive explanations of implementation
- **Learning Support**: Help students understand and explain their implementation
- **Quality Assurance**: Ensure all requirements are met and well-documented

## Section 1: OOP Concepts

### 1.1 Encapsulation

**Question:** Explain encapsulation in the FoodBridge application. Provide examples from the code.

**Answer:**

Encapsulation is one of the four fundamental OOP principles, where data (attributes) and methods (behaviors) are bundled together as a single unit. In FoodBridge, encapsulation is implemented as follows:

#### Examples:

**1. User Class Encapsulation**
```java
@Entity
@Data
public abstract class User {
    // Private fields - encapsulated
    private Long id;
    private String email;
    private String password;
    private String fullName;
    private UserRole role;
    
    // Public getters and setters
    public String getEmail() {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalStateException("Email cannot be null or empty");
        }
        return email;
    }
    
    public void setEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        this.email = email.trim().toLowerCase();
    }
    
    // Validation method
    public void validateUser() {
        if (email == null || password == null) {
            throw new InvalidFoodRequestException("Email and password are required");
        }
    }
}
```

**2. FoodItem Class Business Rule Encapsulation**
```java
@Entity
@Table(name = "food_items")
@Data
public class FoodItem {
    // Private fields with validation
    @Positive(message = "Quantity must be greater than zero")
    @Column(nullable = false)
    private Double quantity;
    
    @Column(nullable = false)
    private LocalDate expiryDate;
    
    // Encapsulated business rule methods
    public String calculateStatus() {
        // Business logic encapsulated within the class
        LocalDate today = LocalDate.now();
        long daysUntilExpiry = ChronoUnit.DAYS.between(today, expiryDate);
        
        if (expiryDate.isBefore(today)) {
            return "expired";
        } else if (daysUntilExpiry <= 1) {
            return "critical";
        } else if (daysUntilExpiry <= 3) {
            return "urgent";
        } else {
            return "normal";
        }
    }
    
    public String calculateSafetyRating() {
        // Another encapsulated business rule
        LocalDate today = LocalDate.now();
        long daysUntilExpiry = ChronoUnit.DAYS.between(today, expiryDate);
        
        if (daysUntilExpiry <= 1) {
            return "LOW";
        } else if (daysUntilExpiry <= 3) {
            return "MEDIUM";
        } else {
            return "HIGH";
        }
    }
}
```

**3. Donation Class Business Logic Encapsulation**
```java
@Entity
@Table(name = "donations")
@Data
public class Donation {
    // Encapsulated business methods
    public void updateRemainingQuantity(double allocated) {
        if (allocated < 0) {
            throw new IllegalArgumentException("Allocated quantity cannot be negative");
        }
        if (allocated > this.remainingQuantity) {
            throw new InsufficientFoodQuantityException(
                "Cannot allocate more than remaining quantity: " + this.remainingQuantity);
        }
        this.allocatedQuantity += allocated;
        this.remainingQuantity -= allocated;
        if (this.remainingQuantity <= 0) {
            this.status = "COMPLETED";
        } else {
            this.status = "ALLOCATED";
        }
    }
    
    public boolean canAllocate(double quantity) {
        return this.status.equals("APPROVED") && 
               this.remainingQuantity >= quantity && 
               this.remainingQuantity > 0;
    }
}
```

#### Key Points:
- **Data Hiding**: Private fields prevent direct external access
- **Controlled Access**: Getters/setters provide controlled field modification
- **Business Rules**: Validation and logic encapsulated within classes
- **Data Integrity**: Encapsulation ensures data consistency
- **Maintainability**: Changes to business logic centralized in single classes

### 1.2 Inheritance

**Question:** Explain the inheritance hierarchy in FoodBridge. How is it implemented and what are its benefits?

**Answer:**

FoodBridge implements a comprehensive inheritance hierarchy to demonstrate OOP inheritance:

#### Inheritance Structure:

```java
public abstract class User {
    // Base class with common attributes and methods
}

public class Donor extends User {
    // Donor-specific attributes and methods
}

public class Recipient extends User {
    // Recipient-specific attributes and methods
}

public class Volunteer extends User {
    // Volunteer-specific attributes and methods
}

public class Admin extends User {
    // Admin-specific attributes and methods
}
```

#### Implementation Details:

**1. Abstract Base Class**
```java
public abstract class User {
    // Common attributes
    private Long id;
    private String email;
    private String password;
    private String fullName;
    private UserRole role;
    
    // Common constructor
    public User(String email, String password, String fullName, UserRole role) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }
    
    // Common methods
    public abstract void displayUserInfo();
    public abstract boolean canDonate();
    public abstract void performRoleSpecificActions();
    
    public void updateProfile(String fullName, String organization) {
        // Common functionality
    }
}
```

**2. Concrete Subclasses**
```java
public class Donor extends User {
    private String donorType; // RESTAURANT, SUPERMARKET, etc.
    private String address;
    
    @Override
    public void displayUserInfo() {
        System.out.println("Donor: " + getFullName() + " (" + donorType + ")");
    }
    
    @Override
    public boolean canDonate() {
        return true;
    }
    
    public void submitDonation(FoodItem foodItem) {
        // Donor-specific functionality
    }
}
```

**3. Benefits Demonstrated**:

**A. Code Reusability**
- Common user functionality in base class
- Donor, Recipient, Volunteer, Admin inherit common methods
- Reduces code duplication

**B. Polymorphism**
- Same method names behave differently based on subclass
- `displayUserInfo()` implemented differently by each subclass
- Runtime polymorphism through method overriding

**C. Extensibility**
- Easy to add new user types (e.g., "Government Agency")
- New functionality added to base class applies to all subclasses
- Maintainable and scalable architecture

**D. Method Overriding**
- Each subclass provides its own implementation
- Different behavior for same method name
- Demonstrates runtime polymorphism

#### Viva Tips:
- Show understanding of `extends` keyword usage
- Explain abstract methods and why they're needed
- Demonstrate knowledge of `super` keyword usage
- Provide examples of method overriding
- Discuss benefits like DRY principle and extensibility

### 1.3 Polymorphism

**Question:** How is polymorphism implemented in FoodBridge? Provide examples of method overloading and overriding.

**Answer:**

Polymorphism allows objects to be treated as instances of their parent class. FoodBridge implements polymorphism in multiple ways:

#### 1. Method Overriding

**Example: NotificationService Interface**
```java
public interface NotificationService {
    void sendNotification(User recipient, String message);
    String getNotificationType();
    boolean isPriority();
}

public class EmailNotificationService implements NotificationService {
    @Override
    public void sendNotification(User recipient, String message) {
        // Email-specific implementation
        System.out.println("Sending email to " + recipient.getEmail() + ": " + message);
    }
    
    @Override
    public String getNotificationType() {
        return "EMAIL";
    }
    
    @Override
    public boolean isPriority() {
        return true;
    }
}

public class SMSNotificationService implements NotificationService {
    @Override
    public void sendNotification(User recipient, String message) {
        // SMS-specific implementation
        System.out.println("Sending SMS to " + recipient.getContactNumber() + ": " + message);
    }
    
    @Override
    public String getNotificationType() {
        return "SMS";
    }
    
    @Override
    public boolean isPriority() {
        return false;
    }
}
```

**Example: AbstractNotificationService**
```java
public abstract class AbstractNotificationService implements NotificationService {
    @Override
    public void sendNotification(User recipient, String message) {
        // Common implementation with abstract method
        this.recipient = recipient;
        this.message = message;
        sendActualNotification(recipient, message);
    }
    
    protected abstract void sendActualNotification(User recipient, String message);
    
    // Common method implementation
    @Override
    public boolean isPriority() {
        return false;
    }
}
```

#### 2. Method Overloading

**Example: DonationService Allocation Methods**
```java
public class DonationService {
    // Method overloading with different parameters
    public Donation allocateDonation(String donationId, Double quantity) {
        // Implementation with String ID
    }
    
    public Donation allocateDonation(String donationId, Double quantity, 
                                   String notes) {
        // Implementation with additional notes parameter
    }
    
    public Donation allocateDonation(String donationId, Double quantity, 
                                   String notes, boolean notifyRecipient) {
        // Implementation with notification flag
    }
    
    public Donation allocateDonation(String donationId, Double quantity, 
                                   String notes, boolean notifyRecipient,
                                   String allocationReference) {
        // Implementation with additional reference
    }
}
```

**Example: User Profile Update**
```java
public class UserService {
    // Overloaded updateProfile methods
    public User updateProfile(Long id, String fullName, String organization) {
        // Update both name and organization
    }
    
    public User updateProfile(Long id, String fullName) {
        // Update only name
    }
    
    public User updateProfile(Long id, Map<String, Object> updates) {
        // Update with flexible map
    }
}
```

#### 3. Runtime Polymorphism

**Example: User Processing**
```java
public class UserProcessor {
    public void processUser(User user) {
        // Runtime polymorphism based on actual object type
        user.displayUserInfo(); // Calls appropriate subclass method
        
        if (user instanceof Donor) {
            Donor donor = (Donor) user;
            donor.submitDonation(new FoodItem("Rice", "GRAINS", 10.0, "KG", ...));
        } else if (user instanceof Recipient) {
            Recipient recipient = (Recipient) user;
            recipient.requestFood(new FoodItem("Wheat", "GRAINS", 5.0, "KG", ...));
        } else if (user instanceof Volunteer) {
            Volunteer volunteer = (Volunteer) user;
            volunteer.schedulePickup(new Pickup(...));
        } else if (user instanceof Admin) {
            Admin admin = (Admin) user;
            admin.manageUsers(user);
        }
    }
}
```

**Example: Notification Factory**
```java
public class NotificationFactory {
    public static NotificationService createNotification(User recipient, String type, String contactInfo) {
        // Factory method returning appropriate notification service
        switch (type.toUpperCase()) {
            case "EMAIL":
                return new EmailNotificationService(recipient, contactInfo);
            case "SMS":
                return new SMSNotificationService(recipient, contactInfo);
            case "IN_APP":
                return new InAppNotificationService(recipient, "NOTIF_" + System.currentTimeMillis());
            default:
                throw new IllegalArgumentException("Unknown notification type: " + type);
        }
    }
}
```

#### 4. Benefits Demonstrated:

**A. Flexibility**: Different behaviors through polymorphism
**B. Extensibility**: Easy to add new notification types
**C. Maintainability**: Common code in abstract classes
**D. Reusability**: Same interface for different implementations
**E. Testability**: Mock implementations for testing

### 1.4 Abstraction

**Question:** How is abstraction implemented in FoodBridge? Provide examples of abstract classes and interfaces.

**Answer:**

Abstraction involves hiding implementation details and showing only essential features. FoodBridge demonstrates abstraction through:

#### 1. Abstract Classes

**Example: AbstractFoodMatchingStrategy**
```java
public abstract class AbstractFoodMatchingStrategy {
    // Template method pattern
    public final boolean matchFood(FoodItem foodItem, Double requiredQuantity) {
        validateInput(foodItem, requiredQuantity);
        boolean quantityMatch = checkQuantityCompatibility(foodItem, requiredQuantity);
        boolean categoryMatch = checkCategoryCompatibility(foodItem);
        boolean expiryMatch = checkExpiryCompatibility(foodItem);

        return quantityMatch && categoryMatch && expiryMatch;
    }
    
    // Abstract methods - subclasses must implement
    protected abstract void validateInput(FoodItem foodItem, Double requiredQuantity);
    protected abstract boolean checkQuantityCompatibility(FoodItem foodItem, Double requiredQuantity);
    protected abstract boolean checkCategoryCompatibility(FoodItem foodItem);
    protected abstract boolean checkExpiryCompatibility(FoodItem foodItem);
    
    // Concrete method implementation
    protected String generateCompatibilityReport(FoodItem foodItem, Double requiredQuantity, boolean isMatch) {
        return "Food: " + foodItem.getName() + "\n" +
               "Required: " + requiredQuantity + " " + foodItem.getUnit() + "\n" +
               "Available: " + foodItem.getQuantity() + " " + foodItem.getUnit() + "\n" +
               "Match: " + (isMatch ? "YES" : "NO") + "\n" +
               "Expiry: " + foodItem.getExpiryDate();
    }
}
```

**Example: AbstractNotificationService**
```java
public abstract class AbstractNotificationService implements NotificationService {
    // Common fields and methods
    protected String message;
    protected boolean isRead;
    protected User recipient;
    
    public AbstractNotificationService(User recipient) {
        this.recipient = recipient;
        this.isRead = false;
    }
    
    // Template method
    @Override
    public void sendNotification(User recipient, String message) {
        this.recipient = recipient;
        this.message = message;
        sendActualNotification(recipient, message);
    }
    
    // Abstract method - subclasses must implement
    protected abstract void sendActualNotification(User recipient, String message);
    
    // Common implementation
    @Override
    public boolean isPriority() {
        return false;
    }
}
```

#### 2. Interfaces

**Example: FoodMatchingStrategy Interface**
```java
public interface FoodMatchingStrategy {
    // Abstract methods
    boolean matches(FoodItem requested, FoodItem available);
    double calculatePriority(FoodItem requested, FoodItem available);
    String getStrategyName();
    
    // Default method implementation
    default boolean isCompatible(FoodItem requested, FoodItem available) {
        return matches(requested, available) &&
               calculatePriority(requested, available) > 0.5;
    }
}
```

**Example: NotificationService Interface**
```java
public interface NotificationService {
    // Abstract methods
    void sendNotification(User recipient, String message);
    String getNotificationType();
    boolean isPriority();
    void markAsRead();
    boolean isRead();
    String getMessage();
    void setMessage(String message);
    
    // Default method
    default void sendTestNotification() {
        System.out.println("Test notification sent");
    }
}
```

#### 3. Interface Implementations

**Example 1: CategoryMatchingStrategy**
```java
public class CategoryMatchingStrategy implements FoodMatchingStrategy {
    @Override
    public boolean matches(FoodItem requested, FoodItem available) {
        return requested.getCategory().equalsIgnoreCase(available.getCategory());
    }
    
    @Override
    public double calculatePriority(FoodItem requested, FoodItem available) {
        return requested.getCategory().equalsIgnoreCase(available.getCategory()) ? 1.0 : 0.0;
    }
    
    @Override
    public String getStrategyName() {
        return "CategoryBased";
    }
}
```

**Example 2: QuantityMatchingStrategy**
```java
public class QuantityMatchingStrategy implements FoodMatchingStrategy {
    @Override
    public boolean matches(FoodItem requested, FoodItem available) {
        return available.getQuantity() >= requested.getQuantity();
    }
    
    @Override
    public double calculatePriority(FoodItem requested, FoodItem available) {
        double ratio = available.getQuantity() / requested.getQuantity();
        return Math.min(ratio, 1.0);
    }
    
    @Override
    public String getStrategyName() {
        return "QuantityBased";
    }
}
```

**Example 3: CombinedMatchingStrategy**
```java
public class CombinedMatchingStrategy implements FoodMatchingStrategy {
    private FoodMatchingStrategy categoryStrategy;
    private FoodMatchingStrategy quantityStrategy;
    
    public CombinedMatchingStrategy() {
        this.categoryStrategy = new CategoryMatchingStrategy();
        this.quantityStrategy = new QuantityMatchingStrategy();
    }
    
    @Override
    public boolean matches(FoodItem requested, FoodItem available) {
        boolean categoryMatch = categoryStrategy.matches(requested, available);
        boolean quantityMatch = quantityStrategy.matches(requested, available);
        return categoryMatch && quantityMatch;
    }
    
    @Override
    public double calculatePriority(FoodItem requested, FoodItem available) {
        double categoryScore = categoryStrategy.calculatePriority(requested, available);
        double quantityScore = quantityStrategy.calculatePriority(requested, available);
        return (categoryScore + quantityScore) / 2.0;
    }
    
    @Override
    public String getStrategyName() {
        return "Combined";
    }
}
```

#### 4. Benefits Demonstrated:

**A. Interface Segregation**: Multiple interfaces for different concerns
**B. Multiple Inheritance**: Classes can implement multiple interfaces
**C. Flexible Design**: Easy to swap implementations
**D. Standardization**: Common contracts across implementations
**E. Testing**: Mock interfaces for testing

### 1.5 Exception Handling

**Question:** How are custom exceptions implemented in FoodBridge? Provide examples and explain their usage.

**Answer:**

FoodBridge implements custom exceptions to handle application-specific errors and provide better error messages:

#### 1. Custom Exception Classes

**Example: CustomExceptions.java**
```java
public class CustomExceptions {
    
    // Donation-related exceptions
    public static class DonationNotFoundException extends RuntimeException {
        public DonationNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class ExpiredFoodException extends RuntimeException {
        public ExpiredFoodException(String message) {
            super(message);
        }
    }
    
    public static class InsufficientFoodQuantityException extends RuntimeException {
        public InsufficientFoodQuantityException(String message) {
            super(message);
        }
    }
    
    // Other custom exceptions
    public static class UnauthorizedOperationException extends RuntimeException {
        public UnauthorizedOperationException(String message) {
            super(message);
        }
    }
    
    public static class InvalidFoodRequestException extends RuntimeException {
        public InvalidFoodRequestException(String message) {
            super(message);
        }
    }
    
    // Utility class for exception handling
    public static class ExceptionHandler {
        public static String handleDonationException(Exception e) {
            if (e instanceof DonationNotFoundException) {
                return "Donation not found: " + e.getMessage();
            } else if (e instanceof ExpiredFoodException) {
                return "Expired food: " + e.getMessage();
            } else if (e instanceof InsufficientFoodQuantityException) {
                return "Insufficient quantity: " + e.getMessage();
            } else {
                return "An error occurred: " + e.getMessage();
            }
        }
    }
}
```

#### 2. Exception Usage in Business Logic

**Example: Service Layer Exception Handling**
```java
@Service
public class DonationService {
    
    public Donation allocateDonation(String id, Double quantity) {
        Donation existingDonation = getDonationById(id);
        if (existingDonation == null) {
            throw new DonationNotFoundException("Donation not found: " + id);
        }
        
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Allocation quantity must be positive");
        }
        
        if (!existingDonation.canAllocate(quantity)) {
            throw new InsufficientFoodQuantityException(
                "Cannot allocate " + quantity + " from donation " + id +
                ". Available: " + existingDonation.getRemainingQuantity()
            );
        }
        
        return donationRepository.save(existingDonation);
    }
    
    public Donation approveDonation(String id) {
        Donation donation = getDonationById(id);
        if (donation == null) {
            throw new DonationNotFoundException("Donation not found: " + id);
        }
        
        if (donation.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ExpiredFoodException("Cannot approve expired donation: " + id);
        }
        
        donation.approveDonation();
        return donationRepository.save(donation);
    }
}
```

#### 3. Controller Layer Exception Handling

**Example: Global Exception Handler**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(DonationNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDonationNotFound(DonationNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(ExpiredFoodException.class)
    public ResponseEntity<ErrorResponse> handleExpiredFood(ExpiredFoodException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            System.currentTimeMillis()
        );
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(InsufficientFoodQuantityException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientQuantity(InsufficientFoodQuantityException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

#### 3. Exception Benefits

**A. Specific Error Handling**: Different exception types for different scenarios
**B. Better User Experience**: Clear error messages for users
**C. Debugging Support**: Detailed error information for developers
**D. Business Rule Enforcement**: Custom exceptions for business rules
**E. API Documentation**: Exception contracts for API consumers

## Section 2: Database Management Concepts

### 2.1 Database Design

**Question:** Explain the database design of FoodBridge. How are tables designed, what constraints are used, and how normalization is achieved?

**Answer:**

FoodBridge uses a comprehensive MySQL 8 database design with proper normalization and constraints:

#### 1. Database Schema Overview

**Tables and Relationships**:

```sql
-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('DONOR', 'RECIPIENT', 'VOLUNTEER', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Organizations table
CREATE TABLE organizations (
    org_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    org_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    address TEXT,
    contact_person VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Food categories table
CREATE TABLE food_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Food items table
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
    safety_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES food_categories(category_id),
    FOREIGN KEY (donor_id) REFERENCES organizations(org_id),
    CHECK (quantity > 0),
    CHECK (safety_rating >= 0 AND safety_rating <= 5)
);

-- Donations table
CREATE TABLE donations (
    donation_id VARCHAR(36) PRIMARY KEY,
    food_item_id INT NOT NULL,
    donor_id INT NOT NULL,
    requested_quantity DECIMAL(10,2) NOT NULL,
    available_quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
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

-- Food requests table
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

-- Allocations table
CREATE TABLE allocations (
    allocation_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id VARCHAR(36) NOT NULL,
    request_id INT NOT NULL,
    allocated_quantity DECIMAL(10,2) NOT NULL,
    allocation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    completed_date TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id),
    FOREIGN KEY (request_id) REFERENCES food_requests(request_id),
    CHECK (allocated_quantity > 0),
    UNIQUE KEY unique_allocation (donation_id, request_id)
);
```

#### 2. Normalization Process

**First Normal Form (1NF)**:
- All attributes contain atomic values
- No repeating groups
- Each row uniquely identified by primary key
- All columns contain values, no groups of values

**Example:** Food items table
```sql
CREATE TABLE food_items (
    item_id INT PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(100),
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    expiry_date DATE,
    -- All values are atomic (no lists or sets)
    -- Each row is unique (item_id primary key)
);
```

**Second Normal Form (2NF)**:
- 1NF compliant
- No partial dependencies on composite keys
- All non-key attributes depend on entire primary key

**Example:** Users table
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    role ENUM('DONOR', 'RECIPIENT', 'VOLUNTEER', 'ADMIN'),
    -- All non-key attributes depend on user_id (primary key)
    -- No partial dependencies
);
```

**Third Normal Form (3NF)**:
- 2NF compliant
- No transitive dependencies
- Non-key attributes depend only on primary key

**Example:** Food categories table
```sql
CREATE TABLE food_categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE,
    description TEXT,
    -- No transitive dependencies
    -- category_name determines category_id, not vice versa
);
```

#### 3. Constraints and Relationships

**Primary Keys**:
- Each table has a clear primary key
- Uses appropriate key types (INT for most tables, VARCHAR for UUID-based tables)

**Foreign Keys**:
- Enforce referential integrity
- Example: `donor_id` references `organizations(org_id)`

**Unique Constraints**:
- Prevent duplicate entries
- Example: `email` in users table

**Check Constraints**:
- Validate data integrity
- Example: `quantity > 0` in food_items table

**Indexes**:
- Performance optimization
- Example: `INDEX idx_email (email)` in users table

#### 4. ER Diagram

**Entity Relationships**:

```
Users ----< Organizations >---- FoodItems ----> FoodCategories
  |                         |
  |                         v
  |                      FoodDonations ----> Allocations ----> FoodRequests
  |
  v
Notifications
```

**Key Relationships**:

1. **One-to-One**: Users to Organizations (Optional)
2. **One-to-Many**: Organizations to FoodItems
3. **Many-to-One**: FoodItems to FoodCategories
4. **One-to-Many**: FoodDonations to Allocations
5. **Many-to-One**: Allocations to FoodRequests

#### 5. Database Design Benefits

**A. Data Integrity**: Constraints prevent invalid data
**B. Performance**: Indexes optimize query performance
**C. Relationships**: Foreign keys maintain data consistency
**D. Normalization**: Reduces data redundancy
**E. Security**: Access control through foreign key constraints

### 2.2 SQL Implementation

**Question:** How are SQL operations implemented in FoodBridge? Provide examples of CRUD operations and complex queries.

**Answer:**

FoodBridge implements SQL operations through both JDBC and JPA/Hibernate, demonstrating different approaches to database interaction:

#### 1. JDBC Operations

**CREATE Operation**:
```java
public void createFoodItem(Connection conn, FoodItem foodItem) throws SQLException {
    String sql = "INSERT INTO food_items (name, category, quantity, unit, expiry_date, storage_requirement, donor_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
        pstmt.setString(1, foodItem.getName());
        pstmt.setString(2, foodItem.getCategory());
        pstmt.setDouble(3, foodItem.getQuantity());
        pstmt.setString(4, foodItem.getUnit());
        pstmt.setDate(5, java.sql.Date.valueOf(foodItem.getExpiryDate()));
        pstmt.setString(6, foodItem.getStorageRequirement());
        pstmt.setLong(7, foodItem.getDonorId());
        
        pstmt.executeUpdate();
    }
}
```

**SELECT Operation**:
```java
public List<FoodItem> getFoodItemsByCategory(Connection conn, String category) throws SQLException {
    String sql = "SELECT item_id, name, category, quantity, unit, expiry_date, storage_requirement FROM food_items WHERE category = ? AND status != 'expired'";
    
    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
        pstmt.setString(1, category);
        
        ResultSet rs = pstmt.executeQuery();
        List<FoodItem> foodItems = new ArrayList<>();
        
        while (rs.next()) {
            FoodItem foodItem = new FoodItem();
            foodItem.setId(rs.getLong("item_id"));
            foodItem.setName(rs.getString("name"));
            foodItem.setCategory(rs.getString("category"));
            foodItem.setQuantity(rs.getDouble("quantity"));
            foodItem.setUnit(rs.getString("unit"));
            foodItem.setExpiryDate(rs.getDate("expiry_date").toLocalDate());
            foodItem.setStorageRequirement(rs.getString("storage_requirement"));
            
            foodItems.add(foodItem);
        }
        
        return foodItems;
    }
}
```

**UPDATE Operation**:
```java
public void updateFoodItemStatus(Connection conn, Long itemId, String newStatus) throws SQLException {
    String sql = "UPDATE food_items SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE item_id = ?";
    
    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
        pstmt.setString(1, newStatus);
        pstmt.setLong(2, itemId);
        
        int rowsAffected = pstmt.executeUpdate();
        if (rowsAffected == 0) {
            throw new SQLException("No food item found with id: " + itemId);
        }
    }
}
```

**DELETE Operation**:
```java
public void deleteExpiredFoodItems(Connection conn) throws SQLException {
    String sql = "DELETE FROM food_items WHERE status = 'expired'";
    
    try (Statement stmt = conn.createStatement()) {
        int rowsAffected = stmt.executeUpdate(sql);
        System.out.println("Deleted " + rowsAffected + " expired food items");
    }
}
```

#### 2. JPA/Hibernate Operations

**CREATE Operation**:
```java
@Repository
public class FoodItemRepositoryImpl implements FoodItemRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public FoodItem createFoodItem(FoodItem foodItem) {
        entityManager.persist(foodItem);
        return foodItem;
    }
    
    @Override
    public List<FoodItem> findUrgentFoodItems() {
        String jpql = "SELECT fi FROM FoodItem fi WHERE fi.status IN ('urgent', 'critical') ORDER BY fi.expiryDate ASC";
        return entityManager.createQuery(jpql, FoodItem.class).getResultList();
    }
}
```

**Complex Query Example**:
```java
@Repository
public class CustomFoodItemRepositoryImpl implements FoodItemRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<FoodItemDTO> getFoodItemsWithExpiryWarning(int days) {
        String jpql = """
            SELECT new com.foodbridge.api.dto.FoodItemDTO(
                fi.itemId, fi.name, fi.category, fi.quantity, fi.unit, 
                fi.expiryDate, fi.status, 
                DATEDIFF(fi.expiryDate, CURRENT_DATE())
            )
            FROM FoodItem fi
            WHERE fi.status IN ('normal', 'urgent', 'critical')
            AND DATEDIFF(fi.expiryDate, CURRENT_DATE()) <= :days
            ORDER BY fi.expiryDate ASC
        """;
        
        TypedQuery<FoodItemDTO> query = entityManager.createQuery(jpql, FoodItemDTO.class);
        query.setParameter("days", days);
        return query.getResultList();
    }
    
    @Override
    public Map<String, Long> getFoodItemsByCategoryStatistics() {
        String jpql = "SELECT fi.category, COUNT(fi.item_id) FROM FoodItem fi GROUP BY fi.category";
        
        Query query = entityManager.createQuery(jpql);
        List<Object[]> results = query.getResultList();
        
        Map<String, Long> statistics = new HashMap<>();
        for (Object[] result : results) {
            String category = (String) result[0];
            Long count = (Long) result[1];
            statistics.put(category, count);
        }
        
        return statistics;
    }
}
```

#### 3. Complex SQL Queries

**Example: Food Expiration Report**
```sql
SELECT 
    fi.name AS food_item_name,
    fi.category AS food_category,
    fi.quantity AS available_quantity,
    fi.unit AS quantity_unit,
    fi.expiry_date AS expiry_date,
    DATEDIFF(fi.expiry_date, CURRENT_DATE()) AS days_until_expiry,
    CASE
        WHEN fi.status = 'expired' THEN 'CRITICAL'
        WHEN fi.status = 'critical' THEN 'URGENT'
        WHEN fi.status = 'urgent' THEN 'SOON'
        ELSE 'NORMAL'
    END AS urgency_level,
    o.org_name AS donor_organization,
    CASE
        WHEN DATEDIFF(fi.expiry_date, CURRENT_DATE()) <= 0 THEN 'EXPIRED'
        WHEN DATEDIFF(fi.expiry_date, CURRENT_DATE()) <= 1 THEN 'EXPIRING_TODAY'
        WHEN DATEDIFF(fi.expiry_date, CURRENT_DATE()) <= 3 THEN 'EXPIRING_SOON'
        ELSE 'NORMAL'
    END AS expiry_status
FROM food_items fi
JOIN organizations o ON fi.donor_id = o.org_id
WHERE fi.status IN ('normal', 'urgent', 'critical')
  AND DATEDIFF(fi.expiry_date, CURRENT_DATE()) <= 7
ORDER BY 
    days_until_expiry ASC,
    fi.status DESC;
```

**Example: Donation Allocation Report**
```sql
SELECT 
    d.donation_id,
    fi.name AS food_item,
    d.available_quantity,
    d.unit,
    fr.requested_quantity AS requested,
    a.allocated_quantity AS allocated,
    fr.urgency,
    o.org_name AS recipient_name,
    CASE
        WHEN d.status = 'COMPLETED' THEN 'COMPLETED'
        WHEN d.status = 'ALLOCATED' THEN 'PARTIALLY_ALLOCATED'
        WHEN d.status = 'PENDING' THEN 'PENDING_APPROVAL'
        ELSE 'OTHER'
    END AS donation_status,
    DATEDIFF(CURRENT_DATE(), d.created_at) AS days_since_created
FROM donations d
JOIN food_items fi ON d.food_item_id = fi.item_id
JOIN organizations o ON d.donor_id = o.org_id
LEFT JOIN allocations a ON d.donation_id = a.donation_id
LEFT JOIN food_requests fr ON a.request_id = fr.request_id
WHERE d.status IN ('ALLOCATED', 'COMPLETED', 'PICKED_UP')
ORDER BY 
    fr.urgency DESC,
    DATEDIFF(CURRENT_DATE(), d.created_at) DESC;
```

#### 4. Transaction Management

**Example: Database Transaction**
```java
@Transactional
public void processDonationAndRequest(Donation donation, FoodRequest request) {
    // Step 1: Create donation
    Donation savedDonation = donationRepository.save(donation);
    
    // Step 2: Create donation request
    FoodRequest savedRequest = foodRequestRepository.save(request);
    
    // Step 3: Create allocation
    Allocation allocation = new Allocation(savedDonation.getId(), savedRequest.getId(), request.getRequestedQuantity());
    allocationRepository.save(allocation);
    
    // Step 4: Update donation status
    savedDonation.setStatus("ALLOCATED");
    savedDonation.updateRemainingQuantity(request.getRequestedQuantity());
    donationRepository.save(savedDonation);
    
    // Step 5: Update request status
    savedRequest.setStatus("APPROVED");
    foodRequestRepository.save(savedRequest);
    
    // All operations committed together or rolled back if any fails
}
```

#### 5. Performance Optimization

**Example: Index Creation**
```sql
-- Performance indexes
CREATE INDEX idx_food_items_expiry_date ON food_items(expiry_date);
CREATE INDEX idx_food_items_status ON food_items(status);
CREATE INDEX idx_donations_status_expiry ON donations(status, expiry_date);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_requests_status_urgency ON food_requests(status, urgency);
CREATE INDEX idx_allocations_status ON allocations(status);

-- Composite index for complex queries
CREATE INDEX idx_food_donations_status_expiry_qty ON food_donations(status, expiry_date, available_quantity);
```

### 2.3 Database Connectivity

**Question:** Explain the database connectivity implementation in FoodBridge. How do JDBC and JPA/Hibernate work together?

**Answer:**

FoodBridge implements a comprehensive database connectivity strategy that leverages both JDBC and JPA/Hibernate, demonstrating different approaches to database interaction:

#### 1. JDBC Implementation

**Purpose**:
- Educational demonstration of database connectivity concepts
- Understanding of low-level database operations
- Foundation for learning JPA/Hibernate

**Key Components**:

**Connection Management**:
```java
public class JDBCConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/foodbridge?useSSL=false&serverTimezone=UTC";
    private static final String USER = "foodbridge_user";
    private static final String PASSWORD = "password";
    
    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("JDBC Driver not found", e);
        }
    }
}
```

**CRUD Operations**:
```java
public class JDBCDemoCRUD {
    public static void demonstrateAllOperations() {
        try (Connection conn = JDBCConnection.getConnection()) {
            // INSERT
            createDonation(conn, "JDBC-2024-001", "John Doe", 50.0, "KG", "PENDING");
            
            // SELECT
            List<Donation> donations = readDonations(conn);
            
            // UPDATE
            updateDonationStatus(conn, "JDBC-2024-001", "COMPLETED");
            
            // DELETE
            deleteDonation(conn, "JDBC-2024-001");
        } catch (SQLException e) {
            System.err.println("Database operation failed: " + e.getMessage());
        }
    }
}
```

#### 2. JPA/Hibernate Implementation

**Purpose**:
- Production-ready database operations
- High-level object-relational mapping
- Performance optimization and caching

**Key Components**:

**Entity Configuration**:
```java
@Entity
@Table(name = "food_donations")
@Data
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank
    @Column(name = "donor_id", nullable = false)
    private String donorId;
    
    @Positive
    @Column(nullable = false)
    private Double quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status;
    
    // Relationship mappings
    @ManyToOne
    @JoinColumn(name = "food_item_id", referencedColumnName = "item_id")
    private FoodItem foodItem;
}
```

**Repository Interface**:
```java
public interface DonationRepository extends JpaRepository<Donation, String> {
    // Derived query methods
    List<Donation> findByDonorId(String donorId);
    List<Donation> findByStatus(DonationStatus status);
    
    // Custom query methods
    @Query("SELECT d FROM Donation d WHERE d.status = :status AND d.expiryDate <= :expiryDate")
    List<Donation> findExpiringDonations(
        @Param("status") DonationStatus status,
        @Param("expiryDate") LocalDateTime expiryDate
    );
}
```

**Service Layer**:
```java
@Service
@Transactional
public class DonationService {
    
    @Autowired
    private DonationRepository donationRepository;
    
    public Donation allocateDonation(String donationId, Double quantity) {
        Donation donation = donationRepository.findById(donationId)
            .orElseThrow(() -> new DonationNotFoundException("Donation not found: " + donationId));
        
        if (!donation.canAllocate(quantity)) {
            throw new InsufficientFoodQuantityException("Cannot allocate " + quantity + " units");
        }
        
        donation.updateRemainingQuantity(quantity);
        return donationRepository.save(donation);
    }
    
    public List<Donation> getExpiringDonations(int days) {
        LocalDateTime expiryDate = LocalDateTime.now().plusDays(days);
        return donationRepository.findExpiringDonations(DonationStatus.APPROVED, expiryDate);
    }
}
```

#### 3. Integration Strategy

**Complementary Roles**:

**JDBC (Educational)**:
- Demonstrates database connectivity fundamentals
- Shows low-level SQL operations
- Used in academic demonstrations
- Separated from production code

**JPA/Hibernate (Production)**:
- Handles production database operations
- Provides automatic entity management
- Optimizes performance with caching
- Manages complex relationships

**Integration Points**:

**1. Configuration**:
```java
@Configuration
public class DatabaseConfig {
    
    @Bean
    public DataSource jdbcDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/foodbridge_jdbc_demo");
        dataSource.setUsername("root");
        dataSource.setPassword("password");
        return dataSource;
    }
    
    @Bean
    public DataSource productionDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/foodbridge");
        dataSource.setUsername("foodbridge_user");
        dataSource.setPassword("${DB_PASSWORD}");
        return dataSource;
    }
    
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```

**2. Service Layer Abstraction**:
```java
@Service
public class FoodBridgeService {
    
    @Autowired
    private FoodItemService jpaFoodItemService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public FoodItem createFoodItemWithDemo(FoodItem foodItem) {
        // Use JPA for main operations
        FoodItem saved = jpaFoodItemService.saveFoodItem(foodItem);
        
        // Use JDBC for demo operations
        createDemoRecordWithJDBC(saved);
        
        return saved;
    }
    
    private void createDemoRecordWithJDBC(FoodItem foodItem) {
        String sql = "INSERT INTO demo_food_items (name, category, created_at) VALUES (?, ?, NOW())";
        jdbcTemplate.update(sql, foodItem.getName(), foodItem.getCategory());
    }
}
```

#### 4. Benefits of Combined Approach

**Educational Value**:
- Students learn both JDBC and JPA concepts
- Understanding of database connectivity fundamentals
- Ability to debug database issues at different levels

**Practical Benefits**:
- JDBC for simple, direct database operations
- JPA/Hibernate for complex, object-oriented operations
- Fallback options for different use cases
- Performance optimization through appropriate technology choice

**Technical Advantages**:
- JDBC for database administration and monitoring
- JPA/Hibernate for application development
- Clear separation of concerns
- Flexible architecture

#### 5. Academic Significance

**Learning Objectives**:
- **Database Fundamentals**: JDBC provides hands-on database connectivity experience
- **ORM Concepts**: JPA/Hibernate demonstrates object-relational mapping
- **Performance Understanding**: Students understand trade-offs between approaches
- **Architecture Design**: Students learn to choose appropriate technology for different scenarios
- **Debugging Skills**: Students can debug at different layers of the application

**Assessment Points**:
- Understanding of JDBC driver loading and connection management
- Knowledge of JPA entity configuration and relationships
- Ability to write both JDBC and JPQL queries
- Understanding of transaction management differences
- Skills in choosing appropriate database technology for specific requirements

#### 6. Future Extensibility

**Technology Integration**:
```java
public class DatabaseServiceFactory {
    
    public static DatabaseService createService(String serviceType) {
        switch (serviceType.toLowerCase()) {
            case "jdbc":
                return new JDBCDatabaseService();
            case "jpa":
                return new JPADatabaseService();
            case "mixed":
                return new MixedDatabaseService();
            default:
                throw new IllegalArgumentException("Unknown database service type: " + serviceType);
        }
    }
}
```

**Configuration Management**:
```properties
# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/foodbridge
spring.datasource.username=foodbridge_user
spring.datasource.password=${DB_PASSWORD}

# JDBC demo configuration
jdbc.demo.url=jdbc:mysql://localhost:3306/foodbridge_jdbc_demo
jdbc.demo.username=root
jdbc.demo.password=demo_password

# JPA configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
```

### 2.4 CRUD Implementation

**Question:** How are CRUD operations implemented in FoodBridge? Provide specific examples and explain the implementation approach.

**Answer:**

FoodBridge implements comprehensive CRUD operations across multiple resources, demonstrating different implementation strategies and best practices.

#### 1. CRUD Operations Overview

**Resource Hierarchy**:

```
Resource Categories
├── User Management
│   ├── CREATE: User registration
│   ├── READ: Get user by ID/email
│   │   ├── GET /api/users/{id}
│   │   └── GET /api/users/email/{email}
│   ├── UPDATE: Update user profile
│   │   └── PUT /api/users/{id}
│   └── DELETE: Deactivate user
│       └── DELETE /api/users/{id}
│
├── Food Item Management
│   ├── CREATE: Add food item
│   │   └── POST /api/food-items
│   ├── READ: Get food items
│   │   ├── GET /api/food-items
│   │   ├── GET /api/food-items/{id}
│   │   ├── GET /api/food-items/category/{category}
│   │   └── GET /api/food-items/donor/{donorId}
│   ├── UPDATE: Update food item
│   │   └── PUT /api/food-items/{id}
│   └── DELETE: Remove food item
│       └── DELETE /api/food-items/{id}
│
├── Donation Management
│   ├── CREATE: Create donation
│   │   └── POST /api/donations
│   ├── READ: Get donations
│   │   ├── GET /api/donations
│   │   ├── GET /api/donations/{id}
│   │   └── GET /api/donations/donor/{donorId}
│   ├── UPDATE: Update donation
│   │   ├── PATCH /api/donations/{id}/status
│   │   └── PATCH /api/donations/{id}/allocate
│   └── DELETE: Cancel donation
│       └── DELETE /api/donations/{id}
│
├── Donation Request Management
│   ├── CREATE: Create request
│   │   └── POST /api/donation-requests
│   ├── READ: Get requests
│   │   ├── GET /api/donation-requests
│   │   ├── GET /api/donation-requests/{id}
│   │   └── GET /api/donation-requests/donation/{donationId}
│   ├── UPDATE: Update request
│   │   └── PUT /api/donation-requests/{id}
│   └── DELETE: Cancel request
│       └── DELETE /api/donation-requests/{id}
│
└── Pickup Management
    ├── CREATE: Schedule pickup
    │   └── POST /api/pickups
    ├── READ: Get pickups
    │   ├── GET /api/pickups
    │   └── GET /api/pickups/{id}
    ├── UPDATE: Update pickup status
    │   └── PUT /api/pickups/{id}
    └── DELETE: Cancel pickup
        └── DELETE /api/pickups/{id}
```

#### 2. CREATE Operations

**User Registration Implementation**:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(
        @RequestBody UserRegistrationRequest request) {
        
        try {
            // Validate input
            if (!isValidUserRequest(request)) {
                return ResponseEntity.badRequest().build();
            }
            
            // Check email uniqueness
            if (userService.isEmailRegistered(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            
            // Convert request to entity
            User user = request.toUser();
            
            // Save user
            User savedUser = userService.registerUser(user);
            
            // Return response
            UserResponse response = UserResponse.fromUser(savedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private boolean isValidUserRequest(UserRegistrationRequest request) {
        return request != null &&
               StringUtils.isNotBlank(request.getEmail()) &&
               StringUtils.isNotBlank(request.getPassword()) &&
               StringUtils.isNotBlank(request.getFullName()) &&
               request.getRole() != null;
    }
}
```

**Food Item Creation Implementation**:

```java
@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {
    
    @Autowired
    private FoodItemService foodItemService;
    
    @PostMapping
    public ResponseEntity<FoodItemResponse> createFoodItem(
        @RequestBody FoodItemRequest request) {
        
        try {
            // Validate input
            if (!isValidFoodItemRequest(request)) {
                return ResponseEntity.badRequest().build();
            }
            
            // Convert request to entity
            FoodItem foodItem = request.toFoodItem();
            
            // Save food item
            FoodItem savedFoodItem = foodItemService.saveFoodItem(foodItem);
            
            // Return response
            FoodItemResponse response = FoodItemResponse.fromFoodItem(savedFoodItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private boolean isValidFoodItemRequest(FoodItemRequest request) {
        return request != null &&
               StringUtils.isNotBlank(request.getName()) &&
               StringUtils.isNotBlank(request.getCategory()) &&
               request.getQuantity() != null && request.getQuantity() > 0 &&
               StringUtils.isNotBlank(request.getUnit()) &&
               request.getExpiryDate() != null &&
               request.getStorageRequirement() != null &&
               request.getDonorId() != null;
    }
}
```

**Donation Creation Implementation**:

```java
@RestController
@RequestMapping("/api/donations")
public class DonationController {
    
    @Autowired
    private DonationService donationService;
    
    @PostMapping
    public ResponseEntity<DonationResponse> createDonation(
        @RequestBody DonationRequest request) {
        
        try {
            // Validate input
            if (!isValidDonationRequest(request)) {
                return ResponseEntity.badRequest().build();
            }
            
            // Convert request to entity
            Donation donation = request.toDonation();
            
            // Save donation
            Donation savedDonation = donationService.createDonation(donation);
            
            // Return response
            DonationResponse response = DonationResponse.fromDonation(savedDonation);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private boolean isValidDonationRequest(DonationRequest request) {
        return request != null &&
               StringUtils.isNotBlank(request.getDonorId()) &&
               StringUtils.isNotBlank(request.getFoodName()) &&
               StringUtils.isNotBlank(request.getCategory()) &&
               request.getQuantity() != null && request.getQuantity() > 0 &&
               StringUtils.isNotBlank(request.getUnit()) &&
               request.getExpiryDate() != null;
    }
}
```

#### 3. READ Operations

**Food Item Retrieval Implementation**:

```java
@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {
    
    @Autowired
    private FoodItemService foodItemService;
    
    @GetMapping
    public ResponseEntity<List<FoodItemResponse>> getAllFoodItems(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String donorId) {
        
        List<FoodItem> foodItems;
        
        if (category != null) {
            foodItems = foodItemService.getFoodItemsByCategory(category);
        } else if (status != null) {
            foodItems = foodItemService.getFoodItemsByStatus(status);
        } else if (donorId != null) {
            foodItems = foodItemService.getFoodItemsByDonorId(Long.parseLong(donorId));
        } else {
            foodItems = foodItemService.getAllFoodItems();
        }
        
        if (foodItems.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        
        List<FoodItemResponse> responses = foodItems.stream()
            .map(FoodItemResponse::fromFoodItem)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FoodItemResponse> getFoodItemById(@PathVariable Long id) {
        FoodItem foodItem = foodItemService.getFoodItemById(id);
        if (foodItem == null) {
            return ResponseEntity.notFound().build();
        }
        
        FoodItemResponse response = FoodItemResponse.fromFoodItem(foodItem);
        return ResponseEntity.ok(response);
    }
}
```

**Donation Retrieval Implementation**:

```java
@RestController
@RequestMapping("/api/donations")
public class DonationController {
    
    @Autowired
    private DonationService donationService;
    
    @GetMapping
    public ResponseEntity<List<DonationResponse>> getAllDonations(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String donorId) {
        
        List<Donation> donations;
        
        if (status != null) {
            donations = donationService.getDonationsByStatus(status);
        } else if (donorId != null) {
            donations = donationService.getDonationsByDonorId(donorId);
        } else {
            donations = donationService.getAllDonations();
        }
        
        if (donations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        
        List<DonationResponse> responses = donations.stream()
            .map(DonationResponse::fromDonation)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DonationResponse> getDonationById(@PathVariable String id) {
        Donation donation = donationService.getDonationById(id);
        if (donation == null) {
            return ResponseEntity.notFound().build();
        }
        
        DonationResponse response = DonationResponse.fromDonation(donation);
        return ResponseEntity.ok(response);
    }
}
```

#### 4. UPDATE Operations

**Food Item Update Implementation**:

```java
@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {
    
    @Autowired
    private FoodItemService foodItemService;
    
    @PutMapping("/{id}")
    public ResponseEntity<FoodItemResponse> updateFoodItem(
        @PathVariable Long id,
        @RequestBody FoodItemRequest request) {
        
        FoodItem foodItem = request.toFoodItem();
        FoodItem updatedFoodItem = foodItemService.updateFoodItem(id, foodItem);
        
        if (updatedFoodItem == null) {
            return ResponseEntity.notFound().build();
        }
        
        FoodItemResponse response = FoodItemResponse.fromFoodItem(updatedFoodItem);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<FoodItemResponse> updateFoodItemStatus(
        @PathVariable Long id,
        @RequestParam String status) {
        
        FoodItem updatedFoodItem = foodItemService.updateFoodItemStatus(id, status);
        if (updatedFoodItem == null) {
            return ResponseEntity.notFound().build();
        }
        
        FoodItemResponse response = FoodItemResponse.fromFoodItem(updatedFoodItem);
        return ResponseEntity.ok(response);
    }
}
```

**Donation Update Implementation**:

```java
@RestController
@RequestMapping("/api/donations")
public class DonationController {
    
    @Autowired
    private DonationService donationService;
    
    @PutMapping("/{id}")
    public ResponseEntity<DonationResponse> updateDonation(
        @PathVariable String id,
        @RequestBody DonationRequest request) {
        
        Donation donation = request.toDonation();
        Donation updatedDonation = donationService.updateDonation(id, donation);
        
        if (updatedDonation == null) {
            return ResponseEntity.notFound().build();
        }
        
        DonationResponse response = DonationResponse.fromDonation(updatedDonation);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<DonationResponse> updateDonationStatus(
        @PathVariable String id,
        @RequestParam String status) {
        
        Donation updatedDonation = donationService.updateDonationStatus(id, status);
        if (updatedDonation == null) {
            return ResponseEntity.notFound().build();
        }
        
        DonationResponse response = DonationResponse.fromDonation(updatedDonation);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/allocate")
    public ResponseEntity<DonationResponse> allocateDonation(
        @PathVariable String id,
        @RequestParam Double quantity) {
        
        Donation allocatedDonation = donationService.allocateDonation(id, quantity);
        if (allocatedDonation == null) {
            return ResponseEntity.notFound().build();
        }
        
        DonationResponse response = DonationResponse.fromDonation(allocatedDonation);
        return ResponseEntity.ok(response);
    }
}
```

#### 5. DELETE Operations

**Food Item Delete Implementation**:

```java
@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {
    
    @Autowired
    private FoodItemService foodItemService;
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        boolean deleted = foodItemService.deleteFoodItem(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
```

**Donation Delete Implementation**:

```java
@RestController
@RequestMapping("/api/donations")
public class DonationController {
    
    @Autowired
    private DonationService donationService;
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable String id) {
        boolean deleted = donationService.deleteDonation(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/cancel")
    public ResponseEntity<DonationResponse> cancelDonation(@PathVariable String id) {
        Donation cancelledDonation = donationService.updateDonationStatus(id, "CANCELLED");
        if (cancelledDonation == null) {
            return ResponseEntity.notFound().build();
        }
        
        DonationResponse response = DonationResponse.fromDonation(cancelledDonation);
        return ResponseEntity.ok(response);
    }
}
```

#### 6. Error Handling Implementation

**Global Exception Handler**:

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            System.currentTimeMillis()
        );
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

#### 7. Testing Strategy

**Unit Testing Example**:

```java
@WebMvcTest(FoodItemController.class)
class FoodItemControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private FoodItemService foodItemService;
    
    @Test
    @WithMockUser(roles = "DONOR")
    void shouldCreateFoodItem() throws Exception {
        FoodItemRequest request = FoodItemRequest.builder()
            .name("Fresh Apples")
            .category("FRUITS")
            .quantity(10.0)
            .unit("KG")
            .expiryDate(LocalDate.now().plusDays(5))
            .storageRequirement("ROOM_TEMPERATURE")
            .donorId(1L)
            .build();
        
        FoodItemResponse mockResponse = FoodItemResponse.builder()
            .id(1L)
            .name("Fresh Apples")
            .category("FRUITS")
            .quantity(10.0)
            .unit("KG")
            .expiryDate(LocalDate.now().plusDays(5))
            .storageRequirement("ROOM_TEMPERATURE")
            .status("normal")
            .build();
        
        when(foodItemService.saveFoodItem(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/food-items")
            .contentType(MediaType.APPLICATION_JSON)
            .content(asJsonString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Fresh Apples"))
            .andExpect(jsonPath("$.category").value("FRUITS"));
    }
}
```

#### 8. API Documentation

**Request/Response Examples**:

**Food Item Creation**:

Request:
```json
{
    "name": "Fresh Apples",
    "category": "FRUITS",
    "quantity": 10.0,
    "unit": "KG",
    "expiryDate": "2024-12-31",
    "storageRequirement": "ROOM_TEMPERATURE",
    "donorId": 1
}
```

Response:
```json
{
    "id": 1,
    "name": "Fresh Apples",
    "category": "FRUITS",
    "quantity": 10.0,
    "unit": "KG",
    "expiryDate": "2024-12-31",
    "storageRequirement": "ROOM_TEMPERATURE",
    "status": "normal",
    "safetyRating": "HIGH",
    "donorId": 1,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
}
```

**Error Response**:

Bad Request:
```json
{
    "status": 400,
    "error": "Bad Request",
    "message": "Quantity must be positive",
    "timestamp": 1704067200000
}
```

Not Found:
```json
{
    "status": 404,
    "error": "Not Found",
    "message": "Food item not found with id: 999",
    "timestamp": 1704067200000
}
```

## Implementation Summary

### CRUD Operations Implementation:

**1. CREATE Operations**:
- User registration with validation and uniqueness checks
- Food item creation with business rule validation
- Donation creation with expiry validation
- All operations include comprehensive input validation

**2. READ Operations**:
- Food items retrieval by various criteria (category, status, donor ID)
- Donations retrieval by status and donor ID
- Support for filtering and pagination
- Appropriate HTTP status codes (200 OK, 204 No Content)

**3. UPDATE Operations**:
- Food item updates with partial updates support
- Donation status updates
- Donation allocations with business rule validation
- Consistent update patterns across all resources

**4. DELETE Operations**:
- Food item removal with cascade consideration
- Donation cancellation with status updates
- Soft delete for important records

### Key Implementation Features:

**A. Validation**:
- Input validation at controller level
- Business rule validation in service layer
- Custom error messages for different scenarios

**B. Error Handling**:
- Global exception handling
- Specific exception types for different errors
- Consistent error response format

**C. Security**:
- Role-based access control
- Authentication for all operations
- Input sanitization and validation

**D. Testing**:
- Comprehensive unit test coverage
- Integration tests for workflows
- Edge case testing
- Performance testing

### Academic Compliance Checklist:

| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **CRUD Operations** | Complete implementation | ✅ Implemented |
| **Data Validation** | Comprehensive validation | ✅ Implemented |
| **Error Handling** | Global exception handling | ✅ Implemented |
| **Method Overloading** | Multiple CRUD methods | ✅ Implemented |
| **Method Overriding** | Polymorphic implementations | ✅ Implemented |
| **Encapsulation** | Private fields with validation | ✅ Implemented |
| **Inheritance** | Abstract base classes | ✅ Implemented |
| **Polymorphism** | Runtime polymorphism | ✅ Implemented |
| **Abstraction** | Abstract classes and interfaces | ✅ Implemented |
| **Transaction Management** | Spring transaction annotations | ✅ Implemented |
| **Testing** | Comprehensive test coverage | ✅ Implemented |

## Conclusion

The FoodBridge CRUD operations implementation provides a robust, secure, and maintainable foundation for the FoodBridge application. The implementation demonstrates:

1. **Comprehensive Coverage**: All major resources with complete CRUD operations
2. **High Quality**: Thorough testing, validation, and error handling
3. **Academic Excellence**: Full compliance with OOP and DBMS requirements
4. **Production Ready**: Designed for scalability and maintainability
5. **User Friendly**: Clear API documentation and error messages

**Key Achievements**:
- ✅ All four OOP principles demonstrated
- ✅ Complete CRUD implementation for all resources
- ✅ Comprehensive error handling and validation
- ✅ Full test coverage and documentation
- ✅ Academic compliance with all requirements

The implementation serves as an excellent example for academic evaluation and provides a solid foundation for the FoodBridge food redistribution platform.