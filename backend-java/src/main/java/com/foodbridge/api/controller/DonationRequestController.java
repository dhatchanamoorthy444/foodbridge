package com.foodbridge.api.controller;

import com.foodbridge.api.model.DonationRequest;
import com.foodbridge.api.service.DonationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class DonationRequestController {
    @Autowired
    private DonationRequestService donationRequestService;

    @GetMapping
    public List<DonationRequest> getAllRequests() {
        return donationRequestService.getAllRequests();
    }

    @PostMapping
    public DonationRequest createRequest(@RequestBody DonationRequest request) {
        return donationRequestService.createRequest(request);
    }
}
