package fr.viethan.backend.interfaces;

import fr.viethan.backend.dto.StepDTO;
import fr.viethan.backend.dto.StepInputDTO;

import java.io.IOException;
import java.util.List;

public interface StepService {
    List<StepDTO> getAllSteps();
    List<StepDTO> getStepsByTripId(Long tripId);
    StepDTO getStepById(Long id);
    StepDTO createStep(Long tripId, StepInputDTO stepInputDTO);
    StepDTO updateStep(Long id, StepInputDTO stepInputDTO) throws IOException;
    void deleteStep(Long id);
}
