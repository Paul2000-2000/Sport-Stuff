package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class FeedBackProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    private Long productFeedbackProductId;

    private String productFeedBackUsername;

    private Float productFeedbackRating;

    private String productFeedbackMessage;

    private String productName;

    private String productDescription;

    private double productPrice;

    private Long productQuantity;

    private String productImage;



}
