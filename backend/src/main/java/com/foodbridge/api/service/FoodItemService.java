package com.foodbridge.api.service;

import com.foodbridge.api.model.FoodItem;
import com.foodbridge.api.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    // CREATE
    public FoodItem saveFoodItem(FoodItem foodItem) {
        if (foodItem == null) {
            throw new IllegalArgumentException("Food item cannot be null");
        }

        // Validate business rules
        if (foodItem.getQuantity() == null || foodItem.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        if (foodItem.getExpiryDate() == null) {
            throw new IllegalArgumentException("Expiry date is required");
        }

        if (foodItem.getExpiryDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Expiry date cannot be in the past");
        }

        // Set default values if not provided
        if (foodItem.getStatus() == null || foodItem.getStatus().isEmpty()) {
            foodItem.setStatus("normal");
        }

        if (foodItem.getSafetyRating() == null || foodItem.getSafetyRating().isEmpty()) {
            foodItem.setSafetyRating(foodItem.calculateSafetyRating());
        }

        // Update timestamps
        if (foodItem.getCreatedAt() == null) {
            foodItem.setCreatedAt(LocalDateTime.now());
        }
        foodItem.setUpdatedAt(LocalDateTime.now());

        return foodItemRepository.save(foodItem);
    }

    // READ - All
    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    // READ - By ID
    public FoodItem getFoodItemById(Long id) {
        return foodItemRepository.findById(id).orElse(null);
    }

    // READ - By Donor ID
    public List<FoodItem> getFoodItemsByDonorId(Long donorId) {
        return foodItemRepository.findByDonorId(donorId);
    }

    // READ - By Category
    public List<FoodItem> getFoodItemsByCategory(String category) {
        return foodItemRepository.findByCategory(category);
    }

    // READ - By Expiry Date
    public List<FoodItem> getFoodItemsByExpiryDate(String expiryDate) {
        LocalDate date = LocalDate.parse(expiryDate);
        return foodItemRepository.findByExpiryDate(date);
    }

    // READ - By Status
    public List<FoodItem> getFoodItemsByStatus(String status) {
        return foodItemRepository.findByStatus(status);
    }

    // UPDATE
    public FoodItem updateFoodItem(Long id, FoodItem foodItemDetails) {
        FoodItem existingItem = getFoodItemById(id);
        if (existingItem == null) {
            return null;
        }

        // Update fields
        if (foodItemDetails.getName() != null) {
            existingItem.setName(foodItemDetails.getName());
        }
        if (foodItemDetails.getCategory() != null) {
            existingItem.setCategory(foodItemDetails.getCategory());
        }
        if (foodItemDetails.getQuantity() != null) {
            existingItem.setQuantity(foodItemDetails.getQuantity());
        }
        if (foodItemDetails.getUnit() != null) {
            existingItem.setUnit(foodItemDetails.getUnit());
        }
        if (foodItemDetails.getExpiryDate() != null) {
            existingItem.setExpiryDate(foodItemDetails.getExpiryDate());
        }
        if (foodItemDetails.getStorageRequirement() != null) {
            existingItem.setStorageRequirement(foodItemDetails.getStorageRequirement());
        }
        if (foodItemDetails.getStatus() != null) {
            existingItem.setStatus(foodItemDetails.getStatus());
        }

        // Recalculate status and safety rating
        existingItem.setStatus(existingItem.calculateStatus());
        existingItem.setSafetyRating(existingItem.calculateSafetyRating());
        existingItem.setUpdatedAt(LocalDateTime.now());

        return foodItemRepository.save(existingItem);
    }

    // UPDATE Status
    public FoodItem updateFoodItemStatus(Long id, String status) {
        FoodItem existingItem = getFoodItemById(id);
        if (existingItem == null) {
            return null;
        }

        // Validate status
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        existingItem.setStatus(status);
        existingItem.setUpdatedAt(LocalDateTime.now());
        return foodItemRepository.save(existingItem);
    }

    // DELETE
    public boolean deleteFoodItem(Long id) {
        FoodItem existingItem = getFoodItemById(id);
        if (existingItem == null) {
            return false;
        }
        foodItemRepository.delete(existingItem);
        return true;
    }

    // Business logic methods
    public List<FoodItem> getUrgentFoodItems() {
        return foodItemRepository.findUrgentItems();
    }

    public List<FoodItem> getExpiringSoonFoodItems() {
        return foodItemRepository.findCriticalItems();
    }

    public List<FoodItem> getExpiredFoodItems() {
        return foodItemRepository.findExpiredItems();
    }

    public List<FoodItem> getFoodItemsExpiringWithinDays(int days) {
        LocalDate today = LocalDate.now();
        LocalDate expiryDate = today.plusDays(days);
        return foodItemRepository.findByExpiryDateAndStatusAfter(expiryDate, "normal");
    }

    public List<FoodItem> getHighSafetyRatingItems() {
        return foodItemRepository.findHighSafetyRatingItems();
    }

    public List<FoodItem> getFoodItemsExpiringThisWeek() {
        LocalDate today = LocalDate.now();
        LocalDate endOfWeek = today.plusDays(7);
        return foodItemRepository.findByExpiryDateBetween(today, endOfWeek);
    }

    public List<FoodItem> getUrgentItemsSortedByExpiry() {
        return foodItemRepository.findUrgentItemsSortedByExpiry();
    }

    // Static method using 'static'
    public static String getDefaultStatus() {
        return "normal";
    }

    // Helper method for status validation
    private boolean isValidStatus(String status) {
        String[] validStatuses = {"normal", "urgent", "critical", "expired", "safety_review"};
        for (String validStatus : validStatuses) {
            if (validStatus.equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }
}