package fr.viethan.backend.dto;

import fr.viethan.backend.entities.ImageEntity;
import fr.viethan.backend.entities.StepEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StepDTO {
    private Long id;
    private String description;
    private double latitude;
    private double longitude;
    private LocalDate date;
    private Long tripId;
    private List<String> images;

    public static StepDTO fromEntity(StepEntity step) {
        List<String> files = step.getImages()
                .stream()
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
        step.setId(this.id);
        step.setDescription(this.description);
        step.setLatitude(this.latitude);
        step.setLongitude(this.longitude);
        step.setDate(this.date);
        return step;
    }
}