package com.foodbridge.api.controller;

import com.foodbridge.api.model.FoodItem;
import com.foodbridge.api.service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    // CREATE
    @PostMapping
    public ResponseEntity<FoodItem> createFoodItem(@RequestBody FoodItem foodItem) {
        try {
            // Validate request
            if (foodItem == null) {
                return ResponseEntity.badRequest().build();
            }
            if (foodItem.getName() == null || foodItem.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (foodItem.getCategory() == null || foodItem.getCategory().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (foodItem.getQuantity() == null || foodItem.getQuantity() <= 0) {
                return ResponseEntity.badRequest().build();
            }
            if (foodItem.getExpiryDate() == null) {
                return ResponseEntity.badRequest().build();
            }

            FoodItem createdItem = foodItemService.saveFoodItem(foodItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - All
    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        try {
            List<FoodItem> items = foodItemService.getAllFoodItems();
            if (items.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By ID
    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodItemById(@PathVariable Long id) {
        try {
            FoodItem item = foodItemService.getFoodItemById(id);
            if (item == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By Donor ID
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<FoodItem>> getFoodItemsByDonorId(@PathVariable Long donorId) {
        try {
            List<FoodItem> items = foodItemService.getFoodItemsByDonorId(donorId);
            if (items.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By Category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodItem>> getFoodItemsByCategory(@PathVariable String category) {
        try {
            List<FoodItem> items = foodItemService.getFoodItemsByCategory(category);
            if (items.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By Expiry Date
    @GetMapping("/expiry/{expiryDate}")
    public ResponseEntity<List<FoodItem>> getFoodItemsByExpiryDate(@PathVariable String expiryDate) {
        try {
            List<FoodItem> items = foodItemService.getFoodItemsByExpiryDate(expiryDate);
            if (items.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ - By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FoodItem>> getFoodItemsByStatus(@PathVariable String status) {
        try {
            List<FoodItem> items = foodItemService.getFoodItemsByStatus(status);
            if (items.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> updateFoodItem(@PathVariable Long id, @RequestBody FoodItem foodItemDetails) {
        try {
            FoodItem updatedItem = foodItemService.updateFoodItem(id, foodItemDetails);
            if (updatedItem == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE Status
    @PatchMapping("/{id}/status")
    public ResponseEntity<FoodItem> updateFoodItemStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            FoodItem updatedItem = foodItemService.updateFoodItemStatus(id, status);
            if (updatedItem == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        try {
            boolean deleted = foodItemService.deleteFoodItem(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method to get urgent food items
    @GetMapping("/urgent")
    public ResponseEntity<List<FoodItem>> getUrgentFoodItems() {
        try {
            List<FoodItem> items = foodItemService.getUrgentFoodItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method to get expiring soon items
    @GetMapping("/expiring-soon")
    public ResponseEntity<List<FoodItem>> getExpiringSoonFoodItems() {
        try {
            List<FoodItem> items = foodItemService.getExpiringSoonFoodItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}