package com.example.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class WishList {

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
    @ManyToOne(cascade = CascadeType.ALL)
    private Products product;

    public WishList(){

    }
    public WishList(Long userId, Products product)
    {
        this.userId = userId;
        this.productId = product.getProductId();
        this.productName = product.getProductName();
        this.productQuantity = product.getProductQuantity();
        this.productPrice = product.getProductPrice();
        this.productDescription = product.getProductDescription();
        this.productImage = product.getProductImage();
        this.productCategory= product.getProductCategory();
        this.productCategoryAdidasSize=product.getProductCategoryAdidasSize();
        this.productCategoryPantsSize=product.getProductCategoryPantsSize();
        this.productCategoryTShirtSize=product.getProductCategoryTShirtSize();
        this.productCategoryBikeSize=product.getProductCategoryBikeSize();

    }


}
