package com.example.cloud.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileDto {
    private  String id;
    private  String clerkId;
    private  String email;
    private  String firstName;
    private  String lastName;
    private  Integer credits;
    private  String photoUrl;
    private Instant createdAt;

}