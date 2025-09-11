package com.example.cloud.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransactions {

    private String id;
    private String clerkId;
    private String paymentId;
    private String orderId;
    private String planId;
    private Integer amount;
    private String currency;
    private  Integer creditsAdded;
    private String status;
    private  String userEmail;
    private  String username;
    private LocalDateTime  transactionDate;

}
