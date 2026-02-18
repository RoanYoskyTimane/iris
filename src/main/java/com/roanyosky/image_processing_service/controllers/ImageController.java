package com.roanyosky.image_processing_service.controllers;


import com.roanyosky.image_processing_service.dtos.*;
import com.roanyosky.image_processing_service.entities.User;
import com.roanyosky.image_processing_service.services.ImageService;
import com.roanyosky.image_processing_service.services.R2Service;
import com.roanyosky.image_processing_service.services.RateLimiteService;
import io.github.bucket4j.Bucket;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/images")
public class ImageController {
    private final ImageService imageService;
    private final R2Service r2Service;
    private final RateLimiteService rateLimiteService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal User currentUser) {
        //1. Resolves the bucket for this speficic user
        Bucket bucket = rateLimiteService.resolveBucket((long)currentUser.getId());

        if (bucket.tryConsume(1))
        {
            try {
                return ResponseEntity.ok(imageService.uploadImage(file, currentUser.getId()));
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
            }
        }else {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("You have reacheed your free upload limit (2 photos per day)");
        }
    }

    @GetMapping("/{key}")
    public ResponseEntity<byte[]> download(@PathVariable String key) {
        ImageDownloadDto imageDownloadDto = imageService.downloadImage(key);

        return ResponseEntity.ok()
                .contentType(imageDownloadDto.getMediaType()) // CRITICAL: Tells the OS this is an image
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
                .body(imageDownloadDto.getImageData());
    }

    @PostMapping("/{key}/transform")
    public ResponseEntity<?> transformImage(@PathVariable String key, @RequestBody TransformRequest transformRequest){

        ImageProcessingResult processedImage = imageService.imageTransfomation(key, transformRequest);

        //3. Returns the processed image
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/" + processedImage.getFormat()))
                .body(processedImage.getImageData());
    }

    @GetMapping
    public ResponseEntity<Page<ImageDto>> getImages(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int limit,
        @AuthenticationPrincipal User autheticatedUser
    ){
        Page<ImageDto> images = imageService.getAllImagesPaginated(page, limit, autheticatedUser.getId());
        return ResponseEntity.ok(images);
    }

    @DeleteMapping("/{key}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteImage(@PathVariable String key, @AuthenticationPrincipal User authenticatedUser){
        imageService.deleteImage(key, authenticatedUser.getId());
        return ResponseEntity.accepted().build();
    }
}
