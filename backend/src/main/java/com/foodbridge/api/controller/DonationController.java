package com.foodbridge.api.controller;

import com.foodbridge.api.model.Donation;
import com.foodbridge.api.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    // CREATE
    @PostMapping
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        try {
            // Validate request
            if (donation == null) {
                return ResponseEntity.badRequest().build();
            }
            if (donation.getDonorId() == null || donation.getDonorId().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (donation.getFoodName() == null || donation.getFoodName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (donation.getQuantity() == null || donation.getQuantity() <= 0) {
                return ResponseEntity.badRequest().build();
            }
            if (donation.getExpiryDate() == null) {
                return ResponseEntity.badRequest().build();
            }

            Donation createdDonation = donationService.createDonation(donation);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDonation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - All
    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {
        try {
            List<Donation> donations = donationService.getAllDonations();
            if (donations.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By ID
    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable String id) {
        try {
            Donation donation = donationService.getDonationById(id);
            if (donation == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(donation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By Donor ID
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<Donation>> getDonationsByDonorId(@PathVariable String donorId) {
        try {
            List<Donation> donations = donationService.getDonationsByDonorId(donorId);
            if (donations.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Donation>> getDonationsByStatus(@PathVariable String status) {
        try {
            List<Donation> donations = donationService.getDonationsByStatus(status);
            if (donations.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Donation> updateDonation(@PathVariable String id, @RequestBody Donation donationDetails) {
        try {
            Donation updatedDonation = donationService.updateDonation(id, donationDetails);
            if (updatedDonation == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedDonation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE Status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Donation> updateDonationStatus(@PathVariable String id, @RequestParam String status) {
        try {
            Donation updatedDonation = donationService.updateDonationStatus(id, status);
            if (updatedDonation == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedDonation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE Allocation
    @PatchMapping("/{id}/allocate")
    public ResponseEntity<Donation> allocateDonation(@PathVariable String id, @RequestParam Double quantity) {
        try {
            Donation allocatedDonation = donationService.allocateDonation(id, quantity);
            if (allocatedDonation == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(allocatedDonation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE / CANCEL
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable String id) {
        try {
            boolean deleted = donationService.deleteDonation(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method for cancelling donation
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Donation> cancelDonation(@PathVariable String id) {
        return updateDonationStatus(id, "CANCELLED");
    }

    // Helper method for approving donation
    @PostMapping("/{id}/approve")
    public ResponseEntity<Donation> approveDonation(@PathVariable String id) {
        return updateDonationStatus(id, "APPROVED");
    }

    // Helper method for completing donation
    @PostMapping("/{id}/complete")
    public ResponseEntity<Donation> completeDonation(@PathVariable String id) {
        return updateDonationStatus(id, "COMPLETED");
    }
}