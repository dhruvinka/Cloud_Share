package com.example.cloud.Controller;

import com.example.cloud.Dto.UserCreditsDto;
import com.example.cloud.Entity.UserCredits;
import com.example.cloud.Service.UserCreditService;
import lombok.AllArgsConstructor;
import lombok.Generated;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserCreditController {

    private  final UserCreditService userCreditService;


    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits()
    {
        UserCredits userCredits =userCreditService.getUserCredits();
        UserCreditsDto res= UserCreditsDto.builder()
                .credits(userCredits.getCredits())
                .plan(userCredits.getPlan())
                .build();

        return  ResponseEntity.ok(res);

    }
}
