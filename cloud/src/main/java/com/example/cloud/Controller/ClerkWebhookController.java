package com.example.cloud.Controller;

import com.example.cloud.Dto.ProfileDto;
import com.example.cloud.Service.ProfileService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.svix.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.svix.Webhook;
import java.net.http.HttpHeaders;
import java.util.Map;
import java.util.List;



@RestController
@RequiredArgsConstructor
@RequestMapping("/webhooks")
public class ClerkWebhookController {

    private final ProfileService profileService;

    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(@RequestHeader("svix-id") String svixId,
                                                @RequestHeader("svix-signature") String svixSignature,
                                                @RequestHeader("svix-timestamp") String svixTimestamp,
                                                @RequestBody String payload) {
        try {
            // ✅ Verify Clerk webhook
            boolean isValid = verifyWebhookSignature(svixId, svixSignature, svixTimestamp, payload);
            if (!isValid) {
                return ResponseEntity.badRequest().body("Invalid signature or payload");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);

            String eventType = rootNode.path("type").asText();
            JsonNode dataNode = rootNode.path("data");

            switch (eventType) {
                case "user.created":
                    handleUserCreated(dataNode);
                    break;
                case "user.updated":
                    handleUserUpdated(dataNode);
                    break;
                case "user.deleted":
                    handleUserDeleted(dataNode);
                    break;
                default:
                    System.out.println("⚠️ Unhandled event type: " + eventType);
            }

            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error processing webhook: " + e.getMessage());
        }
    }

    private void handleUserCreated(JsonNode data) {
        String clerkId = data.path("id").asText();
        String email = extractEmail(data);
        String firstName = data.path("first_name").asText("");
        String lastName = data.path("last_name").asText("");
        String photoUrl = data.path("image_url").asText("");

        ProfileDto newProfile = ProfileDto.builder()
                .clerkId(clerkId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .photoUrl(photoUrl)
                .build();

        profileService.createProfile(newProfile);
        System.out.println("✅ User created with ID: " + clerkId);
    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId = data.path("id").asText();
        String email = extractEmail(data);
        String firstName = data.path("first_name").asText("");
        String lastName = data.path("last_name").asText("");
        String photoUrl = data.path("image_url").asText("");

        ProfileDto updatedProfile = ProfileDto.builder()
                .clerkId(clerkId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .photoUrl(photoUrl)
                .build();

        profileService.updateProfile(updatedProfile);
        System.out.println("✅ User updated with ID: " + clerkId);
    }

    private void handleUserDeleted(JsonNode data) {
        String clerkId = data.path("id").asText();
        profileService.deleteProfileByClerkId(clerkId);
        System.out.println("🗑️ User deleted with ID: " + clerkId);
    }

    private String extractEmail(JsonNode data) {
        JsonNode emailAddresses = data.path("email_addresses");
        if (emailAddresses.isArray() && emailAddresses.size() > 0) {
            return emailAddresses.get(0).path("email_address").asText("");
        }
        return "";
    }

    private boolean verifyWebhookSignature(String svixId, String svixSignature, String svixTimestamp, String payload) {
        try {
            Webhook webhook = new Webhook(webhookSecret);

            HttpHeaders headers = HttpHeaders.of(
                    Map.of(
                            "svix-id", List.of(svixId),
                            "svix-signature", List.of(svixSignature),
                            "svix-timestamp", List.of(svixTimestamp)
                    ),
                    (k, v) -> true // accept all headers
            );

            // Verify the webhook
            webhook.verify(payload, headers);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Webhook signature verification failed: " + e.getMessage());
            return false;
        }
    }


}
