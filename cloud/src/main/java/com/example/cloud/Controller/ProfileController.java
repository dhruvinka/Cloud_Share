package com.example.cloud.Controller;

import com.example.cloud.Dto.ProfileDto;
import com.example.cloud.Service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {


    private  final ProfileService profileService;


    @PostMapping("/register")
    public ResponseEntity<?>registerProfile(@RequestBody ProfileDto profileDto)
    {
        ProfileDto savedprofile=profileService.createProfile(profileDto);
        return  ResponseEntity.status(HttpStatus.CREATED).body(savedprofile);
    }

    @PutMapping("/update")
    public ResponseEntity<?>updateProfile(@RequestBody ProfileDto profileDto)
    {
        ProfileDto savedprofile=profileService.updateProfile(profileDto);
        return  ResponseEntity.status(HttpStatus.CREATED).body(savedprofile);
    }
}
