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
public class Checkout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long checkoutId;


    private String billingAddress;
    private String postalCode;

    private String paymentMethod;
    private String phoneNumber;
    private Long userId;
    private double totalPrice;


    public Checkout(String billingAddress, String postalCode, String phoneNumber, Long userId, double totalPrice, String paymentMethod) {
        this.billingAddress = billingAddress;
        this.postalCode = postalCode;
        this.phoneNumber = phoneNumber;
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;

    }

    public Checkout() {

    }


}
