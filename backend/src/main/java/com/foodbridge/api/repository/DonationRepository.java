package com.foodbridge.api.repository;

import com.foodbridge.api.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, String> {

    // Derived query methods
    List<Donation> findByDonorId(String donorId);
    List<Donation> findByStatus(String status);
    List<Donation> findByStatusIn(List<String> statuses);

    // Custom query methods using @Query annotation
    @Query("SELECT d FROM Donation d WHERE d.status = 'PENDING'")
    List<Donation> findPendingDonations();

    @Query("SELECT d FROM Donation d WHERE d.status = 'APPROVED'")
    List<Donation> findApprovedDonations();

    @Query("SELECT d FROM Donation d WHERE d.status = 'ALLOCATED'")
    List<Donation> findAllocatedDonations();

    @Query("SELECT d FROM Donation d WHERE d.status = 'COMPLETED'")
    List<Donation> findCompletedDonations();

    @Query("SELECT d FROM Donation d WHERE d.expiryDate <= :expiryDate")
    List<Donation> findByExpiryDateLessThanEqual(@Param("expiryDate") LocalDateTime expiryDate);

    @Query("SELECT d FROM Donation d WHERE d.expiryDate <= :expiryDate AND d.status NOT IN :excludedStatuses")
    List<Donation> findByExpiryDateLessThanEqualAndStatusNotIn(
        @Param("expiryDate") LocalDateTime expiryDate,
        @Param("excludedStatuses") List<String> excludedStatuses
    );

    // Custom query for donations with low remaining quantity
    @Query("SELECT d FROM Donation d WHERE d.remainingQuantity <= :quantityThreshold")
    List<Donation> findByRemainingQuantityLessThanEqual(
        @Param("quantityThreshold") Double quantityThreshold
    );

    // Count queries
    long countByDonorId(String donorId);
    long countByStatus(String status);

    // Check existence
    boolean existsByIdAndStatus(String id, String status);

    // Custom query for allocating donations (conceptual)
    @Query("UPDATE Donation d SET d.allocatedQuantity = d.allocatedQuantity + :quantity, d.remainingQuantity = d.remainingQuantity - :quantity, d.status = CASE WHEN d.remainingQuantity - :quantity <= 0 THEN 'COMPLETED' ELSE 'ALLOCATED' END WHERE d.id = :donationId AND d.remainingQuantity >= :quantity")
    int allocateDonation(
        @Param("donationId") String donationId,
        @Param("quantity") Double quantity
    );
}