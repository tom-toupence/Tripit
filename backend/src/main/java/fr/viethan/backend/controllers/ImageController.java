package fr.viethan.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import fr.viethan.backend.interfaces.ImageService;
import org.springframework.core.io.InputStreamResource;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            imageService.uploadFile(file, file.getOriginalFilename());
            return ResponseEntity.ok("Upload réussi !");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur upload : " + e.getMessage());
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<?> download(@PathVariable String filename) {
        try {
            var inputStream = imageService.downloadFile(filename);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(inputStream.response().contentType()))
                    .body(new InputStreamResource(inputStream));
        } catch (NoSuchKeyException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur download : " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{filename}")
    public ResponseEntity<?> delete(@PathVariable String filename) {
        try {
            imageService.deleteFile(filename);
            return ResponseEntity.ok("Suppression réussie !");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur suppression : " + e.getMessage());
        }
    }
}
