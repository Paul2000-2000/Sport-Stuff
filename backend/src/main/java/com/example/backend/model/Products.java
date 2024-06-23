package com.example.backend.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;


    private String productName;
    private String productDescription;
    private double productPrice;
    private Long productQuantity;
    private String productImage;
    private String productCategory;
    private String productCategoryTShirtSize;
    private String productCategoryAdidasSize;
    private String productCategoryPantsSize;
    private String productCategoryBikeSize;


    @OneToMany(mappedBy = "productId", cascade = CascadeType.ALL)
    private List<Purchase> purchases;

}
