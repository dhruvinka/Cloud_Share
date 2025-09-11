package com.example.cloud.Controller;

import com.example.cloud.Entity.PaymentTransactions;
import com.example.cloud.Entity.Profile;
import com.example.cloud.Service.ProfileService;
import com.example.cloud.repo.PaymentTransactionsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transaction")
public class TransactionController {


    private  final ProfileService profileService;
    private final PaymentTransactionsRepo paymentTransactionsRepo;


    @GetMapping
    public ResponseEntity<?> getUserTransaction()
    {
        Profile currentProfile=profileService.getCurrentProfile();
        String clerkId=currentProfile.getClerkId();

        List<PaymentTransactions> transactions=paymentTransactionsRepo.findByClerkIdAndStatusOrderByTransactionDateDesc(clerkId,"SUCCESS");
        return  ResponseEntity.ok(transactions);
    }
}
