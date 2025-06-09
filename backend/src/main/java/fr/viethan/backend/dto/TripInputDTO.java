package fr.viethan.backend.dto;

import fr.viethan.backend.entities.StepEntity;
import fr.viethan.backend.entities.TripEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripInputDTO {
    private String country;
    private List<StepInputDTO> steps;

    // Convertir une entité Trip en DTO
    public static TripDTO fromEntity(TripEntity trip) {
        return new TripDTO(
                trip.getId(),
                trip.getCountry(),
                trip.getSteps() != null
                        ? trip.getSteps().stream().map(StepInputDTO::fromEntity).collect(Collectors.toList())
                        : null
        );
    }

    public static TripEntity toEntity(TripInputDTO trip) {
        TripEntity tripEntity = new TripEntity();
        tripEntity.setCountry(trip.getCountry());
        if (trip.getSteps() != null) {
            List<StepEntity> steps = trip.getSteps().stream()
                    .map(StepInputDTO::toEntity)
                    .collect(Collectors.toList());
            for (StepEntity step : steps) {
                step.setTrip(tripEntity); // <---- C’est ÇA le fix !
            }
            tripEntity.setSteps(steps);
        }
        return tripEntity;
    }


}