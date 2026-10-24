package com.foodbridge.api.repository;

import com.foodbridge.api.model.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
}
