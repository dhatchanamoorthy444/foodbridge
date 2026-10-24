package com.foodbridge.api.service;

import com.foodbridge.api.model.Donation;
import com.foodbridge.api.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DonationService {
    @Autowired
    private DonationRepository donationRepository;

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Donation createDonation(Donation donation) {
        return donationRepository.save(donation);
    }
}
