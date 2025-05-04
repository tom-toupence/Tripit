package fr.viethan.backend.controllers;

import fr.viethan.backend.dto.StepDTO;
import fr.viethan.backend.interfaces.StepService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<StepDTO> getAllSteps() {
        //return stepService.getAllSteps();
        return null;
    }

    @GetMapping("/{id}")
    public StepDTO getStepById(@PathVariable Long id) {
        //return stepService.getStepById(id);
        return null;
    }

}
