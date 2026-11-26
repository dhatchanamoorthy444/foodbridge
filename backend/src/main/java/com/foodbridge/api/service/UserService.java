package com.foodbridge.api.service;

import com.foodbridge.api.model.User;
import com.foodbridge.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // CREATE
    public User registerUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        // Validate user using business logic
        user.validateUser();

        // Check if email already exists
        if (userRepository.existsByEmailAndIsActive(user.getEmail(), true)) {
            throw new IllegalArgumentException("Email already registered: " + user.getEmail());
        }

        // Set default values
        if (user.getId() == null) {
            // Generate verification token if needed
            user.setVerificationToken(UUID.randomUUID().toString());
            user.setTokenExpiry(LocalDateTime.now().plusHours(24));
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setIsActive(true);

        return userRepository.save(user);
    }

    // READ - All
    public List<User> getAllUsers() {
        return userRepository.findAllActiveUsers();
    }

    // READ - By ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // READ - By Email
    public User getUserByEmail(String email) {
        return userRepository.findActiveUserByEmail(email).orElse(null);
    }

    // READ - By Role
    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findActiveUsersByRole(role);
    }

    // READ - By Organization
    public List<User> getUsersByOrganization(String organization) {
        return userRepository.findUsersByOrganization(organization);
    }

    // UPDATE
    public User updateUser(Long id, User userDetails) {
        User existingUser = getUserById(id);
        if (existingUser == null) {
            return null;
        }

        // Update fields
        if (userDetails.getFullName() != null) {
            existingUser.setFullName(userDetails.getFullName());
        }
        if (userDetails.getPassword() != null) {
            existingUser.setPassword(userDetails.getPassword());
        }
        if (userDetails.getOrganization() != null) {
            existingUser.setOrganization(userDetails.getOrganization());
        }
        if (userDetails.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(userDetails.getPhoneNumber());
        }
        if (userDetails.getRole() != null) {
            existingUser.setRole(userDetails.getRole());
        }

        existingUser.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(existingUser);
    }

    // UPDATE Profile
    public User updateProfile(Long id, String fullName, String organization) {
        User existingUser = getUserById(id);
        if (existingUser == null) {
            return null;
        }

        existingUser.updateProfile(fullName, organization);
        return userRepository.save(existingUser);
    }

    // DEACTIVATE / DELETE
    public boolean deactivateUser(Long id) {
        User existingUser = getUserById(id);
        if (existingUser == null) {
            return false;
        }
        existingUser.setIsActive(false);
        existingUser.setUpdatedAt(LocalDateTime.now());
        userRepository.save(existingUser);
        return true;
    }

    // Business logic methods
    public List<User> getDonors() {
        return userRepository.findActiveDonors();
    }

    public List<User> getRecipients() {
        return userRepository.findActiveRecipients();
    }

    public List<User> getVolunteers() {
        return userRepository.findActiveVolunteers();
    }

    public List<User> getAdmins() {
        return userRepository.findActiveAdmins();
    }

    public User authenticateUser(String email, String password) {
        User user = getUserByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            return user;
        }
        return null;
    }

    // Static method using 'static'
    public static String getDefaultRole() {
        return User.UserRole.DONOR.toString();
    }

    // Helper method for statistics
    public UserStatistics getUserStatistics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActive(true);
        long donors = userRepository.countByRole(User.UserRole.DONOR);
        long recipients = userRepository.countByRole(User.UserRole.RECIPIENT);
        long volunteers = userRepository.countByRole(User.UserRole.VOLUNTEER);
        long admins = userRepository.countByRole(User.UserRole.ADMIN);

        return new UserStatistics(totalUsers, activeUsers, donors, recipients, volunteers, admins);
    }

    // Inner class for statistics
    public static class UserStatistics {
        private final long totalUsers;
        private final long activeUsers;
        private final long donors;
        private final long recipients;
        private final long volunteers;
        private final long admins;

        public UserStatistics(long totalUsers, long activeUsers, long donors, long recipients, long volunteers, long admins) {
            this.totalUsers = totalUsers;
            this.activeUsers = activeUsers;
            this.donors = donors;
            this.recipients = recipients;
            this.volunteers = volunteers;
            this.admins = admins;
        }

        // Getters
        public long getTotalUsers() { return totalUsers; }
        public long getActiveUsers() { return activeUsers; }
        public long getDonors() { return donors; }
        public long getRecipients() { return recipients; }
        public long getVolunteers() { return volunteers; }
        public long getAdmins() { return admins; }
    }
}