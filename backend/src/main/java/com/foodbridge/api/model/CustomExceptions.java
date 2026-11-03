package com.foodbridge.api.model;

// Custom exceptions for FoodBridge application
// Demonstrating custom exception handling in Java

@SuppressWarnings("serial")
public class DonationNotFoundException extends RuntimeException {
    public DonationNotFoundException(String message) {
        super(message);
    }

    public DonationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

@SuppressWarnings("serial")
public class ExpiredFoodException extends RuntimeException {
    public ExpiredFoodException(String message) {
        super(message);
    }

    public ExpiredFoodException(String message, Throwable cause) {
        super(message, cause);
    }
}

@SuppressWarnings("serial")
public class InsufficientFoodQuantityException extends RuntimeException {
    public InsufficientFoodQuantityException(String message) {
        super(message);
    }

    public InsufficientFoodQuantityException(String message, Throwable cause) {
        super(message, cause);
    }
}

@SuppressWarnings("serial")
public class UnauthorizedOperationException extends RuntimeException {
    public UnauthorizedOperationException(String message) {
        super(message);
    }

    public UnauthorizedOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}

@SuppressWarnings("serial")
public class InvalidFoodRequestException extends RuntimeException {
    public InvalidFoodRequestException(String message) {
        super(message);
    }

    public InvalidFoodRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}

@SuppressWarnings("serial")
public class FoodNotFoundException extends RuntimeException {
    public FoodNotFoundException(String message) {
        super(message);
    }

    public FoodNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

@SuppressWarnings("serial")
public class OrganizationNotFoundException extends RuntimeException {
    public OrganizationNotFoundException(String message) {
        super(message);
    }

    public OrganizationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Exception handler utility class (demonstrating static methods)
public class ExceptionHandler {

    // Static method to handle donation-related exceptions
    public static String handleDonationException(Exception e) {
        if (e instanceof DonationNotFoundException) {
            return "Donation not found: " + e.getMessage();
        } else if (e instanceof ExpiredFoodException) {
            return "Expired food: " + e.getMessage();
        } else if (e instanceof InsufficientFoodQuantityException) {
            return "Insufficient quantity: " + e.getMessage();
        } else if (e instanceof UnauthorizedOperationException) {
            return "Unauthorized operation: " + e.getMessage();
        } else if (e instanceof InvalidFoodRequestException) {
            return "Invalid food request: " + e.getMessage();
        } else {
            return "An error occurred: " + e.getMessage();
        }
    }

    // Static method to validate and throw exceptions
    public static void validateDonationRequest(String donationId, Double quantity) {
        if (donationId == null || donationId.trim().isEmpty()) {
            throw new InvalidFoodRequestException("Donation ID cannot be null or empty");
        }
        if (quantity == null || quantity <= 0) {
            throw new InvalidFoodRequestException("Quantity must be positive");
        }
    }

    // Method to demonstrate exception chaining
    public static void processDonationWithExceptionHandling(String donationId, Double quantity) {
        try {
            // Simulate some operation that might fail
            if (quantity > 100) {
                throw new InsufficientFoodQuantityException("Quantity exceeds limit");
            }
            // If this succeeds, process normally
            System.out.println("Donation processed successfully: " + donationId);
        } catch (InsufficientFoodQuantityException e) {
            // Handle with custom exception
            throw new InsufficientFoodQuantityException(
                "Failed to process donation: " + donationId + ". " + e.getMessage(),
                e
            );
        } catch (Exception e) {
            // Handle general exceptions
            throw new RuntimeException("Unexpected error processing donation", e);
        }
    }
}