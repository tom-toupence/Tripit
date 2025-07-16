package fr.viethan.backend.interfaces;

import fr.viethan.backend.entities.ImageEntity;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.IOException;

public interface ImageService {
    ImageEntity uploadFile(MultipartFile file, String key) throws IOException;

    ResponseInputStream<GetObjectResponse> downloadFile(String key);

    void deleteFile(String key);

    boolean fileExists(String key);

}

