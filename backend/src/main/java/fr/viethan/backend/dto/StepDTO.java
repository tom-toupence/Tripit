package fr.viethan.backend.dto;

import fr.viethan.backend.entities.StepEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StepDTO {
    private Long id;
    private String description;
    private double latitude;
    private double longitude;
    private LocalDate date;
    private Long tripId; // Pour lier à un Trip

    public static StepDTO fromEntity(StepEntity step) {
        return new StepDTO(
                step.getId(),
                step.getDescription(),
                step.getLatitude(),
                step.getLongitude(),
                step.getDate(),
                step.getTrip() != null ? step.getTrip().getId() : null
        );
    }

    public StepEntity toEntity() {
        StepEntity step = new StepEntity();
        step.setId(this.id);
        step.setDescription(this.description);
        step.setLatitude(this.latitude);
        step.setLongitude(this.longitude);
        step.setDate(this.date);
        return step; // On ne met pas `trip` ici pour éviter les boucles infinies
    }
}