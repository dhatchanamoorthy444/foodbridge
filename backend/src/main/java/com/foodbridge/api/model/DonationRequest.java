package com.foodbridge.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_requests")
@Data
public class DonationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Donation ID is required")
    @Column(name = "donation_id", nullable = false)
    private String donationId;

    @NotBlank(message = "Recipient ID is required")
    @Column(name = "recipient_id", nullable = false)
    private String recipientId;

    @NotNull(message = "Requested quantity is required")
    @Positive(message = "Requested quantity must be positive")
    @Column(name = "requested_quantity", nullable = false)
    private Double requestedQuantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency", nullable = false)
    private UrgencyLevel urgency = UrgencyLevel.MEDIUM;

    private String description;
    private LocalDate preferredPickupDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructor with 'this' keyword
    public DonationRequest(String donationId, String recipientId, Double requestedQuantity) {
        this.donationId = donationId;
        this.recipientId = recipientId;
        this.requestedQuantity = requestedQuantity;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
        this.urgency = UrgencyLevel.MEDIUM;
    }

    // Business method using 'this'
    public void approveRequest() {
        if (this.status == RequestStatus.PENDING) {
            this.status = RequestStatus.APPROVED;
            this.updatedAt = LocalDateTime.now();
        } else {
            throw new InvalidFoodRequestException("Can only approve pending requests");
        }
    }

    // Business method using 'this'
    public void rejectRequest(String reason) {
        if (this.status == RequestStatus.PENDING) {
            this.status = RequestStatus.REJECTED;
            this.updatedAt = LocalDateTime.now();
        } else {
            throw new InvalidFoodRequestException("Can only reject pending requests");
        }
    }

    // Business method using 'this'
    public void cancelRequest() {
        if (this.status != RequestStatus.COMPLETED) {
            this.status = RequestStatus.CANCELLED;
            this.updatedAt = LocalDateTime.now();
        } else {
            throw new InvalidFoodRequestException("Cannot cancel completed requests");
        }
    }

    // Business method using 'this'
    public void completeRequest() {
        if (this.status == RequestStatus.APPROVED) {
            this.status = RequestStatus.COMPLETED;
            this.updatedAt = LocalDateTime.now();
        } else {
            throw new InvalidFoodRequestException("Can only complete approved requests");
        }
    }

    // Override toString method for debugging
    @Override
    public String toString() {
        return "DonationRequest{" +
                "id=" + id +
                ", donationId='" + donationId + '\'' +
                ", recipientId='" + recipientId + '\'' +
                ", requestedQuantity=" + requestedQuantity +
                ", status=" + status +
                ", urgency=" + urgency +
                "}";
    }

    // Equals and hashCode methods
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        DonationRequest that = (DonationRequest) obj;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}

// Enum for request status
enum RequestStatus {
    PENDING("Request is pending approval"),
    APPROVED("Request has been approved"),
    REJECTED("Request has been rejected"),
    CANCELLED("Request has been cancelled"),
    COMPLETED("Request has been completed");

    private final String description;

    RequestStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

// Enum for urgency level
enum UrgencyLevel {
    LOW("Low urgency"),
    MEDIUM("Medium urgency"),
    HIGH("High urgency"),
    URGENT("Urgent - requires immediate attention");

    private final String description;

    UrgencyLevel(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}