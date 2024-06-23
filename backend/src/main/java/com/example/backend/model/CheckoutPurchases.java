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
public class CheckoutPurchases {

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

    private String productCategoryAdidasSize;

    private String productCategoryPantsSize;

    private String productCategoryTShirtSize;

    private String productCategoryBikeSize;

    private Long numberOrder;




    public CheckoutPurchases(Long userId, Long productId, long productQuantity, double productPrice, String productDescription,
                             String productImage, String productName,  String productCategory , String productCategoryAdidasSize,
                            String productCategoryPantsSize,String productCategoryTShirtSize ,String productCategoryBikeSize , Long numberOrder ) {
        this.userId = userId;
        this.productName = productName;
        this.productId = productId;
        this.productQuantity = productQuantity;
        this.productPrice = productPrice;
        this.productDescription = productDescription;
        this.productImage = productImage;
        this.productCategory= productCategory;
        this.productCategoryAdidasSize=productCategoryAdidasSize;
        this.productCategoryPantsSize=productCategoryPantsSize;
        this.productCategoryTShirtSize=productCategoryTShirtSize;
        this.productCategoryBikeSize=productCategoryBikeSize;
        this.numberOrder = numberOrder;

    }

    public CheckoutPurchases() {

    }

}
