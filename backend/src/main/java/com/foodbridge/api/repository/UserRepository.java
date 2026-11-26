package com.foodbridge.api.repository;

import com.foodbridge.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Derived query methods
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.UserRole role);
    List<User> findByIsActive(boolean isActive);

    // Custom query methods using @Query annotation
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = true")
    List<User> findActiveUsersByRole(@Param("role") User.UserRole role);

    @Query("SELECT u FROM User u WHERE u.organization = :organization")
    List<User> findUsersByOrganization(@Param("organization") String organization);

    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.createdAt DESC")
    List<User> findAllActiveUsers();

    // Custom query for user statistics
    @Query("SELECT u.role as role, COUNT(u) as userCount FROM User u WHERE u.isActive = true GROUP BY u.role")
    List<Object[]> getUserStatisticsByRole();

    // Check existence
    boolean existsByEmailAndIsActive(String email, boolean isActive);

    // Count queries
    long countByRole(User.UserRole role);
    long countByIsActive(boolean isActive);

    // Custom query for finding donors
    @Query("SELECT u FROM User u WHERE u.role = User.UserRole.DONOR AND u.isActive = true")
    List<User> findActiveDonors();

    // Custom query for finding recipients
    @Query("SELECT u FROM User u WHERE u.role = User.UserRole.RECIPIENT AND u.isActive = true")
    List<User> findActiveRecipients();

    // Custom query for finding volunteers
    @Query("SELECT u FROM User u WHERE u.role = User.UserRole.VOLUNTEER AND u.isActive = true")
    List<User> findActiveVolunteers();

    // Custom query for finding admins
    @Query("SELECT u FROM User u WHERE u.role = User.UserRole.ADMIN AND u.isActive = true")
    List<User> findActiveAdmins();
}