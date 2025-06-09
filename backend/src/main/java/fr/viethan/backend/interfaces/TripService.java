package fr.viethan.backend.interfaces;

import fr.viethan.backend.dto.TripDTO;
import fr.viethan.backend.dto.TripInputDTO;

import java.util.List;
import java.util.Optional;

public interface TripService {
    List<TripDTO> getAllTrips();
    Optional<TripDTO> getTripById(Long id);
    TripDTO createTrip(TripInputDTO tripDTO);
    TripDTO updateTrip(Long id, TripDTO tripDTO);
    void deleteTrip(Long id);
}
