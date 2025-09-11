package com.example.cloud.Service;

import com.example.cloud.Entity.UserCredits;
import com.example.cloud.repo.UserCreditsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditService {   // ✅ fixed class name

    private final UserCreditsRepo userCreditsRepo;
    private final ProfileService profileService;

    /**
     * Create initial credits for a new user
     */
    public UserCredits createInitialCredits(String clerkId) {
        UserCredits userCredits = UserCredits.builder()
                .credits(5)
                .clerkId(clerkId)
                .plan("BASIC")
                .build();

        return userCreditsRepo.save(userCredits);
    }

    /**
     * Get user credits, or create if not present
     */
    public UserCredits getUserCredits(String clerkId) {
        return userCreditsRepo.findByClerkId(clerkId)
                .orElseGet(() -> {
                    UserCredits newCredits = createInitialCredits(clerkId);
                    return newCredits;
                });
    }


    /**
     * Get credits for currently logged-in user
     */
    public UserCredits getUserCredits() {
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserCredits(clerkId);
    }

    /**
     * Check if user has enough credits
     */
    public boolean hasEnoughCredits(int req) {
        UserCredits userCredits = getUserCredits();
        return userCredits != null && userCredits.getCredits() >= req;
    }

    /**
     * Deduct credits after usage
     */
    public UserCredits deductCredits() {
        UserCredits userCredits = getUserCredits();
        if (userCredits != null && userCredits.getCredits() <= 0 ) {
           return  null;
        }
        userCredits.setCredits(userCredits.getCredits() - 1);
        return userCreditsRepo.save(userCredits);

    }

    /**
     * Add credits (e.g., when upgrading plan)
     */
    public UserCredits addCredits(String clerkId,Integer creditsToAdd,String plan) {
       UserCredits userCredits= userCreditsRepo.findByClerkId(clerkId)
                .orElseGet(()->createInitialCredits(clerkId));
       userCredits.setCredits(userCredits.getCredits()+creditsToAdd);
       userCredits.setPlan(plan);
       return userCreditsRepo.save(userCredits);
    }
}
