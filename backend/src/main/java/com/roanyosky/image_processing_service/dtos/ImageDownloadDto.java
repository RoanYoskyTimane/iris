package com.roanyosky.image_processing_service.dtos;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.MediaType;

@Data
@Builder
public class ImageDownloadDto {
    private byte[] imageData;
    private MediaType mediaType;
}
