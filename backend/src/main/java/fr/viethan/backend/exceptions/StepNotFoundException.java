package fr.viethan.backend.exceptions;

public class StepNotFoundException extends RuntimeException{
    public StepNotFoundException(Long stepId)  {
        super("Step with ID " + stepId + " not found");
    }
}
