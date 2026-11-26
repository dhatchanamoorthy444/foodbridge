package com.foodbridge.api.service;

import com.foodbridge.api.model.DonationRequest;
import com.foodbridge.api.repository.DonationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DonationRequestService {

    @Autowired
    private DonationRequestRepository donationRequestRepository;

    // CREATE
    public DonationRequest createDonationRequest(DonationRequest donationRequest) {
        if (donationRequest == null) {
            throw new IllegalArgumentException("Donation request cannot be null");
        }

        // Generate UUID if not provided
        if (donationRequest.getId() == null || donationRequest.getId().isEmpty()) {
            donationRequest.setId(UUID.randomUUID().toString());
        }

        // Set default status if not provided
        if (donationRequest.getStatus() == null || donationRequest.getStatus().isEmpty()) {
            donationRequest.setStatus("PENDING");
        }

        // Set creation timestamp
        donationRequest.setCreatedAt(LocalDateTime.now());

        return donationRequestRepository.save(donationRequest);
    }

    // READ - All
    public List<DonationRequest> getAllDonationRequests() {
        return donationRequestRepository.findAll();
    }

    // READ - By ID
    public DonationRequest getDonationRequestById(String id) {
        return donationRequestRepository.findById(id).orElse(null);
    }

    // READ - By Donation ID
    public List<DonationRequest> getDonationRequestsByDonationId(String donationId) {
        return donationRequestRepository.findByDonationId(donationId);
    }

    // READ - By Recipient ID
    public List<DonationRequest> getDonationRequestsByRecipientId(String recipientId) {
        return donationRequestRepository.findByRecipientId(recipientId);
    }

    // UPDATE
    public DonationRequest updateDonationRequest(String id, DonationRequest donationRequestDetails) {
        DonationRequest existingRequest = getDonationRequestById(id);
        if (existingRequest == null) {
            return null;
        }

        // Update fields
        if (donationRequestDetails.getDonationId() != null) {
            existingRequest.setDonationId(donationRequestDetails.getDonationId());
        }
        if (donationRequestDetails.getRecipientId() != null) {
            existingRequest.setRecipientId(donationRequestDetails.getRecipientId());
        }
        if (donationRequestDetails.getRequestedQuantity() != null) {
            existingRequest.setRequestedQuantity(donationRequestDetails.getRequestedQuantity());
        }
        if (donationRequestDetails.getStatus() != null) {
            existingRequest.setStatus(donationRequestDetails.getStatus());
        }

        return donationRequestRepository.save(existingRequest);
    }

    // UPDATE Status
    public DonationRequest updateDonationRequestStatus(String id, String status) {
        DonationRequest existingRequest = getDonationRequestById(id);
        if (existingRequest == null) {
            return null;
        }

        // Validate status
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        existingRequest.setStatus(status);
        return donationRequestRepository.save(existingRequest);
    }

    // DELETE / CANCEL
    public boolean deleteDonationRequest(String id) {
        DonationRequest existingRequest = getDonationRequestById(id);
        if (existingRequest == null) {
            return false;
        }
        donationRequestRepository.delete(existingRequest);
        return true;
    }

    // Custom query methods (to be implemented in repository)
    public List<DonationRequest> findPendingRequests() {
        return donationRequestRepository.findByStatus("PENDING");
    }

    public List<DonationRequest> findApprovedRequests() {
        return donationRequestRepository.findByStatus("APPROVED");
    }

    // Business logic methods
    public boolean canRequestFood(String donationId, double requestedQuantity) {
        // Implement business logic to check if food is available for request
        return true; // Placeholder for implementation
    }

    // Helper method for status validation
    private boolean isValidStatus(String status) {
        String[] validStatuses = {"PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"};
        for (String validStatus : validStatuses) {
            if (validStatus.equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }
}