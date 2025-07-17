package fr.viethan.backend.exceptions;

public class ImageUploadException extends RuntimeException {
    public ImageUploadException(String message) {
        super(
            "Image upload failed: " + message
        );
    }
}
