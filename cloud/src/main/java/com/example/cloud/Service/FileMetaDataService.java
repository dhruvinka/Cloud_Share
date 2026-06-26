package com.example.cloud.Service;

import com.example.cloud.Dto.FileMetaDataDto;
import com.example.cloud.Entity.FileMetaDataDocument;
import com.example.cloud.Entity.Profile;
import com.example.cloud.repo.FileMetaDataDocumentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetaDataService {

    private final UserCreditService userCreditService;
    private final ProfileService profileService;
    private final FileMetaDataDocumentRepo fileMetaDataDocumentRepo;
    private final S3Client s3Client;
    private final FileScanService fileScanService;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public List<FileMetaDataDto> uploadFiles(MultipartFile[] files) throws IOException {
        Profile currentProfile = profileService.getCurrentProfile();
        List<FileMetaDataDocument> savedFiles = new ArrayList<>();

        // Check credits before upload
        if (!userCreditService.hasEnoughCredits(files.length)) {
            throw new RuntimeException("Not enough credits to upload files");
        }

        for (MultipartFile multipartFile : files) {
            String originalFileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            String fileExtension = "";
            int dotIndex = originalFileName.lastIndexOf(".");
            if (dotIndex > 0) {
                fileExtension = originalFileName.substring(dotIndex);
            }

            // 🔍 Scan file with VirusTotal before uploading
            try {
                fileScanService.scanFile(multipartFile);
            } catch (RuntimeException e) {
                // Malicious file — reject immediately
                throw e;
            } catch (Exception e) {
                throw new RuntimeException("File scan failed: " + e.getMessage());
            }

            // Generate unique file name
            String uniqueFileName = UUID.randomUUID() + fileExtension;

            // Upload directly to AWS S3 (only reached if scan passed)
            s3Client.putObject(PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(uniqueFileName)
                    .contentType(multipartFile.getContentType())
                    .build(),
                    RequestBody.fromInputStream(multipartFile.getInputStream(), multipartFile.getSize()));

            // Build metadata entity
            FileMetaDataDocument fileMetaData = FileMetaDataDocument.builder()
                    .fileLocation(uniqueFileName)
                    .name(originalFileName)
                    .size(multipartFile.getSize())
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(true) // default public (change to false if you want private by default)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            savedFiles.add(fileMetaDataDocumentRepo.save(fileMetaData));
        }

        // Deduct credits after successful upload
        userCreditService.deductCredits();

        // Convert to DTO and return
        return savedFiles.stream()
                .map(this::maptoDto)
                .collect(Collectors.toList());
    }

    private FileMetaDataDto maptoDto(FileMetaDataDocument fileMetaDataDocument) {
        return FileMetaDataDto.builder()
                .id(fileMetaDataDocument.getId())
                .name(fileMetaDataDocument.getName())
                .size(fileMetaDataDocument.getSize())
                .fileLocation(fileMetaDataDocument.getFileLocation())
                .clerkId(fileMetaDataDocument.getClerkId())
                .isPublic(fileMetaDataDocument.getIsPublic()) // ✅ FIXED
                .uploadedAt(fileMetaDataDocument.getUploadedAt())
                .build();
    }

    public List<FileMetaDataDto> getFiles() {
        Profile currentProfile = profileService.getCurrentProfile();
        List<FileMetaDataDocument> files = fileMetaDataDocumentRepo.findByClerkId(currentProfile.getClerkId());
        return files.stream().map(this::maptoDto).collect(Collectors.toList());
    }

    public FileMetaDataDto getPublicFile(String id) {
        Optional<FileMetaDataDocument> fileOption = fileMetaDataDocumentRepo.findById(id);
        if (fileOption.isEmpty() || !fileOption.get().getIsPublic()) {
            throw new RuntimeException("Unable to get the file");
        }
        return maptoDto(fileOption.get());
    }

    public FileMetaDataDto getDownloadableFile(String id) {
        FileMetaDataDocument file = fileMetaDataDocumentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("File not Found"));
        return maptoDto(file);
    }

    public void deleteFile(String id) {
        try {
            Profile currentProfile = profileService.getCurrentProfile();

            FileMetaDataDocument file = fileMetaDataDocumentRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("File not Found"));

            // Only allow delete if the file belongs to current user
            if (!file.getClerkId().equals(currentProfile.getClerkId())) {
                throw new RuntimeException("File does not belong to current user");
            }

            // Delete from AWS S3
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(file.getFileLocation())
                    .build());

            // Delete from DB
            fileMetaDataDocumentRepo.deleteById(id);

        } catch (Exception e) {
            throw new RuntimeException("Error deleting file: " + e.getMessage(), e);
        }
    }

    public FileMetaDataDto togglePublic(String id) {
        FileMetaDataDocument file = fileMetaDataDocumentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("File not Found"));

        file.setIsPublic(!file.getIsPublic()); // flip status
        fileMetaDataDocumentRepo.save(file);

        return maptoDto(file); // return updated status
    }

    public InputStream getFileStream(String fileLocation) {
        return s3Client.getObject(GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileLocation)
                .build());
    }
}
