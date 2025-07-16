package fr.viethan.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "steps")
@Data
@NoArgsConstructor
public class StepEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private double latitude;
    private double longitude;
    private LocalDate date;

    @OneToMany(
            mappedBy = "step",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ImageEntity> images = new ArrayList<>();


    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private TripEntity trip;

    public void addImage(ImageEntity image) {
        images.add(image);
        image.setStep(this);
    }
}