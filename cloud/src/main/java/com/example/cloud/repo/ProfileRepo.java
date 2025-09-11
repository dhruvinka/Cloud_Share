package com.example.cloud.repo;

import com.example.cloud.Entity.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfileRepo extends MongoRepository<Profile, String> {

    Optional<Profile> findByEmail(String email);

    Profile findByClerkId(String clerkId);

    boolean existsByClerkId(String clerkId); // ✅ fixed
}
