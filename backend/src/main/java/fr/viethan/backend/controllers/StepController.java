package fr.viethan.backend.controllers;

import fr.viethan.backend.dto.StepDTO;
import fr.viethan.backend.dto.StepInputDTO;
import fr.viethan.backend.exceptions.StepNotFoundException;
import fr.viethan.backend.exceptions.TripNotFoundException;
import fr.viethan.backend.interfaces.StepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/steps")
@CrossOrigin(origins = "http://localhost:3000")
public class StepController {

    private final StepService stepService;

    @Autowired
    public StepController(StepService stepService) {
        this.stepService = stepService;
    }


    @GetMapping
    public ResponseEntity<List<StepDTO>> getAllSteps() {
        List<StepDTO> steps = stepService.getAllSteps(); // Assuming null means all steps
        return ResponseEntity.ok(steps);
    }
    @GetMapping("/trips/{tripId}/steps")
    public ResponseEntity<List<StepDTO>> getAllStepsByTripId(@PathVariable Long tripId) {
        List<StepDTO> steps = stepService.getStepsByTripId(tripId);
        return ResponseEntity.ok(steps);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StepDTO> getStepById(@PathVariable Long id) {
        try {
            StepDTO step = stepService.getStepById(id);
            return ResponseEntity.ok(step); // 200 OK si trouvé
        } catch (StepNotFoundException e) {
            return ResponseEntity.notFound().build(); // 404 si pas trouvé
        }
    }

    @PostMapping("/{tripId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StepDTO> createStep(@PathVariable Long tripId, @RequestBody StepInputDTO stepInputDTO) {
        try {
            StepDTO createdStep = stepService.createStep(tripId, stepInputDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStep);
        } catch (TripNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
