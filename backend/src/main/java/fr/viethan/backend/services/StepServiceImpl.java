package fr.viethan.backend.services;

import fr.viethan.backend.dto.StepDTO;
import fr.viethan.backend.dto.StepInputDTO;
import fr.viethan.backend.entities.ImageEntity;
import fr.viethan.backend.entities.OSMEntity;
import fr.viethan.backend.entities.StepEntity;
import fr.viethan.backend.entities.TripEntity;
import fr.viethan.backend.exceptions.ImageUploadException;
import fr.viethan.backend.exceptions.StepNotFoundException;
import fr.viethan.backend.exceptions.TripNotFoundException;
import fr.viethan.backend.interfaces.ImageService;
import fr.viethan.backend.interfaces.StepService;
import fr.viethan.backend.repositories.ImageRepository;
import fr.viethan.backend.repositories.StepRepository;
import fr.viethan.backend.repositories.TripRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import org.springframework.http.HttpHeaders;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StepServiceImpl implements StepService {

    private final StepRepository stepRepository;
    private final TripRepository tripRepository;
    private final ImageService imageService;
    private final ImageRepository imageRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String OSM_API_URL = "https://nominatim.openstreetmap.org/search?q=";



    public StepServiceImpl(StepRepository stepRepository, TripRepository tripRepository, ImageService imageService, ImageRepository imageRepository) {
        this.stepRepository = stepRepository;
        this.tripRepository = tripRepository;
        this.imageService = imageService;
        this.imageRepository = imageRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StepDTO> getAllSteps() {
        return stepRepository.findAll()
                .stream()
                .map(StepDTO::fromEntity)
                .collect(Collectors.toList());
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


    @Override
    @Transactional
    public StepDTO createStep(Long tripId, StepInputDTO inputDTO) throws ImageUploadException {
        TripEntity trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException(tripId));

        StepEntity stepEntity = inputDTO.toEntity();
        stepEntity.setTrip(trip);
        StepEntity saved = stepRepository.save(stepEntity);

        List<ImageEntity> imgs = new ArrayList<>();
        for (MultipartFile file : inputDTO.getImages()) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            String uuid = UUID.randomUUID().toString();
            String key  = "trips/"+ tripId + "/steps/" + saved.getId() + "/" + uuid + "-" + file.getOriginalFilename();

            ImageEntity img;
            try {
                img = imageService.uploadFile(file, key);
            } catch (IOException e) {
                throw new ImageUploadException("Failed to upload image: " + file.getOriginalFilename());
            }
            img.setStep(saved);
            imgs.add(img);
        }

        saved.getImages().addAll(imgs);
        stepRepository.save(saved);

        return StepDTO.fromEntity(saved);
    }


    @Override
    @Transactional(readOnly = true)
    public StepDTO getStepById(Long id) {
        return stepRepository.findById(id)
                .map(StepDTO::fromEntity)
                .orElse(null); // Ou lancer une exception personnalisée si l'étape n'existe pas
    }


    @Override
    @Transactional
    public StepDTO updateStep(Long id, StepInputDTO stepInputDTO) throws IOException {
        StepEntity stepEntity = stepRepository.findById(id)
                .orElseThrow(() -> new StepNotFoundException(id));

        // Update champs basiques
        stepEntity.setDescription(stepInputDTO.getDescription());
        stepEntity.setLatitude(stepInputDTO.getLatitude());
        stepEntity.setLongitude(stepInputDTO.getLongitude());
        stepEntity.setDate(stepInputDTO.getDate());

        // 1. Supprimer images non gardées
        List<ImageEntity> imagesToDelete = new ArrayList<>();
        for (ImageEntity img : new ArrayList<>(stepEntity.getImages())) {
            if (!stepInputDTO.getExistingImageIds().contains(img.getId())) {
                imageService.deleteFile(img.getObjectKey());
                imagesToDelete.add(img);
            }
        }
        // Supprime côté parent (la collection !)
        for (ImageEntity img : imagesToDelete) {
            stepEntity.getImages().remove(img);
            imageRepository.delete(img);
        }

        // 2. Ajouter nouvelles images
        if (stepInputDTO.getImages() != null) {
            for (MultipartFile file : stepInputDTO.getImages()) {
                if (file == null || file.isEmpty()) continue;
                String uuid = UUID.randomUUID().toString();
                String key = "trips/" + stepEntity.getTrip().getId() + "/steps/" + stepEntity.getId() + "/" + uuid + "-" + file.getOriginalFilename();

                if (!imageService.fileExists(key)) {
                    try {
                        ImageEntity newImg = imageService.uploadFile(file, key);
                        newImg.setStep(stepEntity);
                        stepEntity.getImages().add(newImg);
                        imageRepository.save(newImg);
                    } catch (IOException e) {
                        throw new ImageUploadException("Failed to upload image: " + file.getOriginalFilename());
                    }
                }
            }
        }

        StepEntity updated = stepRepository.save(stepEntity);
        return StepDTO.fromEntity(updated);
    }


    @Override
    @Transactional
    public void deleteStep(Long id) {
        StepEntity stepEntity = stepRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Step not found with id: " + id));
        for (ImageEntity img : stepEntity.getImages()) {
            try {
                imageService.deleteFile(img.getObjectKey());
            } catch (Exception e) {
                // Log the exception and continue execution
                System.err.println("Failed to delete file with object key: " + img.getObjectKey() + ". Error: " + e.getMessage());
            }
        }
        stepRepository.delete(stepEntity);
    }

}

