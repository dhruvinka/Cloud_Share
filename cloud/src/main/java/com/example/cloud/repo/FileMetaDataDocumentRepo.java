package com.example.cloud.repo;

import com.example.cloud.Entity.FileMetaDataDocument;
import com.sun.jdi.event.StepEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FileMetaDataDocumentRepo extends MongoRepository<FileMetaDataDocument,String> {

    List<FileMetaDataDocument> findByClerkId(String clerkId);
    Long countByClerkId(String clerkId);
}
