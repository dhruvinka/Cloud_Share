package com.example.cloud.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@Service
public class FileScanService {

    @Value("${virustotal.api.key}")
    private String apiKey;

    private static final String VT_UPLOAD_URL = "https://www.virustotal.com/api/v3/files";
    private static final String VT_ANALYSIS_URL = "https://www.virustotal.com/api/v3/analyses/";
    private static final int SCAN_WAIT_MS = 15000; // Wait 15 seconds for scan
    private static final int MAX_POLL_ATTEMPTS = 5;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Scans a file using VirusTotal API.
     * Throws RuntimeException if file is detected as malicious.
     */
    public void scanFile(MultipartFile file) throws Exception {
        log.info("🔍 Scanning file: {}", file.getOriginalFilename());

        // Step 1: Upload file to VirusTotal
        String analysisId = uploadToVirusTotal(file);

        // Step 2: Wait for scan to complete
        log.info("⏳ Waiting for scan result...");
        Thread.sleep(SCAN_WAIT_MS);

        // Step 3: Poll for result
        for (int attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt++) {
            ScanStatus status = getScanResult(analysisId);

            if (status == ScanStatus.CLEAN) {
                log.info("✅ File is clean: {}", file.getOriginalFilename());
                return; // File is safe — allow upload
            } else if (status == ScanStatus.INFECTED) {
                log.warn("❌ Malicious file detected: {}", file.getOriginalFilename());
                throw new RuntimeException(
                    "File rejected: '" + file.getOriginalFilename() +
                    "' was detected as malicious by VirusTotal. Upload cancelled."
                );
            } else {
                // Still scanning — wait and retry
                log.info("🔄 Scan still in progress (attempt {}/{}), retrying...", attempt, MAX_POLL_ATTEMPTS);
                Thread.sleep(5000);
            }
        }

        // If scan never completed, allow upload but log warning
        log.warn("⚠️ VirusTotal scan timed out for: {}. Allowing upload.", file.getOriginalFilename());
    }

    /** Uploads file to VirusTotal and returns the analysis ID */
    private String uploadToVirusTotal(MultipartFile file) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apikey", apiKey);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        byte[] fileBytes = file.getBytes();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(VT_UPLOAD_URL, request, Map.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("VirusTotal upload failed. Please try again.");
        }

        Map<?, ?> data = (Map<?, ?>) response.getBody().get("data");
        return (String) data.get("id");
    }

    /** Polls VirusTotal for scan result — returns CLEAN, INFECTED, or PENDING */
    private ScanStatus getScanResult(String analysisId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-apikey", apiKey);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                VT_ANALYSIS_URL + analysisId,
                HttpMethod.GET,
                request,
                Map.class
            );

            if (response.getBody() == null) return ScanStatus.PENDING;

            Map<?, ?> data = (Map<?, ?>) response.getBody().get("data");
            Map<?, ?> attributes = (Map<?, ?>) data.get("attributes");
            String scanStatus = (String) attributes.get("status");

            if (!"completed".equals(scanStatus)) {
                return ScanStatus.PENDING;
            }

            // Get stats from completed scan
            Map<?, ?> stats = (Map<?, ?>) attributes.get("stats");
            int malicious = getStatValue(stats, "malicious");
            int suspicious = getStatValue(stats, "suspicious");

            log.info("📊 Scan stats — malicious: {}, suspicious: {}", malicious, suspicious);

            // Flag as infected if 2 or more engines detect it
            if (malicious >= 2 || suspicious >= 5) {
                return ScanStatus.INFECTED;
            }

            return ScanStatus.CLEAN;

        } catch (Exception e) {
            log.error("Error fetching VirusTotal result: {}", e.getMessage());
            return ScanStatus.PENDING;
        }
    }

    private int getStatValue(Map<?, ?> stats, String key) {
        Object val = stats.get(key);
        if (val instanceof Integer) return (Integer) val;
        if (val instanceof Number) return ((Number) val).intValue();
        return 0;
    }

    private enum ScanStatus {
        CLEAN, INFECTED, PENDING
    }
}
