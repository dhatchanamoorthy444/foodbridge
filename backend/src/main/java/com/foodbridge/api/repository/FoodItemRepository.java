package com.foodbridge.api.repository;

import com.foodbridge.api.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    // Derived query methods
    List<FoodItem> findByDonorId(Long donorId);
    List<FoodItem> findByCategory(String category);
    List<FoodItem> findByExpiryDate(LocalDate expiryDate);
    List<FoodItem> findByStatus(String status);
    List<FoodItem> findByStatusIn(List<String> statuses);

    // Custom query methods using @Query annotation
    @Query("SELECT fi FROM FoodItem fi WHERE fi.status = 'urgent' OR fi.status = 'critical'")
    List<FoodItem> findUrgentItems();

    @Query("SELECT fi FROM FoodItem fi WHERE fi.status = 'critical'")
    List<FoodItem> findCriticalItems();

    @Query("SELECT fi FROM FoodItem fi WHERE fi.status = 'expired'")
    List<FoodItem> findExpiredItems();

    @Query("SELECT fi FROM FoodItem fi WHERE fi.expiryDate <= :date AND fi.status != 'expired'")
    List<FoodItem> findByExpiryDateBeforeAndStatusNotExpired(@Param("date") LocalDate date);

    @Query("SELECT fi FROM FoodItem fi WHERE fi.donorId = :donorId AND fi.status = :status")
    List<FoodItem> findByDonorIdAndStatus(
        @Param("donorId") Long donorId,
        @Param("status") String status
    );

    // Custom query for items expiring within certain days
    @Query("SELECT fi FROM FoodItem fi WHERE fi.expiryDate <= :expiryDate AND fi.status IN ('urgent', 'critical', 'normal')")
    List<FoodItem> findByExpiryDateAndStatusAfter(
        @Param("expiryDate") LocalDate expiryDate,
        @Param("status") String status
    );

    // Count queries
    long countByStatus(String status);
    long countByDonorId(Long donorId);

    // Check existence
    boolean existsByIdAndDonorId(Long id, Long donorId);

    // Custom query for safety rating
    @Query("SELECT fi FROM FoodItem fi WHERE fi.safetyRating = :safetyRating")
    List<FoodItem> findBySafetyRating(@Param("safetyRating") String safetyRating);

    // Custom query for urgent items with donor info
    @Query("SELECT fi FROM FoodItem fi WHERE fi.status IN ('urgent', 'critical') ORDER BY fi.expiryDate ASC")
    List<FoodItem> findUrgentItemsSortedByExpiry();

    // Custom query for items expiring this week
    @Query("SELECT fi FROM FoodItem fi WHERE fi.expiryDate BETWEEN :startDate AND :endDate AND fi.status != 'expired'")
    List<FoodItem> findByExpiryDateBetween(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    // Custom query for high safety rating items
    @Query("SELECT fi FROM FoodItem fi WHERE fi.safetyRating = 'HIGH' AND fi.status = 'normal'")
    List<FoodItem> findHighSafetyRatingItems();
}