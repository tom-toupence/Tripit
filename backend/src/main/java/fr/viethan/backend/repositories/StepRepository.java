package fr.viethan.backend.repositories;

import fr.viethan.backend.entities.StepEntity;
import fr.viethan.backend.entities.TripEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StepRepository extends JpaRepository<StepEntity, Long> {
    List<StepEntity> findByTripId(Long tripId);
}
