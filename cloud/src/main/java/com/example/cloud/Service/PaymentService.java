package com.example.cloud.Service;

import com.example.cloud.Dto.PaymentDto;
import com.example.cloud.Dto.PaymentVerificationDto;
import com.example.cloud.Entity.PaymentTransactions;
import com.example.cloud.Entity.Profile;
import com.example.cloud.repo.PaymentTransactionsRepo;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileService profileService;
    private final UserCreditService userCreditService;
    private final PaymentTransactionsRepo paymentTransactionsRepo;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    /**
     * Create Razorpay Order and save transaction with PENDING status
     */
    public PaymentDto createOrder(PaymentDto paymentDto) {
        try {
            Profile currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", paymentDto.getAmount() * 100); // in paise
            orderRequest.put("currency", paymentDto.getCurrency());
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");

            // Save transaction as PENDING
            PaymentTransactions transactions = PaymentTransactions.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDto.getPlanId())
                    .amount(paymentDto.getAmount())
                    .currency(paymentDto.getCurrency())
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currentProfile.getEmail())
                    .username(currentProfile.getFirstName() + " " + currentProfile.getLastName())
                    .build();

            paymentTransactionsRepo.save(transactions);

            return PaymentDto.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("Order created successfully")
                    .build();

        } catch (Exception e) {
            return PaymentDto.builder()
                    .success(false)
                    .message("Error creating order: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Verify Razorpay payment signature, update transaction status, and add credits
     */
    public PaymentDto verifyPayment(PaymentVerificationDto request) {
        try {
            Profile currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            String data = request.getRazorpay_order_id() + "|" + request.getRazorpay_payment_id();
            String generatedSignature = generateHmacSha256Signature(data, razorpayKeySecret);

            Optional<PaymentTransactions> optionalTransaction =
                    paymentTransactionsRepo.findByOrderId(request.getRazorpay_order_id());

            if (optionalTransaction.isEmpty()) {
                return PaymentDto.builder()
                        .success(false)
                        .message("Transaction not found")
                        .build();
            }

            PaymentTransactions transaction = optionalTransaction.get();

            if (generatedSignature.equals(request.getRazorpay_signature())) {
                int creditsToAdd = 0;
                String plan = "BASIC";

                switch (transaction.getPlanId().toLowerCase()) {
                    case "basic":
                        creditsToAdd = 100; // or whatever you want
                        plan = "BASIC";
                        break;
                    case "premium":
                        creditsToAdd = 500;
                        plan = "PREMIUM";
                        break;
                    case "ultimate":
                        creditsToAdd = 5000;
                        plan = "ULTIMATE";
                        break;
                }


                if (creditsToAdd > 0) {
                    userCreditService.addCredits(clerkId, creditsToAdd, plan);
                    updateTransactionStatus(transaction, "SUCCESS", request.getRazorpay_payment_id(), creditsToAdd);

                    return PaymentDto.builder()
                            .success(true)
                            .message("Payment verified successfully")
                            .credits(userCreditService.getUserCredits(clerkId).getCredits())
                            .build();
                } else {
                    updateTransactionStatus(transaction, "FAILED", request.getRazorpay_payment_id(), 0);
                    return PaymentDto.builder()
                            .success(false)
                            .message("Invalid plan selected")
                            .build();
                }

            } else {
                updateTransactionStatus(transaction, "FAILED", request.getRazorpay_payment_id(), 0);
                return PaymentDto.builder()
                        .success(false)
                        .message("Payment verification failed: Invalid signature")
                        .build();
            }

        } catch (Exception e) {
            return PaymentDto.builder()
                    .success(false)
                    .message("Error verifying payment: " + e.getMessage())
                    .build();
        }
    }

    private void updateTransactionStatus(PaymentTransactions transaction, String status, String razorpayPaymentId, Integer credits) {
        transaction.setStatus(status);
        transaction.setPaymentId(razorpayPaymentId);
        if (credits != null) {
            transaction.setCreditsAdded(credits);
        }
        paymentTransactionsRepo.save(transaction);
    }

    /**
     * Generate HMAC SHA256 signature for Razorpay validation
     */
    private String generateHmacSha256Signature(String data, String secret) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes());

        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
