package fr.viethan.backend.services;


import fr.viethan.backend.entities.ImageEntity;
import fr.viethan.backend.interfaces.ImageService;
import fr.viethan.backend.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;

@Service
public class ImageServiceImpl implements ImageService {


    private final ImageRepository imageRepository;
    private final S3Client s3Client;
    private final String bucketName;

    public ImageServiceImpl(ImageRepository imageRepository, S3Client s3Client,
                            @Value("${cloudflare.r2.bucket}") String bucketName) {
        this.imageRepository = imageRepository;
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    // 1. Upload d'une image
    @Override
    public ImageEntity uploadFile(MultipartFile file, String key) throws IOException {
        if (file.isEmpty()) {
            System.out.println("Le fichier ne peut pas être vide");
            throw new IllegalArgumentException("Le fichier ne peut pas être vide");
        }

        System.out.println("Uploading image to R2/S3 with key: " + key);


        String detectedType = file.getContentType();
        String filename = file.getOriginalFilename();

        if (filename != null && (filename.endsWith(".jpg") || filename.endsWith(".jpeg"))) {
            detectedType = "image/jpeg";
        }
        if (filename != null && filename.endsWith(".png")) {
            detectedType = "image/png";
        }
        System.out.println("Final content-type sent: " + detectedType);


        // 1. Upload sur R2/S3
        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(detectedType)
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

        } catch (S3Exception e) {
            System.err.println("AWS error code: " + e.awsErrorDetails().errorCode());
            throw e;
        }


        System.out.println("Image uploaded successfully to R2/S3 with key: " + key);
        ImageEntity img = new ImageEntity();
        img.setKey(key);
        return imageRepository.save(img);
    }

    // 2. Download d'une image
    public ResponseInputStream<GetObjectResponse> downloadFile(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        return s3Client.getObject(getObjectRequest);
    }

    // 3. Suppression d'une image
    public void deleteFile(String key) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
    }
}
