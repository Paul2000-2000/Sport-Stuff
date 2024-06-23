package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Image {

    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String imageUrl;
    private String imageId;

    public Image(String name, String imageId, String imageUrl) {
        this.name = name;
        this.imageId = imageId;
        this.imageUrl = imageUrl;
    }

}
