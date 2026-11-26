package com.foodbridge.api.repository;

import com.foodbridge.api.model.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DonationRequestRepository extends JpaRepository<DonationRequest, String> {

    // Custom query methods using @Query annotations
    @Query("SELECT dr FROM DonationRequest dr WHERE dr.donationId = :donationId")
    List<DonationRequest> findByDonationId(@Param("donationId") String donationId);

    @Query("SELECT dr FROM DonationRequest dr WHERE dr.recipientId = :recipientId")
    List<DonationRequest> findByRecipientId(@Param("recipientId") String recipientId);

    @Query("SELECT dr FROM DonationRequest dr WHERE dr.status = :status")
    List<DonationRequest> findByStatus(@Param("status") String status);

    @Query("SELECT dr FROM DonationRequest dr WHERE dr.donationId = :donationId AND dr.status = :status")
    List<DonationRequest> findByDonationIdAndStatus(
        @Param("donationId") String donationId,
        @Param("status") String status
    );

    // Derived query methods
    List<DonationRequest> findByDonationIdAndStatusIn(String donationId, List<String> statuses);
    List<DonationRequest> findByRecipientIdAndStatus(String recipientId, String status);

    // Count queries
    long countByDonationId(String donationId);
    long countByRecipientId(String recipientId);

    // Check existence
    boolean existsByDonationIdAndStatus(String donationId, String status);
}