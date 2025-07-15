package fr.viethan.backend.dto;

import fr.viethan.backend.entities.ImageEntity;
import fr.viethan.backend.entities.StepEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StepInputDTO {
    private String description;
    private double latitude;
    private double longitude;
    private LocalDate date;
    private Long tripId;
    private List<MultipartFile> images = new ArrayList<>();

    public static StepDTO fromEntity(StepEntity step) {
        // Récupère la liste des filenames (ou URLs) depuis l'entité
        List<String> files = step.getImages().stream()
                .map(ImageEntity::getFilename)
                .collect(Collectors.toList());

        return new StepDTO(
                step.getId(),
                step.getDescription(),
                step.getLatitude(),
                step.getLongitude(),
                step.getDate(),
                step.getTrip() != null ? step.getTrip().getId() : null,
                files
        );
    }

    public StepEntity toEntity() {
        StepEntity step = new StepEntity();
        step.setDescription(this.description);
        step.setLatitude(this.latitude);
        step.setLongitude(this.longitude);
        step.setDate(this.date);

        return step;
    }
}