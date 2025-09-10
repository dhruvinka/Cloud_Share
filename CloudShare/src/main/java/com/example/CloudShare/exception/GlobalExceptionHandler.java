//package com.example.CloudShare.exception;
//
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.util.HashMap;
//import java.util.LinkedHashMap;
//import java.util.Map;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(DuplicateKeyException.class)
//    public ResponseEntity<?>handleDuplicateEmailException(DuplicateKeyException e)
//    {
//           Map<String,Object> data=new HashMap<>();
//           data.put("Status", HttpStatus.CONFLICT);
//           data.put("message",e.getMessage());
//           return ResponseEntity.status(HttpStatus.CONFLICT).body(data);
//
//    }
//}
