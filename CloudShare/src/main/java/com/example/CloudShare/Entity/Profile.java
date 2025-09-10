package com.example.CloudShare.Entity;

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
@Document(collation = "profiles")
public class Profile {
    private  String id;
    private  String clerkId;
    private  String email;
    private  String FirstName;
    private  String LastName;
    private  Integer credits;
    private  String photoUrl;

    @Create
    private Instant createdAt

}
