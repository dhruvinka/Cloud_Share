package com.example.cloud.Controller;

import com.example.cloud.Dto.PaymentDto;
import com.example.cloud.Dto.PaymentVerificationDto;
import com.example.cloud.Service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {


    private  final PaymentService paymentService;


    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentDto paymentDto)
    {
        //call a service method to create the order
        PaymentDto response=paymentService.createOrder(paymentDto);
        if (response.getSuccess()) {
            return  ResponseEntity.ok(response);
        }
        else
        {
            return ResponseEntity.badRequest().body(response);
        }
    }


    @PostMapping("/verify")
    public  ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationDto paymentVerificationDto)
    {
        PaymentDto response=paymentService.verifyPayment(paymentVerificationDto);
        if (response.getSuccess()) {
            return  ResponseEntity.ok(response);
        }
        else
        {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
