package com.foodbridge.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_requests")
@Data
public class DonationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "donation_id", nullable = false)
    private String donationId;

    @Column(name = "recipient_id", nullable = false)
    private String recipientId;

    @Column(name = "requested_quantity", nullable = false)
    private Double requestedQuantity;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
