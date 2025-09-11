package com.example.cloud.Controller;


import com.example.cloud.Dto.FileMetaDataDto;
import com.example.cloud.Entity.UserCredits;
import com.example.cloud.Service.FileMetaDataService;
import com.example.cloud.Service.UserCreditService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FileController {


    private  final FileMetaDataService fileMetaDataService;
    private  final UserCreditService userCreditService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(@RequestPart("files")MultipartFile file[]) throws IOException {
        try {
            Map<String, Object> response = new HashMap<>();
            List<FileMetaDataDto> list = fileMetaDataService.uploadFiles(file);
            UserCredits finalCredits = userCreditService.getUserCredits();

            response.put("files", list);
            response.put("remainingCredits", finalCredits);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);

        }

    }


    @GetMapping("/my")
    public  ResponseEntity<?> getAllFiles() {
        List<FileMetaDataDto> files = fileMetaDataService.getFiles();
        return ResponseEntity.ok(files);
    }


    @GetMapping("/public/{fileId}")
    public  ResponseEntity<?> getPublicFile(@PathVariable String fileId) {
        FileMetaDataDto file = fileMetaDataService.getPublicFile(fileId);
        return ResponseEntity.ok(file);
    }


    @GetMapping("/download/{id}")
    public  ResponseEntity<Resource> download(@PathVariable String id) throws MalformedURLException {
        FileMetaDataDto downloadableFile=fileMetaDataService.getDownloadableFile(id);
        Path path=Paths.get(downloadableFile.getFileLocation());
        Resource resource=new UrlResource(path.toUri());

        return  ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadableFile.getName() + "\"")
                .body(resource);
    }


    @DeleteMapping("/{id}")
    public  ResponseEntity<?> deleteFile(@PathVariable String id) {
        fileMetaDataService.deleteFile(id);
        return  ResponseEntity.noContent().build();
    }

    @PatchMapping("/toggle/{id}")
    public  ResponseEntity<?> togglepublice(@PathVariable String  id)
    {
        FileMetaDataDto fileMetaDataDto=fileMetaDataService.togglePublic(id);
        return  ResponseEntity.ok(fileMetaDataDto);
    }




}

