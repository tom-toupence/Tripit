package fr.viethan.backend.services;

import fr.viethan.backend.dto.TripDTO;
import fr.viethan.backend.dto.TripInputDTO;
import fr.viethan.backend.entities.TripEntity;
import fr.viethan.backend.interfaces.TripService;
import fr.viethan.backend.repositories.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;

    public TripServiceImpl(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripDTO> getAllTrips() {
        return tripRepository.findAll()
                .stream()
                .map(TripDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TripDTO> getTripById(Long id) {
        return tripRepository.findById(id).map(TripDTO::fromEntity);
    }

    @Override
    @Transactional
    public TripDTO createTrip(TripInputDTO tripDTO) {
        TripEntity tripEntity = TripInputDTO.toEntity(tripDTO);
        TripEntity savedTrip = tripRepository.save(tripEntity);
        return TripDTO.fromEntity(savedTrip);
    }

    @Override
    @Transactional
    public TripDTO updateTrip(Long id, TripDTO tripDTO) {
        if (tripRepository.existsById(id)) {
            TripEntity updatedTrip = tripDTO.toEntity();
            updatedTrip.setId(id);
            return TripDTO.fromEntity(tripRepository.save(updatedTrip));
        }
        return null; // Ou une exception personnalisée
    }

    @Override
    @Transactional
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
}
