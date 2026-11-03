package com.foodbridge.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role; // DONOR, RECIPIENT, VOLUNTEER, ADMIN

    private String organization;
    private String phoneNumber;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private boolean isActive = true;
    private String verificationToken;
    private LocalDateTime tokenExpiry;

    // Constructor using 'this' keyword
    public User(String email, String password, String fullName, UserRole role) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Pre-persist and pre-update hooks using 'this'
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Abstract methods for polymorphism
    public abstract void displayUserInfo();
    public abstract boolean canDonate();
    public abstract void performRoleSpecificActions();

    // Common method for inheritance using 'super'
    public void updateProfile(String fullName, String organization) {
        if (fullName != null && !fullName.trim().isEmpty()) {
            this.fullName = fullName;
        }
        if (organization != null) {
            this.organization = organization;
        }
        this.updatedAt = LocalDateTime.now();
    }

    // Method overloading using 'this'
    public void updateProfile(String fullName) {
        this.fullName = fullName;
        this.updatedAt = LocalDateTime.now();
    }

    // Validation method
    public void validateUser() {
        if (email == null || email.trim().isEmpty()) {
            throw new InvalidFoodRequestException("Email cannot be null or empty");
        }
        if (!email.contains("@")) {
            throw new InvalidFoodRequestException("Invalid email format");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new InvalidFoodRequestException("Password cannot be null or empty");
        }
        if (role == null) {
            throw new InvalidFoodRequestException("Role cannot be null");
        }
    }

    // Static method using 'User'
    public static String getDefaultRole() {
        return UserRole.DONOR.toString();
    }

    // Final method using 'final'
    public final boolean isAdmin() {
        return this.role == UserRole.ADMIN;
    }
}

// Enum for user roles (using 'enum' concept)
enum UserRole {
    DONOR("Can donate food"),
    RECIPIENT("Can receive food"),
    VOLUNTEER("Can help with pickups"),
    ADMIN("Has full system access");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}