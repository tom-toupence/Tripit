package fr.viethan.backend.services;

import fr.viethan.backend.dto.StepDTO;
import fr.viethan.backend.entities.OSMEntity;
import fr.viethan.backend.interfaces.StepService;
import fr.viethan.backend.repositories.StepRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import org.springframework.http.HttpHeaders;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StepServiceImpl implements StepService {

    private final StepRepository stepRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String OSM_API_URL = "https://nominatim.openstreetmap.org/search?q=";



    public StepServiceImpl(StepRepository stepRepository) {
        this.stepRepository = stepRepository;
    }


    @Override
    @Transactional(readOnly = true)
    public List<StepDTO> getStepsByTripId(Long tripId) {
        return stepRepository.findByTripId(tripId)
                .stream()
                .map(StepDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<double[]> getCoordinatesFromLocation(String locationName) {
        String url = UriComponentsBuilder.fromHttpUrl(OSM_API_URL)
                .queryParam("q", locationName)
                .queryParam("format", "json")
                .build()
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "ViethanTravelApp/1.0 (tom06530@gmail.com)");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<OSMEntity[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, OSMEntity[].class);

        if (response.getBody() != null && response.getBody().length > 0) {
            return Optional.of(new double[]{response.getBody()[0].getLat(), response.getBody()[0].getLon()});
        }
        return Optional.empty();
    }
}

