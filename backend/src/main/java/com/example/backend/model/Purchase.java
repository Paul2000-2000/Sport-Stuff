package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Purchase {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long productId;
    private String productName;
    private long productQuantity;
    private double productPrice;
    private String productDescription;
    private String productImage;

    private String productCategory;

    private String productCategoryTShirtSize;

    private String productCategoryAdidasSize;

    private String productCategoryPantsSize;

    private String productCategoryBikeSize;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "checkout_id")
    private Checkout checkout;


    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    private Products product;

    public Purchase() {

    }

    public Purchase(Long userId, Products product) {
        this.userId = userId;
        this.productId = product.getProductId();
        this.productName = product.getProductName();
        this.productCategory=product.getProductCategory();
        this.productCategoryTShirtSize=product.getProductCategoryTShirtSize();
        this.productCategoryAdidasSize=product.getProductCategoryAdidasSize();
        this.productCategoryPantsSize=product.getProductCategoryPantsSize();
        this.productCategoryBikeSize=product.getProductCategoryBikeSize();
        this.productQuantity = product.getProductQuantity();
        this.productPrice = product.getProductPrice();
        this.productDescription = product.getProductDescription();
        this.productImage = product.getProductImage();

    }

}
