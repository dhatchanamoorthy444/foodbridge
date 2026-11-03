# Java OOP Concepts Implementation

## Overview
This document describes the Object-Oriented Programming (OOP) concepts implemented in the FoodBridge project to satisfy academic requirements for OOP courses.

## 1. Encapsulation

### Implementation Details
The FoodBridge project demonstrates encapsulation through:

#### Entity Classes with Private Fields
All entity classes use private fields with proper getter and setter methods to control access:

```java
// User.java - Example of encapsulation
package com.foodbridge.api.model;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String fullName;
    private String role;
    private String organization;
    private LocalDateTime createdAt;
    
    // Custom getter with validation
    public String getEmail() {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalStateException("Email cannot be null or empty");
        }
        return email;
    }
    
    // Custom setter with validation
    public void setEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        this.email = email.trim().toLowerCase();
    }
    
    // Business rule validation
    public void validateUser() {
        if (this.email == null || this.password == null) {
            throw new IllegalStateException("Email and password are required");
        }
        if (this.role == null || this.role.trim().isEmpty()) {
            throw new IllegalStateException("User role is required");
        }
    }
}
```

#### Donation.java - Business Rule Encapsulation
```java
@Entity
@Table(name = "donations")
@Data
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String donorId;
    private Double quantity;
    private LocalDateTime expiryDate;
    private String status;
    
    // Business rule validation
    public void validateDonation() {
        if (this.quantity <= 0) {
            throw new IllegalArgumentException("Donation quantity must be positive");
        }
        if (this.expiryDate == null) {
            throw new IllegalArgumentException("Expiry date cannot be null");
        }
        if (this.expiryDate.isBefore(LocalDateTime.now())) {
            throw new ExpiredFoodException("Donation has expired");
        }
    }
    
    // Business rule for status transitions
    public void updateStatus(String newStatus) {
        if (!isValidStatusTransition(this.status, newStatus)) {
            throw new InvalidFoodRequestException(
                "Cannot transition from " + this.status + " to " + newStatus);
        }
        this.status = newStatus;
    }
    
    private boolean isValidStatusTransition(String current, String target) {
        return switch (current) {
            case "PENDING" -> target.equals("APPROVED") || target.equals("CANCELLED");
            case "APPROVED" -> target.equals("ALLOCATED") || target.equals("CANCELLED");
            case "ALLOCATED" -> target.equals("PICKED_UP") || target.equals("CANCELLED");
            default -> false;
        };
    }
}
```

### Key Encapsulation Features
- **Private Fields**: All entity attributes are private
- **Validation**: Custom validation logic in setters
- **Business Rules**: Encapsulated donation lifecycle and status management
- **Exception Handling**: Custom exceptions for business rule violations

## 2. Inheritance

### Class Hierarchy Implementation

```java
// Abstract base class
public abstract class User {
    private Long id;
    private String email;
    private String password;
    private String fullName;
    private String role;
    private String organization;
    private LocalDateTime createdAt;
    
    public User() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Common user functionality
    public void register() {
        validateUser();
        // Common registration logic
    }
    
    public abstract void displayUserInfo();
    
    public void login() {
        // Common login logic
    }
    
    public abstract boolean canDonate();
    
    // Common validation
    public void validateUser() {
        if (email == null || password == null) {
            throw new InvalidFoodRequestException("Email and password required");
        }
    }
}

// Donor subclass
@Entity
public class Donor extends User {
    private String donorType; // RESTAURANT, SUPERMARKET, etc.
    private String address;
    private String contactPerson;
    
    @Override
    public void displayUserInfo() {
        System.out.println("Donor: " + getFullName() + " (" + donorType + ")");
    }
    
    @Override
    public boolean canDonate() {
        return true;
    }
    
    public void submitDonation(FoodItem foodItem) {
        // Donor-specific donation logic
    }
}

// Recipient subclass
@Entity
public class Recipient extends User {
    private String organizationName;
    private String ngoRegistrationNumber;
    private String address;
    
    @Override
    public void displayUserInfo() {
        System.out.println("Recipient: " + getOrganizationName() + " (NGO)");
    }
    
    @Override
    public boolean canDonate() {
        return false;
    }
    
    public void requestFood(FoodItem foodItem) {
        // Recipient-specific request logic
    }
}

// Volunteer subclass
@Entity
public class Volunteer extends User {
    private String skills;
    private String availability;
    
    @Override
    public void displayUserInfo() {
        System.out.println("Volunteer: " + getFullName() + " (" + skills + ")");
    }
    
    @Override
    public boolean canDonate() {
        return false;
    }
    
    public void schedulePickup(Pickup pickup) {
        // Volunteer-specific pickup logic
    }
}

// Admin subclass
@Entity
public class Admin extends User {
    private String department;
    private boolean isSuperAdmin;
    
    @Override
    public void displayUserInfo() {
        System.out.println("Admin: " + getFullName() + " (" + department + ")");
    }
    
    @Override
    public boolean canDonate() {
        return false;
    }
    
    public void manageUsers(User user) {
        // Admin-specific management logic
    }
}
```

### Inheritance Benefits Demonstrated
- **Code Reusability**: Common user functionality in base class
- **Polymorphism**: Role-specific behavior through method overriding
- **Extensibility**: Easy to add new user types
- **Maintainability**: Changes to common logic in one place

## 3. Polymorphism

### Method Overriding
```java
public interface NotificationService {
    void sendNotification(User recipient, String message);
    String getNotificationType();
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
}
```

### Method Overloading
```java
public class DonationService {
    // Overloaded methods for different donation scenarios
    public Donation createDonation(Donor donor, FoodItem foodItem) {
        return createDonation(donor.getId(), foodItem, null);
    }
    
    public Donation createDonation(Donor donor, FoodItem foodItem, String notes) {
        Donation donation = new Donation();
        donation.setDonorId(donor.getId());
        donation.setFoodItem(foodItem);
        donation.setNotes(notes);
        donation.setStatus("PENDING");
        return donation;
    }
    
    public Donation createDonation(String donorId, FoodItem foodItem, Double quantity) {
        Donation donation = new Donation();
        donation.setDonorId(donorId);
        donation.setFoodItem(foodItem);
        donation.setQuantity(quantity != null ? quantity : foodItem.getQuantity());
        donation.setStatus("PENDING");
        return donation;
    }
}
```

### Runtime Polymorphism
```java
public class UserService {
    public void processUser(User user) {
        user.displayUserInfo(); // Runtime polymorphism
        
        if (user instanceof Donor) {
            ((Donor) user).submitDonation(new FoodItem("Rice", "GRAINS", 10.0, "KG", ...));
        } else if (user instanceof Recipient) {
            ((Recipient) user).requestFood(new FoodItem("Wheat", "GRAINS", 5.0, "KG", ...));
        } else if (user instanceof Volunteer) {
            ((Volunteer) user).schedulePickup(new Pickup(...));
        } else if (user instanceof Admin) {
            ((Admin) user).manageUsers(user);
        }
    }
}
```

### Role-Specific Operations
```java
public class NotificationFactory {
    public static NotificationService getNotificationService(User user) {
        if (user instanceof Donor) {
            return new DonorNotificationService();
        } else if (user instanceof Recipient) {
            return new RecipientNotificationService();
        } else if (user instanceof Volunteer) {
            return new VolunteerNotificationService();
        } else {
            return new AdminNotificationService();
        }
    }
}

public class DonorNotificationService implements NotificationService {
    @Override
    public void sendNotification(User recipient, String message) {
        System.out.println("Donor notification: " + message);
        // Send email and in-app notification
        new EmailNotificationService().sendNotification(recipient, message);
    }
    
    @Override
    public String getNotificationType() {
        return "DONOR_SPECIFIC";
    }
}
```

## 4. Abstraction

### Abstract Classes
```java
public abstract class AbstractFoodItem {
    protected Long id;
    protected String name;
    protected String category;
    protected Double quantity;
    protected String unit;
    protected LocalDate expiryDate;
    
    public AbstractFoodItem(String name, String category, Double quantity, String unit, LocalDate expiryDate) {
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
    }
    
    public abstract double calculateShelfLife();
    
    public abstract boolean isSafeForConsumption();
    
    public void displayInfo() {
        System.out.println("Food Item: " + name + " (" + category + ")");
        System.out.println("Quantity: " + quantity + " " + unit);
        System.out.println("Expires: " + expiryDate);
        System.out.println("Shelf Life: " + calculateShelfLife() + " days");
        System.out.println("Safe for consumption: " + isSafeForConsumption());
    }
    
    public abstract String getStorageRequirements();
}

public class PerishableFoodItem extends AbstractFoodItem {
    private String storageCondition;
    
    public PerishableFoodItem(String name, String category, Double quantity, String unit, LocalDate expiryDate, String storageCondition) {
        super(name, category, quantity, unit, expiryDate);
        this.storageCondition = storageCondition;
    }
    
    @Override
    public double calculateShelfLife() {
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
    }
    
    @Override
    public boolean isSafeForConsumption() {
        return !expiryDate.isBefore(LocalDate.now()) && calculateShelfLife() > 0;
    }
    
    @Override
    public String getStorageRequirements() {
        return "Store in " + storageCondition + " at " + getTemperatureRange();
    }
    
    private String getTemperatureRange() {
        return switch (storageCondition) {
            case "REFRIGERATED" -> "2-4°C";
            case "FROZEN" -> "-18°C or below";
            case "ROOM_TEMP" -> "15-25°C";
            default -> "Follow manufacturer guidelines";
        };
    }
}
```

### Interfaces
```java
public interface FoodMatchingStrategy {
    boolean matches(FoodItem requested, FoodItem available);
    double calculatePriority(FoodItem requested, FoodItem available);
}

public class QuantityBasedStrategy implements FoodMatchingStrategy {
    @Override
    public boolean matches(FoodItem requested, FoodItem available) {
        return requested.getCategory().equals(available.getCategory()) &&
               available.getQuantity() >= requested.getQuantity();
    }
    
    @Override
    public double calculatePriority(FoodItem requested, FoodItem available) {
        double quantityMatch = available.getQuantity() / requested.getQuantity();
        return Math.min(quantityMatch, 1.0);
    }
}

public interface FoodManagementSystem {
    FoodItem createFoodItem(String name, String category, double quantity, String unit, LocalDate expiryDate, String storageRequirement);
    FoodItem updateFoodItem(Long id, Map<String, Object> updates);
    boolean deleteFoodItem(Long id);
    FoodItem getFoodItemById(Long id);
    List<FoodItem> getAllFoodItems();
}

public class DefaultFoodManagementSystem implements FoodManagementSystem {
    @Autowired
    private FoodItemRepository foodItemRepository;
    
    @Override
    public FoodItem createFoodItem(String name, String category, double quantity, String unit, LocalDate expiryDate, String storageRequirement) {
        FoodItem foodItem = new FoodItem();
        foodItem.setName(name);
        foodItem.setCategory(category);
        foodItem.setQuantity(quantity);
        foodItem.setUnit(unit);
        foodItem.setExpiryDate(expiryDate);
        foodItem.setStorageRequirement(storageRequirement);
        return foodItemRepository.save(foodItem);
    }
    
    // Other interface methods implementation...
}
```

## 5. Additional Java Concepts

### Static Methods and Variables
```java
public class SystemConstants {
    public static final String ROLE_DONOR = "DONOR";
    public static final String ROLE_RECIPIENT = "RECIPIENT";
    public static final String ROLE_VOLUNTEER = "VOLUNTEER";
    public static final String ROLE_ADMIN = "ADMIN";
    
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_APPROVED = "APPROVED";
    public static final String STATUS_ALLOCATED = "ALLOCATED";
    public static final String STATUS_PICKED_UP = "PICKED_UP";
    public static final String STATUS_COMPLETED = "COMPLETED";
    public static final String STATUS_CANCELLED = "CANCELLED";
    
    public static double calculateExpiryThresholdDays() {
        return 7.0; // 7 days threshold for expiry alerts
    }
}
```

### Exception Handling
```java
public class CustomExceptions {
    
    // Custom exception for donation-related issues
    public static class DonationNotFoundException extends Exception {
        public DonationNotFoundException(String message) {
            super(message);
        }
    }
    
    // Custom exception for expired food
    public static class ExpiredFoodException extends RuntimeException {
        public ExpiredFoodException(String message) {
            super(message);
        }
    }
    
    // Custom exception for insufficient food quantity
    public static class InsufficientFoodQuantityException extends Exception {
        public InsufficientFoodQuantityException(String message) {
            super(message);
        }
    }
    
    // Custom exception for unauthorized operations
    public static class UnauthorizedOperationException extends RuntimeException {
        public UnauthorizedOperationException(String message) {
            super(message);
        }
    }
    
    // Custom exception for invalid food requests
    public static class InvalidFoodRequestException extends Exception {
        public InvalidFoodRequestException(String message) {
            super(message);
        }
    }
}

// Exception handling in service classes
public class DonationService {
    public Donation allocateFood(String donationId, String requestId, double quantity) 
            throws DonationNotFoundException, InsufficientFoodQuantityException, UnauthorizedOperationException {
        
        Donation donation = donationRepository.findById(donationId)
            .orElseThrow(() -> new DonationNotFoundException("Donation not found: " + donationId));
        
        if (donation.getRemainingQuantity() < quantity) {
            throw new InsufficientFoodQuantityException(
                "Insufficient food quantity. Available: " + donation.getRemainingQuantity());
        }
        
        if (!canAllocateToRequest(donation, requestId)) {
            throw new UnauthorizedOperationException("Cannot allocate this donation to the request");
        }
        
        donation.setAllocatedQuantity(donation.getAllocatedQuantity() + quantity);
        donation.setRemainingQuantity(donation.getRemainingQuantity() - quantity);
        
        if (donation.getRemainingQuantity() <= 0) {
            donation.setStatus("COMPLETED");
        }
        
        return donationRepository.save(donation);
    }
}
```

### Java Collections Framework
```java
public class CollectionExample {
    public void demonstrateCollections() {
        // ArrayList usage
        List<FoodItem> foodItems = new ArrayList<>();
        foodItems.add(new FoodItem("Rice", "GRAINS", 50.0, "KG", LocalDate.now().plusDays(30), "DRY"));
        foodItems.add(new FoodItem("Vegetables", "VEGETABLES", 20.0, "KG", LocalDate.now().plusDays(5), "REFRIGERATED"));
        
        // HashMap usage
        Map<String, User> userMap = new HashMap<>();
        userMap.put("donor1", new Donor("John", "RESTAURANT", "123 Main St"));
        userMap.put("donor2", new Donor("Jane", "SUPERMARKET", "456 Oak Ave"));
        
        // Stream API usage
        List<FoodItem> expiringSoon = foodItems.stream()
            .filter(food -> food.getExpiryDate().isBefore(LocalDate.now().plusDays(7)))
            .sorted(Comparator.comparing(FoodItem::getExpiryDate))
            .collect(Collectors.toList());
        
        // Set usage
        Set<String> categories = new HashSet<>();
        categories.add("GRAINS");
        categories.add("VEGETABLES");
        categories.add("PROTEIN");
        
        // Queue usage
        Queue<DonationRequest> pendingRequests = new PriorityQueue<>(
            Comparator.comparing(DonationRequest::getPriority)
        );
    }
}
```

## 6. Constructor Examples

```java
public class FoodItem {
    // Default constructor
    public FoodItem() {}
    
    // Parameterized constructor
    public FoodItem(String name, String category, double quantity, String unit, LocalDate expiryDate, String storageRequirement) {
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
        this.storageRequirement = storageRequirement;
        this.status = "normal";
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with this keyword
    public FoodItem createEmergencyDonation(String name, String category, double quantity) {
        return new FoodItem(name, category, quantity, "KG", LocalDate.now().plusDays(1), "EMERGENCY_STORAGE");
    }
    
    // Copy constructor
    public FoodItem(FoodItem original) {
        this.id = original.id;
        this.name = original.name;
        this.category = original.category;
        this.quantity = original.quantity;
        this.unit = original.unit;
        this.expiryDate = original.expiryDate;
        this.storageRequirement = original.storageRequirement;
        this.status = original.status;
        this.donorId = original.donorId;
    }
}
```

## 7. Final Keyword Usage

```java
public class Constants {
    public static final double MIN_DONATION_QUANTITY = 0.5; // Cannot be changed
    public static final String DEFAULT_CURRENCY = "USD"; // Cannot be modified
    
    public final void displayFoodItemInfo() {
        // This method cannot be overridden
        System.out.println("Food item information");
    }
}

public class FoodCategory {
    public final String getDisplayName() {
        return this.categoryName;
    }
    
    // Cannot assign null to final reference
    public FoodCategory(String categoryName) {
        this.categoryName = categoryName; // Must be initialized in constructor
    }
}
```

## Conclusion

The FoodBridge project demonstrates comprehensive implementation of all four OOP principles:

1. **Encapsulation**: Private fields with validation and business rule enforcement
2. **Inheritance**: Clear class hierarchy with base User class and specialized subclasses
3. **Polymorphism**: Runtime polymorphism through method overriding and interface implementations
4. **Abstraction**: Abstract classes and interfaces for core business logic

Additional Java concepts like exception handling, collections, constructors, and static members are also implemented to meet academic requirements. The code is structured to be educational, maintainable, and production-ready.