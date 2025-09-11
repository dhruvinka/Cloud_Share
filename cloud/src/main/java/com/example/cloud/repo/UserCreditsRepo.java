package com.example.cloud.repo;

import com.example.cloud.Entity.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserCreditsRepo extends MongoRepository<UserCredits,String> {

    Optional<UserCredits> findByClerkId(String clerkId);

}
