package fr.viethan.backend.dto;

import fr.viethan.backend.entities.TripEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripDTO {
    private Long id;
    private String name;
    private String country;
    private List<StepDTO> steps;

    // Convertir une entité Trip en DTO
    public static TripDTO fromEntity(TripEntity trip) {
        return new TripDTO(
                trip.getId(),
                trip.getName(),
                trip.getCountry(),
                trip.getSteps() != null
                        ? trip.getSteps().stream().map(StepDTO::fromEntity).collect(Collectors.toList())
                        : null
        );
    }

    // Convertir un DTO en entité Trip
    public TripEntity toEntity() {
        TripEntity trip = new TripEntity();
        trip.setId(this.id);
        trip.setName(this.name);
        trip.setCountry(this.country);
        return trip; // Les étapes seront gérées à part
    }
}