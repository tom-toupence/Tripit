package fr.viethan.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OSMEntity {
    private double lat;
    private double lon;
}
