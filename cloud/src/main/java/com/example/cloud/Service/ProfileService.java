package com.example.cloud.Service;

import com.example.cloud.Dto.ProfileDto;
import com.example.cloud.Entity.Profile;
import com.example.cloud.repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepo profileRepo;

    // ---------------- CREATE ----------------
    public ProfileDto createProfile(ProfileDto profileDto) {
        Profile finalProfile = Profile.builder()
                .clerkId(profileDto.getClerkId())
                .email(profileDto.getEmail())
                .firstName(profileDto.getFirstName())
                .lastName(profileDto.getLastName())
                .photoUrl(profileDto.getPhotoUrl())
                .credits(5) // default credits
                .createdAt(Instant.now())
                .build();

        try {
            finalProfile = profileRepo.save(finalProfile);
        } catch (Exception ex) {
            throw new RuntimeException("Email already exists or ClerkId conflict", ex);
        }

        return mapToDto(finalProfile);
    }

    // ---------------- UPDATE ----------------
    public ProfileDto updateProfile(ProfileDto profileDto) {
        Profile existingProfile = profileRepo.findByClerkId(profileDto.getClerkId());

        if (existingProfile != null) {
            if (profileDto.getEmail() != null && !profileDto.getEmail().isEmpty()) {
                existingProfile.setEmail(profileDto.getEmail());
            }
            if (profileDto.getFirstName() != null && !profileDto.getFirstName().isEmpty()) {
                existingProfile.setFirstName(profileDto.getFirstName());
            }
            if (profileDto.getLastName() != null && !profileDto.getLastName().isEmpty()) {
                existingProfile.setLastName(profileDto.getLastName());
            }
            if (profileDto.getPhotoUrl() != null && !profileDto.getPhotoUrl().isEmpty()) {
                existingProfile.setPhotoUrl(profileDto.getPhotoUrl());
            }

            existingProfile = profileRepo.save(existingProfile);
            return mapToDto(existingProfile);
        }

        throw new RuntimeException("Profile not found with clerkId: " + profileDto.getClerkId());
    }

    // ---------------- EXISTS ----------------
    public boolean existsByClerkId(String clerkId) {
        return profileRepo.existsByClerkId(clerkId);
    }

    // ---------------- DELETE ----------------
    public void deleteProfileByClerkId(String clerkId) {
        Profile existingProfile = profileRepo.findByClerkId(clerkId);
        if (existingProfile != null) {
            profileRepo.delete(existingProfile);
        } else {
            throw new RuntimeException("Profile not found with clerkId: " + clerkId);
        }
    }

    // ---------------- GET CURRENT USER ----------------
    public Profile getCurrentProfile() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new UsernameNotFoundException("User is not authenticated");
        }

        String clerkId = SecurityContextHolder.getContext().getAuthentication().getName();
        return profileRepo.findByClerkId(clerkId);
    }

    // ---------------- HELPER ----------------
    private ProfileDto mapToDto(Profile profile) {
        return ProfileDto.builder()
                .id(profile.getId())
                .clerkId(profile.getClerkId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .photoUrl(profile.getPhotoUrl())
                .credits(profile.getCredits())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
