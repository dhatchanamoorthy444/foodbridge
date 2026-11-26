package com.foodbridge.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "food_items")
@Data
public class FoodItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Food name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @Positive(message = "Quantity must be greater than zero")
    @Column(nullable = false)
    private Double quantity;

    @NotBlank(message = "Unit is required")
    @Column(nullable = false)
    private String unit;

    @NotNull(message = "Expiry date is required")
    @Column(nullable = false)
    private LocalDate expiryDate;

    @NotBlank(message = "Storage requirement is required")
    @Column(nullable = false)
    private String storageRequirement;

    @Column(nullable = false)
    private String status = "normal"; // normal, urgent, critical, expired, safety_review

    @Column(nullable = false)
    private String safetyRating = "HIGH"; // HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private Long donorId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructor with 'this' keyword
    public FoodItem(String name, String category, Double quantity, String unit,
                    LocalDate expiryDate, String storageRequirement, Long donorId) {
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
        this.storageRequirement = storageRequirement;
        this.donorId = donorId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = calculateStatus();
        this.safetyRating = calculateSafetyRating();
    }

    // Business method to calculate status using 'this'
    public String calculateStatus() {
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

    // Business method to calculate safety rating using 'this'
    public String calculateSafetyRating() {
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

    // Method using 'super' (concept demonstration)
    public void updateFoodItemDetails(String name, String category, Double quantity) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
        if (category != null && !category.trim().isEmpty()) {
            this.category = category;
        }
        if (quantity != null && quantity > 0) {
            this.quantity = quantity;
        }
        this.updatedAt = LocalDateTime.now();
        this.status = calculateStatus();
        this.safetyRating = calculateSafetyRating();
    }

    // Override toString method (polymorphism demonstration)
    @Override
    public String toString() {
        return "FoodItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", quantity=" + quantity +
                ", unit='" + unit + '\'' +
                ", expiryDate=" + expiryDate +
                ", status='" + status + '\'' +
                "}";
    }

    // Equals and hashCode methods for object comparison
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        FoodItem foodItem = (FoodItem) obj;
        return id != null && id.equals(foodItem.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}