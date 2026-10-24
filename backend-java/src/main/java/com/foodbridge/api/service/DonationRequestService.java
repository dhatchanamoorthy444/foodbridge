package com.foodbridge.api.service;

import com.foodbridge.api.model.DonationRequest;
import com.foodbridge.api.repository.DonationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationRequestService {
    @Autowired
    private DonationRequestRepository donationRequestRepository;

    public List<DonationRequest> getAllRequests() {
        return donationRequestRepository.findAll();
    }

    public DonationRequest createRequest(DonationRequest request) {
        return donationRequestRepository.save(request);
    }
}
