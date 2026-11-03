package com.foodbridge.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String fullName;
    private String role; // DONOR, RECIPIENT, NGO, ADMIN
    private String organization;
    private LocalDateTime createdAt;
}
