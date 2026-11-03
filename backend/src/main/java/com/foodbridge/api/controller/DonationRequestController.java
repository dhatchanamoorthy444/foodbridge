package com.foodbridge.api.controller;

import com.foodbridge.api.model.DonationRequest;
import com.foodbridge.api.service.DonationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/donation-requests")
public class DonationRequestController {

    @Autowired
    private DonationRequestService donationRequestService;

    // CREATE
    @PostMapping
    public ResponseEntity<DonationRequest> createDonationRequest(@RequestBody DonationRequest donationRequest) {
        try {
            // Validate request
            if (donationRequest == null) {
                return ResponseEntity.badRequest().build();
            }
            if (donationRequest.getDonationId() == null || donationRequest.getDonationId().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (donationRequest.getRecipientId() == null || donationRequest.getRecipientId().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (donationRequest.getRequestedQuantity() == null || donationRequest.getRequestedQuantity() <= 0) {
                return ResponseEntity.badRequest().build();
            }

            DonationRequest createdRequest = donationRequestService.createDonationRequest(donationRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - All
    @GetMapping
    public ResponseEntity<List<DonationRequest>> getAllDonationRequests() {
        try {
            List<DonationRequest> requests = donationRequestService.getAllDonationRequests();
            if (requests.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By ID
    @GetMapping("/{id}")
    public ResponseEntity<DonationRequest> getDonationRequestById(@PathVariable String id) {
        try {
            DonationRequest request = donationRequestService.getDonationRequestById(id);
            if (request == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By Donation ID
    @GetMapping("/donation/{donationId}")
    public ResponseEntity<List<DonationRequest>> getDonationRequestsByDonationId(@PathVariable String donationId) {
        try {
            List<DonationRequest> requests = donationRequestService.getDonationRequestsByDonationId(donationId);
            if (requests.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By Recipient ID
    @GetMapping("/recipient/{recipientId}")
    public ResponseEntity<List<DonationRequest>> getDonationRequestsByRecipientId(@PathVariable String recipientId) {
        try {
            List<DonationRequest> requests = donationRequestService.getDonationRequestsByRecipientId(recipientId);
            if (requests.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DonationRequest> updateDonationRequest(@PathVariable String id, @RequestBody DonationRequest donationRequestDetails) {
        try {
            DonationRequest updatedRequest = donationRequestService.updateDonationRequest(id, donationRequestDetails);
            if (updatedRequest == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE Status
    @PatchMapping("/{id}/status")
    public ResponseEntity<DonationRequest> updateDonationRequestStatus(@PathVariable String id, @RequestParam String status) {
        try {
            DonationRequest updatedRequest = donationRequestService.updateDonationRequestStatus(id, status);
            if (updatedRequest == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE / CANCEL
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonationRequest(@PathVariable String id) {
        try {
            boolean deleted = donationRequestService.deleteDonationRequest(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method for frontend to cancel request
    @PostMapping("/{id}/cancel")
    public ResponseEntity<DonationRequest> cancelDonationRequest(@PathVariable String id) {
        return updateDonationRequestStatus(id, "CANCELLED");
    }

    // Helper method for frontend to approve request
    @PostMapping("/{id}/approve")
    public ResponseEntity<DonationRequest> approveDonationRequest(@PathVariable String id) {
        return updateDonationRequestStatus(id, "APPROVED");
    }

    // Helper method for frontend to reject request
    @PostMapping("/{id}/reject")
    public ResponseEntity<DonationRequest> rejectDonationRequest(@PathVariable String id) {
        return updateDonationRequestStatus(id, "REJECTED");
    }
}