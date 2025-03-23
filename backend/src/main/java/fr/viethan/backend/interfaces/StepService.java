package fr.viethan.backend.interfaces;

import fr.viethan.backend.dto.StepDTO;
import java.util.List;

public interface StepService {
    List<StepDTO> getStepsByTripId(Long tripId);
}
