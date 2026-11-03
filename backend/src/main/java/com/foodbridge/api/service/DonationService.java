package com.foodbridge.api.service;

import com.foodbridge.api.model.Donation;
import com.foodbridge.api.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    // CREATE
    public Donation createDonation(Donation donation) {
        if (donation == null) {
            throw new IllegalArgumentException("Donation cannot be null");
        }

        // Validate business rules
        if (donation.getQuantity() == null || donation.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        if (donation.getExpiryDate() == null) {
            throw new IllegalArgumentException("Expiry date is required");
        }

        if (donation.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ExpiredFoodException("Cannot create donation with past expiry date");
        }

        // Set default values if not provided
        if (donation.getStatus() == null || donation.getStatus().isEmpty()) {
            donation.setStatus("PENDING");
        }

        if (donation.getAllocatedQuantity() == null) {
            donation.setAllocatedQuantity(0.0);
        }

        if (donation.getRemainingQuantity() == null) {
            donation.setRemainingQuantity(donation.getQuantity());
        }

        donation.setCreatedAt(LocalDateTime.now());

        return donationRepository.save(donation);
    }

    // READ - All
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    // READ - By ID
    public Donation getDonationById(String id) {
        return donationRepository.findById(id).orElse(null);
    }

    // READ - By Donor ID
    public List<Donation> getDonationsByDonorId(String donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    // READ - By Status
    public List<Donation> getDonationsByStatus(String status) {
        return donationRepository.findByStatus(status);
    }

    // UPDATE
    public Donation updateDonation(String id, Donation donationDetails) {
        Donation existingDonation = getDonationById(id);
        if (existingDonation == null) {
            return null;
        }

        // Update fields
        if (donationDetails.getFoodName() != null) {
            existingDonation.setFoodName(donationDetails.getFoodName());
        }
        if (donationDetails.getCategory() != null) {
            existingDonation.setCategory(donationDetails.getCategory());
        }
        if (donationDetails.getQuantity() != null) {
            existingDonation.setQuantity(donationDetails.getQuantity());
            // Recalculate remaining quantity
            existingDonation.setRemainingQuantity(existingDonation.getQuantity() - existingDonation.getAllocatedQuantity());
        }
        if (donationDetails.getUnit() != null) {
            existingDonation.setUnit(donationDetails.getUnit());
        }
        if (donationDetails.getExpiryDate() != null) {
            existingDonation.setExpiryDate(donationDetails.getExpiryDate());
        }
        if (donationDetails.getStatus() != null) {
            existingDonation.setStatus(donationDetails.getStatus());
        }
        if (donationDetails.getPickupAddress() != null) {
            existingDonation.setPickupAddress(donationDetails.getPickupAddress());
        }
        if (donationDetails.getPickupNotes() != null) {
            existingDonation.setPickupNotes(donationDetails.getPickupNotes());
        }

        return donationRepository.save(existingDonation);
    }

    // UPDATE Status
    public Donation updateDonationStatus(String id, String status) {
        Donation existingDonation = getDonationById(id);
        if (existingDonation == null) {
            return null;
        }

        // Validate status
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        existingDonation.setStatus(status);
        return donationRepository.save(existingDonation);
    }

    // Allocate Donation (Business Logic)
    public Donation allocateDonation(String id, Double quantity) {
        Donation existingDonation = getDonationById(id);
        if (existingDonation == null) {
            return null;
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

        existingDonation.updateRemainingQuantity(quantity);
        return donationRepository.save(existingDonation);
    }

    // DELETE
    public boolean deleteDonation(String id) {
        Donation existingDonation = getDonationById(id);
        if (existingDonation == null) {
            return false;
        }
        donationRepository.delete(existingDonation);
        return true;
    }

    // Business logic methods
    public List<Donation> getPendingDonations() {
        return donationRepository.findByStatus("PENDING");
    }

    public List<Donation> getApprovedDonations() {
        return donationRepository.findByStatus("APPROVED");
    }

    public List<Donation> getAllocatedDonations() {
        return donationRepository.findByStatus("ALLOCATED");
    }

    public List<Donation> getCompletedDonations() {
        return donationRepository.findByStatus("COMPLETED");
    }

    public List<Donation> getDonationsExpiringSoon() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime soon = now.plusDays(7); // Next 7 days
        return donationRepository.findByExpiryDateLessThanEqualAndStatusNotIn(soon, List.of("COMPLETED", "CANCELLED"));
    }

    // Static method using 'static'
    public static String getDefaultStatus() {
        return "PENDING";
    }

    // Helper method for status validation
    private boolean isValidStatus(String status) {
        String[] validStatuses = {"PENDING", "APPROVED", "ALLOCATED", "PICKED_UP", "COMPLETED", "CANCELLED"};
        for (String validStatus : validStatuses) {
            if (validStatus.equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }
}