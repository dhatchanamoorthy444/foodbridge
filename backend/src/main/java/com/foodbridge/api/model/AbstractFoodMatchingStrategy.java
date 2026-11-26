package com.foodbridge.api.model;

import java.util.List;

// Abstract class for food matching strategy (Abstraction example)
public abstract class AbstractFoodMatchingStrategy {

    // Template method pattern
    public final boolean matchFood(FoodItem foodItem, Double requiredQuantity) {
        validateInput(foodItem, requiredQuantity);
        boolean quantityMatch = checkQuantityCompatibility(foodItem, requiredQuantity);
        boolean categoryMatch = checkCategoryCompatibility(foodItem);
        boolean expiryMatch = checkExpiryCompatibility(foodItem);

        return quantityMatch && categoryMatch && expiryMatch;
    }

    protected abstract void validateInput(FoodItem foodItem, Double requiredQuantity);
    protected abstract boolean checkQuantityCompatibility(FoodItem foodItem, Double requiredQuantity);
    protected abstract boolean checkCategoryCompatibility(FoodItem foodItem);
    protected abstract boolean checkExpiryCompatibility(FoodItem foodItem);

    // Common utility method using 'this'
    protected String generateCompatibilityReport(FoodItem foodItem, Double requiredQuantity, boolean isMatch) {
        return "Food: " + foodItem.getName() +
               "\nRequired: " + requiredQuantity + " " + foodItem.getUnit() +
               "\nAvailable: " + foodItem.getQuantity() + " " + foodItem.getUnit() +
               "\nMatch: " + (isMatch ? "YES" : "NO") +
               "\nExpiry: " + foodItem.getExpiryDate();
    }
}

// Interface for food matching (Abstraction example)
public interface FoodMatchingStrategy {
    boolean matches(FoodItem requested, FoodItem available);
    double calculatePriority(FoodItem requested, FoodItem available);
    String getStrategyName();
    default boolean isCompatible(FoodItem requested, FoodItem available) {
        return matches(requested, available) &&
               calculatePriority(requested, available) > 0.5;
    }
}

// Concrete implementation 1: Category-based strategy
class CategoryMatchingStrategy implements FoodMatchingStrategy {
    @Override
    public boolean matches(FoodItem requested, FoodItem available) {
        return requested.getCategory().equalsIgnoreCase(available.getCategory());
    }

    @Override
    public double calculatePriority(FoodItem requested, FoodItem available) {
        return requested.getCategory().equalsIgnoreCase(available.getCategory()) ? 1.0 : 0.0;
    }

    @Override
    public String getStrategyName() {
        return "CategoryBased";
    }
}

// Concrete implementation 2: Quantity-based strategy
class QuantityMatchingStrategy implements FoodMatchingStrategy {
    @Override
    public boolean matches(FoodItem requested, FoodItem available) {
        return available.getQuantity() >= requested.getQuantity();
    }

    @Override
    public double calculatePriority(FoodItem requested, FoodItem available) {
        double ratio = available.getQuantity() / requested.getQuantity();
        return Math.min(ratio, 1.0);
    }

    @Override
    public String getStrategyName() {
        return "QuantityBased";
    }
}

// Concrete implementation 3: Combined strategy
class CombinedMatchingStrategy implements FoodMatchingStrategy {
    private FoodMatchingStrategy categoryStrategy;
    private FoodMatchingStrategy quantityStrategy;

    public CombinedMatchingStrategy() {
        this.categoryStrategy = new CategoryMatchingStrategy();
        this.quantityStrategy = new QuantityMatchingStrategy();
    }

    @Override
    public boolean matches(FoodItem requested, FoodItem available) {
        boolean categoryMatch = categoryStrategy.matches(requested, available);
        boolean quantityMatch = quantityStrategy.matches(requested, available);
        return categoryMatch && quantityMatch;
    }

    @Override
    public double calculatePriority(FoodItem requested, FoodItem available) {
        double categoryScore = categoryStrategy.calculatePriority(requested, available);
        double quantityScore = quantityStrategy.calculatePriority(requested, available);
        return (categoryScore + quantityScore) / 2.0;
    }

    @Override
    public String getStrategyName() {
        return "Combined";
    }
}