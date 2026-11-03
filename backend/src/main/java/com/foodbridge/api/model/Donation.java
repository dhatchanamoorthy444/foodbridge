package com.foodbridge.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "donations")
@Data
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Donor ID is required")
    @Column(name = "donor_id", nullable = false)
    private String donorId;

    @NotBlank(message = "Food name is required")
    @Column(name = "food_name", nullable = false)
    private String foodName;

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
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, ALLOCATED, PICKED_UP, COMPLETED, CANCELLED

    private Double allocatedQuantity = 0.0;
    private Double remainingQuantity = 0.0;

    private LocalDateTime pickupDate;
    private String pickupAddress;
    private String pickupNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructor with 'this' keyword
    public Donation(String donorId, String foodName, String category, Double quantity,
                    String unit, LocalDateTime expiryDate) {
        this.donorId = donorId;
        this.foodName = foodName;
        this.category = category;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
        this.createdAt = LocalDateTime.now();
        this.remainingQuantity = quantity;
        this.status = "PENDING";
    }

    // Business method to calculate remaining quantity using 'this'
    public void updateRemainingQuantity(double allocated) {
        if (allocated < 0) {
            throw new IllegalArgumentException("Allocated quantity cannot be negative");
        }
        if (allocated > this.remainingQuantity) {
            throw new InsufficientFoodQuantityException("Cannot allocate more than remaining quantity: " + this.remainingQuantity);
        }
        this.allocatedQuantity += allocated;
        this.remainingQuantity -= allocated;
        if (this.remainingQuantity <= 0) {
            this.status = "COMPLETED";
        } else {
            this.status = "ALLOCATED";
        }
    }

    // Business method to approve donation using 'super' concept
    public void approveDonation() {
        if (this.status.equals("PENDING")) {
            this.status = "APPROVED";
        } else {
            throw new InvalidFoodRequestException("Can only approve pending donations");
        }
    }

    // Business method to check if donation can be allocated
    public boolean canAllocate(double quantity) {
        return this.status.equals("APPROVED") && this.remainingQuantity >= quantity && this.remainingQuantity > 0;
    }

    // Override toString method for better debugging
    @Override
    public String toString() {
        return "Donation{" +
                "id='" + id + '\'' +
                ", donorId='" + donorId + '\'' +
                ", foodName='" + foodName + '\'' +
                ", quantity=" + quantity +
                ", unit='" + unit + '\'' +
                ", status='" + status + '\'' +
                ", remainingQuantity=" + remainingQuantity +
                "}";
    }

    // Equals and hashCode methods for object comparison
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Donation donation = (Donation) obj;
        return id != null && id.equals(donation.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}