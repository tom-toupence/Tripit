package fr.viethan.backend.exceptions;

public class TripNotFoundException extends RuntimeException {
    public TripNotFoundException(Long tripId) {
        super("Trip with ID " + tripId + " not found");
    }
}
