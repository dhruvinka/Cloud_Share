package com.example.cloud.repo;

import com.example.cloud.Entity.PaymentTransactions;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentTransactionsRepo extends MongoRepository<PaymentTransactions, String> {

    // Get all by clerkId
    List<PaymentTransactions> findByClerkId(String clerkId);

    // Get all by clerkId, sorted by latest date
    List<PaymentTransactions> findByClerkIdOrderByTransactionDateDesc(String clerkId);

    // Get all by clerkId + status, sorted by latest date
    List<PaymentTransactions> findByClerkIdAndStatusOrderByTransactionDateDesc(String clerkId, String status);

    Optional<PaymentTransactions> findByOrderId(String orderId);


}
