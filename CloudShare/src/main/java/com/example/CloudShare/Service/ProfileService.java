package com.example.CloudShare.Service;

import com.example.CloudShare.Dto.ProfileDto;
import com.example.CloudShare.Entity.Profile;
import com.example.CloudShare.Repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private  final ProfileRepo profileRepo;

    public ProfileDto createProfile(ProfileDto profileDto)
    {



      Profile finalProfile=  Profile.builder()
                .clerkId(profileDto.getClerkId())
                .email(profileDto.getEmail())
              .firstName(profileDto.getFirstName())
              .lastName(profileDto.getLastName())
                .photoUrl(profileDto.getPhotoUrl())
                .credits(5)
                .createdAt(Instant.now())
                .build();
     try
     {
         finalProfile= profileRepo.save(finalProfile);
     }
     catch (Exception ex)
     {
         throw  new RuntimeException("Email already exist");
     }

    return ProfileDto.builder()
             .id(String.valueOf(finalProfile.getId()))
             .clerkId(finalProfile.getClerkId())
             .email(finalProfile.getEmail())
             .FirstName(finalProfile.getFirstName())
             .LastName(finalProfile.getLastName())
             .photoUrl(finalProfile.getPhotoUrl())
             .credits(finalProfile.getCredits())
             .createdAt(finalProfile.getCreatedAt())
             .build();

    }

//    public  ProfileDto updateProfile(ProfileDto profileDto)
//    {
//            Profile existingProfile   = profileRepo.findByClerkId(profileDto.getClerkId());
//
//        if (existingProfile != null) {
//            //update fileds
//
//            if (profileDto.getEmail() !=null && !profileDto.getEmail().isEmpty())
//            {
//                existingProfile.setEmail(profileDto.getEmail());
//            }
//
//            if (profileDto.getFirstName() !=null && !profileDto.getFirstName().isEmpty())
//            {
//                existingProfile.setFirstName(profileDto.getFirstName());
//            }
//
//            if (profileDto.getLastName() !=null && !profileDto.getLastName().isEmpty())
//            {
//                existingProfile.setLastName(profileDto.getLastName());
//            }
//
//            if (profileDto.getPhotoUrl() !=null && !profileDto.getPhotoUrl().isEmpty())
//            {
//                existingProfile.setPhotoUrl(profileDto.getPhotoUrl());
//            }
//            profileRepo.save(existingProfile);
//
//          return   ProfileDto.builder()
//                    .id(existingProfile.getId())
//                    .clerkId(existingProfile.getClerkId())
//                    .email(existingProfile.getEmail())
//                    .FirstName(existingProfile.getFirstName())
//                    .LastName(existingProfile.getFirstName())
//                    .photoUrl(existingProfile.getPhotoUrl())
//                    .createdAt(existingProfile.getCreatedAt())
//                    .credits(existingProfile.getCredits())
//                    .build();
//
//        }
//        return  null;
//
//    }
//
//    public  boolean existByClerkId( String clerkId)
//    {
//
//        return profileRepo.existByClerkId(clerkId);
//    }


}
